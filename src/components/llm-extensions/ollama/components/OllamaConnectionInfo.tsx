
import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface OllamaConnectionInfoProps {
  ollamaHost: string;
  tryAlternativePort: (port: string) => void;
  isConnected: boolean;
}

export function OllamaConnectionInfo({
  ollamaHost,
  tryAlternativePort,
  isConnected
}: OllamaConnectionInfoProps) {
  // Common ports used by Ollama
  const commonOllamaPorts = ['11434', '24000', '41799', '33653'];
  const currentPort = ollamaHost.split(':').pop() || '11434';
  
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Connection Troubleshooting</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>Current Ollama host: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{ollamaHost}</code></p>
        
        <div>
          <p className="font-medium mb-1">Troubleshooting steps:</p>
          <ol className="list-decimal list-inside text-sm space-y-1 pl-2">
            <li>Make sure Ollama is installed and running on your computer</li>
            <li>Check if Ollama is running on a different port</li>
            <li>Verify there are no firewall restrictions blocking access</li>
            <li>Try restarting the Ollama service</li>
          </ol>
        </div>
        
        <div>
          <p className="font-medium mb-1">Try connecting to common Ollama ports:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {commonOllamaPorts.map(port => (
              <Button 
                key={port}
                size="sm"
                variant={port === currentPort ? "default" : "outline"}
                onClick={() => tryAlternativePort(port)}
                disabled={port === currentPort && isConnected}
              >
                {port === currentPort ? `${port} (current)` : port}
              </Button>
            ))}
          </div>
        </div>
        
        <p className="text-sm">
          For detailed instructions, visit the <a href="https://github.com/ollama/ollama" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ollama GitHub repository</a>
        </p>
      </AlertDescription>
    </Alert>
  );
}
