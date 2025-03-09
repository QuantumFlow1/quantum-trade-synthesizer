
import { useState, useEffect, useRef } from "react";
import { Bot, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const StockbotChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for Groq API key on mount
  useEffect(() => {
    const groqApiKey = localStorage.getItem('groqApiKey');
    setHasApiKey(!!groqApiKey);
    
    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem('stockbotChatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error parsing saved Stockbot messages:', error);
      }
    } else {
      // Add welcome message if no saved messages
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I am Stockbot, your AI-powered trading assistant. How can I help you with your trading strategy today?',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('stockbotChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const groqApiKey = localStorage.getItem('groqApiKey');
      
      if (!groqApiKey && !isSimulationMode) {
        throw new Error("Groq API key is missing. Please set it in the settings.");
      }

      // Format message history for API
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add user message to history
      messageHistory.push({
        role: 'user',
        content: inputMessage
      });

      if (isSimulationMode) {
        // Simulate response in demo mode
        await simulateResponse(inputMessage);
      } else {
        // Call the edge function to get a response from Groq
        const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
          body: { 
            message: inputMessage,
            previousMessages: messageHistory,
            userLevel: 'intermediate'
          },
          headers: {
            'x-groq-api-key': groqApiKey || ''
          }
        });
        
        if (error) {
          console.error('Error from edge function:', error);
          throw new Error(error.message || 'Failed to get response from Stockbot');
        }
        
        if (!data || !data.response) {
          throw new Error('Received invalid response from Stockbot');
        }
        
        const assistantMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from Stockbot'}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to get response from Stockbot',
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a response (for demo/testing)
  const simulateResponse = async (userMessage: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simple response based on user input
    let response = '';
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('buy') || lowercaseMessage.includes('long')) {
      response = "Based on my analysis of current market conditions, I'd recommend caution with new long positions. The market is showing high volatility with bearish technical indicators. If you're considering buying, start with a small position size and set a tight stop loss at 2% below entry.";
    } else if (lowercaseMessage.includes('sell') || lowercaseMessage.includes('short')) {
      response = "The current market does show some bearish indicators that might support a short position. However, be aware that the RSI is approaching oversold territory. If you decide to short, consider a small position with a clear exit strategy if the market reverses.";
    } else if (lowercaseMessage.includes('bitcoin') || lowercaseMessage.includes('btc')) {
      response = "Bitcoin is currently in a consolidation phase after the recent pullback. Support levels are forming around $61,200, with resistance at $65,800. Volume has been declining, suggesting a potential breakout soon. Watch for increased volume as a signal of direction.";
    } else if (lowercaseMessage.includes('ethereum') || lowercaseMessage.includes('eth')) {
      response = "Ethereum is showing stronger technical signals than Bitcoin at the moment. The ETH/BTC pair is trending upward, suggesting potential outperformance. Key support is at $3,420 with resistance at $3,850. The 50-day moving average is providing good support.";
    } else if (lowercaseMessage.includes('recommend') || lowercaseMessage.includes('suggestion')) {
      response = "Based on current market analysis, I recommend a cautious approach. Market sentiment indicators are mixed, with technical indicators slightly bearish. Consider maintaining 60% cash position, with selective entries on quality assets that pull back to major support levels. Altcoins show higher risk currently.";
    } else {
      response = "I've analyzed the current market conditions and noticed some interesting patterns. Overall market sentiment is neutral with a slight bearish bias. Technical indicators show potential resistance levels approaching. Would you like specific analysis on a particular asset or trading strategy?";
    }
    
    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am Stockbot, your AI-powered trading assistant. How can I help you with your trading strategy today?',
      timestamp: new Date()
    }]);
    
    toast({
      title: "Chat Cleared",
      description: "All previous messages have been removed.",
      duration: 3000
    });
  };

  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden">
      <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bot className="w-5 h-5 mr-2 text-blue-500" />
          Stockbot Trading Assistant
        </CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSimulationMode(!isSimulationMode)}
            className={isSimulationMode ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""}
          >
            {isSimulationMode ? "Demo Mode" : "Live Mode"}
          </Button>
          <Button variant="ghost" size="icon" onClick={clearChat}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!hasApiKey && !isSimulationMode && (
        <Alert variant="warning" className="m-3">
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            Please set your Groq API key in the settings to enable full Stockbot functionality.
          </AlertDescription>
        </Alert>
      )}

      {isSimulationMode && (
        <Alert variant="warning" className="m-3">
          <AlertTitle>Simulation Mode Active</AlertTitle>
          <AlertDescription>
            Stockbot is using simulated responses instead of real AI analysis.
          </AlertDescription>
        </Alert>
      )}

      <CardContent className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white border border-gray-200 shadow-sm rounded-lg rounded-tl-none px-4 py-2">
              <div className="flex space-x-2 items-center">
                <Skeleton className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
                <Skeleton className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
                <Skeleton className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-3 border-t bg-white">
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Stockbot about trading strategies..."
            className="flex-1 resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading} 
            className="h-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
