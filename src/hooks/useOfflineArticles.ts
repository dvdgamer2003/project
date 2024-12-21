import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import * as db from '@/lib/storage/db';
import type { Article } from '@/types';

export function useOfflineArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      const savedArticles = await db.getArticles();
      setArticles(savedArticles);
    } catch (error) {
      console.error('Error loading offline articles:', error);
      toast.error('Failed to load saved articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
    return () => {
      // Clean up database connection on unmount
      db.closeDB();
    };
  }, [loadArticles]);

  const saveArticle = useCallback(async (article: Article) => {
    try {
      await db.saveArticle(article);
      await loadArticles();
      toast.success('Article saved for offline reading');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
      throw error;
    }
  }, [loadArticles]);

  const removeArticle = useCallback(async (id: string) => {
    try {
      await db.removeArticle(id);
      await loadArticles();
      toast.success('Article removed from saved articles');
    } catch (error) {
      console.error('Error removing article:', error);
      toast.error('Failed to remove article');
      throw error;
    }
  }, [loadArticles]);

  const isArticleSaved = useCallback(async (id: string): Promise<boolean> => {
    try {
      return await db.isArticleSaved(id);
    } catch (error) {
      console.error('Error checking article status:', error);
      return false;
    }
  }, []);

  return {
    articles,
    loading,
    saveArticle,
    removeArticle,
    isArticleSaved,
  };
}