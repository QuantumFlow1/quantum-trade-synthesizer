
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SocialData {
  text: string;
  source: string;
  timestamp: string;
  language?: string;
  region?: string;
}

interface SentimentAnalysis {
  score: number;
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  language: string;
  market_context: {
    region: string;
    timezone: string;
    market_hours: string;
  };
}

const getMarketContext = (region: string = 'global'): any => {
  const contexts = {
    'EU': {
      region: 'Europe',
      timezone: 'CET',
      market_hours: '09:00-17:30 CET'
    },
    'US': {
      region: 'United States',
      timezone: 'EST',
      market_hours: '09:30-16:00 EST'
    },
    'ASIA': {
      region: 'Asia',
      timezone: 'JST',
      market_hours: 'Various (JST/HKT/SGT)'
    },
    'global': {
      region: 'Global',
      timezone: 'UTC',
      market_hours: '24/7'
    }
  };
  
  return contexts[region] || contexts.global;
};

const detectLanguage = (text: string): string => {
  // Basis taaldetectie op basis van karaktersets en patronen
  const patterns = {
    nl: /\b(het|de|een|dat|dit|deze|die|en|is|zijn)\b/i,
    en: /\b(the|a|an|this|that|these|those|and|is|are)\b/i,
    fr: /\b(le|la|les|un|une|des|ce|cette|ces|et|est|sont)\b/i,
    de: /\b(der|die|das|ein|eine|und|ist|sind)\b/i,
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang;
  }
  
  return 'en'; // Default to English
};

const analyzeSentimentMultilingual = (text: string, language: string): number => {
  const sentimentDictionaries = {
    nl: {
      positive: ["stijging", "winst", "groei", "bullish", "opwaarts", "vertrouwen", "positief"],
      negative: ["daling", "verlies", "bearish", "neerwaarts", "risico", "zorgen", "negatief"]
    },
    en: {
      positive: ["increase", "profit", "growth", "bullish", "upward", "confidence", "positive"],
      negative: ["decrease", "loss", "bearish", "downward", "risk", "concerns", "negative"]
    },
    fr: {
      positive: ["hausse", "profit", "croissance", "haussier", "confiance", "positif"],
      negative: ["baisse", "perte", "baissier", "risque", "préoccupations", "négatif"]
    },
    de: {
      positive: ["Anstieg", "Gewinn", "Wachstum", "bullisch", "Vertrauen", "positiv"],
      negative: ["Rückgang", "Verlust", "bärisch", "Risiko", "Sorgen", "negativ"]
    }
  };

  const dictionary = sentimentDictionaries[language] || sentimentDictionaries.en;
  const words = text.toLowerCase().split(/\s+/);
  
  let score = 0;
  let wordCount = 0;
  
  words.forEach(word => {
    if (dictionary.positive.includes(word)) score += 1;
    if (dictionary.negative.includes(word)) score -= 1;
    wordCount++;
  });

  return score / Math.max(wordCount, 1);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { socialData } = await req.json() as { socialData: SocialData[] };
    console.log('Analyzing social data:', socialData);

    const analyses = socialData.map(data => {
      const language = data.language || detectLanguage(data.text);
      const sentimentScore = analyzeSentimentMultilingual(data.text, language);
      const marketContext = getMarketContext(data.region);
      
      const analysis: SentimentAnalysis = {
        score: sentimentScore,
        sentiment: sentimentScore > 0.1 ? "positive" : 
                  sentimentScore < -0.1 ? "negative" : "neutral",
        confidence: Math.min(Math.abs(sentimentScore) * 2, 1),
        language: language,
        market_context: marketContext
      };

      return {
        ...data,
        analysis
      };
    });

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
