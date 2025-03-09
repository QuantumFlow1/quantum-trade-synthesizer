
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, LineChart, BrainCircuit, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { MarketData } from "./types";
import { supabase } from "@/lib/supabase";

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

  // Call the Supabase edge function to get an AI-generated response
  const generateResponse = async (userMessage: string) => {
    setIsLoading(true);
    setAiError(null);
    
    try {
      console.log("Calling market-analysis function with message:", userMessage);
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('market-analysis', {
        body: { 
          message: userMessage,
          marketData: marketData 
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
