
import { useState, useEffect, useRef } from 'react';
import { TradingDataPoint } from '@/utils/tradingData';

export type ColorTheme = 'light' | 'dark';

export function useThemeDetection() {
  const [theme, setTheme] = useState<ColorTheme>('dark');

  useEffect(() => {
    // Check if user prefers dark mode
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    
    // Add listener for theme changes
    const themeChangeHandler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    darkModeMediaQuery.addEventListener('change', themeChangeHandler);
    
    // Clean up
    return () => {
      darkModeMediaQuery.removeEventListener('change', themeChangeHandler);
    };
  }, []);

  return theme;
}

// WebGL state for 3D visualizations
export function useWebGLState() {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const checkedRef = useRef<boolean>(false);

  useEffect(() => {
    if (checkedRef.current) return;
    
    checkedRef.current = true;
    
    // Check if WebGL is available in this browser
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isWebGLAvailable = !!gl;
      
      setWebGLAvailable(isWebGLAvailable);
      
      if (gl) {
        // Clean up resources
        if (gl instanceof WebGLRenderingContext) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      }
    } catch (e) {
      console.error('Error checking WebGL availability:', e);
      setWebGLAvailable(false);
    }
  }, []);

  return {
    webGLAvailable,
    contextLost,
    setContextLost
  };
}

// Improved hook for 3D market view with error handling and loading states
export function useImprovedMarket3DView({ 
  visualizationData, 
  onError, 
  onLoaded 
}: { 
  visualizationData: TradingDataPoint[];
  onError?: () => void;
  onLoaded?: () => void;
}) {
  const theme = useThemeDetection();
  const { webGLAvailable, contextLost, setContextLost } = useWebGLState();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const errorTypeRef = useRef<string>('unknown');
  
  // Handle loading state
  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      const loadingTimer = setInterval(() => {
        setLoadingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      
      return () => clearInterval(loadingTimer);
    }
  }, [isLoading]);
  
  // Handle data changes
  useEffect(() => {
    if (visualizationData.length > 0) {
      setIsLoading(false);
      
      if (onLoaded && !hasError && webGLAvailable && !contextLost) {
        onLoaded();
      }
    }
  }, [visualizationData, hasError, webGLAvailable, contextLost, onLoaded]);
  
  // Handle WebGL context events
  const handleContextLost = () => {
    console.log('WebGL context lost');
    setContextLost(true);
    errorTypeRef.current = 'context-lost';
    setHasError(true);
    if (onError) onError();
  };
  
  const handleContextRestored = () => {
    console.log('WebGL context restored');
    setContextLost(false);
    if (!webGLAvailable) return;
    setHasError(false);
  };
  
  // Handle retry
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    startTimeRef.current = Date.now();
    setLoadingTime(0);
  };
  
  // Handle WebGL restore
  const handleWebGLRestore = () => {
    setWebGLAvailable(true);
    setContextLost(false);
    setHasError(false);
    handleRetry();
  };
  
  // Get error state type for appropriate UI message
  const getErrorStateType = () => {
    if (!webGLAvailable) return 'webgl-unsupported';
    if (contextLost) return 'context-lost';
    if (hasError) return errorTypeRef.current;
    return 'none';
  };
  
  return {
    theme,
    isLoading,
    hasError,
    webGLAvailable,
    contextLost,
    loadingTime,
    handleContextLost,
    handleContextRestored,
    handleRetry,
    handleWebGLRestore,
    getErrorStateType,
    setHasError,
    errorTypeRef
  };
}
