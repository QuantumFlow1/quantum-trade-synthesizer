
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Server, InfoIcon } from "lucide-react";
import { ConnectionStatus } from "@/hooks/useOllamaDockerConnect";
import { ollamaApi } from "@/utils/ollamaApiClient";

interface OllamaConnectionStatusProps {
  connectionStatus: ConnectionStatus | null;
}

export const OllamaConnectionStatus = ({ connectionStatus }: OllamaConnectionStatusProps) => {
  if (!connectionStatus) return null;

  // Extract origin for display purposes
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  const isGitpod = typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
  const isLovablePreview = typeof window !== 'undefined' && 
    window.location.hostname.includes('lovable.app');

  return (
    <Alert variant={connectionStatus.connected ? "default" : "destructive"}>
      {connectionStatus.connected ? (
        <>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Succesvol verbonden</AlertTitle>
          <AlertDescription>
            Verbonden met Ollama op {ollamaApi.getBaseUrl()}
            {connectionStatus.modelsCount !== undefined && (
              <p className="mt-1">{connectionStatus.modelsCount} modellen gevonden</p>
            )}
            {connectionStatus.modelsCount === 0 && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Geen modellen gevonden. Je moet een model pullen om Ollama te gebruiken.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Pull een model door uit te voeren:</p>
                  {isGitpod ? (
                    <code className="block">
                      docker exec -it ollama ollama pull llama3
                    </code>
                  ) : (
                    <code className="block">
                      docker exec -it ollama ollama pull llama3
                    </code>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Vernieuw na het pullen om de beschikbare modellen te zien
                  </p>
                </div>
              </div>
            )}
          </AlertDescription>
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verbinding mislukt</AlertTitle>
          <AlertDescription>
            {connectionStatus.error}
            
            {connectionStatus.error?.includes('CORS') || connectionStatus.error?.includes('403 Forbidden') ? (
              <div className="mt-2 text-sm">
                <p className="font-medium">CORS probleem:</p>
                <p>Ollama moet geconfigureerd zijn om verzoeken van {currentOrigin} toe te staan</p>
                
                {isGitpod ? (
                  <div className="mt-2">
                    <p className="font-medium">In Gitpod, probeer:</p>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs overflow-x-auto">
                      docker stop ollama && docker rm ollama<br/>
                      docker run -d --name ollama -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
                    </pre>
                    <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                      <strong>Gitpod Tip:</strong> Het kan zijn dat je poort 11434 moet openstellen in je Gitpod-configuratie.
                      Controleer of poort 11434 is vermeld in het tabblad Ports in de Gitpod UI.
                    </p>
                  </div>
                ) : isLovablePreview ? (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs overflow-x-auto">
                    docker stop ollama && docker rm ollama<br/>
                    docker run -d --name ollama -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
                  </pre>
                ) : (
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 mb-1 text-xs overflow-x-auto">
                    docker run -e OLLAMA_ORIGINS={currentOrigin} -p 11434:11434 ollama/ollama
                  </pre>
                )}
                
                {isLovablePreview && (
                  <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                    <strong>Lovable Preview:</strong> Wanneer je verbinding maakt vanaf een preview-URL, 
                    moet je ervoor zorgen dat je Ollama-instantie openbaar toegankelijk is en geconfigureerd is met de preview-URL 
                    in OLLAMA_ORIGINS. Overweeg een backend-proxy of serverless-functie te gebruiken voor productiegebruik.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-2 text-sm">
                <p className="font-medium">Verbindingsfout:</p>
                <p>Zorg ervoor dat Ollama draait en het adres correct is.</p>
                
                {isGitpod && (
                  <div className="mt-2">
                    <p className="font-medium">In Gitpod, controleer:</p>
                    <ul className="list-disc list-inside pl-2 mt-1 text-xs">
                      <li>Draait de Ollama-container? Voer uit: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">docker ps | grep ollama</code></li>
                      <li>Probeer verbinding te maken met <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://ollama:11434</code> of <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://172.17.0.1:11434</code></li>
                      <li>Is poort 11434 opengesteld in Gitpod?</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Alternative ports suggestion */}
            <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
              <p className="text-xs font-medium">Alternatieve oplossingen:</p>
              <ul className="list-disc list-inside pl-2 mt-1 text-xs">
                <li>Probeer andere poorten zoals 11435 of 37321</li>
                <li>Controleer of Docker draait en toegankelijk is</li>
                <li>Probeer de container te herstarten: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">docker restart ollama</code></li>
                <li>Zorg ervoor dat CORS correct is ingesteld voor je huidige oorsprong</li>
              </ul>
            </div>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};
