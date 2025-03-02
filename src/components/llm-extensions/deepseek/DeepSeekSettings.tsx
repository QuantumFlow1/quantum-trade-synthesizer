
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validateApiKey } from '@/components/chat/api-keys/apiKeyUtils';

interface DeepSeekSettingsProps {
  onClose: () => void;
}

export function DeepSeekSettings({ onClose }: DeepSeekSettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  
  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  const handleSave = () => {
    // Validate the API key
    if (!validateApiKey(apiKey, 'deepseek')) {
      return;
    }
    
    // Save API key to localStorage
    localStorage.setItem('deepseekApiKey', apiKey);
    
    // Show saved animation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    // Show toast notification
    toast({
      title: "API Key Saved",
      description: "Your DeepSeek API key has been saved.",
      variant: "default"
    });
    
    // Trigger an event to notify other components
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
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
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
        <p>DeepSeek offers powerful code-focused AI models.</p>
        <p>You can get an API key by signing up on the DeepSeek website.</p>
      </div>
    </div>
  );
}
