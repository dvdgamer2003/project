import { MOODS } from '@/types/mood';
import type { Mood } from '@/types/mood';
import type { Category } from '@/types/categories';

export function getNewsSectionTitle(mood?: Mood, category?: Category): string {
  if (mood) {
    return `${MOODS[mood].label} News`;
  }
  
  if (category) {
    return `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Stories`;
  }
  
  return "Latest Stories";
}