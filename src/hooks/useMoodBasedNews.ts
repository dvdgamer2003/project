import { useState, useCallback, useEffect } from 'react';
import { useNews } from './useNews';
import { analyzeMoodSuitability } from '@/lib/analysis/moodAnalyzer';
import { shuffleArray } from '@/lib/utils/array';
import { MOODS, type Mood } from '@/types/mood';
import type { Article } from '@/types';
import { toast } from 'react-hot-toast';

const MIN_ARTICLES = 6;

export function useMoodBasedNews() {
  const [selectedMood, setSelectedMood] = useState<Mood>();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const { articles, loading, error, refreshNews } = useNews();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filterArticlesByMood = useCallback((articles: Article[], mood: Mood) => {
    if (!articles.length) return [];
    
    setIsAnalyzing(true);
    try {
      const filtered = analyzeMoodSuitability(articles, mood);
      // Shuffle the filtered articles to add variety
      return shuffleArray(filtered.length >= MIN_ARTICLES ? filtered : articles);
    } catch (error) {
      console.error('Error filtering articles:', error);
      return shuffleArray(articles);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedMood) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = filterArticlesByMood(articles, selectedMood);
    setFilteredArticles(filtered);
    
    if (filtered.length < MIN_ARTICLES && !loading) {
      refreshNews();
    }
  }, [selectedMood, articles, filterArticlesByMood, loading, refreshNews]);

  const handleMoodSelect = useCallback((mood: Mood | undefined) => {
    if (mood === selectedMood) {
      // If same mood is selected, just re-shuffle
      setFilteredArticles(prev => shuffleArray([...prev]));
      return;
    }

    setSelectedMood(mood);
    if (mood) {
      toast.success(`Showing ${MOODS[mood].label.toLowerCase()} news`);
      refreshNews();
    } else {
      // Reset to original articles when mood is cleared
      setFilteredArticles(articles);
    }
  }, [selectedMood, articles, refreshNews]);

  return {
    selectedMood,
    setSelectedMood: handleMoodSelect,
    articles: filteredArticles,
    loading: loading || isAnalyzing,
    error
  };
}