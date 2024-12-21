import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TrendingNews } from './components/TrendingNews';
import { RecommendedNews } from './components/RecommendedNews';
import { NewsSection } from './components/NewsSection';
import { MoodSelector } from './components/MoodSelector';
import { FloatingAiButton } from './components/ai/FloatingAiButton';
import { useAuth } from './hooks/useAuth';
import { useMoodBasedNews } from './hooks/useMoodBasedNews';
import { getNewsSectionTitle } from './lib/utils/news';
import type { Category } from './types/categories';

export default function App() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const { 
    selectedMood,
    setSelectedMood,
    articles, 
    loading, 
    error 
  } = useMoodBasedNews();

  const showTrendingAndRecommended = !selectedCategory && !selectedMood;

  return (
    <>
      <Layout 
        onCategorySelect={setSelectedCategory} 
        selectedCategory={selectedCategory}
      >
        <div className="max-w-7xl mx-auto">
          <MoodSelector 
            selectedMood={selectedMood} 
            onMoodSelect={setSelectedMood} 
          />

          {showTrendingAndRecommended && (
            <>
              <TrendingNews />
              <RecommendedNews />
            </>
          )}

          <NewsSection
            title={getNewsSectionTitle(selectedMood, selectedCategory)}
            articles={articles}
            loading={loading}
            error={error}
            paginationType="pagination"
          />
        </div>
      </Layout>
      <FloatingAiButton articles={articles} />
    </>
  );
}