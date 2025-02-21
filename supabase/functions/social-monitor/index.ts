
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SocialData {
  text: string;
  source: string;
  timestamp: string;
}

interface SentimentAnalysis {
  score: number;
  sentiment: "positief" | "negatief" | "neutraal";
  confidence: number;
}

const analyzeSentiment = (text: string): SentimentAnalysis => {
  // Basis sentiment analyse logica
  const positiveWords = ["stijging", "winst", "groei", "bullish", "opwaarts", "vertrouwen"];
  const negativeWords = ["daling", "verlies", "bearish", "neerwaarts", "risico", "zorgen"];
  
  const words = text.toLowerCase().split(" ");
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  const normalizedScore = score / Math.max(words.length, 1);
  
  return {
    score: normalizedScore,
    sentiment: normalizedScore > 0.1 ? "positief" : 
              normalizedScore < -0.1 ? "negatief" : "neutraal",
    confidence: Math.min(Math.abs(normalizedScore) * 2, 1)
  };
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { socialData } = await req.json() as { socialData: SocialData[] };
    
    console.log('Analyzing social data:', socialData);

    const analyses = socialData.map(data => ({
      ...data,
      analysis: analyzeSentiment(data.text)
    }));

    // Log de resultaten voor debugging
    console.log('Sentiment analyses:', analyses);

    return new Response(
      JSON.stringify({ 
        analyses,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in social-monitor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
