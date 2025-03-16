
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";

interface OllamaConnectionGuideProps {
  connectToDocker: (address: string) => Promise<void>;
}

export const OllamaConnectionGuide = ({ connectToDocker }: OllamaConnectionGuideProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md mt-2">
      <h4 className="text-sm font-medium mb-2">Docker Container Connection Guide:</h4>
      <ol className="list-decimal list-inside text-sm space-y-2">
        <li>Make sure port 11434 is exposed in your Docker container</li>
        <li>Try these connection formats:
          <ul className="list-disc list-inside pl-5 mt-1 text-xs">
            <li>Container ID: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">de67d12500e8</code></li>
            <li>Container name: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">ollama</code></li>
            <li>With port: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">de67d12500e8:11434</code></li>
            <li>Full URL: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://de67d12500e8:11434</code></li>
            <li>Docker host IP: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://host.docker.internal:11434</code></li>
          </ul>
        </li>
        <li>If using host networking in Docker, try <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">localhost:11434</code></li>
        <li>Check that there are no firewall rules blocking access to the container</li>
      </ol>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => connectToDocker('de67d12500e8')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Container ID
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => connectToDocker('ollama')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Container Name
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => connectToDocker('host.docker.internal:11434')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try host.docker.internal
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => connectToDocker('172.17.0.1:11434')}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Docker Bridge IP
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" /> 
          Tip: For Docker Desktop, make sure port 11434 is properly published in your container settings.
        </p>
      </div>
    </div>
  );
};
