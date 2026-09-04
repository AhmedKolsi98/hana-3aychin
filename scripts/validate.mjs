export const ICONS = [
  'Zap', 'Droplets', 'ThermometerSun', 'UtensilsCrossed', 'Laptop',
  'PhoneCall', 'Flame', 'Wind', 'Info', 'Hospital', 'MapPin', 'BookOpen',
];

export function djb2(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

export function parseFrontmatter(raw) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!block) return null;
  const data = {};
  for (const line of block[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const value = kv[2].trim();
    data[kv[1]] = /^".*"$/.test(value) ? value.slice(1, -1)
      : /^-?\d+$/.test(value) ? Number(value)
      : value;
  }
  return data;
}

const TEL = /^tel:\+?[0-9]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateMeta(meta) {
  const errors = [];
  const add = (where, message) => errors.push({ where, message });

  if (meta.schemaVersion !== 2) {
    add('_meta.json', `schemaVersion must be 2, found ${JSON.stringify(meta.schemaVersion)}`);
  }

  const seen = new Set();
  for (const s of meta.sections ?? []) {
    const at = `_meta.json > section "${s.id}"`;
    if (seen.has(s.id)) add(at, 'duplicate id');
    seen.add(s.id);
    if (!Number.isInteger(s.order)) add(at, 'order must be a whole number');
    if (!ICONS.includes(s.icon)) add(at, `icon ${JSON.stringify(s.icon)} is not one of: ${ICONS.join(', ')}`);
    if (!s.title?.ar) add(at, 'title is missing its Arabic text');
    if (!s.sub?.ar) add(at, 'sub is missing its Arabic text');
  }
  if (!seen.size) add('_meta.json', 'sections must not be empty');

  const seenContacts = new Set();
  for (const c of meta.emergencyContacts ?? []) {
    const at = `_meta.json > contact "${c.id}"`;
    if (seenContacts.has(c.id)) add(at, 'duplicate id');
    seenContacts.add(c.id);
    if (!Number.isInteger(c.order)) add(at, 'order must be a whole number');
    if (!c.number) add(at, 'number is required');
    if (!TEL.test(c.tel ?? '')) add(at, `tel ${JSON.stringify(c.tel)} must look like tel:198 or tel:+21671335500`);
    if (!c.name?.ar) add(at, 'name is missing its Arabic text');
  }
  if (!seenContacts.size) add('_meta.json', 'emergencyContacts must not be empty');

  return errors;
}

export function validateArticles(articles, sectionIds) {
  const errors = [];
  const add = (where, message) => errors.push({ where, message });
  const seen = new Set();

  for (const { slug, data } of articles) {
    const at = `public/content/${slug}.md`;
    if (!data) {
      add(at, 'missing the --- frontmatter block');
      continue;
    }
    for (const field of ['slug', 'section', 'lang', 'title', 'summary', 'updatedAt']) {
      if (!data[field]) add(at, `frontmatter is missing "${field}"`);
    }
    if (!Number.isInteger(data.order)) add(at, 'frontmatter order must be a whole number');
    if (data.slug && data.slug !== slug) add(at, `slug "${data.slug}" does not match the filename`);
    if (data.section && !sectionIds.includes(data.section)) {
      add(at, `section "${data.section}" does not exist in _meta.json`);
    }
    if (data.updatedAt && !DATE.test(data.updatedAt)) add(at, `updatedAt "${data.updatedAt}" must be YYYY-MM-DD`);
    if (seen.has(slug)) add(at, `duplicate slug "${slug}"`);
    seen.add(slug);
  }

  return errors;
}
