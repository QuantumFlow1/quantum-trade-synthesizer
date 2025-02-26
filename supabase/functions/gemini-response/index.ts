
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, model, maxTokens, temperature, apiKey } = await req.json();

    // Log request details (without sensitive info)
    console.log(`Gemini request received for model: ${model || 'gemini-pro'}`);
    console.log(`Message length: ${message?.length || 0}, context items: ${context?.length || 0}`);
    
    // Validate required parameters
    if (!message) {
      throw new Error("Message is required");
    }

    // Check if API key is provided
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }

    // Prepare conversation history in Gemini format
    const geminiMessages = [];
    
    // Add context messages if available
    if (context && Array.isArray(context)) {
      for (const item of context) {
        if (item.role === 'user') {
          geminiMessages.push({ role: 'user', parts: [{ text: item.content }] });
        } else if (item.role === 'assistant') {
          geminiMessages.push({ role: 'model', parts: [{ text: item.content }] });
        }
      }
    }
    
    // Add the current message
    geminiMessages.push({ role: 'user', parts: [{ text: message }] });

    // Set the API endpoint (Gemini API)
    const selectedModel = model || 'gemini-pro';
    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

    // Prepare request payload for Gemini API
    const payload = {
      contents: geminiMessages,
      generationConfig: {
        temperature: temperature || 0.7,
        maxOutputTokens: maxTokens || 1024,
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
    };

    console.log('Sending request to Gemini API...');
    
    // Make the API call to Gemini
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Parse the API response
    const data = await response.json();
    
    // Log response status (for debugging)
    console.log(`Gemini API response status: ${response.status}`);
    
    // Check for errors in the response
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Failed to get response from Gemini API');
    }

    // Extract the generated text from the Gemini response
    let generatedText = '';
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      generatedText = data.candidates[0].content.parts[0].text || '';
    } else {
      throw new Error('No text generated in Gemini response');
    }

    // Return the successful response
    return new Response(
      JSON.stringify({ 
        response: generatedText,
        status: 'success'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    // Log and return any errors that occur
    console.error('Error in gemini-response function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error in Gemini API request',
        status: 'error'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
