
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define the expected shape of valid market data
interface MarketData {
  id?: string;
  symbol: string;
  name?: string;
  price: number;
  change24h?: number;
  volume24h?: number;
  high24h?: number;
  low24h?: number;
  market_cap?: number;
  timestamp?: number;
}

// Robust data validation function
function validateMarketData(data: any, source: string): { valid: boolean; errors: string[]; data?: MarketData[] } {
  const errors: string[] = [];
  
  // Check if data exists and is an array
  if (!data) {
    errors.push(`No data received from ${source}`);
    return { valid: false, errors };
  }
  
  // Handle different data structures from different sources
  let marketData: any[] = [];
  
  if (Array.isArray(data)) {
    marketData = data;
  } else if (data.data && Array.isArray(data.data)) {
    marketData = data.data;
  } else if (typeof data === 'object') {
    // Try to extract data from common API response patterns
    if (data.results && Array.isArray(data.results)) {
      marketData = data.results;
    } else if (data.markets && Array.isArray(data.markets)) {
      marketData = data.markets;
    } else {
      errors.push(`Unrecognized data structure from ${source}`);
      return { valid: false, errors };
    }
  }

  if (marketData.length === 0) {
    errors.push(`Empty data array from ${source}`);
    return { valid: false, errors };
  }

  // Transform and validate each item
  const validatedData: MarketData[] = [];
  
  for (let i = 0; i < marketData.length; i++) {
    const item = marketData[i];
    const itemErrors: string[] = [];
    
    // Check for required fields
    if (!item.symbol && !item.ticker && !item.asset_id) {
      itemErrors.push(`Item ${i} missing symbol/ticker/asset_id`);
    }
    
    // Check for price field with different possible names
    if (
      item.price === undefined && 
      item.current_price === undefined && 
      item.last_price === undefined &&
      item.price_usd === undefined
    ) {
      itemErrors.push(`Item ${i} missing price information`);
    }
    
    // If errors found for this item, log them but continue processing others
    if (itemErrors.length > 0) {
      console.warn(`Validation issues for item ${i}:`, itemErrors);
      errors.push(...itemErrors);
      continue;
    }
    
    // Transform to standard format
    const validItem: MarketData = {
      symbol: item.symbol || item.ticker || item.asset_id,
      name: item.name || item.asset_name || item.coin || item.symbol,
      price: Number(item.price || item.current_price || item.last_price || item.price_usd),
      change24h: item.change_24h !== undefined ? Number(item.change_24h) : 
                 item.price_change_percentage_24h !== undefined ? Number(item.price_change_percentage_24h) : 
                 item.percent_change_24h !== undefined ? Number(item.percent_change_24h) : undefined,
      volume24h: item.volume_24h !== undefined ? Number(item.volume_24h) : 
                 item.total_volume !== undefined ? Number(item.total_volume) : 
                 item.volume !== undefined ? Number(item.volume) : undefined,
      high24h: item.high_24h !== undefined ? Number(item.high_24h) :
               item.high !== undefined ? Number(item.high) : undefined,
      low24h: item.low_24h !== undefined ? Number(item.low_24h) :
              item.low !== undefined ? Number(item.low) : undefined,
      market_cap: item.market_cap !== undefined ? Number(item.market_cap) : undefined,
      timestamp: item.timestamp || Math.floor(Date.now() / 1000)
    };
    
    // Final validation of converted values
    if (isNaN(validItem.price) || validItem.price <= 0) {
      errors.push(`Item ${i} has invalid price: ${validItem.price}`);
      continue;
    }
    
    // Check for any NaN values in numeric fields
    const numericFields: (keyof MarketData)[] = ['price', 'change24h', 'volume24h', 'high24h', 'low24h', 'market_cap'];
    let hasNanValues = false;
    
    for (const field of numericFields) {
      if (validItem[field] !== undefined && isNaN(Number(validItem[field]))) {
        errors.push(`Item ${i} has invalid ${field}: ${validItem[field]}`);
        hasNanValues = true;
      }
    }
    
    if (hasNanValues) continue;
    
    // Add validated item
    validatedData.push(validItem);
  }
  
  // Return validation results
  const isValid = validatedData.length > 0;
  return { 
    valid: isValid, 
    errors: errors,
    data: isValid ? validatedData : undefined
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting enhanced market data validation");
    
    const requestData = await req.json();
    const { marketData, source } = requestData;
    
    console.log(`Received request to validate data from source: ${source}`);
    
    // Validate the market data
    const validationResult = validateMarketData(marketData, source);
    
    if (!validationResult.valid) {
      console.warn("Market data validation failed:", validationResult.errors);
    } else {
      console.log(`Successfully validated ${validationResult.data?.length} market data items`);
    }
    
    // Return the validation result
    return new Response(
      JSON.stringify(validationResult),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error validating market data:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      }),
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
