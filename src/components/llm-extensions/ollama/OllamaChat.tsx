
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Settings, Send } from 'lucide-react';
import { useOllamaModels } from '@/hooks/useOllamaModels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ollamaApi } from '@/utils/ollamaApiClient';
import { ChatHeader } from '../components/ChatHeader';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
};

export function OllamaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    models, 
    isConnected, 
    connectionError, 
    ollamaHost, 
    updateHost, 
    refreshModels 
  } = useOllamaModels();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set first model when models load
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].name);
    }
  }, [models, selectedModel]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedModel) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Create message history from existing messages
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Add the new user message
      messageHistory.push({
        role: 'user',
        content: input.trim(),
      });
      
      // Call Ollama API
      const response = await ollamaApi.createChatCompletion(
        messageHistory,
        selectedModel
      );
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Ollama:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from Ollama",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Focus input for next message
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        title="Ollama Chat"
        description="Chat with your local Ollama models"
        icon={<MessageCircle className="h-5 w-5" />}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        }
      />
      
      {isSettingsOpen && (
        <div className="p-4 border-b space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Ollama Host</label>
              <Input 
                value={ollamaHost} 
                onChange={(e) => updateHost(e.target.value)}
                placeholder="http://localhost:11434"
              />
            </div>
            <Button onClick={refreshModels} disabled={isLoading}>
              Refresh Models
            </Button>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.length > 0 ? (
                  models.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {connectionError || "No models available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <div>
              <MessageCircle className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <h3 className="text-lg font-medium">Start a conversation with Ollama</h3>
              <p className="text-sm max-w-md mt-2">
                Chat with your locally hosted models using Ollama
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.timestamp && (
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading || !isConnected}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !isConnected || !input.trim()}
          >
            {isLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
