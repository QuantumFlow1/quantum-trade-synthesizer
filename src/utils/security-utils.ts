
/**
 * Security utilities for protecting against XSS and other attacks
 */

/**
 * Sanitizes HTML strings to prevent XSS attacks
 * @param html The HTML string to sanitize
 * @returns A sanitized string
 */
export const sanitizeHtml = (html: string): string => {
  // Simple implementation - for production, consider using DOMPurify or similar library
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validates user input against allowed patterns
 * @param input User input to validate
 * @param pattern Regex pattern to test against
 * @returns Boolean indicating if input matches the pattern
 */
export const validateUserInput = (input: string, pattern: RegExp): boolean => {
  return pattern.test(input);
};

/**
 * Creates a nonce value for use with CSP
 * @returns A random nonce string
 */
export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Checks if a URL is on the allowed domains list
 * @param url The URL to check
 * @param allowedDomains Array of allowed domains
 * @returns Boolean indicating if the URL is allowed
 */
export const isUrlAllowed = (url: string, allowedDomains: string[]): boolean => {
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || 
      urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch (e) {
    return false; // Invalid URL
  }
};
