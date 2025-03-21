
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RefreshCw, Brain, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface APIProviderListProps {
  providers: Record<string, boolean>;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function APIProviderList({ providers, onRefresh, isRefreshing }: APIProviderListProps) {
  // Define provider details
  const providerDetails = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT models including GPT-4o and GPT-3.5 Turbo",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
      icon: "🔄"
    },
    {
      id: "groq",
      name: "Groq",
      description: "Ultra-fast inference with Llama and Mixtral models",
      models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768", "gemma-7b-it"],
      icon: "⚡"
    },
    {
      id: "anthropic",
      name: "Claude",
      description: "Anthropic's Claude models",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      icon: "🧠"
    },
    {
      id: "gemini",
      name: "Google AI",
      description: "Google's Gemini models",
      models: ["gemini-pro", "gemini-flash"],
      icon: "🌐"
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      description: "DeepSeek's specialized code & chat models",
      models: ["deepseek-chat", "deepseek-coder"],
      icon: "💻"
    },
    {
      id: "ollama",
      name: "Ollama",
      description: "Local open-source models",
      models: ["llama3", "mistral", "codellama", "phi"],
      icon: "🏠"
    }
  ];
  
  const handleConfigureClick = (providerId: string) => {
    // Navigate to the API keys tab
    const apiKeysTab = document.querySelector('[value="keys"]') as HTMLElement;
    if (apiKeysTab) {
      apiKeysTab.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Available LLM Providers</h2>
        <Button size="sm" variant="outline" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providerDetails.map((provider) => (
          <Card key={provider.id} className={providers[provider.id] ? "border-primary/20" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-lg">{provider.icon}</span>
                  {provider.name}
                  {providers[provider.id] && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Connected
                    </Badge>
                  )}
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-center w-5 h-5">
                        {providers[provider.id] ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{providers[provider.id] ? "API Key Configured" : "API Key Not Configured"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-xs">{provider.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-xs space-y-1">
                <div className="font-medium">Available Models:</div>
                <ul className="pl-4 list-disc">
                  {provider.models.map(model => (
                    <li key={model}>{model}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                size="sm" 
                variant={providers[provider.id] ? "outline" : "default"} 
                className="w-full" 
                onClick={() => handleConfigureClick(provider.id)}
              >
                <Settings className="h-3.5 w-3.5 mr-2" />
                {providers[provider.id] ? "Reconfigure API Key" : "Configure API Key"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
