
import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, SendIcon, Loader2, User, Settings, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function DeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save API key when it changes
  const saveApiKey = () => {
    localStorage.setItem('deepseekApiKey', apiKey);
    setShowSettings(false);
    toast({
      title: "API key saved",
      description: "Your DeepSeek API key has been saved.",
      duration: 3000,
    });
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000,
    });
  };

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Send message to DeepSeek API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!apiKey) {
      toast({
        title: "API key required",
        description: "Please set your DeepSeek API key in settings.",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
    }

    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Make request to DeepSeek API via Edge Function
      const response = await supabase.functions.invoke('deepseek-response', {
        body: {
          message: inputMessage,
          context: conversationHistory,
          model: 'deepseek-coder',
          maxTokens: 1000,
          temperature: 0.7,
          apiKey: apiKey
        }
      });

      // Handle errors
      if (response.error) {
        throw new Error(`DeepSeek API Error: ${response.error.message || 'Unknown error'}`);
      }

      if (!response.data?.response) {
        throw new Error('Invalid response from DeepSeek API. Please try again.');
      }

      // Add assistant response to chat
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);

    } catch (error) {
      console.error('DeepSeek chat error:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unknown error occurred. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages([...newMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center">
          <Bot className="h-5 w-5 mr-2 text-blue-500" />
          DeepSeek Chat
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearChat}
            title="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
        {showSettings ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">DeepSeek API Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 block mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter your DeepSeek API key"
                />
              </div>
              <Button onClick={saveApiKey} size="sm">Save Settings</Button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <Bot className="w-16 h-16 mb-6 opacity-20" />
            <p className="text-lg">Ask DeepSeek something</p>
            <p className="text-sm mt-2">Specialized in code and technical questions</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 max-w-[85%] flex ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <div className={`mr-2 mt-1 ${message.role === 'user' ? 'text-white' : 'text-blue-600'}`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isLoading} 
            className="h-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
