
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading visualization...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-foreground/80 text-sm">{message}</p>
    </div>
  );
};
