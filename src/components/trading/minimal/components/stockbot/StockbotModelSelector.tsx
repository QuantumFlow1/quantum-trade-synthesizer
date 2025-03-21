
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Bot, Settings, Brain } from "lucide-react";

interface StockbotModelSelectorProps {
  availableProviders: Record<string, boolean>;
  onConfigureApiKey: () => void;
}

export const StockbotModelSelector: React.FC<StockbotModelSelectorProps> = ({
  availableProviders,
  onConfigureApiKey
}) => {
  const llmProviders = [
    { 
      id: 'groq', 
      name: 'Groq', 
      description: 'Fast inference with Llama 3 and Mixtral models',
      models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma-7b-it']
    },
    { 
      id: 'openai', 
      name: 'OpenAI', 
      description: 'Powerful GPT-4o and GPT-3.5 models',
      models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
    },
    { 
      id: 'anthropic', 
      name: 'Claude', 
      description: 'Claude 3 family of assistants',
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
    },
    { 
      id: 'gemini', 
      name: 'Google AI', 
      description: 'Google\'s Gemini models',
      models: ['gemini-pro', 'gemini-flash']
    },
    { 
      id: 'ollama', 
      name: 'Ollama', 
      description: 'Local open-source models',
      models: ['llama3', 'mistral', 'codellama', 'phi']
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available LLM Models</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Configure API keys to enable different LLM providers for intelligent trading analysis
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {llmProviders.map(provider => (
          <Card key={provider.id} className={availableProviders[provider.id] ? "border-primary/30" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  {provider.name}
                </CardTitle>
                {availableProviders[provider.id] ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
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
                variant={availableProviders[provider.id] ? "outline" : "default"} 
                className="w-full" 
                onClick={onConfigureApiKey}
              >
                <Settings className="h-3.5 w-3.5 mr-2" />
                {availableProviders[provider.id] ? "Reconfigure API Key" : "Configure API Key"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {!Object.values(availableProviders).some(Boolean) && (
        <Alert className="mt-4">
          <AlertDescription className="text-sm">
            No API keys configured yet. Configure at least one provider to enable advanced AI trading analysis.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
