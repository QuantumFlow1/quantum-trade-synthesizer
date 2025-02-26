
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cpu } from 'lucide-react';
import { AI_MODELS, ModelInfo } from '../types/GrokSettings';
import { toast } from '@/hooks/use-toast';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  apiKeys: {
    openaiApiKey?: string;
    claudeApiKey?: string;
    geminiApiKey?: string;
    deepseekApiKey?: string;
  };
}

export function ModelSelector({ selectedModel, onModelChange, apiKeys }: ModelSelectorProps) {
  const selectedModelInfo = AI_MODELS.find(model => model.id === selectedModel);

  const handleModelChange = (modelId: string) => {
    onModelChange(modelId);
    
    // Check if the model requires an API key
    const selectedModelInfo = AI_MODELS.find(model => model.id === modelId);
    if (selectedModelInfo?.needsApiKey) {
      // Check if we have the required API key
      let hasKey = false;
      switch (modelId) {
        case 'openai':
        case 'gpt-4':
        case 'gpt-3.5-turbo':
          hasKey = !!apiKeys.openaiApiKey || !!localStorage.getItem('openaiApiKey');
          break;
        case 'claude':
        case 'claude-3-haiku':
        case 'claude-3-sonnet':
        case 'claude-3-opus':
          hasKey = !!apiKeys.claudeApiKey || !!localStorage.getItem('claudeApiKey');
          break;
        case 'gemini':
        case 'gemini-pro':
          hasKey = !!apiKeys.geminiApiKey || !!localStorage.getItem('geminiApiKey');
          break;
        case 'deepseek':
        case 'deepseek-chat':
          hasKey = !!apiKeys.deepseekApiKey || !!localStorage.getItem('deepseekApiKey');
          break;
      }
      
      if (!hasKey) {
        // Alert the user that they need to set an API key
        toast({
          title: "API Key Required",
          description: `${selectedModelInfo.name} requires an API key. Please set it in the API Keys section.`,
          variant: "destructive",
          duration: 5000
        });
      }
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-gray-600" />
          <Label htmlFor="model-select" className="text-sm text-gray-700">AI Model</Label>
        </div>
        <span className="text-sm font-medium text-primary">{selectedModelInfo?.name || 'Onbekend model'}</span>
      </div>
      <Select 
        value={selectedModel} 
        onValueChange={handleModelChange}
      >
        <SelectTrigger id="model-select" className="w-full">
          <SelectValue placeholder="Selecteer AI model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map(model => (
            <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
