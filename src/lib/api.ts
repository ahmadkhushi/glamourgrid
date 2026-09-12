/**
 * Utility for resolving backend API URLs dynamically based on environment configuration.
 * Supports Vercel frontend + Render backend deployment setup.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

/**
 * Returns the fully qualified API endpoint URL.
 * e.g., getApiUrl('/api/orders') => 'https://your-backend.onrender.com/api/orders'
 */
export function getApiUrl(path: string): string {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  
  return cleanPath;
}
