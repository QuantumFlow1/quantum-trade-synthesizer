
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

interface ClaudeSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onClose: () => void;
}

export function ClaudeSettings({ apiKey, setApiKey, onClose }: ClaudeSettingsProps) {
  const [inputKey, setInputKey] = useState(apiKey);

  // Make sure component shows the current API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('claudeApiKey');
    if (savedKey && !inputKey) {
      setInputKey(savedKey);
    }
  }, [inputKey]);

  const saveSettings = () => {
    if (!inputKey.trim()) {
      toast({
        title: "API key required",
        description: "Please enter your Claude API key",
        variant: "destructive",
      });
      return;
    }

    console.log('Saving Claude API key');
    setApiKey(inputKey);
    localStorage.setItem('claudeApiKey', inputKey);
    
    toast({
      title: "Settings saved",
      description: "Your Claude API key has been saved",
      duration: 3000,
    });
    
    onClose();
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Claude API Settings</h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter your Claude API key to use the Claude assistant. You can get an API key from 
          <a 
            href="https://claude.ai/console" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:underline ml-1"
          >
            Claude Console
          </a>.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="claude-api-key">Claude API Key</Label>
        <Input
          id="claude-api-key"
          type="password"
          placeholder="Enter your Claude API key"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={saveSettings}
          className="bg-green-600 hover:bg-green-700"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
