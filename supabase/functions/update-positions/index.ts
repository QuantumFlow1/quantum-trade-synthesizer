
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the trade data from the request
    const { trade } = await req.json();
    const { user_id, pair_id, amount, price, type } = trade;

    // Fetch existing position
    const { data: existingPosition } = await supabaseClient
      .from('positions')
      .select('*')
      .eq('user_id', user_id)
      .eq('pair_id', pair_id)
      .single();

    if (type === 'buy') {
      if (existingPosition) {
        // Update existing position
        const newAmount = existingPosition.amount + amount;
        const newAvgPrice = ((existingPosition.amount * existingPosition.average_entry_price) + (amount * price)) / newAmount;
        
        await supabaseClient
          .from('positions')
          .update({
            amount: newAmount,
            average_entry_price: newAvgPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPosition.id);
      } else {
        // Create new position
        await supabaseClient
          .from('positions')
          .insert({
            user_id,
            pair_id,
            amount,
            average_entry_price: price
          });
      }
    } else if (type === 'sell') {
      if (existingPosition) {
        const newAmount = existingPosition.amount - amount;
        
        if (newAmount <= 0) {
          // Close position
          await supabaseClient
            .from('positions')
            .delete()
            .eq('id', existingPosition.id);
        } else {
          // Update position
          await supabaseClient
            .from('positions')
            .update({
              amount: newAmount,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPosition.id);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
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
