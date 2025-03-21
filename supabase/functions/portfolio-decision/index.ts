
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log(`portfolio-decision function started at ${new Date().toISOString()}`);
  console.log(`Memory usage at start: ${JSON.stringify(Deno.memoryUsage())}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let requestBody;
    try {
      console.log("Parsing request body");
      requestBody = await req.json();
      console.log(`Request body parsed: ${JSON.stringify(requestBody).substring(0, 200)}...`);
    } catch (e) {
      console.error("Error parsing request body:", e);
      throw new Error(`Invalid request body: ${e.message}`);
    }
    
    const { marketData, budget, constraints } = requestBody;
    
    if (!marketData || !Array.isArray(marketData)) {
      throw new Error("Market data is required and must be an array");
    }
    
    console.log(`Received ${marketData.length} market data entries`);
    console.log(`Budget: ${budget}, Constraints: ${JSON.stringify(constraints)}`);
    
    // Generate portfolio decision
    console.time('generateDecision');
    const decision = generatePortfolioDecision(marketData, budget, constraints);
    console.timeEnd('generateDecision');
    
    console.log(`Generated portfolio decision with ${decision.assets.length} assets`);
    console.log(`Memory usage after processing: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return new Response(
      JSON.stringify({
        status: 'success',
        decision,
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
    console.error("Error in portfolio-decision:", error);
    console.error("Error stack:", error.stack);
    console.error(`Memory usage at error: ${JSON.stringify(Deno.memoryUsage())}`);
    
    return new Response(
      JSON.stringify({ 
        status: 'error',
        message: error.message,
        errorType: error.name,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } finally {
    console.log(`portfolio-decision function completed at ${new Date().toISOString()}`);
  }
});

// Generate a portfolio decision based on market data and constraints
function generatePortfolioDecision(marketData, budget = 10000, constraints = {}) {
  try {
    console.log("Generating portfolio decision");
    
    // Default risk level if not specified
    const riskLevel = constraints.riskLevel || 'moderate';
    console.log(`Using risk level: ${riskLevel}`);
    
    // Sort market data by some criteria (e.g., price stability, market cap)
    const sortedData = [...marketData].sort((a, b) => {
      // Prioritize based on risk level
      if (riskLevel === 'conservative') {
        // For conservative, prioritize market cap (stability)
        return (b.marketCap || 0) - (a.marketCap || 0);
      } else if (riskLevel === 'aggressive') {
        // For aggressive, prioritize price change (growth potential)
        return Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0);
      } else {
        // For moderate, balanced approach
        const aScore = (a.marketCap || 0) / 1e9 + (a.change24h > 0 ? a.change24h : 0);
        const bScore = (b.marketCap || 0) / 1e9 + (b.change24h > 0 ? b.change24h : 0);
        return bScore - aScore;
      }
    });
    
    console.log(`Sorted market data, first entry: ${JSON.stringify(sortedData[0])}`);
    
    // Allocate budget based on weightings
    const totalAssets = Math.min(sortedData.length, 5); // Limit to top 5 assets
    const selectedAssets = sortedData.slice(0, totalAssets);
    
    // Calculate allocations
    let allocations = [];
    let remainingBudget = budget;
    
    // Different allocation strategies based on risk
    if (riskLevel === 'conservative') {
      // Conservative: More even distribution with bias to larger caps
      for (let i = 0; i < selectedAssets.length; i++) {
        const weight = (selectedAssets.length - i) / ((selectedAssets.length * (selectedAssets.length + 1)) / 2);
        const allocation = budget * weight;
        allocations.push(allocation);
      }
    } else if (riskLevel === 'aggressive') {
      // Aggressive: Heavily weighted toward top performers
      for (let i = 0; i < selectedAssets.length; i++) {
        const weight = Math.pow(0.6, i);
        const normalizedWeight = weight / selectedAssets.reduce((sum, _, idx) => sum + Math.pow(0.6, idx), 0);
        const allocation = budget * normalizedWeight;
        allocations.push(allocation);
      }
    } else {
      // Moderate: Balanced approach
      for (let i = 0; i < selectedAssets.length; i++) {
        const weight = Math.pow(0.8, i);
        const normalizedWeight = weight / selectedAssets.reduce((sum, _, idx) => sum + Math.pow(0.8, idx), 0);
        const allocation = budget * normalizedWeight;
        allocations.push(allocation);
      }
    }
    
    // Round and adjust to ensure we don't exceed budget due to rounding
    allocations = allocations.map(amount => Math.floor(amount * 100) / 100);
    const totalAllocated = allocations.reduce((sum, amount) => sum + amount, 0);
    
    if (totalAllocated > budget) {
      // Adjust the largest allocation down if we exceed budget
      const maxIndex = allocations.indexOf(Math.max(...allocations));
      allocations[maxIndex] -= (totalAllocated - budget);
    } else if (totalAllocated < budget) {
      // Add remainder to largest allocation
      const maxIndex = allocations.indexOf(Math.max(...allocations));
      allocations[maxIndex] += (budget - totalAllocated);
    }
    
    // Calculate quantities based on current prices
    const assets = selectedAssets.map((asset, i) => {
      const allocation = allocations[i];
      const quantity = asset.price > 0 ? allocation / asset.price : 0;
      
      return {
        symbol: asset.symbol,
        allocation,
        price: asset.price,
        quantity: Math.floor(quantity * 1e6) / 1e6, // Round to 6 decimal places
        percentage: (allocation / budget) * 100
      };
    });
    
    console.log(`Generated allocations for ${assets.length} assets`);
    
    return {
      totalBudget: budget,
      assets,
      riskLevel,
      expectedReturn: calculateExpectedReturn(assets, marketData),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in generatePortfolioDecision:", error);
    // Return failsafe portfolio
    return {
      totalBudget: budget,
      assets: marketData.slice(0, 2).map(asset => ({
        symbol: asset.symbol,
        allocation: budget / 2,
        price: asset.price,
        quantity: (budget / 2) / asset.price,
        percentage: 50
      })),
      riskLevel: 'moderate',
      expectedReturn: 0,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

// Calculate expected return based on historical performance
function calculateExpectedReturn(assets, marketData) {
  try {
    // Simple calculation based on 24h change
    return assets.reduce((total, asset) => {
      const marketAsset = marketData.find(m => m.symbol === asset.symbol);
      const assetReturn = marketAsset ? (marketAsset.change24h / 100) * asset.allocation : 0;
      return total + assetReturn;
    }, 0);
  } catch (error) {
    console.error("Error in calculateExpectedReturn:", error);
    return 0; // Safe fallback
  }
}
