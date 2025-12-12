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

export const SITE_URL = getBaseUrl();
