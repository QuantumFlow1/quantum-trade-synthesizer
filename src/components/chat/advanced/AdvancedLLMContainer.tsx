
import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Container for the Advanced LLM Interface
 * Provides consistent styling and layout for all elements
 */
interface AdvancedLLMContainerProps {
  children: ReactNode;
  showSimulatedDataWarning?: boolean;
}

export default function AdvancedLLMContainer({ 
  children, 
  showSimulatedDataWarning = false 
}: AdvancedLLMContainerProps) {
  return (
    <div className="w-full min-h-screen bg-gray-950">
      {showSimulatedDataWarning && (
        <div className="max-w-7xl mx-auto px-4 py-2 bg-amber-900/50 border-b border-amber-700/50 text-amber-200">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
            <p className="text-sm">
              Using simulated trading data - Unable to fetch real-time market information
            </p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md min-h-screen">
        {children}
      </div>
    </div>
  );
}
