
import { createClient } from '@supabase/supabase-js'

// Vervang deze waarden met de keys uit je Supabase dashboard
const supabaseUrl = 'https://tfmlretexydslgowlkid.supabase.co'
const supabaseAnonKey = 'JOUW_NIEUWE_ANON_KEY' // Vervang dit met je nieuwe anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
