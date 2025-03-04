
import React from 'react';

export const LoadingDecision: React.FC = () => {
  return (
    <div className="flex justify-center py-4">
      <div className="flex flex-col items-center">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
        <p className="text-xs text-muted-foreground">Generating portfolio decision...</p>
      </div>
    </div>
  );
};
