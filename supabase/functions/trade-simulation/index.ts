
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the simulation data from the request
    const { simulation } = await req.json();
    console.log("Received simulation data:", simulation);
    
    const { 
      user_id, 
      pair_id, 
      amount, 
      entry_price, 
      type, 
      strategy = 'user-defined',
      simulation_type = 'daytrading'
    } = simulation;

    // Log the extracted values
    console.log("Processing simulation:", {
      user_id,
      pair_id,
      amount,
      entry_price,
      type,
      strategy,
      simulation_type
    });

    // Create the simulated trade entry
    const { data: simulatedTrade, error } = await supabase
      .from('simulated_trades')
      .insert({
        user_id,
        pair_id,
        amount,
        entry_price,
        type,
        strategy,
        simulation_type,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating simulated trade:", error);
      throw error;
    }
    
    console.log("Simulated trade created:", simulatedTrade);

    return new Response(
      JSON.stringify({ 
        success: true, 
        simulatedTrade 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error processing simulation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
