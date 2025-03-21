
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { MarketData } from "../types";
import { supabase } from "@/lib/supabase";
import { 
  Asset, 
  PortfolioParams, 
  generateQUBOMatrix, 
  solveQUBOClassical 
} from "@/utils/quboUtils";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

// Helper function to convert market data to asset format for QUBO
const marketDataToAsset = (marketData?: MarketData): Asset | undefined => {
  if (!marketData) return undefined;
  
  return {
    symbol: marketData.symbol,
    price: marketData.price,
    expectedReturn: marketData.change24h / 100 * marketData.price, // Approximate expected return
    historicalPrices: [
      marketData.low24h || 0,
      marketData.price,
      marketData.high24h || 0
    ]
  };
};

// Generate sample portfolio data for QUBO demonstrations
const generateSamplePortfolio = (baseAsset?: Asset): Asset[] => {
  // If we have market data, use it as one of the assets
  const assets: Asset[] = [];
  
  if (baseAsset) {
    assets.push(baseAsset);
  }
  
  // Add some sample assets to complete the portfolio
  const sampleAssets: Asset[] = [
    { symbol: "BTC", price: 62549.23, expectedReturn: 1252.98 },
    { symbol: "ETH", price: 3045.78, expectedReturn: 76.14 },
    { symbol: "SOL", price: 144.25, expectedReturn: -14.42 },
    { symbol: "DOGE", price: 0.14, expectedReturn: 0.0084 },
    { symbol: "ADA", price: 0.45, expectedReturn: -0.009 }
  ];
  
  // Add sample assets until we have 5 total
  for (let i = 0; i < Math.min(5 - assets.length, sampleAssets.length); i++) {
    assets.push(sampleAssets[i]);
  }
  
  return assets;
};

export function useAIAnalysis(marketData?: MarketData) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data using both traditional and quantum-inspired methods. I can explain optimization concepts, prepare QUBO formulations, and provide insights on up to 16 assets. Ask me about trends, quantum portfolio optimization, or trading strategies. Remember, I only provide analysis - all final decisions are yours.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  // Process messages that might require QUBO computation
  const processQuboRequests = useCallback((message: string): string | null => {
    const lowerMessage = message.toLowerCase();
    
    // Check if this is a request to generate a QUBO matrix
    if (
      (lowerMessage.includes("generate") || lowerMessage.includes("create") || lowerMessage.includes("show")) && 
      (lowerMessage.includes("qubo matrix") || lowerMessage.includes("qubo formulation")) &&
      (lowerMessage.includes("portfolio") || lowerMessage.includes("assets"))
    ) {
      try {
        // Create sample portfolio with the current market data if available
        const baseAsset = marketDataToAsset(marketData);
        const assets = generateSamplePortfolio(baseAsset);
        
        // Parse budget from message or use default
        let budget = 10000; // Default
        const budgetMatch = message.match(/budget of \$?(\d+[,\d]*)/i);
        if (budgetMatch && budgetMatch[1]) {
          budget = parseInt(budgetMatch[1].replace(/,/g, ''));
        }
        
        // Create portfolio parameters
        const portfolioParams: PortfolioParams = {
          assets,
          budget,
          weights: {
            returnWeight: 0.4,
            budgetWeight: 0.4,
            diversificationWeight: 0.2
          }
        };
        
        // Generate QUBO matrix
        const quboMatrix = generateQUBOMatrix(portfolioParams);
        
        // Solve using classical method for demonstration
        const solution = solveQUBOClassical(quboMatrix, budget, assets);
        
        // Format matrix for display (simplified for this example)
        let matrixDisplay = "QUBO Matrix (simplified representation):\n\n";
        const n = Math.min(quboMatrix.matrix.length, 5); // Show at most 5x5
        
        for (let i = 0; i < n; i++) {
          let row = "";
          for (let j = 0; j < n; j++) {
            row += quboMatrix.matrix[i][j].toFixed(2).padStart(8) + " ";
          }
          matrixDisplay += row + "\n";
        }
        
        // Format solution
        const solutionDisplay = `
Selected Assets: ${solution.selectedAssets.join(", ")}
Total Cost: $${solution.totalCost.toFixed(2)}
Expected Return: $${solution.expectedReturn.toFixed(2)}
        `;
        
        // Return comprehensive QUBO explanation
        return `
# QUBO Matrix for Portfolio Optimization

I've generated a QUBO matrix for a portfolio of ${assets.length} assets with a budget of $${budget}.

## Portfolio Assets
${assets.map(a => `- ${a.symbol}: $${a.price.toFixed(2)}, Expected Return: $${a.expectedReturn.toFixed(2)}`).join("\n")}

## QUBO Formulation
The portfolio optimization problem is formulated as:

f(x) = -θ₁∑ᵢxᵢrᵢ + θ₂(∑ᵢxᵢpᵢ - b)² + θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ

Where:
- θ₁ = ${portfolioParams.weights.returnWeight} (return weight)
- θ₂ = ${portfolioParams.weights.budgetWeight} (budget constraint weight)
- θ₃ = ${portfolioParams.weights.diversificationWeight} (diversification weight)
- b = $${budget} (budget)

## Matrix Representation
${matrixDisplay}

## Classical Solution
${solutionDisplay}

This QUBO formulation can be solved on quantum annealing hardware like D-Wave, which is particularly efficient at finding global minima in complex optimization landscapes.

Remember: This is a quantum-inspired simulation, not an actual quantum computation. The final investment decisions are yours alone.
`;
      } catch (error) {
        console.error("Error generating QUBO matrix:", error);
        return null; // Let the AI handle it if we can't generate
      }
    }
    
    return null; // Not a QUBO computation request
  }, [marketData]);

  // Call the Supabase edge function to get an AI-generated response
  const generateResponse = async (userMessage: string) => {
    setIsLoading(true);
    setAiError(null);
    
    try {
      // First, check if this is a QUBO computation request we can handle locally
      const quboResponse = processQuboRequests(userMessage);
      
      if (quboResponse) {
        // If we generated a QUBO response, use it directly
        const newMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: quboResponse
        };
        
        setMessages(prev => [...prev, newMessage]);
        return;
      }
      
      console.log("Calling market-analysis function with message:", userMessage);
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('market-analysis', {
        body: { 
          message: userMessage,
          marketData: marketData,
          includeQuantumApproach: true
        }
      });
      
      if (error) {
        console.error('Error calling market-analysis function:', error);
        throw new Error(error.message || "Failed to connect to AI service");
      }
      
      if (!data || !data.response) {
        console.error('Invalid response from market-analysis function:', data);
        throw new Error("Received invalid response from AI service");
      }
      
      console.log('Received AI response:', data.response.substring(0, 100) + '...');
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response
      };
      
      setMessages(prev => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiError('Failed to generate market analysis. Please try again later.');
      toast({
        title: "AI Analysis Error",
        description: error instanceof Error ? error.message : "Could not generate market analysis response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent
    };
    
    setMessages(prev => [...prev, userMessage]);
    await generateResponse(messageContent);
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data using both traditional and quantum-inspired methods. I can explain optimization concepts, prepare QUBO formulations, and provide insights on up to 16 assets. Ask me about trends, quantum portfolio optimization, or trading strategies. Remember, I only provide analysis - all final decisions are yours.'
    }]);
    toast({
      title: "Chat Reset",
      description: "The market analysis chat has been reset",
    });
  };

  return {
    messages,
    isLoading,
    aiError,
    handleSendMessage,
    resetChat
  };
}
