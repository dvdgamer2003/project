import React, { useState, useEffect } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { useOfflineArticles } from '@/hooks/useOfflineArticles';
import type { Article } from '@/types';

interface SaveOfflineButtonProps {
  article: Article;
}

export function SaveOfflineButton({ article }: SaveOfflineButtonProps) {
  const { saveArticle, removeArticle, isArticleSaved } = useOfflineArticles();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSavedStatus();
  }, [article.id]);

  const checkSavedStatus = async () => {
    try {
      const isSaved = await isArticleSaved(article.id);
      setSaved(isSaved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (saved) {
        await removeArticle(article.id);
        setSaved(false);
      } else {
        await saveArticle(article);
        setSaved(true);
      }
    } catch (error) {
      console.error('Error toggling article save:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
        saved
          ? 'bg-green-500/90 text-white hover:bg-green-600/90'
          : 'bg-white/90 text-gray-600 hover:bg-gray-100/90'
      }`}
      title={saved ? 'Remove from saved articles' : 'Save for offline reading'}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : saved ? (
        <Check className="w-5 h-5" />
      ) : (
        <Download className="w-5 h-5" />
      )}
    </button>
  );
}