
import React, { ReactNode } from 'react';

/**
 * Container for the Advanced LLM Interface
 * Provides consistent styling and layout for all elements
 */
interface AdvancedLLMContainerProps {
  children: ReactNode;
}

export default function AdvancedLLMContainer({ children }: AdvancedLLMContainerProps) {
  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-sm min-h-screen">
        {children}
      </div>
    </div>
  );
}
