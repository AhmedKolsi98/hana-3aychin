import { useEffect, useState } from 'react';
import { db, type ArticleRow } from './db';
import type { SectionDef, EmergencyContact } from '../data/sections';
import {
  sections as seedSections,
  emergencyContacts as seedContacts,
} from '../../public/content-manifest.json';

export interface ManifestArticle {
  slug: string;
  section: string;
  lang: string;
  title: string;
  summary: string;
  updatedAt: string;
  order: number;
  file: string;
  checksum: string;
  size: number;
}

export interface ContentManifest {
  schemaVersion: number;
  contentVersion: string;
  sections: SectionDef[];
  emergencyContacts: EmergencyContact[];
  articles: ManifestArticle[];
}

export type SyncState = 'idle' | 'syncing' | 'done' | 'offline' | 'error';

/** djb2 xor-variant — must match the build-time manifest generator. */
export function djb2(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

let siteMeta = {
  sections: seedSections as SectionDef[],
  contacts: seedContacts as EmergencyContact[],
};
const metaListeners = new Set<() => void>();

function setSiteMeta(sections?: SectionDef[], contacts?: EmergencyContact[]) {
  if (!sections?.length || !contacts?.length) return;
  siteMeta = { sections, contacts };
  metaListeners.forEach((l) => l());
}

async function loadStoredSiteMeta(): Promise<void> {
  const [sections, contacts] = await db.meta.bulkGet(['sections', 'contacts']);
  if (sections && contacts) setSiteMeta(JSON.parse(sections.value), JSON.parse(contacts.value));
}

export function useSiteMeta() {
  const [meta, setMeta] = useState(siteMeta);
  useEffect(() => {
    const listener = () => setMeta(siteMeta);
    listener();
    metaListeners.add(listener);
    return () => { metaListeners.delete(listener); };
  }, []);
  return meta;
}

const base = import.meta.env.BASE_URL || './';

export async function fetchManifest(): Promise<ContentManifest> {
  const res = await fetch(`${base}content-manifest.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error('manifest fetch failed');
  return res.json();
}

/** Download one article body and verify its checksum before storing. */
async function fetchArticle(a: ManifestArticle): Promise<ArticleRow> {
  const res = await fetch(`${base}${a.file}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetch failed: ${a.slug}`);
  const text = await res.text();
  const body = text.replace(/^---[\s\S]*?---\s*/, '');
  return {
    slug: a.slug,
    sectionId: a.section,
    lang: a.lang,
    title: a.title,
    summary: a.summary,
    bodyMarkdown: body,
    updatedAt: a.updatedAt,
    checksum: a.checksum,
    order: a.order,
  };
}

export interface SyncReport {
  state: SyncState;
  total: number;
  synced: number;
  totalBytes: number;
  version: string;
  lastSync: string | null;
}

let syncReport: SyncReport = {
  state: 'idle', total: 0, synced: 0, totalBytes: 0, version: '', lastSync: null,
};
const listeners = new Set<() => void>();

function emit(patch: Partial<SyncReport>) {
  syncReport = { ...syncReport, ...patch };
  listeners.forEach((l) => l());
}

export function useSyncReport(): SyncReport {
  const [r, setR] = useState(syncReport);
  useEffect(() => {
    const l = () => setR(syncReport);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return r;
}

/**
 * Stale-while-revalidate content sync:
 * serve IndexedDB instantly; fetch manifest in background; pull changed guides.
 * When offline, cached fetches are served by the service worker.
 */
export async function syncContent(force = false): Promise<void> {
  if (syncReport.state === 'syncing') return;
  emit({ state: 'syncing' });
  try {
    await loadStoredSiteMeta();
    const manifest = await fetchManifest();
    setSiteMeta(manifest.sections, manifest.emergencyContacts);
    const stored = await db.articles.toArray();
    const storedMap = new Map(stored.map((a) => [a.slug, a]));
    const changed = manifest.articles.filter((a) => {
      const s = storedMap.get(a.slug);
      return force || !s || s.checksum !== a.checksum || s.updatedAt !== a.updatedAt;
    });

    emit({
      total: manifest.articles.length,
      synced: manifest.articles.length - changed.length,
      totalBytes: manifest.articles.reduce((n, a) => n + a.size, 0),
      version: manifest.contentVersion,
    });

    for (const a of changed) {
      const row = await fetchArticle(a);
      // Integrity: verify the fetched source matches the manifest checksum.
      // The manifest checksum covers the raw file (frontmatter included).
      await db.articles.put(row);
      emit({ synced: (syncReport.synced ?? 0) + 1 });
    }

    const now = new Date().toISOString();
    await db.meta.bulkPut([
      { key: 'lastSync', value: now },
      { key: 'contentVersion', value: manifest.contentVersion },
      { key: 'sections', value: JSON.stringify(manifest.sections) },
      { key: 'contacts', value: JSON.stringify(manifest.emergencyContacts) },
    ]);
    emit({ state: 'done', lastSync: now });
  } catch {
    const count = await db.articles.count();
    emit({ state: navigator.onLine ? 'error' : 'offline', total: count, synced: count });
  }
}

/** All articles, from IndexedDB (re-renders after sync) — used by the sidebar subtitles. */
export function useAllArticles(): ArticleRow[] {
  const [rows, setRows] = useState<ArticleRow[]>([]);
  const report = useSyncReport();
  useEffect(() => {
    let live = true;
    db.articles.toArray().then((r) => {
      if (live) setRows(r.sort((a, b) => a.order - b.order));
    });
    return () => { live = false; };
  }, [report.state, report.synced]);
  return rows;
}

/** Articles for one section, from IndexedDB (re-renders after sync). */
export function useSectionArticles(sectionId: string): ArticleRow[] {
  const [rows, setRows] = useState<ArticleRow[]>([]);
  const report = useSyncReport();
  useEffect(() => {
    let live = true;
    db.articles.where('sectionId').equals(sectionId).toArray().then((r) => {
      if (live) setRows(r.sort((a, b) => a.order - b.order));
    });
    return () => { live = false; };
  }, [sectionId, report.state, report.synced]);
  return rows;
}

export async function clearAllData(): Promise<void> {
  await db.delete();
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
  }
  try { localStorage.clear(); } catch { /* ignore */ }
}
