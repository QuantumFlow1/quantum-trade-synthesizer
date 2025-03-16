
import React from "react";
import { Button } from "@/components/ui/button";
import { Terminal, Info } from "lucide-react";

interface OllamaConnectionGuideProps {
  connectToDocker: (address: string) => Promise<boolean | void>;
}

export const OllamaConnectionGuide = ({ connectToDocker }: OllamaConnectionGuideProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Info className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
        <div className="text-sm">
          <h4 className="font-medium">Quick Connect Options</h4>
          <p className="text-muted-foreground mt-1">
            Try these common connection options for Ollama:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center"
          onClick={() => connectToDocker("http://localhost:11434")}
        >
          <Terminal className="h-3.5 w-3.5 mr-1.5" />
          localhost:11434
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center"
          onClick={() => connectToDocker("http://127.0.0.1:11434")}
        >
          <Terminal className="h-3.5 w-3.5 mr-1.5" />
          127.0.0.1:11434
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center"
          onClick={() => connectToDocker("http://host.docker.internal:11434")}
        >
          <Terminal className="h-3.5 w-3.5 mr-1.5" />
          Docker Internal
        </Button>
      </div>
    </div>
  );
};
