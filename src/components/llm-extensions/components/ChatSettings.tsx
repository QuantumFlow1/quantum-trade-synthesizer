
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ChatSettingsProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  saveApiKey: (key: string) => void;
  type: 'openai' | 'claude' | 'grok' | 'deepseek' | 'ollama';
}

export function ChatSettings({ 
  apiKey, 
  setApiKey, 
  saveApiKey,
  type 
}: ChatSettingsProps) {
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSave = () => {
    saveApiKey(tempApiKey);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {type === 'openai' && 'OpenAI Settings'}
          {type === 'claude' && 'Claude Settings'}
          {type === 'grok' && 'Grok Settings'}
          {type === 'deepseek' && 'DeepSeek Settings'}
          {type === 'ollama' && 'Ollama Settings'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder={`Enter your ${type} API key`}
            />
            {type === 'openai' && (
              <p className="text-xs text-muted-foreground">
                You can get your API key from the OpenAI dashboard.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={!tempApiKey.trim()}>
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
