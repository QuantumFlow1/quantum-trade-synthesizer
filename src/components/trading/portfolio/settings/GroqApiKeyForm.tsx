
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const GroqApiKeyForm: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const { toast } = useToast();

  // Check if API key exists when component mounts
  React.useEffect(() => {
    const checkApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-api-keys', {
          body: { keyType: 'groq' }
        });
        
        if (error) {
          console.error('Error checking API key:', error);
          return;
        }
        
        setHasKey(data?.hasKey || false);
      } catch (error) {
        console.error('Error checking API key:', error);
      }
    };
    
    checkApiKey();
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the Supabase edge function to save the API key
      const { data, error } = await supabase.functions.invoke('save-api-key', {
        body: { 
          keyType: 'groq',
          apiKey: apiKey
        }
      });
      
      if (error) {
        throw error;
      }
      
      setApiKey('');
      setHasKey(true);
      
      toast({
        title: "API Key Saved",
        description: "Your Groq API key has been saved securely.",
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Error Saving API Key",
        description: error instanceof Error ? error.message : "Failed to save API key",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Groq API Configuration</h3>
      </div>
      
      {hasKey ? (
        <Alert>
          <AlertTitle>API Key Configured</AlertTitle>
          <AlertDescription>
            A Groq API key is already saved. You can update it by entering a new key below.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            To use the Groq LLM agent, you need to provide a Groq API key. The key will be stored securely.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="groq-api-key">Groq API Key</Label>
        <Input
          id="groq-api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="gsk_..."
        />
        <p className="text-xs text-muted-foreground">
          The API key will be stored securely and never exposed in the frontend code.
        </p>
      </div>
      
      <Button 
        onClick={handleSaveApiKey} 
        disabled={isLoading || !apiKey.trim()}
        className="w-full"
      >
        {isLoading ? 'Saving...' : hasKey ? 'Update API Key' : 'Save API Key'}
      </Button>
    </div>
  );
};
