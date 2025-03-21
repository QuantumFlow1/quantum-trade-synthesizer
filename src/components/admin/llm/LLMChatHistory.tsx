
import React from "react";
import { LLMChatMessage, LLMProviderType } from "./types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface LLMChatHistoryProps {
  messages: LLMChatMessage[];
}

export function LLMChatHistory({ messages }: LLMChatHistoryProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`
            flex gap-3 max-w-[80%] 
            ${message.role === "user" ? "flex-row-reverse" : "flex-row"}
          `}>
            <MessageAvatar role={message.role} provider={message.provider} />
            
            <div className={`
              py-2 px-3 rounded-lg
              ${message.role === "user" 
                ? "bg-primary text-primary-foreground" 
                : message.role === "system"
                  ? "bg-muted text-muted-foreground"
                  : "bg-gray-100 text-gray-900"
              }
              ${message.isError ? "border border-red-500" : ""}
            `}>
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
                {message.isStreaming && (
                  <span className="inline-block ml-1 animate-pulse">▌</span>
                )}
              </div>
              
              {(message.isStreaming) && (
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  {message.isStreaming && (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      <span>Generating...</span>
                    </>
                  )}
                </div>
              )}
              
              <div className="text-xs mt-1 opacity-70">
                {getProviderDisplayName(message.provider)} - {message.model}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Get provider display name
function getProviderDisplayName(provider: LLMProviderType): string {
  const names: Record<LLMProviderType, string> = {
    openai: 'OpenAI',
    groq: 'Groq',
    anthropic: 'Claude',
    ollama: 'Ollama',
    deepseek: 'DeepSeek'
  };
  
  return names[provider] || provider;
}

// Message avatar component
function MessageAvatar({ role, provider }: { role: string; provider: LLMProviderType }) {
  const getAvatarInfo = () => {
    if (role === "user") {
      return { 
        src: null, 
        fallback: "U", 
        bgColor: "bg-primary text-primary-foreground" 
      };
    }
    
    if (role === "system") {
      return { 
        src: null, 
        fallback: "S", 
        bgColor: "bg-muted text-muted-foreground" 
      };
    }
    
    // Assistant avatars based on provider
    const providerInfo: Record<LLMProviderType, { fallback: string; bgColor: string }> = {
      openai: { fallback: "AI", bgColor: "bg-green-500 text-white" },
      groq: { fallback: "G", bgColor: "bg-purple-500 text-white" },
      anthropic: { fallback: "C", bgColor: "bg-yellow-500 text-black" },
      ollama: { fallback: "O", bgColor: "bg-blue-500 text-white" },
      deepseek: { fallback: "D", bgColor: "bg-indigo-500 text-white" }
    };
    
    return { 
      src: null, 
      fallback: providerInfo[provider]?.fallback || "AI", 
      bgColor: providerInfo[provider]?.bgColor || "bg-gray-500 text-white" 
    };
  };
  
  const { src, fallback, bgColor } = getAvatarInfo();
  
  return (
    <Avatar className={`h-8 w-8 ${bgColor}`}>
      {src && <AvatarImage src={src} alt={role} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
