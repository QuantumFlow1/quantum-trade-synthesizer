
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfmlretexydslgowlkid.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbWxyZXRleHlkc2xnb3dsa2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3ODkyMDAsImV4cCI6MjA1NTM2NTIwMH0.1w7FEnBOJAvIVyScs6vqOfk7e0IRNF8tTC8ccOxiHfE'

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
  }
})

// Enhanced connection check function with improved error handling and debugging
export const checkSupabaseConnection = async () => {
  console.log('Starting Supabase connection check...');
  const results = {
    marketData: false,
    database: false,
    grok3API: false
  };
  
  const failures = [];
  
  try {
    // Test edge function connection - market data
    console.log('Testing market-data-collector function...');
    try {
      const { data: marketData, error: marketError } = await supabase.functions.invoke('market-data-collector');
      
      if (marketError) {
        console.error('Market data collector error:', marketError);
        failures.push('Market data collector failed: ' + marketError.message);
      } else {
        console.log('Market data collector response:', marketData);
        
        // Validate the market data response
        const isValidData = marketData && (
          (Array.isArray(marketData) && marketData.length > 0) ||
          (marketData.data && Array.isArray(marketData.data) && marketData.data.length > 0)
        );
        
        results.marketData = isValidData;
        if (!isValidData) {
          failures.push('Market data collector returned invalid data format');
        }
      }
    } catch (error) {
      console.error('Market data collector exception:', error);
      failures.push('Market data collector exception: ' + (error instanceof Error ? error.message : String(error)));
    }

    // Test database connection
    console.log('Testing database connection...');
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('trading_pairs')
        .select('count(*)')
        .single();
      
      if (dbError) {
        console.error('Database connection error:', dbError);
        failures.push('Database connection failed: ' + dbError.message);
      } else {
        console.log('Database connection successful:', dbData);
        results.database = true;
      }
    } catch (dbError) {
      console.error('Database exception:', dbError);
      failures.push('Database exception: ' + (dbError instanceof Error ? dbError.message : String(dbError)));
    }

    // Test Grok3 API connection
    console.log('Testing Grok3 API connection...');
    try {
      const { data: grokData, error: grokError } = await supabase.functions.invoke('grok3-ping');
      
      if (grokError) {
        console.error('Grok3 API connection error:', grokError);
        failures.push('Grok3 API failed: ' + grokError.message);
      } else {
        console.log('Grok3 API connection response:', grokData);
        results.grok3API = grokData?.status === 'available';
        if (!results.grok3API) {
          failures.push('Grok3 API returned unavailable status');
        }
      }
    } catch (grokError) {
      console.error('Grok3 API connection exception:', grokError);
      failures.push('Grok3 API exception: ' + (grokError instanceof Error ? grokError.message : String(grokError)));
    }

    console.log('Supabase connection check results:', results);
    console.log('Connection failures:', failures);
    return results.marketData || results.database; // Return true if at least one vital service is available
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
}
