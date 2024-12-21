import { getDB } from './connection';
import { DB_CONFIG } from './schema';
import type { Article } from '@/types';

// Retry utility for handling transient errors
async function withRetry<T>(
  operation: () => Promise<T>, 
  maxRetries = 3
): Promise<T> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 100)
      );
    }
  }
  
  throw lastError;
}

export async function saveArticle(article: Article): Promise<void> {
  await withRetry(async () => {
    const db = await getDB();
    await db.put(DB_CONFIG.stores.articles, {
      ...article,
      savedAt: Date.now()
    });
  });
}

export async function removeArticle(id: string): Promise<void> {
  await withRetry(async () => {
    const db = await getDB();
    await db.delete(DB_CONFIG.stores.articles, id);
  });
}

export async function getArticles(): Promise<Article[]> {
  return withRetry(async () => {
    const db = await getDB();
    try {
      return await db.getAllFromIndex(
        DB_CONFIG.stores.articles, 
        'by-date'
      );
    } catch (error) {
      // Fallback to getting all if index fails
      console.warn('Index lookup failed, falling back to getAll');
      return db.getAll(DB_CONFIG.stores.articles);
    }
  });
}

export async function isArticleSaved(id: string): Promise<boolean> {
  return withRetry(async () => {
    const db = await getDB();
    const article = await db.get(DB_CONFIG.stores.articles, id);
    return !!article;
  });
}

export async function clearArticles(): Promise<void> {
  await withRetry(async () => {
    const db = await getDB();
    await db.clear(DB_CONFIG.stores.articles);
  });
}