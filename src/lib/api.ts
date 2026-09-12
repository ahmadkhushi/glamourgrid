/**
 * Utility for resolving API endpoint paths.
 * Returns relative paths (e.g., '/api/orders') so Vercel natively resolves
 * all requests on the same domain without requiring external environment variables.
 */
export function getApiUrl(path: string): string {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If an external backend base URL is explicitly set, use it; otherwise return clean relative path
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  if (baseUrl) {
    return `${baseUrl}${cleanPath}`;
  }
  
  return cleanPath;
}

