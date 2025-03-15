
import React from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface OllamaNoModelsAlertProps {
  refreshModels: () => void;
}

export function OllamaNoModelsAlert({ refreshModels }: OllamaNoModelsAlertProps) {
  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>No Ollama Models Found</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Your Ollama instance is connected but doesn't have any models installed.</p>
        <div className="mt-2">
          <p className="text-sm mb-2">To install a model, run this command in your terminal:</p>
          <code className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm block">
            ollama pull llama3
          </code>
        </div>
        <p className="text-sm mt-2">
          Or visit <a href="https://ollama.com/library" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ollama Library</a> for more models.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 self-end" 
          onClick={refreshModels}
        >
          <Download className="h-4 w-4 mr-2" /> Check for Models
        </Button>
      </AlertDescription>
    </Alert>
  );
}
