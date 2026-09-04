import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { djb2, parseFrontmatter, validateMeta, validateArticles, ICONS } from './validate.mjs';

const said = (errors, fragment) => errors.some((e) => `${e.where} ${e.message}`.includes(fragment));

const section = (over = {}) => ({
  id: 'water', order: 2, icon: 'Droplets',
  title: { ar: 'الماء' }, sub: { ar: 'التخزين والتطهير' }, ...over,
});
const contact = (over = {}) => ({
  id: 'samu', order: 2, number: '190', tel: 'tel:190', name: { ar: 'الإسعاف' }, ...over,
});
const meta = (over = {}) => ({
  schemaVersion: 2, sections: [section()], emergencyContacts: [contact()], ...over,
});
const article = (over = {}) => ({
  slug: 'majel-javel',
  data: {
    slug: 'majel-javel', section: 'water', lang: 'ar',
    title: 'ت', summary: 'ص', updatedAt: '2026-08-28', order: 1, ...over,
  },
});

test('djb2 matches the values the app already has cached', () => {
  assert.equal(djb2(''), '1505');
  assert.equal(djb2('hana'), '7c716d43');
  assert.equal(djb2('هانا عايشين'), '762a87c8');
});

test('frontmatter reads quoted values, numbers and colons in titles', () => {
  const data = parseFrontmatter('---\nslug: zeer-pot\norder: 2\ntitle: "وعاء الزير: ثلاجة الأجداد"\n---\n\nالنص');
  assert.deepEqual(data, { slug: 'zeer-pot', order: 2, title: 'وعاء الزير: ثلاجة الأجداد' });
});

test('frontmatter reads a CRLF file the same way', () => {
  assert.deepEqual(parseFrontmatter('---\r\nslug: a\r\norder: 1\r\n---\r\nbody'), { slug: 'a', order: 1 });
});

test('a file with no frontmatter returns null', () => {
  assert.equal(parseFrontmatter('# just a heading'), null);
});

test('the real _meta.json passes', () => {
  const real = JSON.parse(readFileSync(new URL('../public/content/_meta.json', import.meta.url), 'utf8'));
  assert.deepEqual(validateMeta(real), []);
});

test('a well-formed _meta.json passes', () => {
  assert.deepEqual(validateMeta(meta()), []);
});

test('duplicate section id is rejected', () => {
  assert.ok(said(validateMeta(meta({ sections: [section(), section()] })), 'duplicate id'));
});

test('an icon outside the whitelist is rejected', () => {
  assert.ok(said(validateMeta(meta({ sections: [section({ icon: 'Hospitl' })] })), '"Hospitl" is not one of'));
});

test('a tel with spaces is rejected', () => {
  assert.ok(said(validateMeta(meta({ emergencyContacts: [contact({ tel: 'tel:71 335 500' })] })), 'must look like'));
});

test('a title without Arabic is rejected', () => {
  assert.ok(said(validateMeta(meta({ sections: [section({ title: { fr: 'Eau' } })] })), 'missing its Arabic text'));
});

test('the wrong schemaVersion is rejected', () => {
  assert.ok(said(validateMeta(meta({ schemaVersion: 1 })), 'schemaVersion must be 2'));
});

test('a non-integer order is rejected', () => {
  assert.ok(said(validateMeta(meta({ sections: [section({ order: '2' })] })), 'order must be'));
});

test('a well-formed guide passes', () => {
  assert.deepEqual(validateArticles([article()], ['water']), []);
});

test('a guide pointing at an unknown section is rejected', () => {
  assert.ok(said(validateArticles([article({ section: 'watter' })], ['water']), 'does not exist in _meta.json'));
});

test('frontmatter slug must match the filename', () => {
  assert.ok(said(validateArticles([article({ slug: 'majel' })], ['water']), 'does not match the filename'));
});

test('two guides with the same slug are rejected', () => {
  assert.ok(said(validateArticles([article(), article()], ['water']), 'duplicate slug'));
});

test('updatedAt must be YYYY-MM-DD', () => {
  assert.ok(said(validateArticles([article({ updatedAt: '28/08/2026' })], ['water']), 'must be YYYY-MM-DD'));
});

test('a missing frontmatter field is named', () => {
  const a = article();
  delete a.data.summary;
  assert.ok(said(validateArticles([a], ['water']), 'missing "summary"'));
});

test('a file without frontmatter is reported', () => {
  assert.ok(said(validateArticles([{ slug: 'p', data: null }], ['water']), 'missing the --- frontmatter'));
});

test('the icon whitelist matches ICONS in src/data/sections.ts', () => {
  const ts = readFileSync(new URL('../src/data/sections.ts', import.meta.url), 'utf8');
  const body = /export const ICONS: Record<string, LucideIcon \| undefined> = \{([\s\S]*?)\};/.exec(ts);
  assert.ok(body, 'could not find the ICONS map');
  assert.deepEqual(body[1].split(',').map((s) => s.trim()).filter(Boolean).sort(), [...ICONS].sort());
});
