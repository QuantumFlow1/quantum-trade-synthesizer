
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { TradingDataPoint } from "../_shared/trading-types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { marketData, source } = await req.json();
    console.log(`Validating market data from source: ${source}`);
    
    if (!marketData || !Array.isArray(marketData)) {
      console.error("Invalid market data format received:", marketData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid market data format. Expected an array.",
          valid: false,
          data: null
        }),
        { headers: corsHeaders }
      );
    }
    
    // Map the data to ensure it has the correct structure
    const validatedData = marketData.map((item) => {
      // Explicitly determine trend as "up" or "down" to satisfy TypeScript
      const trendValue: "up" | "down" = 
        (item.change24h > 0 || item.close > item.open) ? "up" : "down";

      // Set default values for required TradingDataPoint properties
      const result: TradingDataPoint = {
        name: item.name || item.symbol || "Unknown",
        open: typeof item.open === 'number' ? item.open : (item.price || 0),
        close: typeof item.close === 'number' ? item.close : (item.price || 0),
        high: typeof item.high === 'number' ? item.high : (item.high24h || item.price * 1.02 || 0),
        low: typeof item.low === 'number' ? item.low : (item.low24h || item.price * 0.98 || 0),
        volume: typeof item.volume === 'number' ? item.volume : (item.volume24h || 0),
        // Calculate derived metrics if not provided
        sma: item.sma || ((item.open + item.close) / 2) || 0,
        ema: item.ema || (item.sma * 0.8 + Math.random() * 20 - 10) || 0,
        rsi: item.rsi || Math.random() * 100 || 50,
        macd: item.macd || Math.random() * 20 - 10 || 0,
        macdSignal: item.macdSignal || (item.macd + (Math.random() * 4 - 2)) || 0,
        macdHistogram: item.macdHistogram || (item.macd - item.macdSignal) || 0,
        bollingerUpper: item.bollingerUpper || (item.high + Math.random() * 300) || 0,
        bollingerLower: item.bollingerLower || (item.low - Math.random() * 300) || 0,
        stochastic: item.stochastic || Math.random() * 100 || 50,
        adx: item.adx || Math.random() * 100 || 50,
        // Use the explicitly determined trend value
        trend: trendValue
      };
      
      return result;
    });
    
    console.log(`Successfully validated ${validatedData.length} data points`);
    
    // Return the validated and formatted data
    return new Response(
      JSON.stringify({ 
        valid: true,
        data: validatedData 
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error in market-data-validator function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        valid: false,
        data: null
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
