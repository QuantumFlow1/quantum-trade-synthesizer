
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelCard } from "./ModelCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Server } from "lucide-react";
import { useOllamaDockerConnect } from "@/hooks/useOllamaDockerConnect";
import { OllamaConnectionStatus } from "./ollama/OllamaConnectionStatus";
import { Skeleton } from "@/components/ui/skeleton";
import { ollamaApi } from "@/utils/ollamaApiClient";
import { toast } from "@/components/ui/use-toast";

export const LLMModelsList = () => {
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<any[]>([]);
  
  // Get Ollama connection state - use the singleton instance across the app
  const { connectionStatus, connectToDocker } = useOllamaDockerConnect();
  
  // Load Ollama models if connected
  useEffect(() => {
    const loadOllamaModels = async () => {
      if (connectionStatus?.connected) {
        try {
          const models = await ollamaApi.listModels();
          setOllamaModels(models.map(model => ({
            id: model.name,
            name: model.name,
            description: `${model.details?.parameter_size || 'Unknown size'} - ${model.details?.family || 'Unknown family'}`,
            isEnabled: true,
            apiProvider: "ollama"
          })));
        } catch (error) {
          console.error("Failed to load Ollama models:", error);
        }
      } else {
        setOllamaModels([]);
      }
    };
    
    loadOllamaModels();
  }, [connectionStatus]);
  
  // Standard models data (API-based models)
  const standardModels = [
    {
      id: "1",
      name: "OpenAI GPT-4",
      description: "Advanced language model with reasoning capabilities",
      isEnabled: true,
      apiProvider: "openai"
    },
    {
      id: "2",
      name: "Claude 3 Opus",
      description: "Anthropic's most capable model for complex tasks",
      isEnabled: true,
      apiProvider: "anthropic"
    },
    {
      id: "3",
      name: "DeepSeek Coder",
      description: "Specialized model for code generation and analysis",
      isEnabled: false,
      apiProvider: "deepseek"
    },
    {
      id: "4",
      name: "Grok-1",
      description: "xAI's conversational AI model",
      isEnabled: true,
      apiProvider: "xai"
    }
  ];
  
  // Combine standard models with Ollama models
  const allModels = [...standardModels, ...ollamaModels];

  // Simulate refreshing models
  const refreshModels = async () => {
    setIsRefreshing(true);
    
    // If Ollama is connected, refresh Ollama models
    if (connectionStatus?.connected) {
      try {
        await ollamaApi.checkConnection();
        const models = await ollamaApi.listModels();
        setOllamaModels(models.map(model => ({
          id: model.name,
          name: model.name,
          description: `${model.details?.parameter_size || 'Unknown size'} - ${model.details?.family || 'Unknown family'}`,
          isEnabled: true,
          apiProvider: "ollama"
        })));
        toast({
          title: "Models refreshed",
          description: `Found ${models.length} Ollama models`,
        });
      } catch (error) {
        console.error("Failed to refresh Ollama models:", error);
        toast({
          title: "Refresh failed",
          description: "Could not refresh Ollama models",
          variant: "destructive"
        });
      }
    }
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">AI Chat Models</h3>
          <p className="text-muted-foreground text-sm">
            Manage models used for AI chat features
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline" 
            size="sm"
            onClick={refreshModels}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddingModel(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </div>
      </div>

      {/* Always show Ollama connection status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Server className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-base">Ollama Local Models</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => connectToDocker('http://localhost:11434')}
              className="h-8"
            >
              Connect
            </Button>
          </div>
          <CardDescription>
            Connect to your local Ollama instance for open-source models
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus && <OllamaConnectionStatus connectionStatus={connectionStatus} />}
          
          {!connectionStatus && (
            <div className="text-center py-3 text-sm text-muted-foreground">
              Checking Ollama connection status...
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allModels.map((model) => (
          <ModelCard
            key={model.id}
            id={model.id}
            name={model.name}
            description={model.description}
            isEnabled={model.isEnabled}
            apiProvider={model.apiProvider}
          />
        ))}
        
        {isRefreshing && (
          <>
            <Skeleton className="h-[148px] w-full rounded-md" />
            <Skeleton className="h-[148px] w-full rounded-md" />
          </>
        )}
      </div>
    </div>
  );
};
