
/**
 * Check if the current environment is localhost
 */
export function isLocalhostEnvironment(): boolean {
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
}

/**
 * Check if the current environment is Gitpod or other cloud IDE
 */
export function isGitpodEnvironment(): boolean {
  return typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
}

/**
 * Get the current origin for CORS suggestions
 */
export function getCurrentOrigin(): string {
  return typeof window !== 'undefined' ? window.location.origin : '';
}

/**
 * Helper to delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
