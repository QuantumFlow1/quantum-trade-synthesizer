
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Server, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OllamaConnectionGuideProps {
  connectToDocker: (address: string) => Promise<boolean | void>;
}

export const OllamaConnectionGuide: React.FC<OllamaConnectionGuideProps> = ({
  connectToDocker,
}) => {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle>Ollama Connection Guide</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Ollama is an open-source AI model server that runs locally on your machine. To use it:
        </p>
        <ol className="list-decimal list-inside space-y-1 mb-2">
          <li>Install Ollama from <a href="https://ollama.ai/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ollama.ai/download</a></li>
          <li>Start Ollama on your computer</li>
          <li>Pull a model with <code className="bg-gray-100 px-1 py-0.5 rounded">ollama pull llama3</code></li>
        </ol>
        <div className="flex justify-end gap-2 mt-3">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open('https://ollama.ai/download', '_blank')}
          >
            Visit Ollama Website
          </Button>
          <Button 
            size="sm"
            onClick={() => connectToDocker('http://localhost:11434')}
          >
            Quick Connect
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
