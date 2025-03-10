
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Bot, Settings, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getAvailableProviders } from '@/utils/apiKeyManager';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  providerName: string;
  needsApiKey: boolean;
  isAvailable?: boolean;
}

const AI_MODELS: AIModel[] = [
  // OpenAI Models
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', providerName: 'OpenAI', needsApiKey: true },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', providerName: 'OpenAI', needsApiKey: true },
  
  // Claude Models
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'claude', providerName: 'Anthropic', needsApiKey: true },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'claude', providerName: 'Anthropic', needsApiKey: true },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'claude', providerName: 'Anthropic', needsApiKey: true },
  
  // Groq Models
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3 70B', provider: 'groq', providerName: 'Groq', needsApiKey: true },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b', provider: 'groq', providerName: 'Groq', needsApiKey: true },
  
  // Gemini Models
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini', providerName: 'Google', needsApiKey: true },
  
  // DeepSeek Models
  { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'deepseek', providerName: 'DeepSeek', needsApiKey: true },
];

interface UnifiedAISelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  showSettings?: boolean;
  onSettingsClick?: () => void;
}

export function UnifiedAISelector({ 
  selectedModelId, 
  onModelChange,
  showSettings = true,
  onSettingsClick
}: UnifiedAISelectorProps) {
  const [providers, setProviders] = useState(getAvailableProviders());
  const [models, setModels] = useState<AIModel[]>([]);
  
  // Listen for API key changes
  useEffect(() => {
    const updateProviders = () => {
      setProviders(getAvailableProviders());
    };
    
    // Initial check
    updateProviders();
    
    // Listen for storage changes
    window.addEventListener('apikey-updated', updateProviders);
    window.addEventListener('storage', updateProviders);
    
    return () => {
      window.removeEventListener('apikey-updated', updateProviders);
      window.removeEventListener('storage', updateProviders);
    };
  }, []);
  
  // Update models based on available providers
  useEffect(() => {
    const updatedModels = AI_MODELS.map(model => ({
      ...model,
      isAvailable: model.needsApiKey ? providers[model.provider] : true
    }));
    
    setModels(updatedModels);
  }, [providers]);
  
  // Get the selected model
  const selectedModel = models.find(model => model.id === selectedModelId) || models[0];
  
  const handleModelSelect = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    
    if (!model) return;
    
    // Check if API key is required but not available
    if (model.needsApiKey && !model.isAvailable) {
      toast({
        title: "API Key Required",
        description: `Please configure your ${model.providerName} API key in settings.`,
        variant: "warning",
        duration: 5000
      });
      
      // Trigger settings dialog if provided
      if (onSettingsClick) {
        onSettingsClick();
      }
      
      return;
    }
    
    // Change model
    onModelChange(modelId);
    
    toast({
      title: "Model Changed",
      description: `Now using ${model.name} (${model.providerName})`,
      duration: 2000,
    });
  };
  
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Bot className="h-3.5 w-3.5 mr-1.5" />
            {selectedModel?.name || 'Select Model'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Group models by provider */}
          {Object.entries(
            models.reduce((groups, model) => {
              const provider = model.providerName;
              if (!groups[provider]) groups[provider] = [];
              groups[provider].push(model);
              return groups;
            }, {} as Record<string, AIModel[]>)
          ).map(([provider, providerModels]) => (
            <div key={provider}>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground py-1">
                {provider}
              </DropdownMenuLabel>
              
              {providerModels.map(model => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  disabled={model.needsApiKey && !model.isAvailable}
                  className="flex justify-between"
                >
                  <span>{model.name}</span>
                  {model.id === selectedModelId ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : model.needsApiKey && !model.isAvailable ? (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  ) : null}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showSettings && onSettingsClick && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8"
          onClick={onSettingsClick}
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
