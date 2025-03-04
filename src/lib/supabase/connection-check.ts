
import { supabase } from './client';
import { withTimeout } from './utils';

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
      // Create a promise from the Supabase query
      const dbPromise = supabase
        .from('agent_collected_data')
        .select('count')
        .limit(1)
        .then(result => {
          return { data: result.data, error: result.error };
        });
      
      // Convert PromiseLike to Promise to avoid TypeScript error
      const dbRequest = Promise.resolve(dbPromise);
      
      const { data: dbData, error: dbError } = await withTimeout(
        dbRequest,
        5000,
        'Database connection timed out after 5 seconds'
      );
      
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
        const marketDataPromise = supabase.functions.invoke('market-data-collector');
        
        const { data: marketData, error: marketError } = await withTimeout(
          marketDataPromise,
          5000,
          'Market data collector function timed out after 5 seconds'
        );
        
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
        
        const grokApiPromise = supabase.functions.invoke('grok3-ping', grokTestParams);
        
        const { data: grokData, error: grokError } = await withTimeout(
          grokApiPromise,
          5000,
          'Grok3 API connection timed out after 5 seconds'
        );
        
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
