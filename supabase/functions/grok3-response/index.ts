
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Cors headers voor cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Grok3 API service starting...")

interface RequestBody {
  message: string;
  context?: any[];
}

// Helper om de verzoeken naar Grok3 API te verzenden
async function fetchGrok3Response(message: string, context: any[] = []) {
  try {
    const apiKey = Deno.env.get("GROK3_API_KEY");
    
    if (!apiKey) {
      console.error("GROK3_API_KEY is not set in environment variables");
      throw new Error("API key not configured");
    }
    
    console.log("Grok3 API key present:", !!apiKey);
    
    // System ping test - geef direct pong terug
    if (message === "system: ping test") {
      console.log("Received system ping test, responding with pong");
      return {
        response: "pong", 
        status: "available"
      };
    }

    // Log de inkomende boodschap en context (maar zonder gevoelige gegevens)
    console.log(`Processing request with message length: ${message.length} chars`);
    console.log(`Context items: ${context?.length || 0}`);

    // Hier zou je eigenlijk je echte Grok3 API aanroepen
    // Dit is een gesimuleerde respons voor testdoeleinden
    let response;

    // Voor demonstratiedoeleinden - echte implementatie zou de Grok3 API aanroepen
    if (message.toLowerCase().includes("genereer financieel advies") || 
        message.toLowerCase().includes("generate financial trading advice")) {
      response = "Voor een optimale portefeuille in de huidige markt, adviseer ik een verdeling van 40% large-cap aandelen, 20% obligaties, 25% tech, 10% grondstoffen en 5% cash. Recente marktvolatiliteit vraagt om strategische spreiding. Overweeg DCA-strategie voor techaandelen gezien de huidige correctie. Houd MACD en RSI indicatoren in de gaten voor timing.";
    } else if (message.toLowerCase().includes("genereer signaal") || 
               message.toLowerCase().includes("generate signal") || 
               message.toLowerCase().includes("perform market analysis")) {
      response = `{"direction": "LONG", "entry_price": 156.23, "stop_loss": 152.80, "take_profit": 162.50, "confidence": 78, "reasoning": "Bullish divergence op RSI met ondersteuningsniveau getest. Volume neemt toe met positieve MACD crossover."}`;
    } else if (message.toLowerCase().includes("generate")) {
      response = "Based on current market conditions, I recommend focusing on quality stocks with strong balance sheets. Consider defensive sectors like healthcare and consumer staples while reducing exposure to high-beta tech stocks. Maintain adequate cash reserves for opportunities after the current correction phase.";
    } else if (message.toLowerCase().includes("kan je m")) {
      response = `Dit is een test antwoord van de Grok3 API. Je vroeg: "${message}"`;
    } else {
      response = `Ik heb je vraag ontvangen: "${message}". Als trading assistent kan ik je helpen met marktanalyse, investeringsstrategieën en risicobeheer. Wat wil je specifiek weten?`;
    }

    return {
      response: response,
      status: "available"
    };

  } catch (error) {
    console.error("Error in Grok3 API call:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Controleer of de methode POST is
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Only POST requests are supported' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse de request body
    const requestData: RequestBody = await req.json();
    const { message, context = [] } = requestData;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Processing message:", message.substring(0, 50) + (message.length > 50 ? "..." : ""));

    // Roep de Grok3 API aan
    const result = await fetchGrok3Response(message, context);

    // Stuur de response terug
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred', 
      status: "unavailable"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/grok3-response' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"message":"Hello Grok"}'
