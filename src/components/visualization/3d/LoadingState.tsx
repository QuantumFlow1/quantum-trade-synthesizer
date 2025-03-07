
import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Loading visualization..." }: LoadingStateProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-16 w-16">
          {/* Simplified spinner animation for better performance */}
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-r-primary border-l-transparent border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '1.2s' }}></div>
        </div>
        
        <p className="font-medium text-center">{message}</p>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          The 3D visualization is preparing your market data
        </p>
      </div>
    </div>
  );
};
