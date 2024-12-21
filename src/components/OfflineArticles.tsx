import React from 'react';
import { Wifi, WifiOff, Trash2 } from 'lucide-react';
import { NewsCard } from './NewsCard';
import { LoadingSpinner } from './LoadingSpinner';
import { useOfflineArticles } from '@/hooks/useOfflineArticles';

interface OfflineArticlesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OfflineArticles({ isOpen, onClose }: OfflineArticlesProps) {
  const { articles, loading, removeArticle } = useOfflineArticles();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {navigator.onLine ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-yellow-500" />
            )}
            <h3 className="text-lg font-semibold">Saved Articles</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-5rem)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onRemove={() => removeArticle(article.id)}
                  showRemoveButton
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No saved articles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}