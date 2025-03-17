
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/components/admin/types/chat-types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { hasApiKey } from "@/utils/apiKeyManager";
import { AGENTS } from "../constants/agents";

export const useAgentChat = () => {
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
    
    // Initial check
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

  return {
    selectedAgent,
    selectedModel,
    inputMessage,
    chatHistory,
    isLoading,
    apiAvailable,
    inputRef,
    messagesEndRef,
    setInputMessage,
    handleAgentChange,
    handleModelChange,
    handleSendMessage,
    handleKeyDown,
    clearChat,
    getCurrentAgentName: () => AGENTS.find(a => a.id === selectedAgent)?.name || 'AI'
  };
};
