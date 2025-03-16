
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, AlertTriangle, Info, Server, Play } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OllamaConnectionGuideProps {
  connectToDocker: (address: string) => Promise<void>;
}

export const OllamaConnectionGuide = ({ connectToDocker }: OllamaConnectionGuideProps) => {
  // Detect if we're in Gitpod environment or Lovable preview
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
  
  const isLovablePreview = typeof window !== 'undefined' && 
    window.location.hostname.includes('lovable.app');
  
  // Get the current origin for display purposes
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const gitpodWorkspaceUrl = isGitpod && typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="space-y-4">
      {isLovablePreview && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-sm">
            <strong>Preview URL Connection Issue:</strong> When running from a Lovable preview URL 
            (<code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">{currentOrigin}</code>), 
            you cannot connect directly to a local Ollama instance due to browser security restrictions.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1 text-primary" />
          {isLovablePreview 
            ? "Options for Preview Environments:" 
            : "Docker Connection Guide:"}
        </h4>
        
        {isLovablePreview ? (
          <div className="space-y-4">
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>
                <span className="font-medium">Use a publicly accessible Ollama instance</span>
                <p className="text-xs mt-1 ml-5">
                  For preview environments, you need to use an Ollama instance that's accessible over the internet
                </p>
              </li>
              <li>
                <span className="font-medium">Set up a proxy server</span>
                <p className="text-xs mt-1 ml-5">
                  You can create a simple proxy server that forwards requests from your application to Ollama
                </p>
              </li>
              <li>
                <span className="font-medium">Download the Lovable project and run locally</span>
                <p className="text-xs mt-1 ml-5">
                  When running locally, you can connect directly to a local Ollama instance
                </p>
              </li>
              <li>
                <span className="font-medium">Use Supabase Edge Functions as a proxy</span>
                <p className="text-xs mt-1 ml-5">
                  Create an Edge Function that forwards requests to your Ollama instance
                </p>
              </li>
            </ol>
            
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
              <p className="text-sm font-medium flex items-center">
                <Info className="h-4 w-4 mr-1 text-blue-500" />
                Best Solution:
              </p>
              <p className="text-xs mt-1">
                For the best experience, we recommend downloading the project to your local machine. 
                Then you can connect directly to Ollama running on the same machine without CORS issues.
              </p>
              <p className="text-xs mt-2">
                In a more permanent setup, you should use a backend proxy service (like a Supabase Edge Function)
                to securely handle communication between your frontend and Ollama.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Docker Container Connection Guide:</h4>
            <ol className="list-decimal list-inside text-sm space-y-2">
              <li>Make sure port 11434 is exposed in your Docker container</li>
              <li>Try these connection formats:
                <ul className="list-disc list-inside pl-5 mt-1 text-xs">
                  <li>Container ID: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">de67d12500e8</code></li>
                  <li>Container name: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">ollama</code></li>
                  <li>Alternative ports: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">localhost:11435</code> or <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">localhost:37321</code></li>
                  <li>With port: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">de67d12500e8:11434</code></li>
                  <li>Full URL: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://de67d12500e8:11434</code></li>
                  <li>Docker host IP: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">http://host.docker.internal:11434</code></li>
                </ul>
              </li>
              <li>If using host networking in Docker, try <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">localhost:11434</code></li>
              <li>Check that there are no firewall rules blocking access to the container</li>
            </ol>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="flex items-center">
          <ExternalLink className="h-3 w-3 mr-1" /> 
          <span>
            <strong>CORS Configuration:</strong> Your Ollama container needs{" "}
            <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded break-all">
              OLLAMA_ORIGINS={currentOrigin}
            </code>
          </span>
        </p>
        
        {isLovablePreview && (
          <p className="mt-2 text-amber-600 dark:text-amber-400">
            Note: Running local software (like Ollama) with preview URLs requires advanced networking setup.
            Consider using the local development environment instead.
          </p>
        )}
      </div>
    </div>
  );
};
