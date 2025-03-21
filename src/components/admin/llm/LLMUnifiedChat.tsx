
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, Send, Loader2, Zap, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { LLMProvider, LLMProviderType, LLMChatMessage } from "./types";
import { useLLMModels } from "./hooks/useLLMModels";
import { LLMModelSelector } from "./LLMModelSelector";
import { LLMChatHistory } from "./LLMChatHistory";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LLMSettingsDialog } from "./LLMSettingsDialog";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { hasApiKey } from "@/utils/apiKeyManager";

export function LLMUnifiedChat() {
  const [selectedProvider, setSelectedProvider] = useState<LLMProviderType>("deepseek");
  const [messages, setMessages] = useState<LLMChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showStreamingResponse, setShowStreamingResponse] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [agentActive, setAgentActive] = useState(true);
  
  const { 
    models, 
    selectedModel, 
    setSelectedModel, 
    isLoading, 
    error, 
    isConnected 
  } = useLLMModels(selectedProvider);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Add welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Welcome to the Unified LLM Interface. You can chat with different AI models by selecting a provider and model. How can I help you today?`,
          provider: selectedProvider,
          model: selectedModel || "default"
        }
      ]);
    }
  }, []);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating || !isConnected || !agentActive) return;
    
    // Add user message
    const userMessage: LLMChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      provider: selectedProvider,
      model: selectedModel || "unknown"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsGenerating(true);
    
    // Add thinking message
    const thinkingId = `assistant-${Date.now()}`;
    if (showStreamingResponse) {
      setMessages(prev => [
        ...prev,
        {
          id: thinkingId,
          role: "assistant",
          content: "",
          provider: selectedProvider,
          model: selectedModel || "unknown",
          isStreaming: true
        }
      ]);
    }
    
    try {
      let response = "";
      
      // Call the appropriate API based on the selected provider
      if (selectedProvider === "deepseek") {
        response = await callDeepSeekAPI(userMessage.content, messages);
      } else {
        // Call other provider APIs or use simulation for testing
        response = await simulateLLMResponse(
          userMessage.content, 
          selectedProvider, 
          selectedModel || "default",
          showStreamingResponse ? 
            (token) => updateStreamingMessage(thinkingId, token) : 
            undefined
        );
      }
      
      if (showStreamingResponse) {
        // Update the streaming message with isStreaming set to false
        setMessages(prev => 
          prev.map(msg => 
            msg.id === thinkingId ? 
              {...msg, content: response, isStreaming: false} : 
              msg
          )
        );
      } else {
        // Add the complete response
        setMessages(prev => [
          ...prev,
          {
            id: thinkingId,
            role: "assistant",
            content: response,
            provider: selectedProvider,
            model: selectedModel || "unknown"
          }
        ]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "system",
          content: `An error occurred while generating a response: ${error instanceof Error ? error.message : "Unknown error"}`,
          provider: selectedProvider,
          model: selectedModel || "unknown",
          isError: true
        }
      ]);
    } finally {
      setIsGenerating(false);
      
      // Focus the input field
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };
  
  const callDeepSeekAPI = async (message: string, chatHistory: LLMChatMessage[]) => {
    // Check if DeepSeek API key is configured
    const apiKey = localStorage.getItem('deepseekApiKey');
    if (!apiKey) {
      throw new Error("DeepSeek API key not configured. Please add your API key in settings.");
    }
    
    // First check if API is available
    const { data: pingData, error: pingError } = await supabase.functions.invoke('deepseek-ping', {
      body: { apiKey }
    });
    
    if (pingError || pingData?.status !== 'available') {
      throw new Error(pingData?.message || "DeepSeek API is currently unavailable");
    }
    
    // Format chat history for the API
    const formattedHistory = chatHistory
      .filter(msg => msg.role !== "system" && !msg.isError)
      .slice(0, -1) // Exclude the last message (current user message)
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    
    // Call the DeepSeek API
    const { data, error } = await supabase.functions.invoke('deepseek-response', {
      body: {
        message,
        context: formattedHistory,
        apiKey,
        model: selectedModel || "deepseek-chat"
      }
    });
    
    if (error) {
      console.error("DeepSeek API error:", error);
      throw new Error(`DeepSeek API error: ${error.message}`);
    }
    
    if (!data?.response) {
      throw new Error("Invalid response from DeepSeek API");
    }
    
    return data.response;
  };
  
  const updateStreamingMessage = (id: string, token: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? 
          {...msg, content: msg.content + token} : 
          msg
      )
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setMessages([]);
  };
  
  const toggleAgentActivity = () => {
    setAgentActive(!agentActive);
    
    toast({
      title: agentActive ? "Agent Deactivated" : "Agent Activated",
      description: agentActive ? 
        "The LLM agent has been deactivated. No responses will be generated." : 
        "The LLM agent has been activated. You can now receive responses.",
      variant: agentActive ? "destructive" : "default"
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Unified LLM Chat
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 mr-4">
            <Switch
              id="agent-toggle"
              checked={agentActive}
              onCheckedChange={toggleAgentActivity}
            />
            <Label htmlFor="agent-toggle" className="flex items-center text-sm">
              {agentActive ? 
                <ToggleRight className="h-4 w-4 mr-1 text-green-500" /> : 
                <ToggleLeft className="h-4 w-4 mr-1 text-gray-400" />
              }
              Agent {agentActive ? "Active" : "Inactive"}
            </Label>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSettings(true)}
          >
            Configure
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            disabled={messages.length === 0 || isGenerating}
          >
            Clear
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <LLMModelSelector 
            selectedProvider={selectedProvider}
            onProviderChange={setSelectedProvider}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            models={models}
            isLoading={isLoading}
          />
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="stream-toggle"
                checked={showStreamingResponse}
                onCheckedChange={setShowStreamingResponse}
              />
              <Label htmlFor="stream-toggle">Stream Response</Label>
            </div>
            
            <div className="flex items-center space-x-1 text-xs">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-muted-foreground">
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {!agentActive && (
          <Alert variant="warning" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Agent is currently inactive. Responses will not be generated.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          <LLMChatHistory messages={messages} />
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={agentActive ? "Type a message..." : "Agent is inactive..."}
              className="resize-none"
              disabled={isGenerating || !isConnected || !agentActive}
              ref={textareaRef}
              rows={2}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isGenerating || !isConnected || !agentActive}
              className="shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <LLMSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        provider={selectedProvider}
      />
    </Card>
  );
}

// Simulate LLM response (used as fallback or for testing)
async function simulateLLMResponse(
  message: string, 
  provider: LLMProviderType, 
  model: string,
  onToken?: (token: string) => void
): Promise<string> {
  const responses: Record<LLMProviderType, string> = {
    openai: `As an OpenAI assistant using ${model}, I can help with that. ${message.length > 10 ? "Your question seems interesting!" : "Please provide more details."}`,
    groq: `Groq AI (${model}) response: I've analyzed your query. ${message.includes("?") ? "Here's what I found..." : "Please ask a specific question for better results."}`,
    anthropic: `Claude by Anthropic (${model}) here. I notice you're asking about "${message.substring(0, 20)}...". Let me think about this carefully.`,
    ollama: `Ollama (${model}) response: I'm processing your request locally. ${message.toLowerCase().includes("help") ? "I'll do my best to assist you." : "What specific information are you looking for?"}`,
    deepseek: `DeepSeek (${model}): Thank you for your message. ${message.split(" ").length > 5 ? "I've carefully considered your detailed query." : "Could you elaborate on your request?"}`
  };
  
  const baseResponse = responses[provider] || "I'm processing your request...";
  const fullResponse = `${baseResponse}\n\nYour message was: "${message}"\n\nThis is a simulated response from the ${provider} provider using the ${model} model. In a real implementation, this would call the actual API.`;
  
  if (onToken) {
    // Simulate streaming response
    let streamedSoFar = "";
    const words = fullResponse.split(" ");
    
    for (const word of words) {
      streamedSoFar += word + " ";
      onToken(word + " ");
      // Simulate varying response speeds
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
    }
    
    return fullResponse;
  } else {
    // Simulate a delay for the complete response
    await new Promise(resolve => setTimeout(resolve, 1000));
    return fullResponse;
  }
}
