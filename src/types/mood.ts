export type Mood = 'cheerful' | 'serious' | 'curious' | 'relaxed' | 'motivated';

export const MOODS: Record<Mood, {
  label: string;
  description: string;
  categories: string[];
  emoji: string;
}> = {
  cheerful: {
    label: 'Cheerful',
    description: 'Uplifting and positive stories',
    categories: ['entertainment', 'sports', 'technology'],
    emoji: '😊'
  },
  serious: {
    label: 'Serious',
    description: 'In-depth news and analysis',
    categories: ['politics', 'business', 'science'],
    emoji: '🤔'
  },
  curious: {
    label: 'Curious',
    description: 'Interesting and educational content',
    categories: ['science', 'education', 'technology'],
    emoji: '🧐'
  },
  relaxed: {
    label: 'Relaxed',
    description: 'Light and entertaining stories',
    categories: ['travel', 'food', 'entertainment'],
    emoji: '😌'
  },
  motivated: {
    label: 'Motivated',
    description: 'Inspiring success stories',
    categories: ['business', 'sports', 'technology'],
    emoji: '💪'
  }
};