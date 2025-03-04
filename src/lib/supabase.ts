
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

// Enhanced connection check function with improved error handling and debugging
export const checkSupabaseConnection = async () => {
  console.log('Starting Supabase connection check...');
  
  // Check if we're offline
  if (!navigator.onLine) {
    console.log('Browser is offline, skipping connection check');
    return false;
  }
  
  const results = {
    marketData: false,
    database: false,
    grok3API: false
  };
  
  try {
    // Test database connection first as it's the most critical
    console.log('Testing database connection...');
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('agent_collected_data')
        .select('count')
        .limit(1)
        .timeout(5000);
      
      if (dbError) {
        console.error('Database connection error:', dbError);
      } else {
        console.log('Database connection successful:', dbData);
        results.database = true;
      }
    } catch (e) {
      console.error('Exception in database connection check:', e);
    }
    
    // Only proceed with other checks if database is connected
    if (results.database) {
      // Test edge function connection
      console.log('Testing market-data-collector function...');
      try {
        const { data: marketData, error: marketError } = await supabase.functions
          .invoke('market-data-collector')
          .timeout(5000);
        
        if (marketError) {
          console.error('Market data collector error:', marketError);
        } else {
          console.log('Market data collector response:', marketData);
          results.marketData = true;
        }
      } catch (e) {
        console.error('Exception in market data collector check:', e);
      }

      // Test Grok3 API access through edge function with detailed error handling
      console.log('Testing Grok3 API connection...');
      try {
        const grokTestParams = {
          body: {
            isAvailabilityCheck: true,
            timestamp: new Date().toISOString() // Add timestamp to prevent caching
          }
        };
        
        console.log('Grok3 API test parameters:', JSON.stringify(grokTestParams));
        
        const { data: grokData, error: grokError } = await supabase.functions
          .invoke('grok3-ping', grokTestParams)
          .timeout(5000);
        
        if (grokError) {
          console.error('Grok3 API connection error details:', grokError);
        } else {
          console.log('Grok3 API test response:', grokData ? JSON.stringify(grokData).substring(0, 100) + '...' : 'No data');
          results.grok3API = grokData?.status === "available";
        }
      } catch (grokException) {
        console.error('Grok3 API exception details:', grokException);
      }
    }

    // Consider the connection successful if at least the database is working
    const essentialServicesWorking = results.database;
    console.log('Connection check results:', results);
    return essentialServicesWorking;
  } catch (error) {
    console.error('Supabase connection check failed with details:', error);
    console.log('Connection check results:', results);
    return false;
  }
}

// New function to check if the Grok3 API is properly configured and working
export const checkGrok3APIConfig = async () => {
  try {
    console.log('Checking Grok3 API configuration...');
    
    const { data, error } = await supabase.functions
      .invoke('grok3-ping', {
        body: { 
          isAvailabilityCheck: true,
          timestamp: new Date().toISOString(), // Add timestamp to prevent caching
          retryAttempt: Math.floor(Math.random() * 1000) // Add random value to prevent caching
        }
      })
      .timeout(5000);
    
    if (error) {
      console.error('Grok3 API configuration error:', error);
      return { 
        isConfigured: false, 
        error: error 
      };
    }
    
    console.log('Grok3 API configuration check result:', data);
    
    return { 
      isConfigured: data?.status === "available",
      data: data
    };
  } catch (error) {
    console.error('Failed to check Grok3 API configuration:', error);
    return { 
      isConfigured: false, 
      error: error 
    };
  }
}
