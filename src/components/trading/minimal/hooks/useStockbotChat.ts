
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useStockbotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const apiCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for Groq API key on mount and when localStorage changes
  const checkApiKey = useCallback(async () => {
    const groqApiKey = localStorage.getItem('groqApiKey');
    const keyExists = !!groqApiKey;
    
    if (keyExists) {
      try {
        // Also check if the key is valid by calling the ping function
        const { data, error } = await supabase.functions.invoke('grok3-ping', {
          headers: {
            'x-groq-api-key': groqApiKey
          }
        });
        
        if (error) {
          console.error('Error checking API availability:', error);
          setHasApiKey(false);
          setIsSimulationMode(true);
          return;
        }
        
        const isAvailable = data?.groqAvailable === true;
        console.log('API key check result:', isAvailable ? 'valid' : 'invalid');
        
        setHasApiKey(isAvailable);
        if (isAvailable) {
          setIsSimulationMode(false);
        }
      } catch (err) {
        console.error('Exception checking API key:', err);
        setHasApiKey(false);
        setIsSimulationMode(true);
      }
    } else {
      setHasApiKey(false);
      setIsSimulationMode(true);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
    
    // Listen for API key updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'groqApiKey') {
        checkApiKey();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Create custom event listener for when API key is updated within the app
    const handleApiKeyUpdate = () => {
      checkApiKey();
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    
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
    
    // Set up periodic API key checks
    apiCheckTimeoutRef.current = setInterval(() => {
      checkApiKey();
    }, 60000); // Check every minute
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      if (apiCheckTimeoutRef.current) {
        clearInterval(apiCheckTimeoutRef.current);
      }
    };
  }, [checkApiKey]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('stockbotChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const showApiKeyDialog = () => {
    setIsKeyDialogOpen(true);
  };

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
        // Switch to simulation mode if no API key and we're trying to use live mode
        setIsSimulationMode(true);
        throw new Error("Groq API key is missing. Please set it in the settings. Using simulation mode for now.");
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

      console.log("Processing message in", isSimulationMode ? "simulation" : "live", "mode");

      if (isSimulationMode) {
        // Simulate response in demo mode
        await simulateResponse(inputMessage);
      } else {
        // First try the direct edge function for trading advice
        try {
          console.log("Sending to generate-trading-advice with Groq key:", groqApiKey ? "present" : "missing");
          
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
            console.error('Error from trading advice edge function:', error);
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
        } catch (tradingApiError) {
          console.error('Trading API error, falling back to grok3-response:', tradingApiError);
          
          // Fall back to the general grok3-response function if trading-specific fails
          const { data, error } = await supabase.functions.invoke('grok3-response', {
            body: { 
              message: inputMessage,
              context: messageHistory
            },
            headers: {
              'x-groq-api-key': groqApiKey || ''
            }
          });
          
          if (error) {
            console.error('Error from grok3-response fallback:', error);
            throw new Error(error.message || 'Failed to get response');
          }
          
          if (!data || !data.response) {
            throw new Error('Received invalid response from fallback API');
          }
          
          const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.response,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        }
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response from Stockbot"}. ${!hasApiKey ? "Please set your Groq API key to enable full functionality." : ""}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to get response from Stockbot',
        variant: "destructive",
        duration: 5000
      });
      
      // If the error was due to missing API key, show the dialog
      if (!hasApiKey && !isSimulationMode) {
        showApiKeyDialog();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate a response (for demo/testing)
  const simulateResponse = async (userMessage: string) => {
    console.log("Simulating response for:", userMessage);
    
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
    
    console.log("Generated simulated response:", response.substring(0, 50) + "...");
    
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

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey,
    isSimulationMode,
    setIsSimulationMode,
    handleSendMessage,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    clearChat
  };
}
