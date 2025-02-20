
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl!, supabaseKey!)

async function monitorSocialData() {
  const sources = [
    { type: 'twitter', keywords: ['crypto', 'bitcoin', 'ethereum'] },
    { type: 'news', keywords: ['market analysis', 'financial news'] },
    { type: 'weather', locations: ['New York', 'London', 'Tokyo'] }
  ]

  const timestamp = new Date().toISOString()

  for (const source of sources) {
    try {
      // Simuleer sociale data verzameling (in productie zou dit echte API calls zijn)
      const socialData = {
        timestamp,
        metrics: {
          sentiment: Math.random() * 2 - 1, // -1 to 1
          volume: Math.floor(Math.random() * 10000),
          trending_topics: ['market volatility', 'economic growth', 'inflation'],
        },
        source: source.type,
        keywords: source.keywords || source.locations
      }

      // Bereken sentiment score
      const sentiment = socialData.metrics.sentiment
      
      // Sla data op in de database
      const { error } = await supabase
        .from('agent_collected_data')
        .insert({
          agent_id: source.type,
          data_type: 'social_data',
          content: socialData,
          source: source.type,
          collected_at: timestamp,
          sentiment: sentiment,
          confidence: 0.85
        })

      if (error) {
        console.error(`Error storing ${source.type} data:`, error)
      }
    } catch (error) {
      console.error(`Error collecting ${source.type} data:`, error)
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting social monitoring...')
    await monitorSocialData()
    
    return new Response(
      JSON.stringify({ message: 'Social monitoring completed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in social-monitor:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
