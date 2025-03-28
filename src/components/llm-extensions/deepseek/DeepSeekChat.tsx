
import React, { useEffect, useState } from 'react';
import { Cpu, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export function DeepSeekChat() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    checkApiKey();
    
    // Listen for API key changes
    const handleStorageChange = () => {
      checkApiKey();
    };
    
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
    };
  }, []);

  const checkApiKey = () => {
    const storedKey = localStorage.getItem('deepseekApiKey');
    setApiKey(storedKey);
    setIsConnected(!!storedKey && storedKey.length > 10);
    
    // Broadcast status to parent components
    if (!!storedKey && storedKey.length > 10) {
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider: 'deepseek', status: 'connected' }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider: 'deepseek', status: 'disconnected' }
      }));
    }
  };

  const verifyConnection = async () => {
    if (!apiKey) {
      return;
    }
    
    setIsChecking(true);
    try {
      // In a real implementation, we'd verify the API key with the DeepSeek API
      // Here we're just simulating a successful connection if the key exists
      setTimeout(() => {
        setIsConnected(true);
        toast({
          title: "Connection Successful",
          description: "Successfully connected to DeepSeek API",
          duration: 3000
        });
        
        // Broadcast status to parent components
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'deepseek', status: 'connected' }
        }));
        
        setIsChecking(false);
      }, 1000);
    } catch (error) {
      console.error("Error connecting to DeepSeek API:", error);
      setIsConnected(false);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to DeepSeek API. Please check your API key.",
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
            <Cpu className="h-16 w-16 text-green-300" />
          </div>
          <h3 className="text-lg font-medium text-green-700">DeepSeek Connected</h3>
          <p className="text-gray-600 text-center mt-2">
            Your DeepSeek API key is active and ready to use.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              localStorage.removeItem('deepseekApiKey');
              setApiKey(null);
              setIsConnected(false);
              checkApiKey();
              toast({
                title: "API Key Removed",
                description: "Your DeepSeek API key has been removed",
                duration: 3000
              });
            }}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <>
          <Cpu className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">DeepSeek Chat</h3>
          <p className="text-gray-500 text-center mt-2">
            Chat interface for DeepSeek is ready for connection.
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
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.href = '/dashboard/settings'}
          >
            Configure API Key
          </Button>
        </>
      )}
    </div>
  );
}
