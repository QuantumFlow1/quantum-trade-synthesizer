
import { useState, useEffect, useCallback } from 'react';
import { OllamaModel, ollamaApi } from '@/utils/ollamaApiClient';

export function useOllamaModels() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching Ollama models...');
      const ollamaModels = await ollamaApi.listModels();
      console.log('Ollama models fetched:', ollamaModels);
      setModels(ollamaModels);
    } catch (err) {
      console.error('Error fetching Ollama models:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return { models, isLoading, error, refreshModels: fetchModels };
}
