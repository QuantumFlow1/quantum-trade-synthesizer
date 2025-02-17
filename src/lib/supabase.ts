
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfmlretexydslgowlkid.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmbWxyZXRleHlkc2xnb3dsa2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxNTYyNDUsImV4cCI6MjAyMzczMjI0NX0.KagGavpS7KHY5WNmwKbLh_zVxNxQwHbGRlgF5I0GVYU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
