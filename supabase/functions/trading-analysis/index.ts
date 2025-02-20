
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbol, marketData } = await req.json() as { 
      symbol: string;
      marketData: MarketData[];
    };

    console.log('Analyzing trading data for:', symbol);

    // Basis analyse logica
    const latestPrice = marketData[marketData.length - 1].price;
    const averagePrice = marketData.reduce((sum, data) => sum + data.price, 0) / marketData.length;
    const volumeIncrease = marketData[marketData.length - 1].volume > marketData[marketData.length - 2].volume;

    // Trading signaal genereren
    let recommendation = "";
    let confidence = 0;
    let riskScore = 0;

    if (latestPrice > averagePrice && volumeIncrease) {
      recommendation = "BUY";
      confidence = 0.75;
      riskScore = 0.4;
    } else if (latestPrice < averagePrice && volumeIncrease) {
      recommendation = "SELL";
      confidence = 0.65;
      riskScore = 0.6;
    } else {
      recommendation = "HOLD";
      confidence = 0.85;
      riskScore = 0.2;
    }

    // Aanbeveling opslaan in de database
    const supabaseClient = await createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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
            latest_price: latestPrice,
            average_price: averagePrice,
            volume_increase: volumeIncrease
          }
        },
        confidence,
        collected_at: new Date().toISOString()
      });

    if (insertError) {
      throw insertError;
    }

    // Response terugsturen
    return new Response(
      JSON.stringify({
        recommendation,
        confidence,
        riskScore,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in trading analysis:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Hulp functie voor Supabase client
async function createClient(supabaseUrl: string, supabaseKey: string) {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.7.1');
  return createClient(supabaseUrl, supabaseKey);
}
