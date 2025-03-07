
import React from "react";

interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  progress?: number;
  simpleMode?: boolean;
}

export const LoadingState = ({ 
  message = "Loading visualization...", 
  showSpinner = true,
  progress,
  simpleMode = false
}: LoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center space-y-4">
        {showSpinner && !simpleMode && (
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-3 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        )}
        
        {showSpinner && simpleMode && (
          <div className="h-8 w-8 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        )}
        
        <p className="font-medium text-center">{message}</p>
        
        {progress !== undefined && !simpleMode && (
          <div className="w-64 bg-secondary/20 rounded-full h-2.5 mt-1">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
