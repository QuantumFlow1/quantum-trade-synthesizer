
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CoinsIcon, Send, Loader2, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { CryptoMessage } from './types';
import { CryptoAssistantMessages } from './CryptoAssistantMessages';
import { useCryptoAssistant } from './hooks/useCryptoAssistant';

export function CryptoAssistant() {
  const {
    messages,
    isLoading,
    inputMessage,
    setInputMessage,
    sendMessage,
    resetChat,
    currentModel,
    switchModel,
    availableModels
  } = useCryptoAssistant();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-focus the input field when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter without shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-md">
      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <CoinsIcon className="mr-2 h-5 w-5" />
            Crypto Assistant
          </CardTitle>
          <div className="flex gap-2">
            <select
              className="text-xs bg-secondary/50 px-2 py-1 rounded border border-secondary"
              value={currentModel}
              onChange={(e) => switchModel(e.target.value)}
              disabled={isLoading}
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetChat}
              disabled={isLoading || messages.length <= 1}
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto pb-0 px-4">
        <CryptoAssistantMessages messages={messages} />
        <div ref={messagesEndRef} />
      </CardContent>
      
      <div className="p-4 pt-2">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            ref={inputRef}
            placeholder="Ask about cryptocurrencies, market trends, or trading strategies..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[120px]"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}
