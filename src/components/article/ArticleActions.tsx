import React from 'react';
import { Bookmark } from 'lucide-react';
import { SaveOfflineButton } from '../SaveOfflineButton';
import { TextToSpeech } from '../TextToSpeech';
import type { Article } from '@/types';

interface ArticleActionsProps {
  article: Article;
  isBookmarked?: boolean;
  onBookmark?: () => void;
}

export function ArticleActions({ article, isBookmarked, onBookmark }: ArticleActionsProps) {
  if (!article) return null;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.();
  };

  return (
    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
      <TextToSpeech text={`${article.title}. ${article.description}`} />
      <SaveOfflineButton article={article} />
      {onBookmark && (
        <button
          onClick={handleBookmark}
          className={`p-2 rounded-full backdrop-blur-md ${
            isBookmarked
              ? 'bg-primary/90 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-gray-100/90'
          } transition-colors`}
          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          <Bookmark className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}