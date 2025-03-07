
import React from "react";

interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  progress?: number;
}

export const LoadingState = ({ 
  message = "Loading visualization...", 
  showSpinner = true,
  progress 
}: LoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center space-y-4">
        {showSpinner && (
          <div className="relative h-12 w-12">
            {/* Simplified spinner with fewer animations for better performance */}
            <div className="absolute inset-0 rounded-full border-3 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
        )}
        
        <p className="font-medium text-center">{message}</p>
        
        {progress !== undefined && (
          <div className="w-64 bg-secondary/20 rounded-full h-2.5 mt-1">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
            ></div>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          You may consider using a pre-built 3D environment instead for better performance
        </p>
      </div>
    </div>
  );
};
