
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  retryAction?: () => void;
  loadingTime?: number;
}

export const LoadingState = ({ 
  message = "Loading...", 
  retryAction, 
  loadingTime = 0 
}: LoadingStateProps) => {
  const [showRetry, setShowRetry] = useState(false);
  
  // Show retry button after a delay if provided
  useEffect(() => {
    if (!retryAction || !loadingTime) return;
    
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, loadingTime);
    
    return () => clearTimeout(timer);
  }, [retryAction, loadingTime]);

  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-4 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
      
      {retryAction && showRetry && (
        <button 
          onClick={retryAction}
          className="mt-2 px-4 py-2 text-sm bg-primary/90 hover:bg-primary text-primary-foreground rounded-md transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};
