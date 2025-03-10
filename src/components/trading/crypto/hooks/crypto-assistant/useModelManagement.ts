
import { useState, useCallback } from 'react';
import { CryptoModel } from '../../types';
import { toast } from '@/components/ui/use-toast';

// Available AI models
const AVAILABLE_MODELS: CryptoModel[] = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3 70B', providerName: 'Groq' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b', providerName: 'Groq' },
  { id: 'gemini-pro', name: 'Gemini Pro', providerName: 'Google' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', providerName: 'Anthropic' },
];

export function useModelManagement() {
  const [currentModel, setCurrentModel] = useState(AVAILABLE_MODELS[0].id);
  
  // Switch between different models
  const switchModel = useCallback((modelId: string) => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model.id);
      toast({
        title: 'Model Changed',
        description: `Now using ${model.name} (${model.providerName})`,
        duration: 2000,
      });
    }
  }, []);
  
  return {
    currentModel,
    switchModel,
    availableModels: AVAILABLE_MODELS
  };
}
