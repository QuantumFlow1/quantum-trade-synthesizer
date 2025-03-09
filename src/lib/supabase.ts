
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
  
  try {
    // Test edge function connection
    console.log('Testing market-data-collector function...');
    const { data: marketData, error: marketError } = await supabase.functions.invoke('market-data-collector');
    
    if (marketError) {
      console.error('Market data collector error:', marketError);
    } else {
      console.log('Market data collector response:', marketData);
      
      // Validate the market data response
      const isValidData = marketData && (
        (Array.isArray(marketData) && marketData.length > 0) ||
        (marketData.data && Array.isArray(marketData.data) && marketData.data.length > 0)
      );
      
      results.marketData = isValidData;
    }

    // Test database connection
    console.log('Testing database connection...');
    const { data: dbData, error: dbError } = await supabase
      .from('trading_pairs')
      .select('count(*)')
      .single();
    
    if (dbError) {
      console.error('Database connection error:', dbError);
    } else {
      console.log('Database connection successful:', dbData);
      results.database = true;
    }

    // Test Grok3 API connection
    console.log('Testing Grok3 API connection...');
    try {
      const { data: grokData, error: grokError } = await supabase.functions.invoke('grok3-ping');
      
      if (grokError) {
        console.error('Grok3 API connection error:', grokError);
      } else {
        console.log('Grok3 API connection response:', grokData);
        results.grok3API = grokData?.status === 'available';
      }
    } catch (grokError) {
      console.error('Grok3 API connection exception:', grokError);
    }

    console.log('Supabase connection check results:', results);
    return results;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return results;
  }
}
