
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

interface GlobalMetricsResponse {
  data: {
    btc_dominance: number;
    eth_dominance: number;
    active_cryptocurrencies: number;
    active_exchanges: number;
    total_cryptocurrencies: number;
    total_exchanges: number;
    total_market_cap: number;
    total_volume_24h: number;
    altcoin_volume_24h: number;
    altcoin_market_cap: number;
    defi_volume_24h: number;
    defi_market_cap: number;
    defi_24h_percentage_change: number;
    stablecoin_volume_24h: number;
    stablecoin_market_cap: number;
    derivatives_volume_24h: number;
    last_updated: string;
    quote: {
      USD: {
        total_market_cap: number;
        total_volume_24h: number;
        altcoin_volume_24h: number;
        altcoin_market_cap: number;
        defi_volume_24h: number;
        defi_market_cap: number;
        stablecoin_volume_24h: number;
        stablecoin_market_cap: number;
        derivatives_volume_24h: number;
        last_updated: string;
      }
    }
  };
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
    elapsed: number;
    credit_count: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CMC_API_KEY = Deno.env.get('COINMARKETCAP_API_KEY');
    
    if (!CMC_API_KEY) {
      console.error('No CoinMarketCap API key found in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'CoinMarketCap API key is not configured',
          success: false
        }),
        { 
          status: 500, 
          headers: corsHeaders 
        }
      );
    }

    console.log('Fetching global metrics from CoinMarketCap...');
    
    // Fetch global metrics from CoinMarketCap API
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CoinMarketCap API error (${response.status}):`, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `CoinMarketCap API error: ${response.status} ${response.statusText}`,
          details: errorText,
          success: false
        }),
        { 
          status: response.status, 
          headers: corsHeaders 
        }
      );
    }

    const data: GlobalMetricsResponse = await response.json();
    console.log('Successfully retrieved global metrics from CoinMarketCap');
    
    // Format the response to include only the data we need
    const formattedData = {
      btcDominance: data.data.btc_dominance,
      ethDominance: data.data.eth_dominance,
      activeCryptocurrencies: data.data.active_cryptocurrencies,
      activeExchanges: data.data.active_exchanges,
      totalMarketCap: data.data.quote.USD.total_market_cap,
      totalVolume24h: data.data.quote.USD.total_volume_24h,
      lastUpdated: data.data.last_updated,
      source: 'coinmarketcap'
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: formattedData
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in coinmarketcap-global-metrics function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: `Server error: ${error.message || 'Unknown error'}`,
        success: false
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
