/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/* The code snippet you provided is a TypeScript script that sets up a simple HTTP server using Deno
runtime. Here's a breakdown of what the code does: */

import "xhr";
import { serve } from "std/http/server.ts";

interface RequestBody {
  service?: string;
  checkSecret?: boolean;
}

interface ApiKeyStatus {
  openai: boolean;
  claude: boolean;
  deepseek: boolean;
  groq: boolean;
  gemini: boolean;
}

// Get environment variables for the API keys
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const CLAUDE_API_KEY = Deno.env.get('CLAUDE_API_KEY');
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

console.log('Starting server...');

serve(async (req) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request headers
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Get request body
    const bodyText = await req.text();
    console.log('Request body text:', bodyText);
    
    // Parse the request body
    const { service, checkSecret } = bodyText ? JSON.parse(bodyText) : {};
    
    console.log(`Checking API keys. Service: ${service}, checkSecret: ${checkSecret}`);
    
    // Check all keys
    const allKeys = {
      openai: !!OPENAI_API_KEY && OPENAI_API_KEY.length > 10,
      claude: !!CLAUDE_API_KEY && CLAUDE_API_KEY.length > 10,
      deepseek: !!DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 10,
      groq: !!GROQ_API_KEY && GROQ_API_KEY.length > 10,
      gemini: !!GEMINI_API_KEY && GEMINI_API_KEY.length > 10
    };
    
    console.log('API Keys availability:', {
      openai: allKeys.openai,
      claude: allKeys.claude,
      deepseek: allKeys.deepseek,
      groq: allKeys.groq,
      gemini: allKeys.gemini
    });
    
    // If checking a specific service
    if (service && service !== 'any') {
      let secretSet = false;
      
      // Check if the specific service has a key
      switch(service.toLowerCase()) {
        case 'openai':
          secretSet = allKeys.openai;
          break;
        case 'claude':
          secretSet = allKeys.claude;
          break;
        case 'deepseek':
          secretSet = allKeys.deepseek;
          break;
        case 'groq':
          secretSet = allKeys.groq;
          break;
        case 'gemini':
          secretSet = allKeys.gemini;
          break;
        default:
          console.log(`Unknown service: ${service}`);
      }
      
      return new Response(
        JSON.stringify({
          status: secretSet ? 'available' : 'unavailable',
          secretSet,
          service,
          allKeys,
          available: secretSet
        }),
        { headers: corsHeaders }
      );
    }
    
    // Check if any key is available
    const anyKeyAvailable = Object.values(allKeys).some(value => value);
    
    return new Response(
      JSON.stringify({
        status: anyKeyAvailable ? 'available' : 'unavailable',
        allKeys,
        available: anyKeyAvailable,
        message: anyKeyAvailable ? 'API keys are available' : 'No API keys are available'
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error(`Error in check-api-keys function:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
