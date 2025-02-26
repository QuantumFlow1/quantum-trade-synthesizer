
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface GrokSettingsProps {
  onClose: () => void;
}

export function GrokSettings({ onClose }: GrokSettingsProps) {
  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem('grokApiKey');
    return savedApiKey || '';
  });

  const saveSettings = () => {
    localStorage.setItem('grokApiKey', apiKey);
    onClose();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-2">Grok API Settings</h3>
      <div className="space-y-4">
        <Alert variant="info" className="mb-3">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Grok API integration is coming soon. Check back later for updates.
          </AlertDescription>
        </Alert>
        
        <div>
          <label className="text-sm text-gray-700 block mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your Grok API key"
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
