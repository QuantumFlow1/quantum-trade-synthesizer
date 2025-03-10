
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, ArrowDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getApiKey } from '@/utils/apiKeyManager';
import { Agent } from '@/types/agent';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentId?: string;
  timestamp: Date;
}

interface AgentChatInterfaceProps {
  agent: Agent;
  onClose: () => void;
}

export function AgentChatInterface({ agent, onClose }: AgentChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: `You are now connected with ${agent.name}, a ${agent.type} trading agent.`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Check for API key
      const groqKey = getApiKey('groq') || getApiKey('openai');
      if (!groqKey) {
        throw new Error('Groq or OpenAI API key is required for agent communication');
      }
      
      // Create a system message that describes the agent's role and personality
      const systemMessage = {
        role: 'system',
        content: `You are ${agent.name}, a ${agent.type} trading agent. 
        ${agent.description}
        ${agent.tradingStyle ? `Your trading style is ${agent.tradingStyle}.` : ''}
        ${agent.performance ? `Your success rate is ${agent.performance.successRate}%.` : ''}
        
        When responding to the user:
        1. Stay in character as a trading agent
        2. Provide specific trading insights based on your type (${agent.type})
        3. If asked about market conditions, stocks, or trading strategies, provide detailed responses
        4. Include specific numbers and percentages when discussing performance or market analysis
        
        The current date is ${new Date().toLocaleDateString()}.`
      };
      
      // Prepare conversation history for the API
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'agent' ? 'assistant' : 'user',
          content: msg.content
        }));
      
      // Add the latest user message
      conversationHistory.push({
        role: 'user',
        content: userMessage.content
      });
      
      // Call the Groq edge function
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: {
          messages: [systemMessage, ...conversationHistory],
          model: "llama-3.3-70b-versatile",
          temperature: 0.8,
          max_tokens: 750
        },
        headers: groqKey ? { 'x-groq-api-key': groqKey } : undefined
      });
      
      if (error) {
        console.error('Error calling groq-chat function:', error);
        throw new Error(error.message || 'Failed to get agent response');
      }
      
      if (!data || data.status === 'error' || !data.response) {
        throw new Error(data?.error || 'Invalid response from agent');
      }
      
      // Create agent response
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: data.response,
        agentId: agent.id,
        timestamp: new Date()
      };
      
      // Add agent response to messages
      setMessages(prev => [...prev, agentResponse]);
      
    } catch (error) {
      console.error('Error in agent communication:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to communicate with agent'}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Communication Error",
        description: "Failed to connect with the trading agent. Please check your API keys.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-slate-50">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-indigo-600" />
          <h3 className="font-medium">{agent.name}</h3>
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
            {agent.status}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : message.role === 'system'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-slate-100 border border-slate-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Scroll indicator if needed */}
        {messagesEndRef.current && messagesEndRef.current.scrollHeight > messagesEndRef.current.clientHeight && (
          <Button 
            size="sm" 
            variant="outline" 
            className="absolute bottom-20 right-4 rounded-full p-2"
            onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ${agent.name} about trading strategies...`}
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
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
