
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketData {
  symbol: string;
  market: string;
  price: number;
  volume: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

serve(async (req) => {
  console.log('Trading analysis function started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Parsing request body');
    const body = await req.json();
    console.log('Received request body:', body);
    
    const { symbol, marketData } = body as { 
      symbol: string;
      marketData: MarketData[];
    };

    if (!symbol || !marketData || !Array.isArray(marketData) || marketData.length === 0) {
      console.error('Invalid input data:', { symbol, marketDataLength: marketData?.length });
      throw new Error('Invalid input data');
    }

    const latestData = marketData[0]; // We krijgen nu maar 1 data punt
    console.log('Processing data for symbol:', symbol, 'Latest data:', latestData);

    // Vereenvoudigde analyse voor één datapunt
    let recommendation = "";
    let confidence = 0;
    let riskScore = 0;

    // Analyse op basis van 24-uurs verandering en huidige prijs
    if (latestData.change24h > 0 && latestData.price > latestData.low24h * 1.02) {
      recommendation = "BUY";
      confidence = 0.75;
      riskScore = 0.4;
    } else if (latestData.change24h < 0 && latestData.price < latestData.high24h * 0.98) {
      recommendation = "SELL";
      confidence = 0.65;
      riskScore = 0.6;
    } else {
      recommendation = "HOLD";
      confidence = 0.85;
      riskScore = 0.2;
    }

    console.log('Analysis results:', {
      recommendation,
      confidence,
      riskScore,
      metrics: {
        change24h: latestData.change24h,
        currentPrice: latestData.price,
        high24h: latestData.high24h,
        low24h: latestData.low24h
      }
    });

    // Supabase client setup
    console.log('Setting up Supabase client');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Missing Supabase credentials');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Store recommendation
    console.log('Storing recommendation in database');
    const { error: insertError } = await supabaseClient
      .from('agent_collected_data')
      .insert({
        agent_id: 'trading-ai-1',
        data_type: 'trade_recommendation',
        source: symbol,
        content: {
          recommendation,
          risk_score: riskScore,
          market_data: {
            symbol: latestData.symbol,
            market: latestData.market,
            latest_price: latestData.price,
            change_24h: latestData.change24h,
            high_24h: latestData.high24h,
            low_24h: latestData.low24h,
            volume: latestData.volume
          }
        },
        confidence,
        collected_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to save recommendation');
    }

    console.log('Successfully processed and stored trading analysis');

    return new Response(
      JSON.stringify({
        symbol,
        recommendation,
        confidence,
        riskScore,
        metrics: {
          change24h: latestData.change24h,
          currentPrice: latestData.price
        },
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in trading analysis:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
