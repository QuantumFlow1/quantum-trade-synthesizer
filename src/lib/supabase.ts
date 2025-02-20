
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

// Verbeterde connection check function met meer logging
export const checkSupabaseConnection = async () => {
  console.log('Starting Supabase connection check...');
  
  try {
    // Test edge function connection
    console.log('Testing market-data-collector function...');
    const { data: marketData, error: marketError } = await supabase.functions.invoke('market-data-collector')
    
    if (marketError) {
      console.error('Market data collector error:', marketError)
      return false
    }
    console.log('Market data collector response:', marketData)

    // Test database connection
    console.log('Testing database connection...');
    const { data: dbData, error: dbError } = await supabase
      .from('agent_collected_data')
      .select('count')
      .limit(1)
    
    if (dbError) {
      console.error('Database connection error:', dbError)
      return false
    }
    console.log('Database connection successful:', dbData)

    return true
  } catch (error) {
    console.error('Supabase connection check failed:', error)
    return false
  }
}