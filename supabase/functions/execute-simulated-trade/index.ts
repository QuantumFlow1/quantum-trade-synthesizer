
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, amount, price, strategy, confidence } = await req.json()
    console.log('Executing simulated trade:', { type, amount, price, strategy, confidence })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store the simulated trade in the database
    const { data, error } = await supabase
      .from('simulated_trades')
      .insert({
        type: type,
        amount: amount,
        entry_price: price,
        status: 'active',
        simulation_type: 'automated',
        strategy: strategy,
        ai_confidence: confidence,
      })
      .select()
      .single()

    if (error) throw error

    console.log('Simulated trade executed:', data)

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error executing simulated trade:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
