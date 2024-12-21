import { callMistralAPI } from './client';
import type { Article } from '@/types';
import type { Mood } from '@/types/mood';
import { MOODS } from '@/types/mood';

const MOOD_CHARACTERISTICS = {
  cheerful: 'positive, uplifting, inspiring, happy, successful',
  serious: 'analytical, important, critical, factual, significant',
  curious: 'fascinating, innovative, educational, discovery, research',
  relaxed: 'entertaining, enjoyable, pleasant, calming, lifestyle',
  motivated: 'achievement, success, progress, improvement, breakthrough'
};

export async function analyzeMoodSuitability(articles: Article[], mood: Mood): Promise<Article[]> {
  if (!articles.length) return [];

  try {
    const articleSummaries = articles
      .map((article, i) => `${i + 1}. ${article.title}\n${article.description}`)
      .join('\n\n');

    const prompt = `As a news curator, analyze these articles and select ones that match a ${mood} mood.
    
    A ${mood} mood is characterized by: ${MOOD_CHARACTERISTICS[mood]}
    The preferred categories are: ${MOODS[mood].categories.join(', ')}
    
    Consider both the emotional tone and subject matter.
    Return ONLY the numbers of matching articles (1-based index), separated by commas.
    Select articles that would make someone in a ${mood} mood feel engaged and interested.
    
    Articles to analyze:
    ${articleSummaries}`;

    const response = await callMistralAPI(prompt, { 
      temperature: 0.3,
      maxTokens: 150
    });

    // Parse response and handle potential formatting issues
    const indices = response
      .split(/[,\s]+/)
      .map(num => parseInt(num.trim()) - 1)
      .filter(index => !isNaN(index) && index >= 0 && index < articles.length);

    // Ensure we have at least some articles
    if (indices.length === 0) {
      // Fallback to category-based filtering
      return articles.filter(article => 
        MOODS[mood].categories.includes(article.category.toLowerCase())
      );
    }

    return articles.filter((_, index) => indices.includes(index));
  } catch (error) {
    console.error('Error in mood analysis:', error);
    // Fallback to category-based filtering
    return articles.filter(article => 
      MOODS[mood].categories.includes(article.category.toLowerCase())
    );
  }
}