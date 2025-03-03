
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Check, Key, X, ExternalLink, RefreshCw, AlertTriangle, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validateApiKey } from '@/components/chat/api-keys/apiKeyUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DeepSeekSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onClose: () => void;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected' | 'error';
  lastChecked?: Date | null;
  onRetryConnection?: () => Promise<void>;
}

export function DeepSeekSettings({ 
  apiKey, 
  setApiKey, 
  onClose, 
  connectionStatus = 'disconnected',
  lastChecked = null,
  onRetryConnection 
}: DeepSeekSettingsProps) {
  const [key, setKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [keyExists, setKeyExists] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Load saved API key on component mount if not provided in props
  useEffect(() => {
    if (!apiKey) {
      const savedKey = localStorage.getItem('deepseekApiKey');
      if (savedKey) {
        setKey(savedKey);
        setApiKey(savedKey); // Update parent component with saved key
        setKeyExists(true);
      }
    } else {
      setKey(apiKey);
      setKeyExists(!!apiKey);
    }
  }, [apiKey, setApiKey]);
  
  const handleSave = () => {
    // Validate the API key
    if (!validateApiKey(key, 'deepseek')) {
      return;
    }
    
    // Save API key to localStorage
    localStorage.setItem('deepseekApiKey', key);
    
    // Update parent component
    setApiKey(key);
    setKeyExists(!!key);
    
    // Show saved animation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    toast({
      title: "API key saved",
      description: "Your DeepSeek API key has been saved. The connection will be tested automatically.",
      duration: 3000,
    });

    // Trigger retry connection if available
    if (onRetryConnection) {
      handleRetryConnection();
    }
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('apikey-updated'));
  };
  
  const clearApiKey = () => {
    localStorage.removeItem('deepseekApiKey');
    setKey('');
    setApiKey('');
    setKeyExists(false);
    
    toast({
      title: "API key removed",
      description: "Your DeepSeek API key has been removed.",
      duration: 3000,
    });
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('apikey-updated'));
  };

  const handleRetryConnection = async () => {
    if (onRetryConnection) {
      setIsRetrying(true);
      try {
        await onRetryConnection();
        toast({
          title: "Connection check complete",
          description: "Connection to DeepSeek has been verified.",
        });
      } catch (error) {
        console.error("Failed to retry connection:", error);
        toast({
          title: "Connection failed",
          description: "Could not connect to DeepSeek. Please check your API key and try again.",
          variant: "destructive"
        });
      } finally {
        setIsRetrying(false);
      }
    }
  };

  const getConnectionStatusDetails = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <Shield className="h-4 w-4 text-green-600" />,
          message: "Connected to DeepSeek API",
          color: "bg-green-50 border-green-200 text-green-700"
        };
      case 'connecting':
        return {
          icon: <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />,
          message: "Connecting to DeepSeek API...",
          color: "bg-yellow-50 border-yellow-200 text-yellow-700"
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
          message: "Connection error. Please check your API key.",
          color: "bg-red-50 border-red-200 text-red-700"
        };
      default:
        return {
          icon: <Key className="h-4 w-4 text-gray-600" />,
          message: "API key required to connect",
          color: "bg-gray-50 border-gray-200 text-gray-700"
        };
    }
  };
  
  const statusDetails = getConnectionStatusDetails();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">DeepSeek Settings</h3>
      
      {/* Connection Status */}
      <div className={`p-3 rounded-md border flex items-center justify-between ${statusDetails.color}`}>
        <div className="flex items-center space-x-2">
          {statusDetails.icon}
          <p className="text-sm">{statusDetails.message}</p>
        </div>
        {connectionStatus !== 'connected' && onRetryConnection && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRetryConnection} 
            disabled={isRetrying || !keyExists}
            className="text-blue-600 hover:text-blue-800"
          >
            {isRetrying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-1">{isRetrying ? 'Checking...' : 'Retry'}</span>
          </Button>
        )}
      </div>

      {/* Last Checked */}
      {lastChecked && (
        <p className="text-xs text-muted-foreground">
          Last connection check: {lastChecked.toLocaleString()}
        </p>
      )}
      
      {/* API Key Status */}
      {keyExists && (
        <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700">API key is configured</p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearApiKey} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
      
      {/* API Key Input */}
      <div className="space-y-2">
        <Label htmlFor="deepseek-api-key">DeepSeek API Key</Label>
        <Input
          id="deepseek-api-key"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your DeepSeek API key"
        />
        <p className="text-xs text-muted-foreground">
          Your API key is stored securely in your browser's local storage.
        </p>
      </div>
      
      {/* Buttons */}
      <div className="flex space-x-2">
        <Button onClick={handleSave} className="flex-1">
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Key
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
      
      {/* Information */}
      <div className="text-sm text-muted-foreground space-y-2">
        <p>DeepSeek is specialized in code generation and technical assistance.</p>
        <p className="flex items-center">
          You can get an API key from the 
          <a 
            href="https://platform.deepseek.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline flex items-center ml-1"
          >
            DeepSeek Platform
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
}
