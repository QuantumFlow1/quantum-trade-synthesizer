
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
    console.log("Received trade data:", trade);
    
    const { user_id, pair_id, amount, price, type } = trade;

    // Log the extracted values
    console.log("Processing trade:", {
      user_id,
      pair_id,
      amount,
      price,
      type
    });

    // Fetch existing position
    const { data: existingPosition, error: positionError } = await supabaseClient
      .from('positions')
      .select('*')
      .eq('user_id', user_id)
      .eq('pair_id', pair_id)
      .single();

    if (positionError) {
      console.log("No existing position found:", positionError.message);
    } else {
      console.log("Found existing position:", existingPosition);
    }

    if (type === 'buy') {
      if (existingPosition) {
        console.log("Updating existing position");
        const newAmount = existingPosition.amount + amount;
        const newAvgPrice = ((existingPosition.amount * existingPosition.average_entry_price) + (amount * price)) / newAmount;
        
        const { error: updateError } = await supabaseClient
          .from('positions')
          .update({
            amount: newAmount,
            average_entry_price: newAvgPrice,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPosition.id);

        if (updateError) {
          console.error("Error updating position:", updateError);
          throw updateError;
        }
        
        console.log("Position updated successfully");
      } else {
        console.log("Creating new position");
        const { error: insertError } = await supabaseClient
          .from('positions')
          .insert({
            user_id,
            pair_id,
            amount,
            average_entry_price: price
          });

        if (insertError) {
          console.error("Error creating position:", insertError);
          throw insertError;
        }
        
        console.log("New position created successfully");
      }
    } else if (type === 'sell') {
      if (existingPosition) {
        console.log("Processing sell order for existing position");
        const newAmount = existingPosition.amount - amount;
        
        if (newAmount <= 0) {
          console.log("Closing position completely");
          const { error: deleteError } = await supabaseClient
            .from('positions')
            .delete()
            .eq('id', existingPosition.id);

          if (deleteError) {
            console.error("Error deleting position:", deleteError);
            throw deleteError;
          }
          
          console.log("Position closed successfully");
        } else {
          console.log("Reducing position size");
          const { error: updateError } = await supabaseClient
            .from('positions')
            .update({
              amount: newAmount,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingPosition.id);

          if (updateError) {
            console.error("Error updating position:", updateError);
            throw updateError;
          }
          
          console.log("Position size reduced successfully");
        }
      } else {
        console.log("Attempted to sell non-existent position");
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
    console.error('Error processing trade:', error);
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
