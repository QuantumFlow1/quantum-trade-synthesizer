
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, Send, Loader2, Zap } from "lucide-react";
import { LLMProvider, LLMProviderType, LLMChatMessage } from "./types";
import { useLLMModels } from "./hooks/useLLMModels";
import { LLMModelSelector } from "./LLMModelSelector";
import { LLMChatHistory } from "./LLMChatHistory";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LLMSettingsDialog } from "./LLMSettingsDialog";

export function LLMUnifiedChat() {
  const [selectedProvider, setSelectedProvider] = useState<LLMProviderType>("groq");
  const [messages, setMessages] = useState<LLMChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showStreamingResponse, setShowStreamingResponse] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
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
    if (!inputMessage.trim() || isGenerating || !isConnected) return;
    
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
      // Simulate API call to the selected provider
      // In a real implementation, this would call the appropriate LLM API
      const response = await simulateLLMResponse(
        userMessage.content, 
        selectedProvider, 
        selectedModel || "default",
        showStreamingResponse ? 
          (token) => updateStreamingMessage(thinkingId, token) : 
          undefined
      );
      
      if (showStreamingResponse) {
        // Update the streaming message with isStreaming set to false
        setMessages(prev => 
          prev.map(msg => 
            msg.id === thinkingId ? 
              {...msg, isStreaming: false} : 
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
          content: `An error occurred while generating a response. Please try again later.`,
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
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Unified LLM Chat
        </CardTitle>
        <div className="flex items-center space-x-2">
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
              placeholder="Type a message..."
              className="resize-none"
              disabled={isGenerating || !isConnected}
              ref={textareaRef}
              rows={2}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isGenerating || !isConnected}
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

// Simulate LLM response (in a real app, this would call the API)
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
