
/**
 * This utility handles Firebase errors that might occur if Firebase libraries
 * are loaded but not properly configured in the application.
 */

// Flag to track if we've shown the warning
let hasShownFirebaseWarning = false;

/**
 * Intercepts Firestore connection errors and prevents them from
 * repeatedly showing in the console
 */
export const setupFirebaseErrorHandling = () => {
  // Only set up once
  if (typeof window === 'undefined') return;
  
  // Intercept window.fetch to catch Firestore API calls
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Check if this is a Firestore request
    if (url.includes('firestore.googleapis.com')) {
      // Show warning once
      if (!hasShownFirebaseWarning) {
        console.warn(
          'Firebase Firestore connection attempted but not configured. ' +
          'This application uses Supabase for data storage. ' +
          'If you need Firebase functionality, please configure it properly.'
        );
        hasShownFirebaseWarning = true;
      }
      
      // Return a dummy response to prevent errors
      return Promise.resolve(new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    
    // Continue with the original fetch for non-Firestore requests
    return originalFetch.apply(this, [input, init]);
  };
  
  // Suppress Firebase-related console errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const errorString = args.join(' ');
    if (
      errorString.includes('@firebase/firestore') || 
      errorString.includes('firestore.googleapis.com')
    ) {
      // Ignore Firebase errors
      return;
    }
    
    // Pass through other errors
    originalConsoleError.apply(this, args);
  };
};
