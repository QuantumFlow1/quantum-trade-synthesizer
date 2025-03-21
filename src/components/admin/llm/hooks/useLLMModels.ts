
import { useState, useEffect } from "react";
import { LLMModel, LLMProviderType } from "../types";

export function useLLMModels(provider: LLMProviderType) {
  const [models, setModels] = useState<LLMModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would fetch models from the API
        const mockModels = getMockModels(provider);
        
        // Check if API key is configured
        const hasApiKey = checkApiKeyConfigured(provider);
        setIsConnected(hasApiKey);
        
        if (!hasApiKey) {
          setError(`No API key configured for ${getProviderDisplayName(provider)}`);
          setModels([]);
        } else {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setModels(mockModels);
          
          // Select first model if none selected
          if (!selectedModel && mockModels.length > 0) {
            setSelectedModel(mockModels[0].id);
          }
        }
      } catch (err) {
        console.error(`Error fetching ${provider} models:`, err);
        setError(`Failed to load models for ${getProviderDisplayName(provider)}`);
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, [provider]);
  
  return {
    models,
    selectedModel,
    setSelectedModel,
    isLoading,
    error,
    isConnected
  };
}

// Check if API key is configured
function checkApiKeyConfigured(provider: LLMProviderType): boolean {
  const keyMapping: Record<LLMProviderType, string | null> = {
    openai: localStorage.getItem('openaiApiKey'),
    groq: localStorage.getItem('groqApiKey'),
    anthropic: localStorage.getItem('claudeApiKey'),
    ollama: 'localhost', // Ollama is assumed to be locally available
    deepseek: localStorage.getItem('deepseekApiKey')
  };
  
  return !!keyMapping[provider];
}

// Get provider display name
function getProviderDisplayName(provider: LLMProviderType): string {
  const names: Record<LLMProviderType, string> = {
    openai: 'OpenAI',
    groq: 'Groq',
    anthropic: 'Anthropic (Claude)',
    ollama: 'Ollama',
    deepseek: 'DeepSeek'
  };
  
  return names[provider] || provider;
}

// Get mock models for the provider
function getMockModels(provider: LLMProviderType): LLMModel[] {
  switch (provider) {
    case 'openai':
      return [
        { id: 'gpt-4o', name: 'GPT-4o', provider, contextLength: 128000, description: 'Most capable model with vision' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider, contextLength: 128000, description: 'Smaller, faster version of GPT-4o' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider, contextLength: 16000, description: 'Fast and efficient model' }
      ];
    
    case 'groq':
      return [
        { id: 'llama3-70b-8192', name: 'Llama 3 70B', provider, contextLength: 8192, description: 'High performance Llama 3 model' },
        { id: 'llama3-8b-8192', name: 'Llama 3 8B', provider, contextLength: 8192, description: 'Efficient Llama 3 model' },
        { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider, contextLength: 32768, description: 'Powerful mixture of experts model' }
      ];
    
    case 'anthropic':
      return [
        { id: 'claude-3-opus', name: 'Claude 3 Opus', provider, contextLength: 200000, description: 'Most powerful Claude model' },
        { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider, contextLength: 200000, description: 'Balanced Claude model' },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider, contextLength: 200000, description: 'Fast Claude model' }
      ];
    
    case 'ollama':
      return [
        { id: 'llama3', name: 'Llama 3', provider, description: 'Local Llama 3 model' },
        { id: 'mistral', name: 'Mistral', provider, description: 'Local Mistral model' },
        { id: 'phi3', name: 'Phi-3', provider, description: 'Local Phi-3 model' }
      ];
    
    case 'deepseek':
      return [
        { id: 'deepseek-coder', name: 'DeepSeek Coder', provider, contextLength: 16000, description: 'Specialized for code generation' },
        { id: 'deepseek-chat', name: 'DeepSeek Chat', provider, contextLength: 16000, description: 'General purpose chat model' }
      ];
    
    default:
      return [];
  }
}
