
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Terminal, Settings, Trash2, SendIcon, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ChatHeader } from '../components/ChatHeader';
import { useOllamaModels } from '@/hooks/useOllamaModels';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Define message type
type OllamaMessage = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function OllamaChat() {
  // State
  const [messages, setMessages] = useState<OllamaMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get Ollama models
  const { 
    models, 
    isLoading: isLoadingModels, 
    isConnected, 
    ollamaHost, 
    updateHost, 
    refreshModels 
  } = useOllamaModels();

  // Selected model state
  const [selectedModel, setSelectedModel] = useState('');

  // Load saved messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('ollamaChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('ollamaChatMessages', JSON.stringify(messages));
  }, [messages]);

  // Set default model when models load
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].name);
    }
  }, [models, selectedModel]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Clear chat messages
  const clearChat = () => {
    setMessages([]);
    toast({
      title: 'Chat Cleared',
      description: 'All messages have been removed.',
    });
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Send message to Ollama
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!isConnected) {
      toast({
        title: 'Ollama Not Connected',
        description: 'Please ensure Ollama is running and check your connection settings.',
        variant: 'destructive',
      });
      setShowSettings(true);
      return;
    }

    if (!selectedModel) {
      toast({
        title: 'No Model Selected',
        description: 'Please select an Ollama model first.',
        variant: 'destructive',
      });
      setShowSettings(true);
      return;
    }

    // Create user message
    const userMessage: OllamaMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulated response for now - in a real implementation this would call the Ollama API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: OllamaMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `This is a simulated response from the ${selectedModel} model: I'm an AI assistant running locally through Ollama. In a real implementation, I would process your prompt: "${inputMessage}" and generate a response based on my training.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to Ollama:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from Ollama.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create header actions as React elements
  const headerActions = (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={toggleSettings}
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
    </>
  );

  return (
    <Card className="w-full h-[500px] flex flex-col shadow-lg">
      <CardHeader className="border-b py-3 px-4 flex flex-row items-center justify-between">
        <ChatHeader 
          title="Ollama Chat"
          description="Chat with your local Ollama models"
          icon={<Terminal className="h-5 w-5 mr-2 text-teal-500" />}
          actions={headerActions}
        />
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
        {showSettings ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ollama-host">Ollama Host</Label>
              <div className="flex gap-2">
                <Input 
                  id="ollama-host"
                  value={ollamaHost}
                  onChange={(e) => updateHost(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="flex-grow"
                />
                <Button 
                  onClick={refreshModels}
                  disabled={isLoadingModels}
                >
                  {isLoadingModels ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model-select">Select Model</Label>
              <Select 
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={!isConnected || models.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <p className="text-sm font-medium mb-1">Status:</p>
              <p className="text-sm">
                {isConnected 
                  ? `Connected to Ollama. ${models.length} models available.` 
                  : "Not connected to Ollama. Make sure Ollama is running on your machine."}
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
            <Terminal className="w-16 h-16 mb-6 opacity-20" />
            <p className="text-lg">Local AI with Ollama</p>
            <p className="text-sm mt-2">Chat with AI models running on your machine</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 p-3 rounded-lg ${
                  message.role === 'user' ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/20">
                  {message.role === 'user' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path><path d="M3 7v10a1 1 0 0 0 1 1h9"></path><path d="M18 12h-2.5a1.5 1.5 0 0 0 0 3H18h.5"></path><line x1="9" y1="17" x2="9" y2="6"></line><line x1="12" y1="17" x2="12" y2="11"></line></svg>
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    {message.role === 'user' ? 'You' : selectedModel || 'Assistant'}
                  </p>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-3">
        <div className="flex w-full gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connect to Ollama in settings first"}
            className="flex-1 resize-none min-h-[40px] max-h-[120px]"
            disabled={isLoading || !isConnected || showSettings}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !inputMessage.trim() || !isConnected || showSettings}
            className="h-10 self-end"
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
