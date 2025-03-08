
import React from "react";

interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  progress?: number;
  simpleMode?: boolean;
  retryAction?: () => void;
  showRetry?: boolean;
  loadingTime?: number;
}

export const LoadingState = ({ 
  message = "Loading visualization...", 
  showSpinner = true,
  progress,
  simpleMode = false,
  retryAction,
  showRetry = false,
  loadingTime = 0
}: LoadingStateProps) => {
  // Show retry button if loading takes too long or explicitly requested
  const showRetryButton = showRetry || loadingTime > 5000;
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center space-y-4">
        {showSpinner && !simpleMode && (
          <div className="relative h-12 w-12" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border-3 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        )}
        
        {showSpinner && simpleMode && (
          <div className="h-8 w-8 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" aria-hidden="true"></div>
        )}
        
        <p className="font-medium text-center" aria-live="polite">{message}</p>
        
        {progress !== undefined && !simpleMode && (
          <div className="w-64 bg-secondary/20 rounded-full h-2.5 mt-1">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-200 ease-in-out" 
              style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
              aria-hidden="true"
            ></div>
          </div>
        )}
        
        {retryAction && showRetryButton && (
          <button 
            onClick={retryAction}
            className="mt-2 px-4 py-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-md text-sm transition-colors"
            aria-label="Retry initialization"
          >
            Retry Initialization
          </button>
        )}
      </div>
    </div>
  );
};
