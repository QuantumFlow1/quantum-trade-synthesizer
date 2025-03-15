
import React from 'react';
import { Terminal, AlertTriangle, Button } from 'lucide-react';
import { Button as UIButton } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { EdgeFunctionStatus } from '../../types/chatTypes';

interface OllamaEmptyStateProps {
  isConnected: boolean;
  models: any[];
  isLoadingModels: boolean;
  toggleSettings: () => void;
  toggleConnectionInfo: () => void;
}

export function OllamaEmptyState({
  isConnected,
  models,
  isLoadingModels,
  toggleSettings,
  toggleConnectionInfo
}: OllamaEmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
      <Terminal className="w-16 h-16 mb-6 opacity-20" />
      <p className="text-lg">Local AI with Ollama</p>
      <p className="text-sm mt-2">Chat with AI models running on your machine</p>
      
      {/* Connection status on the empty state */}
      {isConnected ? (
        <div className="mt-6 text-sm">
          <div className="flex items-center justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <span>Connected to Ollama</span>
          </div>
          {models.length === 0 && !isLoadingModels && (
            <div className="mt-4 p-3 border border-amber-200 rounded-md bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 max-w-md">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-400">No models found</p>
                  <p className="mt-1 text-xs">
                    Install models using the terminal:
                  </p>
                  <code className="mt-1 text-xs block bg-white/50 dark:bg-black/20 p-2 rounded">
                    ollama pull llama3
                  </code>
                  <p className="mt-2 text-xs">
                    <a 
                      href="https://ollama.com/library" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Browse Ollama library
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6 text-sm">
          <div className="flex items-center justify-center mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            <span>Not connected to Ollama</span>
          </div>
          <UIButton 
            variant="outline" 
            size="sm" 
            onClick={toggleSettings} 
            className="mt-2"
          >
            Open Settings
          </UIButton>
          <div className="mt-4 flex flex-col items-center">
            <p className="text-xs text-muted-foreground">
              Need help setting up Ollama?
            </p>
            <UIButton 
              variant="link" 
              size="sm"
              className="text-xs h-auto p-0 mt-1"
              onClick={toggleConnectionInfo}
            >
              View troubleshooting guide
            </UIButton>
          </div>
        </div>
      )}
    </div>
  );
}
