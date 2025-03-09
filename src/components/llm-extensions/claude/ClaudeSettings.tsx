
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Save, X, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClaudeSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  onClose: () => void;
}

export function ClaudeSettings({ apiKey, setApiKey, onClose }: ClaudeSettingsProps) {
  const [inputApiKey, setInputApiKey] = useState(apiKey || '');

  const handleSave = () => {
    setApiKey(inputApiKey);
  };

  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Claude Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <Alert variant="outline" className="bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          To use Claude, you need an API key from Anthropic.
          <a 
            href="https://console.anthropic.com/keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline mt-1"
          >
            Get API key <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </AlertDescription>
      </Alert>

      {!inputApiKey && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Claude API key is required to use this chat.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="claude-api-key">Claude API Key</Label>
        <Input
          id="claude-api-key"
          type="password"
          placeholder="sk-ant-xxxxxxxxxxxxxxxx"
          value={inputApiKey}
          onChange={(e) => setInputApiKey(e.target.value)}
          className="font-mono"
        />
        <p className="text-xs text-gray-500">
          Your API key is stored locally in your browser and is never sent to our servers.
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!inputApiKey.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Save API Key
        </Button>
      </div>
    </div>
  );
}
