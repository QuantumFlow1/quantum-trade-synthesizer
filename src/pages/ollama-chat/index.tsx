
import React, { useEffect, useState } from "react";
import { GrokChat } from "@/components/chat/GrokChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";
import { useOllamaDockerConnect } from "@/hooks/useOllamaDockerConnect";
import { registerOllamaDisconnectFn } from "@/components/auth/AuthProvider";

export default function OllamaChatPage() {
  const [initialized, setInitialized] = useState(false);
  const { connectionStatus, connectToDocker, isConnecting, disconnectFromDocker } = useOllamaDockerConnect();
  
  // Register the disconnect function with the auth provider
  useEffect(() => {
    if (disconnectFromDocker) {
      registerOllamaDisconnectFn(disconnectFromDocker);
    }
  }, [disconnectFromDocker]);
  
  // Attempt to connect to Ollama when the page loads if not already connected
  useEffect(() => {
    const connectIfNeeded = async () => {
      if (!initialized && !connectionStatus?.connected && !isConnecting) {
        await connectToDocker('http://localhost:11434');
        setInitialized(true);
      }
    };
    
    connectIfNeeded();
  }, [connectionStatus, connectToDocker, isConnecting, initialized]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Ollama Chat Interface</h1>
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="flex items-center">
              <Terminal className="mr-2 h-5 w-5 text-teal-600" />
              Local Ollama Models
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[70vh]">
            <GrokChat />
          </CardContent>
        </Card>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Available models: llama3, gemma, phi3, mistral, mixtral, and more</p>
          <p>Connect to your local Ollama instance to get started</p>
        </div>
      </div>
    </div>
  );
}
