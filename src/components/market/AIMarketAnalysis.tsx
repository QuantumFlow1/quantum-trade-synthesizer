
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, LineChart, BrainCircuit, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { MarketData } from "./types";

interface AIMarketAnalysisProps {
  marketData?: MarketData;
  className?: string;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function AIMarketAnalysis({ marketData, className }: AIMarketAnalysisProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data. Ask me about trends, price movements, or trading strategies.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate a response based on the user's message and current market data
  const generateResponse = async (userMessage: string) => {
    setIsLoading(true);
    setAiError(null);
    
    try {
      // Create a prompt that includes market context
      const marketContext = marketData 
        ? `Current market: ${marketData.market}, Symbol: ${marketData.symbol}, Price: $${marketData.price}, 24h Change: ${marketData.change24h}%`
        : 'No specific market data available';
      
      // In a real implementation, this would call the Groq API or another AI service
      // For this proof of concept, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate market analysis response based on user message
      let aiResponse = '';
      if (userMessage.toLowerCase().includes('trend')) {
        aiResponse = marketData?.change24h && marketData.change24h > 0
          ? `The market for ${marketData?.symbol} is trending upward with a ${marketData?.change24h}% increase in the last 24 hours. This suggests positive momentum.`
          : `The market for ${marketData?.symbol} is trending downward with a ${marketData?.change24h}% decrease in the last 24 hours. This suggests negative momentum.`;
      } else if (userMessage.toLowerCase().includes('volume')) {
        aiResponse = `The trading volume for ${marketData?.symbol} is ${marketData?.volume?.toLocaleString()} which is ${marketData?.volume && marketData.volume > 1000000 ? 'relatively high' : 'moderate to low'}.`;
      } else if (userMessage.toLowerCase().includes('predict') || userMessage.toLowerCase().includes('forecast')) {
        aiResponse = `While I can't predict the future with certainty, the current market indicators for ${marketData?.symbol} suggest ${marketData?.change24h && marketData.change24h > 0 ? 'continued positive momentum if market conditions remain stable' : 'potential volatility ahead'}.`;
      } else {
        aiResponse = `Based on the current data for ${marketData?.symbol}, we're seeing a ${marketData?.change24h && marketData.change24h > 0 ? 'positive' : 'negative'} trend with a price of $${marketData?.price}. The 24-hour high was $${marketData?.high24h} and the low was $${marketData?.low24h}.`;
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiError('Failed to generate market analysis. Please try again later.');
      toast({
        title: "AI Analysis Error",
        description: "Could not generate market analysis response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    await generateResponse(userMessage.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data. Ask me about trends, price movements, or trading strategies.'
    }]);
    toast({
      title: "Chat Reset",
      description: "The market analysis chat has been reset",
    });
  };

  return (
    <Card className={`h-full bg-secondary/10 backdrop-blur-xl border border-white/10 shadow-lg ${className}`}>
      <CardHeader className="p-4">
        <CardTitle className="flex items-center text-lg font-medium">
          <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
          Market Analysis AI
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col h-[calc(100%-68px)]">
        {marketData ? (
          <div className="bg-secondary/20 p-2 rounded-md mb-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{marketData.symbol}</span>
              <span className={marketData.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                ${marketData.price.toFixed(2)} ({marketData.change24h}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-secondary/20 p-2 rounded-md mb-3 text-xs">
            <span className="text-muted-foreground">No specific market selected</span>
          </div>
        )}

        {aiError && (
          <Alert variant="destructive" className="mb-3">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{aiError}</AlertDescription>
          </Alert>
        )}

        <div className="flex-grow overflow-y-auto mb-3 space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                <Skeleton className="h-4 w-[200px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 mt-auto">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetChat}
            className="flex-shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Ask about market trends, analysis, or trading insights..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            className="flex-shrink-0"
          >
            <SendIcon className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
