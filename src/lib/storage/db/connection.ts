import { openDB, type IDBPDatabase } from 'idb';
import { DB_CONFIG, type OfflineDB } from './schema';

let dbInstance: IDBPDatabase<OfflineDB> | null = null;
let dbInitPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<OfflineDB>> {
  if (dbInstance) return dbInstance;
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = openDB<OfflineDB>(DB_CONFIG.name, DB_CONFIG.version, {
    upgrade(db, oldVersion) {
      // Handle version upgrades
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.articles)) {
        const store = db.createObjectStore(DB_CONFIG.stores.articles, { 
          keyPath: 'id' 
        });
        // Create index after store is created
        store.createIndex('by-date', 'savedAt');
      }

      // Ensure index exists for existing stores
      const store = db.transaction(DB_CONFIG.stores.articles).objectStore(DB_CONFIG.stores.articles);
      if (!store.indexNames.contains('by-date')) {
        store.createIndex('by-date', 'savedAt');
      }
    },
    blocked() {
      console.warn('Database upgrade blocked by other tabs');
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }
    },
    blocking() {
      if (dbInstance) {
        dbInstance.close();
        dbInstance = null;
      }
    },
    terminated() {
      dbInstance = null;
      dbInitPromise = null;
    },
  });

  try {
    dbInstance = await dbInitPromise;
    return dbInstance;
  } catch (error) {
    dbInitPromise = null;
    throw error;
  }
}

export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
  dbInitPromise = null;
}