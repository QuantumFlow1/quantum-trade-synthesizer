
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

// Enhanced connection check function with more logging and Grok3 API test
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
    const { data: marketData, error: marketError } = await supabase.functions.invoke('market-data-collector')
    
    if (marketError) {
      console.error('Market data collector error:', marketError)
    } else {
      console.log('Market data collector response:', marketData)
      results.marketData = true;
    }

    // Test database connection
    console.log('Testing database connection...');
    const { data: dbData, error: dbError } = await supabase
      .from('agent_collected_data')
      .select('count')
      .limit(1)
    
    if (dbError) {
      console.error('Database connection error:', dbError)
    } else {
      console.log('Database connection successful:', dbData)
      results.database = true;
    }

    // Test Grok3 API access through edge function
    console.log('Testing Grok3 API connection...');
    const { data: grokData, error: grokError } = await supabase.functions.invoke('grok3-response', {
      body: {
        message: 'Simple test message',
        context: []
      }
    })
    
    if (grokError) {
      console.error('Grok3 API connection error:', grokError)
    } else {
      console.log('Grok3 API test response:', grokData ? 'Received data' : 'No data')
      results.grok3API = !!grokData;
    }

    const allConnected = results.marketData && results.database && results.grok3API;
    console.log('Connection check results:', results);
    return allConnected;
  } catch (error) {
    console.error('Supabase connection check failed:', error)
    console.log('Connection check results:', results);
    return false;
  }
}
