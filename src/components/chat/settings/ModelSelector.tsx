
import { Cpu } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AI_MODELS, ModelId } from '../types/GrokSettings';

interface ModelSelectorProps {
  selectedModel: ModelId;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  // Get the currently selected model's full info
  const selectedModelInfo = AI_MODELS.find(model => model.id === selectedModel);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Cpu className="h-4 w-4 text-gray-900 dark:text-white" />
          <Label htmlFor="model-select" className="text-sm text-gray-900 dark:text-white font-medium">AI Model</Label>
        </div>
        <span className="text-sm font-medium text-primary text-gray-900 dark:text-white">{selectedModelInfo?.name || 'Onbekend model'}</span>
      </div>
      <Select 
        value={selectedModel} 
        onValueChange={onModelChange}
      >
        <SelectTrigger id="model-select" className="w-full text-gray-900 dark:text-white">
          <SelectValue placeholder="Selecteer AI model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map(model => (
            <SelectItem key={model.id} value={model.id} className="text-gray-900 dark:text-white">{model.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
