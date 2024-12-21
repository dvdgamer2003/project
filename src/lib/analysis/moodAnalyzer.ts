import type { Article } from '@/types';
import type { Mood } from '@/types/mood';
import { MOODS } from '@/types/mood';

// Sentiment keywords for each mood
const MOOD_KEYWORDS = {
  cheerful: [
    'success', 'happy', 'positive', 'win', 'celebrate', 'achieve', 'breakthrough',
    'joy', 'exciting', 'amazing', 'wonderful', 'good news', 'progress'
  ],
  serious: [
    'analysis', 'report', 'study', 'research', 'investigation', 'critical',
    'important', 'significant', 'development', 'policy', 'decision'
  ],
  curious: [
    'discover', 'innovation', 'research', 'study', 'fascinating', 'breakthrough',
    'new', 'revolutionary', 'explore', 'experiment', 'learn', 'finding'
  ],
  relaxed: [
    'lifestyle', 'entertainment', 'enjoy', 'relax', 'fun', 'leisure', 'art',
    'culture', 'travel', 'food', 'music', 'wellness', 'peaceful'
  ],
  motivated: [
    'achieve', 'goal', 'success', 'inspire', 'lead', 'growth', 'improvement',
    'progress', 'milestone', 'breakthrough', 'innovation', 'excellence'
  ]
};

// Negative keywords that might not fit certain moods
const NEGATIVE_KEYWORDS = [
  'death', 'kill', 'war', 'crisis', 'disaster', 'tragedy', 'accident',
  'fatal', 'crash', 'emergency', 'threat', 'danger', 'violent'
];

function calculateMoodScore(text: string, mood: Mood): number {
  const normalizedText = text.toLowerCase();
  let score = 0;

  // Check for mood-specific keywords
  MOOD_KEYWORDS[mood].forEach(keyword => {
    if (normalizedText.includes(keyword.toLowerCase())) {
      score += 1;
    }
  });

  // Penalize for negative keywords in cheerful and relaxed moods
  if (mood === 'cheerful' || mood === 'relaxed') {
    NEGATIVE_KEYWORDS.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        score -= 2;
      }
    });
  }

  // Bonus for matching categories
  const categories = MOODS[mood].categories;
  if (categories.some(category => normalizedText.includes(category.toLowerCase()))) {
    score += 0.5;
  }

  return score;
}

export function analyzeMoodSuitability(articles: Article[], mood: Mood): Article[] {
  // First filter by preferred categories
  const categoryFiltered = articles.filter(article => 
    MOODS[mood].categories.includes(article.category.toLowerCase())
  );

  // If we have enough category-matched articles, score and sort them
  if (categoryFiltered.length >= 6) {
    return categoryFiltered
      .map(article => ({
        article,
        score: calculateMoodScore(
          `${article.title} ${article.description}`,
          mood
        )
      }))
      .sort((a, b) => b.score - a.score)
      .filter(item => item.score > 0)
      .map(item => item.article);
  }

  // If not enough category matches, analyze all articles
  return articles
    .map(article => ({
      article,
      score: calculateMoodScore(
        `${article.title} ${article.description}`,
        mood
      )
    }))
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .map(item => item.article);
}