import Dexie, { type Table } from 'dexie';

export interface ArticleRow {
  id?: number;
  slug: string;
  sectionId: string;
  lang: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  updatedAt: string;
  checksum: string;
  order: number;
}

export interface MetaRow {
  key: string;
  value: string;
}

export interface ChecklistRow {
  id: string;
  done: boolean;
}

class HanaDB extends Dexie {
  articles!: Table<ArticleRow, number>;
  meta!: Table<MetaRow, string>;
  checklist!: Table<ChecklistRow, string>;

  constructor() {
    super('hana-3aychin');
    this.version(1).stores({
      articles: '++id, &slug, sectionId, lang, updatedAt',
      meta: '&key',
      checklist: '&id',
    });
  }
}

export const db = new HanaDB();
