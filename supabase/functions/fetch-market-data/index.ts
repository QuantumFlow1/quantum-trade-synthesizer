import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock market data for development
const generateMockMarketData = () => {
  const cryptos = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'LINK', 'UNI', 'AAVE'];
  
  return cryptos.map(symbol => {
    const basePrice = Math.random() * 50000 + 1000;
    const change = (Math.random() - 0.5) * 10;
    
    return {
      symbol: `${symbol}/USDT`,
      price: basePrice,
      change24h: change,
      volume: Math.random() * 1000000000,
      high24h: basePrice * 1.05,
      low24h: basePrice * 0.95,
      market: 'crypto',
      timestamp: Date.now()
    };
  });
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching market data...');
    
    // Return mock data for now
    const marketData = generateMockMarketData();
    
    return new Response(JSON.stringify({
      data: marketData,
      status: 'success',
      timestamp: Date.now()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-market-data function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      data: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});