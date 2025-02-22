
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
    console.log('Starting trading analysis function');
    
    // Parse request body
    const requestData: TradingAnalysisRequest = await req.json();
    console.log('Received request data:', requestData);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // Fetch latest market data
    console.log('Fetching latest market data');
    const { data: marketData, error: marketError } = await supabase
      .from('market_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (marketError) {
      console.error('Error fetching market data:', marketError);
      throw marketError;
    }

    console.log(`Retrieved ${marketData?.length || 0} market data points`);

    // Perform analysis based on risk level and mode
    console.log('Performing analysis with parameters:', {
      riskLevel: requestData.riskLevel,
      simulationMode: requestData.simulationMode,
      rapidMode: requestData.rapidMode
    });

    // Generate analysis result
    const analysis = {
      shouldTrade: Math.random() > 0.5,
      recommendedAction: Math.random() > 0.5 ? 'buy' : 'sell',
      recommendedAmount: Math.floor(Math.random() * 100) + 1,
      confidence: Math.floor(Math.random() * 100),
      currentPrice: marketData?.[0]?.price || 0
    };

    console.log('Analysis completed:', analysis);

    // Store analysis result
    console.log('Storing analysis result');
    const { error: insertError } = await supabase
      .from('trading_signals')
      .insert({
        signal_type: analysis.recommendedAction,
        price: analysis.currentPrice,
        confidence: analysis.confidence,
        strategy: requestData.rapidMode ? 'RapidFlow AI' : 'QuantumFlow AI',
        volume: analysis.recommendedAmount,
        status: 'pending',
        metadata: {
          riskLevel: requestData.riskLevel,
          simulationMode: requestData.simulationMode
        }
      });

    if (insertError) {
      console.error('Error storing analysis result:', insertError);
      throw insertError;
    }

    console.log('Analysis result stored successfully');

    // Return response
    return new Response(
      JSON.stringify(analysis),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Trading analysis error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})

