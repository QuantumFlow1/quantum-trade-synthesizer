
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

    // Parse the audit data from the request
    const { 
      userId, 
      orderType, 
      assetSymbol, 
      amount, 
      price, 
      value,
      isHighValue,
      required2FA
    } = await req.json();

    console.log("Logging transaction audit:", {
      userId, 
      orderType, 
      assetSymbol, 
      amount, 
      price, 
      value,
      isHighValue,
      required2FA
    });

    // Log the transaction to the audit log
    const { data, error } = await supabase
      .from('transaction_audits')
      .insert({
        user_id: userId,
        transaction_type: orderType,
        asset_symbol: assetSymbol,
        amount,
        price,
        value,
        high_value: isHighValue,
        required_2fa: required2FA,
        source_ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        status: 'completed'
      });

    if (error) {
      console.error("Error logging transaction audit:", error);
      throw error;
    }

    console.log("Transaction audit logged successfully");

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
    console.error('Error logging transaction audit:', error);
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
