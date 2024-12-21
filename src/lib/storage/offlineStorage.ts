import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Article } from '@/types';

interface OfflineDB extends DBSchema {
  articles: {
    key: string;
    value: Article & {
      savedAt: number;
    };
    indexes: {
      'by-date': number;
    };
  };
}

const DB_NAME = 'offline_articles';
const STORE_NAME = 'articles';
const DB_VERSION = 1;

class OfflineStorage {
  private dbPromise: Promise<IDBPDatabase<OfflineDB>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<OfflineDB>> {
    return openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create the store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-date', 'savedAt');
        }
      },
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs.');
      },
      blocking() {
        console.warn('Database blocking upgrade in another tab.');
      },
      terminated() {
        console.error('Database connection terminated unexpectedly.');
      },
    });
  }

  async saveArticle(article: Article): Promise<void> {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, {
      ...article,
      savedAt: Date.now(),
    });
  }

  async removeArticle(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(STORE_NAME, id);
  }

  async getArticles(): Promise<Article[]> {
    const db = await this.dbPromise;
    const articles = await db.getAllFromIndex(STORE_NAME, 'by-date');
    return articles;
  }

  async isArticleSaved(id: string): Promise<boolean> {
    const db = await this.dbPromise;
    const article = await db.get(STORE_NAME, id);
    return !!article;
  }

  async clear(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(STORE_NAME);
  }
}

export const offlineStorage = new OfflineStorage();