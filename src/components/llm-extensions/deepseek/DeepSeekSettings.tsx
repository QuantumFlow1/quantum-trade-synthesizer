
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface DeepSeekSettingsProps {
  onClose: () => void;
}

export function DeepSeekSettings({ onClose }: DeepSeekSettingsProps) {
  const [apiKey, setApiKey] = useState('');
  
  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  // Save API key when it changes
  const saveApiKey = () => {
    localStorage.setItem('deepseekApiKey', apiKey);
    onClose();
    toast({
      title: "API key saved",
      description: "Your DeepSeek API key has been saved.",
      duration: 3000,
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-2">DeepSeek API Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 block mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your DeepSeek API key"
          />
        </div>
        <Button onClick={saveApiKey} size="sm">Save Settings</Button>
      </div>
    </div>
  );
}
