
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Agent, TradeAction } from '../../src/types/agent.ts';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key, x-openai-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

// Define types for the function
interface RequestBody {
  agentId: string;
  agentType: Agent['type'];
  message: string;
  systemPrompt?: string;
  history?: Array<{ role: string; content: string }>;
}

interface ResponseBody {
  status: 'success' | 'error';
  response?: string;
  error?: string;
}

// Map agent types to specific instructions
const getAgentSpecificInstructions = (agentType: Agent['type']): string => {
  switch (agentType) {
    case 'trader':
      return `You focus on identifying short to medium-term trading opportunities based on technical indicators, momentum, and market sentiment. 
      You should mention specific price levels, technical indicators, and time frames when appropriate.`;
    
    case 'analyst':
      return `You focus on analyzing market trends, company fundamentals, and providing detailed insights.
      You should include data points, ratios, and comprehensive market analysis when appropriate.`;
    
    case 'portfolio_manager':
      return `You focus on portfolio optimization, risk management, and asset allocation.
      You should consider diversification, correlation between assets, and risk-adjusted returns when providing advice.`;
    
    case 'advisor':
      return `You focus on personalized investment advice based on financial goals and risk tolerance.
      You should ask clarifying questions about the investor's objectives and circumstances when needed.`;
    
    case 'fundamentals_analyst':
      return `You focus on analyzing company financials, earnings reports, and business metrics.
      You should cite specific financial data and business fundamentals when discussing companies.`;
    
    case 'technical_analyst':
      return `You focus exclusively on chart patterns, technical indicators, and price action.
      You should mention specific patterns, indicators, and technical levels in your analysis.`;
    
    case 'value_investor':
      return `You focus on identifying undervalued assets based on fundamental analysis and intrinsic value calculations.
      You should mention valuation metrics, margin of safety, and long-term outlook in your responses.`;
    
    case 'receptionist':
      return `You help users navigate the platform and explain various features.
      You should be welcoming, helpful, and guide users to the appropriate tools and resources.`;
    
    default:
      return `You are a knowledgeable trading assistant who provides insights, analysis, and recommendations about financial markets.`;
  }
};

// Process requests with different LLM providers
const processWithGroq = async (
  message: string, 
  systemPrompt: string, 
  history: Array<{ role: string; content: string }>,
  apiKey: string
): Promise<string> => {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ];
  
  console.log(`Calling Groq API with ${messages.length} messages`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages,
      temperature: 0.7,
      max_tokens: 800
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Groq API error (${response.status}):`, errorText);
    throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
};

const processWithOpenAI = async (
  message: string, 
  systemPrompt: string, 
  history: Array<{ role: string; content: string }>,
  apiKey: string
): Promise<string> => {
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: message }
  ];
  
  console.log(`Calling OpenAI API with ${messages.length} messages`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 800
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`OpenAI API error (${response.status}):`, errorText);
    throw new Error(`OpenAI API returned status ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
};

// Generate a simulated response as fallback
const generateSimulatedResponse = (
  message: string,
  agentType: Agent['type']
): string => {
  console.log('Generating simulated response');
  
  // Base response based on agent type
  const baseResponses: Record<Agent['type'], string[]> = {
    'trader': [
      "Based on recent price action, this looks like a potential breakout opportunity.",
      "The technical indicators are showing a bearish divergence, suggesting caution.",
      "I'd recommend waiting for confirmation of the trend before entering this trade."
    ],
    'analyst': [
      "My analysis of the market data suggests we're entering a consolidation phase.",
      "Looking at the broader economic indicators, I expect volatility to increase in the near term.",
      "The sector is showing strong fundamentals despite recent price corrections."
    ],
    'portfolio_manager': [
      "From a portfolio perspective, I'd recommend increasing your allocation to defensive assets.",
      "Given your current positions, adding this asset would improve your diversification.",
      "Your portfolio shows an overexposure to this sector; consider rebalancing."
    ],
    'advisor': [
      "Based on your investment goals, a more conservative approach might be appropriate.",
      "This investment aligns well with your long-term objectives.",
      "Given your risk tolerance, I'd suggest considering alternative options."
    ],
    'receptionist': [
      "I'd be happy to guide you through our trading platform features.",
      "You can find that information in the Analytics section of the dashboard.",
      "Let me help you navigate to the right tool for your needs."
    ],
    'value_investor': [
      "This company appears undervalued based on its fundamentals and future growth prospects.",
      "The current price offers a significant margin of safety relative to intrinsic value.",
      "I don't see sufficient value at current price levels; better opportunities exist elsewhere."
    ],
    'fundamentals_analyst': [
      "The company's latest earnings report shows improving profit margins and cash flow.",
      "Their debt-to-equity ratio is concerning compared to industry peers.",
      "The fundamental metrics indicate strong growth potential in the coming quarters."
    ],
    'technical_analyst': [
      "The chart is forming a clear head and shoulders pattern, suggesting a potential reversal.",
      "We're seeing a golden cross on the daily chart, which is typically a bullish signal.",
      "The RSI indicates that this asset is currently overbought."
    ],
    'valuation_expert': [
      "Using a DCF model, I estimate the fair value about 15% above current market price.",
      "The company is trading at a significant discount to its intrinsic value.",
      "Based on comparable company analysis, the current valuation seems fair."
    ]
  };
  
  // Choose a random base response for the agent type
  const agentResponses = baseResponses[agentType] || baseResponses['advisor'];
  const baseResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
  
  // Add some personalization based on the message
  let personalizedPrefix = '';
  
  if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('purchase')) {
    personalizedPrefix = "Regarding your question about buying, ";
  } else if (message.toLowerCase().includes('sell')) {
    personalizedPrefix = "About your selling consideration, ";
  } else if (message.toLowerCase().includes('risk')) {
    personalizedPrefix = "On the topic of risk, ";
  } else if (message.toLowerCase().includes('market')) {
    personalizedPrefix = "Looking at the current market conditions, ";
  } else if (message.toLowerCase().includes('strategy')) {
    personalizedPrefix = "When it comes to your trading strategy, ";
  } else if (message.toLowerCase().includes('portfolio')) {
    personalizedPrefix = "Considering your portfolio, ";
  } else if (message.toLowerCase().includes('crypto') || message.toLowerCase().includes('bitcoin')) {
    personalizedPrefix = "Regarding the crypto market, ";
  } else if (message.toLowerCase().includes('stock') || message.toLowerCase().includes('equity')) {
    personalizedPrefix = "When analyzing this stock, ";
  } else {
    personalizedPrefix = "Based on your question, ";
  }
  
  return personalizedPrefix + baseResponse;
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ 
      status: 'error', 
      error: 'Method not allowed' 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 405 
    });
  }
  
  try {
    // Parse the request body
    const requestData: RequestBody = await req.json();
    
    // Validate required fields
    if (!requestData.agentId || !requestData.agentType || !requestData.message) {
      throw new Error('Missing required fields: agentId, agentType, or message');
    }
    
    console.log(`Processing request for agent ${requestData.agentId} (${requestData.agentType})`);
    console.log(`Message: ${requestData.message.substring(0, 100)}${requestData.message.length > 100 ? '...' : ''}`);
    
    // Extract API keys from headers
    const groqApiKey = req.headers.get('x-groq-api-key') || '';
    const openaiApiKey = req.headers.get('x-openai-api-key') || '';
    
    // Create system prompt if not provided
    const systemPrompt = requestData.systemPrompt || `You are a ${requestData.agentType} trading agent.
      ${getAgentSpecificInstructions(requestData.agentType)}
      Respond to the user's questions and provide insights based on your expertise.
      Current date: ${new Date().toISOString().split('T')[0]}`;
    
    // Initialize response
    let agentResponse: string;
    
    // Try Groq API first
    if (groqApiKey) {
      try {
        console.log('Attempting to use Groq API');
        agentResponse = await processWithGroq(
          requestData.message,
          systemPrompt,
          requestData.history || [],
          groqApiKey
        );
        console.log('Successfully received response from Groq API');
      } catch (groqError) {
        console.error('Error using Groq API:', groqError);
        
        // Try OpenAI as fallback
        if (openaiApiKey) {
          console.log('Falling back to OpenAI API');
          try {
            agentResponse = await processWithOpenAI(
              requestData.message,
              systemPrompt,
              requestData.history || [],
              openaiApiKey
            );
            console.log('Successfully received response from OpenAI API');
          } catch (openaiError) {
            console.error('Error using OpenAI API:', openaiError);
            // Fall back to simulation
            agentResponse = generateSimulatedResponse(requestData.message, requestData.agentType);
          }
        } else {
          // No OpenAI API key, use simulation
          console.log('No OpenAI API key available, using simulation');
          agentResponse = generateSimulatedResponse(requestData.message, requestData.agentType);
        }
      }
    } 
    // Try OpenAI if no Groq key
    else if (openaiApiKey) {
      try {
        console.log('Using OpenAI API');
        agentResponse = await processWithOpenAI(
          requestData.message,
          systemPrompt,
          requestData.history || [],
          openaiApiKey
        );
        console.log('Successfully received response from OpenAI API');
      } catch (openaiError) {
        console.error('Error using OpenAI API:', openaiError);
        // Fall back to simulation
        agentResponse = generateSimulatedResponse(requestData.message, requestData.agentType);
      }
    } 
    // No API keys, use simulation
    else {
      console.log('No API keys available, using simulation');
      agentResponse = generateSimulatedResponse(requestData.message, requestData.agentType);
    }
    
    // Return the response
    return new Response(
      JSON.stringify({
        status: 'success',
        response: agentResponse
      } as ResponseBody),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      } as ResponseBody),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
