
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, ArrowDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getApiKey } from '@/utils/apiKeyManager';
import { Agent } from '@/types/agent';

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
      const openaiKey = getApiKey('openai');
      if (!openaiKey) {
        throw new Error('OpenAI API key is required for agent communication');
      }
      
      // Simulate agent response (in a real app, you'd call your AI API here)
      setTimeout(() => {
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: generateAgentResponse(agent, inputMessage),
          agentId: agent.id,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, agentResponse]);
        setIsLoading(false);
      }, 1500);
      
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
      setIsLoading(false);
      
      toast({
        title: "Communication Error",
        description: "Failed to connect with the trading agent. Please check your API keys.",
        variant: "destructive"
      });
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

// Helper function to generate simulated agent responses based on agent type
function generateAgentResponse(agent: Agent, userMessage: string): string {
  const lowercaseMessage = userMessage.toLowerCase();
  
  // Common response patterns based on agent type
  switch (agent.type) {
    case 'trader':
      if (lowercaseMessage.includes('market')) {
        return `Based on my analysis, the current market conditions are showing ${Math.random() > 0.5 ? 'bullish' : 'bearish'} patterns. Volume is ${Math.random() > 0.5 ? 'increasing' : 'decreasing'} and volatility is ${Math.random() > 0.5 ? 'high' : 'moderate'}.`;
      } else if (lowercaseMessage.includes('buy') || lowercaseMessage.includes('sell')) {
        return `I've analyzed recent price action and indicators. My recommendation would be to ${Math.random() > 0.6 ? 'accumulate on dips' : 'take partial profits'} with a stop loss at key support levels.`;
      }
      break;
      
    case 'analyst':
      if (lowercaseMessage.includes('analysis')) {
        return `My technical analysis shows a ${Math.random() > 0.5 ? 'potential breakout forming' : 'consolidation pattern'} on the daily chart. Key indicators like RSI and MACD are ${Math.random() > 0.5 ? 'bullish' : 'showing mixed signals'}.`;
      } else if (lowercaseMessage.includes('news')) {
        return `Recent market news includes ${Math.random() > 0.5 ? 'positive regulatory developments' : 'concerns about macroeconomic factors'}. This could impact market sentiment in the short term.`;
      }
      break;
      
    case 'portfolio_manager':
      if (lowercaseMessage.includes('portfolio') || lowercaseMessage.includes('allocation')) {
        return `For optimal portfolio management, I recommend a ${Math.random() > 0.5 ? '60/40' : '70/30'} split between high and medium risk assets. Current market conditions suggest ${Math.random() > 0.5 ? 'increasing exposure to blue-chip assets' : 'taking a more defensive position'}.`;
      } else if (lowercaseMessage.includes('risk')) {
        return `Your current portfolio risk assessment shows a ${Math.random() > 0.5 ? 'moderate' : 'slightly elevated'} risk profile. I recommend ${Math.random() > 0.5 ? 'implementing tighter stop-losses' : 'diversifying across more asset classes'} to better manage downside protection.`;
      }
      break;

    default:
      // Fallback responses for any agent type
      if (lowercaseMessage.includes('strategy')) {
        return `My recommended strategy for current market conditions would be to ${Math.random() > 0.5 ? 'focus on quality assets with strong fundamentals' : 'look for value opportunities in oversold markets'}. Always maintain proper position sizing and risk management.`;
      }
  }
  
  // Generic fallback response
  return `Thanks for your question about "${userMessage.substring(0, 30)}...". As a ${agent.type} agent, I can tell you that ${agent.description}. What specific trading information would you like to know?`;
}
