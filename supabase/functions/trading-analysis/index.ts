
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TradingAnalysisRequest {
  riskLevel: "low" | "medium" | "high";
  simulationMode: boolean;
  rapidMode: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Trading analysis function starting...');

    // Parse request body
    const requestData: TradingAnalysisRequest = await req.json();
    console.log('Request data received:', requestData);

    // Generate mock analysis for testing
    const mockAnalysis = {
      shouldTrade: true,
      recommendedAction: Math.random() > 0.5 ? 'buy' : 'sell',
      confidence: Math.floor(Math.random() * (95 - 70) + 70),
      currentPrice: 45000 + (Math.random() * 1000)
    };

    console.log('Generated analysis:', mockAnalysis);

    return new Response(
      JSON.stringify(mockAnalysis),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error in trading analysis:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
})
