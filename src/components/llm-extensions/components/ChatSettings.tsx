
import React from 'react';
import { Button } from '@/components/ui/button';

interface ChatSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  saveApiKey: () => void;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({
  apiKey,
  setApiKey,
  saveApiKey
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-2">OpenAI API Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-700 block mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your OpenAI API key"
          />
        </div>
        <Button onClick={saveApiKey} size="sm">Save Settings</Button>
      </div>
    </div>
  );
};
