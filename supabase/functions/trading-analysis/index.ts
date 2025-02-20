
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
  timestamp: number;
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
    const { symbol, marketData } = await req.json() as { 
      symbol: string;
      marketData: MarketData[];
    };

    console.log(`Processing trading data for ${symbol}`, { 
      dataPoints: marketData?.length,
      firstPoint: marketData?.[0],
      lastPoint: marketData?.[marketData.length - 1] 
    });

    if (!marketData || marketData.length < 2) {
      console.error('Invalid market data received:', { symbol, marketData });
      throw new Error('Insufficient market data provided');
    }

    // Basis analyse logica
    const latestData = marketData[marketData.length - 1];
    const previousData = marketData[marketData.length - 2];
    
    console.log('Calculating metrics', {
      latest: latestData,
      previous: previousData
    });

    const priceChange = ((latestData.price - previousData.price) / previousData.price) * 100;
    const volumeChange = ((latestData.volume - previousData.volume) / previousData.volume) * 100;
    
    // Verbeterde trading signaal logica
    let recommendation = "";
    let confidence = 0;
    let riskScore = 0;

    // Analyse op basis van prijs, volume en 24-uurs verandering
    if (priceChange > 0 && volumeChange > 10 && latestData.change24h > 0) {
      recommendation = "BUY";
      confidence = 0.75 + (Math.min(volumeChange, 50) / 200); // Max bonus van 0.25
      riskScore = 0.4 + (Math.abs(priceChange) / 100); // Hoger risico bij grotere prijsverandering
    } else if (priceChange < 0 && volumeChange > 10 && latestData.change24h < 0) {
      recommendation = "SELL";
      confidence = 0.65 + (Math.min(volumeChange, 50) / 200);
      riskScore = 0.6 + (Math.abs(priceChange) / 100);
    } else {
      recommendation = "HOLD";
      confidence = 0.85;
      riskScore = 0.2;
    }

    console.log('Analysis results', {
      recommendation,
      confidence,
      riskScore,
      metrics: {
        priceChange,
        volumeChange,
        change24h: latestData.change24h
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
            latest_price: latestData.price,
            price_change: priceChange,
            volume_change: volumeChange,
            change_24h: latestData.change24h,
            high_24h: latestData.high24h,
            low_24h: latestData.low24h
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
        recommendation,
        confidence,
        riskScore,
        metrics: {
          priceChange,
          volumeChange,
          change24h: latestData.change24h
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
