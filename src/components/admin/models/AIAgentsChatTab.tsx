
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatMessage } from "@/components/admin/types/chat-types";
import { Send, Bot, User, Trash2, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { hasApiKey } from "@/utils/apiKeyManager";
import { supabase } from "@/lib/supabase";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { UnifiedAISelector } from "@/components/ai/UnifiedAISelector";
import { ScrollArea } from "@/components/ui/scroll-area";

const AGENTS = [
  { id: "advisor", name: "Financial Advisor", description: "Helps with investment advice and financial planning", systemPrompt: "You are a financial advisor specializing in investment advice. Provide detailed, professional financial planning guidance based on user queries. Include specific investment strategies, risk assessments, and portfolio diversification advice when appropriate." },
  { id: "trader", name: "Trader Assistant", description: "Assists with trading strategies and market analysis", systemPrompt: "You are a professional trading assistant with expertise in market analysis. Provide trading strategies, technical analysis insights, and market trend evaluations. Include specific indicators, entry/exit points, and risk management advice when discussing trading opportunities." },
  { id: "analyst", name: "Data Analyst", description: "Provides data-driven insights and trend analysis", systemPrompt: "You are a data analyst specializing in financial markets. Provide data-driven insights, trend analysis, and statistical evaluations of market data. Include specific metrics, comparative analyses, and data visualization suggestions when appropriate." },
  { id: "support", name: "Technical Support", description: "Helps with technical issues and platform questions", systemPrompt: "You are a technical support specialist for a trading platform. Help users resolve technical issues, navigate platform features, and optimize their trading setup. Provide step-by-step troubleshooting guidance and clear explanations of platform functionality." },
  { id: "receptionist", name: "Receptionist", description: "General information and guidance about the platform", systemPrompt: "You are a receptionist for a financial services platform. Provide general information, guide users to appropriate resources, and answer basic questions about services offered. Be welcoming, professional, and helpful in directing users to the right department or feature." }
];

export const AIAgentsChatTab: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState("advisor");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [inputMessage, setInputMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // Focus on input when agent changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedAgent]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);
  
  // Check if we have any API keys available
  useEffect(() => {
    const checkApiAvailability = () => {
      const hasOpenAI = hasApiKey('openai');
      const hasGroq = hasApiKey('groq');
      const hasClaude = hasApiKey('claude');
      
      setApiAvailable(hasOpenAI || hasGroq || hasClaude);
    };
    
    checkApiAvailability();
    
    // Listen for API key changes
    window.addEventListener('apikey-updated', checkApiAvailability);
    window.addEventListener('storage', checkApiAvailability);
    
    return () => {
      window.removeEventListener('apikey-updated', checkApiAvailability);
      window.removeEventListener('storage', checkApiAvailability);
    };
  }, []);
  
  // Load initial message from selected agent
  useEffect(() => {
    // Skip if we already have messages
    if (chatHistory.length > 0) return;
    
    const currentAgent = AGENTS.find(agent => agent.id === selectedAgent);
    if (currentAgent) {
      setChatHistory([{
        id: uuidv4(),
        role: 'assistant',
        content: `Hello, I'm your ${currentAgent.name}. ${currentAgent.description}. How can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [selectedAgent, chatHistory.length]);
  
  const handleAgentChange = (value: string) => {
    setSelectedAgent(value);
    // Clear chat when changing agents
    setChatHistory([]);
  };
  
  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    toast({
      title: "Model Changed", 
      description: `Now using ${modelId} model for agent chat`,
      duration: 3000
    });
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!apiAvailable) {
      toast({
        title: "API Key Required",
        description: "Please add an API key in the API Keys tab to use AI agents",
        variant: "destructive"
      });
      return;
    }
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const currentAgent = AGENTS.find(agent => agent.id === selectedAgent);
      
      if (!currentAgent) {
        throw new Error("Agent not found");
      }
      
      // Create messages array for API call
      const messages = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add user message
      messages.push({
        role: 'user',
        content: inputMessage
      });
      
      // Determine which API to use based on the selected model
      let responseData;
      
      if (selectedModel.startsWith('gpt')) {
        // Use OpenAI
        const { data, error } = await supabase.functions.invoke('openai-response', {
          body: {
            messages,
            systemPrompt: currentAgent.systemPrompt,
            model: selectedModel
          }
        });
        
        if (error) throw new Error(error.message);
        responseData = data;
      } 
      else if (selectedModel.startsWith('llama')) {
        // Use Groq
        const { data, error } = await supabase.functions.invoke('groq-chat', {
          body: {
            messages,
            systemPrompt: currentAgent.systemPrompt,
            model: selectedModel
          }
        });
        
        if (error) throw new Error(error.message);
        responseData = data;
      }
      else if (selectedModel.startsWith('claude')) {
        // Use Claude
        const { data, error } = await supabase.functions.invoke('claude-ping', {
          body: {
            messages,
            systemPrompt: currentAgent.systemPrompt,
            model: selectedModel
          }
        });
        
        if (error) throw new Error(error.message);
        responseData = data;
      }
      else {
        // Default fallback to our generic agent-communication function
        const { data, error } = await supabase.functions.invoke('agent-communication', {
          body: {
            agentId: currentAgent.id,
            agentType: currentAgent.id,
            message: inputMessage,
            systemPrompt: currentAgent.systemPrompt,
            history: messages.slice(0, -1), // Don't include the last message
            model: selectedModel
          }
        });
        
        if (error) throw new Error(error.message);
        responseData = data;
      }
      
      let responseContent = "I'll help you with that.";
      
      if (responseData && (responseData.response || responseData.content || responseData.message)) {
        responseContent = responseData.response || responseData.content || responseData.message;
      }
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in AI agent chat:", error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or check your API key settings.`,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Chat with AI Agents</h3>
        <div className="flex items-center space-x-2">
          <Select value={selectedAgent} onValueChange={handleAgentChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              {AGENTS.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    <span>{agent.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearChat}
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!apiAvailable && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            No API keys found. Please add your API key in the API Keys tab to use AI agents.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm">AI Model:</span>
        <UnifiedAISelector 
          selectedModelId={selectedModel}
          onModelChange={handleModelChange}
          showSettings={false}
        />
      </div>

      <Card className="border rounded-lg">
        <CardContent className="p-4 space-y-4">
          {/* Chat history section - Now using ScrollArea for better scrolling */}
          <ScrollArea className="h-[350px] border rounded-md bg-background p-4">
            {chatHistory.map((message) => (
              <div 
                key={message.id} 
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {message.role === 'user' ? 'You' : `${AGENTS.find(a => a.id === selectedAgent)?.name || 'AI'}`}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="h-2 w-12 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {/* Input section */}
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask your ${AGENTS.find(a => a.id === selectedAgent)?.name || 'AI assistant'}...`}
              className="flex-1"
              disabled={isLoading || !apiAvailable}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isLoading || !apiAvailable}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
