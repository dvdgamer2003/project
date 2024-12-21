import type { DBSchema } from 'idb';
import type { Article } from '@/types';

export interface OfflineArticle extends Article {
  savedAt: number;
}

export interface OfflineDB extends DBSchema {
  articles: {
    key: string;
    value: OfflineArticle;
    indexes: {
      'by-date': number;
    };
  };
}

export const DB_CONFIG = {
  name: 'offline_articles',
  version: 1,
  stores: {
    articles: 'articles'
  }
} as const;