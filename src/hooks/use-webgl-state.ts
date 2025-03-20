
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export const useWebGLState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contextLost, setContextLost] = useState(false);

  // Handle WebGL context loss
  const handleContextLost = useCallback((event?: any) => {
    console.error('WebGL context lost', event);
    setContextLost(true);
    setHasError(true);
    setErrorMessage('WebGL context lost. Please try refreshing the visualization.');
    
    toast({
      title: 'Visualization Error',
      description: 'The 3D visualization encountered a problem. Trying to recover...',
      variant: 'destructive',
    });
  }, []);

  // Handle WebGL context restoration
  const handleContextRestored = useCallback(() => {
    console.log('WebGL context restored');
    setContextLost(false);
    setHasError(false);
    setErrorMessage(null);
    
    toast({
      title: 'Visualization Recovered',
      description: 'The 3D visualization has been restored.',
    });
  }, []);

  // Handle manual retry
  const handleRetry = useCallback(() => {
    console.log('Retrying WebGL initialization');
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
    setContextLost(false);
    
    // Wait a moment before considering the loading done
    // This gives time for the scene to reinitialize
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return {
    isLoading,
    setIsLoading,
    hasError,
    setHasError,
    errorMessage,
    setErrorMessage,
    contextLost,
    setContextLost,
    handleContextLost,
    handleContextRestored,
    handleRetry
  };
};
