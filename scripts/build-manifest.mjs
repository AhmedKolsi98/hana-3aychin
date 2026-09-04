import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { djb2, parseFrontmatter, validateMeta, validateArticles } from './validate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'public', 'content');

function fail(errors) {
  for (const { where, message } of errors) console.error(`✖ ${where}: ${message}`);
  console.error(`${errors.length} error(s) — manifest not written.`);
  process.exit(1);
}

const meta = JSON.parse(readFileSync(join(contentDir, '_meta.json'), 'utf8'));
const metaErrors = validateMeta(meta);
if (metaErrors.length) fail(metaErrors);

const articles = readdirSync(contentDir)
  .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  .sort()
  .map((file) => {
    const text = readFileSync(join(contentDir, file), 'utf8').replace(/\r\n/g, '\n');
    return {
      slug: basename(file, '.md'),
      data: parseFrontmatter(text),
      checksum: djb2(text),
      size: Buffer.byteLength(text, 'utf8'),
    };
  });

const sectionIds = meta.sections.map((s) => s.id);
const articleErrors = validateArticles(articles, sectionIds);
if (articleErrors.length) fail(articleErrors);

const byOrder = (a, b) => a.order - b.order;
const manifest = {
  schemaVersion: meta.schemaVersion,
  contentVersion: articles.reduce((max, a) => (a.data.updatedAt > max ? a.data.updatedAt : max), ''),
  sections: [...meta.sections].sort(byOrder),
  emergencyContacts: [...meta.emergencyContacts].sort(byOrder),
  articles: articles.map((a) => ({
    ...a.data,
    file: `content/${a.slug}.md`,
    checksum: a.checksum,
    size: a.size,
  })),
};

writeFileSync(join(root, 'public', 'content-manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log(`✔ ${articles.length} guides, ${manifest.sections.length} sections, ${manifest.emergencyContacts.length} contacts`);
