
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

    // Parse the close request from the request
    const { simulation } = await req.json();
    console.log("Received simulation close data:", simulation);
    
    const { id, exit_price } = simulation;

    if (!id || !exit_price) {
      throw new Error("Missing required fields: id or exit_price");
    }

    // Get the simulation first
    const { data: simData, error: getError } = await supabase
      .from('simulated_trades')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) {
      console.error("Error retrieving simulation:", getError);
      throw getError;
    }

    // Calculate P&L based on position type
    let pnl = 0;
    if (simData.type === 'long') {
      pnl = (exit_price - simData.entry_price) * simData.amount;
    } else {
      pnl = (simData.entry_price - exit_price) * simData.amount;
    }

    console.log("Closing simulation with:", {
      id,
      exit_price,
      pnl,
      status: 'closed',
      entry_price: simData.entry_price,
      amount: simData.amount,
      type: simData.type
    });

    // Update the simulation record
    const { data, error } = await supabase
      .from('simulated_trades')
      .update({
        exit_price,
        pnl,
        status: 'closed',
        closed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Error closing simulation:", error);
      throw error;
    }
    
    console.log("Simulation closed successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        simulation: data 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error processing simulation close:', error);
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
