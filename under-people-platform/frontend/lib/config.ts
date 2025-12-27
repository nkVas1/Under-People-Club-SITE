/**
 * Get the base URL for the frontend site
 */
export const getBaseUrl = () => {
  // 1. Priority: Explicitly set domain in Vercel
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // 2. Fallback for local development
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 3. Last resort fallback
  return 'http://localhost:3000';
};

/**
 * Get the API URL with validation
 * CRITICAL: This must be set for production!
 */
export const getAPIUrl = (): string => {
  // 1. Production: Vercel environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL.trim();
    if (!url.startsWith('http')) {
      console.error('⚠️ API_URL must start with http:// or https://');
      return 'http://localhost:8000';
    }
    return url;
  }

  // 2. Development fallback
  if (typeof window !== 'undefined') {
    return 'http://localhost:8000';
  }

  // 3. Server-side fallback
  return 'http://localhost:8000';
};

export const SITE_URL = getBaseUrl();
export const API_URL = getAPIUrl();

// Validate configuration on startup
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn('⚠️ NEXT_PUBLIC_API_URL not set. Using localhost for development.');
}
