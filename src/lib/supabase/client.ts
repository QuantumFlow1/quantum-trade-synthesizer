
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfmlretexydslgowlkid.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbWxyZXRleHlkc2xnb3dsa2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3ODkyMDAsImV4cCI6MjA1NTM2NTIwMH0.1w7FEnBOJAvIVyScs6vqOfk7e0IRNF8tTC8ccOxiHfE'

// Configure the client to avoid using PREPARE statements and handle timeouts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    fetch: (...args) => {
      // Add custom headers to avoid PREPARE statement issues
      const [url, options = {}] = args;
      
      // Add headers to prevent PREPARE statements
      options.headers = {
        ...options.headers,
        'X-Supabase-Prefer': 'tx=rollback',
        'X-Supabase-DB-No-Prepare': 'true',
        'apikey': supabaseAnonKey // Always include API key in headers
      };
      
      // Add timeout to requests to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`Request to ${url} timed out after 10 seconds`);
        controller.abort();
      }, 10000); // 10 second timeout
      
      // Use existing signal if provided
      if (options.signal) {
        const originalSignal = options.signal;
        originalSignal.addEventListener('abort', () => controller.abort());
      }
      
      options.signal = controller.signal;
      
      // Execute fetch with timeout
      return fetch(url, options)
        .then(response => {
          clearTimeout(timeoutId);
          return response;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.error('Supabase fetch error:', error);
          // Rethrow the error after logging
          throw error;
        });
    }
  }
});
