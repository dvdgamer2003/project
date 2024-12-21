// Time constants
export const TIME_CONSTANTS = {
  REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  REFRESH_COOLDOWN: 30 * 1000, // 30 seconds
  CACHE_TTL: 15 * 60 * 1000, // 15 minutes
} as const;

// Pagination constants
export const PAGINATION = {
  ARTICLES_PER_PAGE: 24,
  MAX_PAGES: 5,
} as const;