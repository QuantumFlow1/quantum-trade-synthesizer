
import React, { ReactNode } from 'react';
import { AlertTriangle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Container for the Advanced LLM Interface
 * Provides consistent styling and layout for all elements
 */
interface AdvancedLLMContainerProps {
  children: ReactNode;
  showSimulatedDataWarning?: boolean;
  showApiKeyMissing?: boolean;
  onConfigureApiKeys?: () => void;
}

export default function AdvancedLLMContainer({ 
  children, 
  showSimulatedDataWarning = false,
  showApiKeyMissing = false,
  onConfigureApiKeys
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
      
      {showApiKeyMissing && (
        <div className="max-w-7xl mx-auto px-4 py-2 bg-red-900/50 border-b border-red-700/50 text-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="h-4 w-4 mr-2 text-red-400" />
              <p className="text-sm">
                API sleutels ontbreken - Configureer deze in het Admin Paneel
              </p>
            </div>
            {onConfigureApiKeys && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-red-950 border-red-700 text-red-200 hover:bg-red-900 hover:text-red-100"
                onClick={onConfigureApiKeys}
              >
                Naar Admin Paneel
              </Button>
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto bg-gray-900 rounded-lg shadow-md min-h-screen">
        {children}
      </div>
    </div>
  );
}
