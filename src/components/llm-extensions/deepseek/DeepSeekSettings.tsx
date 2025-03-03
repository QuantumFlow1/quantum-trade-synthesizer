
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validateApiKey } from '@/components/chat/api-keys/apiKeyUtils';

interface DeepSeekSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onClose: () => void;
}

export function DeepSeekSettings({ apiKey, setApiKey, onClose }: DeepSeekSettingsProps) {
  const [key, setKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  
  // Load saved API key on component mount if not provided in props
  useEffect(() => {
    if (!apiKey) {
      const savedKey = localStorage.getItem('deepseekApiKey');
      if (savedKey) {
        setKey(savedKey);
        setApiKey(savedKey); // Update parent component with saved key
      }
    } else {
      setKey(apiKey);
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
    
    // Show saved animation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    toast({
      title: "API key saved",
      description: "Your DeepSeek API key has been saved.",
      duration: 3000,
    });
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('apikey-updated'));
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">DeepSeek Settings</h3>
      
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
      
      <div className="text-sm text-muted-foreground">
        <p>DeepSeek is specialized in code generation and technical assistance.</p>
        <p>You can get an API key from the <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">DeepSeek Platform</a>.</p>
      </div>
    </div>
  );
}
