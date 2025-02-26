
import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, SendIcon, Loader2, User, Settings, Trash2, Zap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function GrokChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  // Send message to Grok API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

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
      // Add assistant response indicating functionality is coming soon
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "Grok integration is coming soon! This is a placeholder response. The actual API integration is under development.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);

    } catch (error) {
      console.error('Grok chat error:', error);
      
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
          <Zap className="h-5 w-5 mr-2 text-purple-500" />
          Grok Chat
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
            <h3 className="text-sm font-medium mb-2">Grok API Settings</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Grok API integration is coming soon. Check back later for updates.
              </p>
              <Button 
                onClick={() => setShowSettings(false)} 
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <Zap className="w-16 h-16 mb-6 opacity-20" />
            <p className="text-lg">Chat with Grok</p>
            <p className="text-sm mt-2">Coming soon - Integration with Grok AI</p>
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
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <div className={`mr-2 mt-1 ${message.role === 'user' ? 'text-white' : 'text-purple-600'}`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
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
            className="h-full bg-purple-600 hover:bg-purple-700"
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
