
import React, { useEffect, useState } from 'react';
import { Brain, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Message } from '../types/chatTypes';

export function GrokChat() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    checkApiKey();
    
    // Listen for API key changes
    const handleStorageChange = () => {
      checkApiKey();
    };
    
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkApiKey = () => {
    // For Grok, check if Groq API key exists
    const storedKey = localStorage.getItem('groqApiKey');
    console.log('Checking Groq API key:', storedKey ? `Key exists (${storedKey.length} chars)` : 'No key found');
    
    setApiKey(storedKey);
    setIsConnected(!!storedKey && storedKey.length > 10);
    
    // Broadcast status to parent components
    if (!!storedKey && storedKey.length > 10) {
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider: 'grok', status: 'connected' }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider: 'grok', status: 'disconnected' }
      }));
    }
  };

  const verifyConnection = async () => {
    if (!apiKey) return;
    
    setIsChecking(true);
    try {
      const keyLength = apiKey.length;
      console.log(`Verifying Grok connection with API key length: ${keyLength}`);
      
      // Make an actual API call to verify the connection
      try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setIsConnected(true);
          toast({
            title: "Connection Successful",
            description: "Successfully connected to Groq API",
            duration: 3000
          });
          
          window.dispatchEvent(new CustomEvent('connection-status-changed', {
            detail: { provider: 'grok', status: 'connected' }
          }));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }
      } catch (error) {
        console.error("API verification error:", error);
        setIsConnected(false);
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect to Groq API",
          variant: "destructive",
          duration: 5000
        });
        
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'grok', status: 'disconnected' }
        }));
      }
      
      setIsChecking(false);
    } catch (error) {
      console.error("Error connecting to Grok API:", error);
      setIsConnected(false);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Grok API. Please check your API key.",
        variant: "destructive",
        duration: 5000
      });
      setIsChecking(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      {isConnected ? (
        <>
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <Brain className="h-16 w-16 text-green-300" />
          </div>
          <h3 className="text-lg font-medium text-green-700">Grok Connected</h3>
          <p className="text-gray-600 text-center mt-2">
            Your Grok API key is active and ready to use.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              localStorage.removeItem('groqApiKey');
              setApiKey(null);
              setIsConnected(false);
              checkApiKey();
              toast({
                title: "API Key Removed",
                description: "Your Grok API key has been removed",
                duration: 3000
              });
            }}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <>
          <Brain className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Grok Chat</h3>
          <p className="text-gray-500 text-center mt-2">
            Chat interface for Grok is ready for connection.
          </p>
          <div className="flex items-center mt-4">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
            <p className="text-xs text-amber-600">
              API key required for connection
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Use the API key settings to configure your connection.
          </p>
          {isChecking ? (
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              disabled
            >
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking connection...
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/dashboard/settings'}
            >
              Configure API Key
            </Button>
          )}
          {apiKey && apiKey.length > 0 && (
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={verifyConnection}
            >
              Verify Connection
            </Button>
          )}
        </>
      )}
    </div>
  );
}
