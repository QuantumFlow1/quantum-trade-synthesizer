
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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

interface MarketAnalysis {
  recommendation: "BUY" | "SELL" | "OBSERVE" | "HOLD";
  confidence: number;
  reason: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const analyzeMarketWithAI = async (data: MarketData, retryCount = 0): Promise<MarketAnalysis> => {
  console.log(`[${new Date().toISOString()}] Starting AI analysis for ${data.symbol} (attempt ${retryCount + 1})`);

  try {
    const prompt = `As a financial expert, analyze this market data and provide a trading recommendation:
    - Symbol: ${data.symbol}
    - Current Price: ${data.price}
    - 24h Volume: ${data.volume}
    - 24h Change: ${data.change24h}%
    - 24h High: ${data.high24h}
    - 24h Low: ${data.low24h}

    Provide a recommendation (BUY/SELL/HOLD/OBSERVE) with a confidence score (0-1) and a brief reason.
    Format your response exactly like this example:
    RECOMMENDATION: BUY
    CONFIDENCE: 0.85
    REASON: Strong upward trend with high volume suggesting continued momentum`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a professional financial analyst providing trading recommendations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        console.log(`Rate limited, retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * (retryCount + 1));
        return analyzeMarketWithAI(data, retryCount + 1);
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const result = await response.json();
    console.log('OpenAI response:', result);

    if (!result.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response format:', result);
      throw new Error('Invalid response format from OpenAI');
    }

    const analysisText = result.choices[0].message.content;
    console.log('Analysis text:', analysisText);
    
    const recommendationMatch = analysisText.match(/RECOMMENDATION:\s*(BUY|SELL|HOLD|OBSERVE)/i);
    const confidenceMatch = analysisText.match(/CONFIDENCE:\s*(0\.\d+)/i);
    const reasonMatch = analysisText.match(/REASON:\s*(.+)$/i);

    if (!recommendationMatch || !confidenceMatch || !reasonMatch) {
      console.error('Failed to parse AI response:', { analysisText, recommendationMatch, confidenceMatch, reasonMatch });
      throw new Error('Could not understand AI analysis format');
    }

    return {
      recommendation: recommendationMatch[1].toUpperCase() as "BUY" | "SELL" | "HOLD" | "OBSERVE",
      confidence: parseFloat(confidenceMatch[1]),
      reason: reasonMatch[1].trim()
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    if (retryCount < MAX_RETRIES && error.message.includes('OpenAI API error')) {
      console.log(`Retrying analysis (attempt ${retryCount + 2})...`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return analyzeMarketWithAI(data, retryCount + 1);
    }
    throw error;
  }
};

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Received request`);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestData = await req.json();
    console.log('Received market data:', requestData);

    if (!requestData?.symbol || !requestData?.price) {
      throw new Error('Invalid request: Missing required market data (symbol or price)');
    }

    const marketData: MarketData = {
      symbol: requestData.symbol,
      market: requestData.market,
      price: requestData.price,
      volume: requestData.volume,
      change24h: requestData.change24h,
      high24h: requestData.high24h,
      low24h: requestData.low24h,
      timestamp: requestData.timestamp
    };

    const analysis = await analyzeMarketWithAI(marketData);
    console.log('Analysis result:', analysis);

    return new Response(
      JSON.stringify({ 
        analysis,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        status: 'error',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('OpenAI API error: 429') ? 429 : 500
      }
    );
  }
});
