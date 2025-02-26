
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ClaudeSettingsProps {
  onClose: () => void;
}

export function ClaudeSettings({ onClose }: ClaudeSettingsProps) {
  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem('claudeApiKey');
    return savedApiKey || '';
  });

  const saveSettings = () => {
    localStorage.setItem('claudeApiKey', apiKey);
    onClose();
    
    // Show success message
    console.log("Claude API key saved");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-2">Claude API Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 block mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your Claude API key"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline" size="sm">
            Cancel
          </Button>
          <Button onClick={saveSettings} size="sm">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
