
import React, { useEffect, useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchAdminApiKey } from '@/components/chat/services/utils/apiHelpers';

export function OpenAIChat() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [adminApiKey, setAdminApiKey] = useState<string | null>(null);
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
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkApiKey = async () => {
    setIsChecking(true);
    try {
      // First check for user's personal key in localStorage
      const storedKey = localStorage.getItem('openaiApiKey');
      console.log('Checking OpenAI API key:', storedKey ? `Key exists (${storedKey.length} chars)` : 'No key found');
      
      setApiKey(storedKey);
      
      if (storedKey && storedKey.length > 10) {
        setIsConnected(true);
        broadcastStatus('connected');
        setIsChecking(false);
        return;
      }
      
      // If no personal key, check for admin key
      console.log('No personal OpenAI key found, checking for admin key...');
      const adminKey = await fetchAdminApiKey('openai');
      
      setAdminApiKey(adminKey);
      
      if (adminKey) {
        console.log('Found admin OpenAI key');
        setIsConnected(true);
        broadcastStatus('connected');
      } else {
        console.log('No admin OpenAI key found');
        setIsConnected(false);
        broadcastStatus('disconnected');
      }
    } catch (error) {
      console.error('Error checking OpenAI API key:', error);
      setIsConnected(false);
      broadcastStatus('disconnected');
    } finally {
      setIsChecking(false);
    }
  };

  const broadcastStatus = (status: 'connected' | 'disconnected') => {
    window.dispatchEvent(new CustomEvent('connection-status-changed', {
      detail: { provider: 'openai', status }
    }));
  };

  const verifyConnection = async () => {
    setIsChecking(true);
    try {
      // First check the locally stored key
      const keyToUse = apiKey || adminApiKey;
      
      if (!keyToUse) {
        toast({
          title: "No API Key Available",
          description: "No OpenAI API key found. Please configure one in settings.",
          variant: "destructive",
          duration: 5000
        });
        setIsConnected(false);
        broadcastStatus('disconnected');
        setIsChecking(false);
        return;
      }
      
      const keyLength = keyToUse.length;
      console.log(`Verifying OpenAI connection with API key length: ${keyLength}`);
      
      // Make an actual API call to verify the connection
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${keyToUse}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setIsConnected(true);
          broadcastStatus('connected');
          toast({
            title: "Connection Successful",
            description: "Successfully connected to OpenAI API",
            duration: 3000
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }
      } catch (error) {
        console.error("API verification error:", error);
        setIsConnected(false);
        broadcastStatus('disconnected');
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect to OpenAI API",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error("Error connecting to OpenAI API:", error);
      setIsConnected(false);
      broadcastStatus('disconnected');
      toast({
        title: "Connection Failed",
        description: "Failed to connect to OpenAI API. Please check your API key.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      {isChecking ? (
        // Loading state
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Checking connection...</h3>
          <p className="text-gray-500 text-center mt-2">
            Verifying API key availability...
          </p>
        </div>
      ) : isConnected ? (
        // Connected state
        <>
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <Sparkles className="h-16 w-16 text-green-300" />
          </div>
          <h3 className="text-lg font-medium text-green-700">OpenAI Connected</h3>
          <p className="text-gray-600 text-center mt-2">
            {apiKey ? 'Your personal OpenAI API key is active.' : 'Using administrator-provided OpenAI API key.'}
          </p>
          {apiKey && (
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                localStorage.removeItem('openaiApiKey');
                setApiKey(null);
                checkApiKey();
                toast({
                  title: "API Key Removed",
                  description: "Your OpenAI API key has been removed. Using admin key if available.",
                  duration: 3000
                });
              }}
            >
              Remove Personal Key
            </Button>
          )}
        </>
      ) : (
        // Disconnected state
        <>
          <Sparkles className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">OpenAI Chat</h3>
          <p className="text-gray-500 text-center mt-2">
            No OpenAI API key is currently available.
          </p>
          <div className="flex items-center mt-4">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
            <p className="text-xs text-amber-600">
              API key required for connection
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard/settings'}
            >
              Configure API Key
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={verifyConnection}
            >
              Retry Connection
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
