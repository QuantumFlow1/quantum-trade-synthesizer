
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Key, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClaudeSettingsProps {
  apiKey: string;
  useMCP?: boolean;
  setApiKey: (key: string) => void;
  toggleMCP?: (enabled: boolean) => void;
  onClose: () => void;
}

export function ClaudeSettings({ apiKey, useMCP = false, setApiKey, toggleMCP, onClose }: ClaudeSettingsProps) {
  const [newApiKey, setNewApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(newApiKey);
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Claude Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="claude-api-key" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Key
          </Label>
          
          <Alert variant="warning" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Your API key is stored locally and is never sent to our servers. It's only used for direct communication with Claude.
            </AlertDescription>
          </Alert>
          
          <Input
            id="claude-api-key"
            value={newApiKey}
            onChange={(e) => setNewApiKey(e.target.value)}
            placeholder="sk-ant-xxxxx"
            type="password"
            className="font-mono"
          />
          
          <div className="text-xs text-muted-foreground mt-1">
            Enter your Claude API key. If you don't have one, get it from{' '}
            <a 
              href="https://console.anthropic.com/settings/keys" 
              target="_blank" 
              rel="noreferrer"
              className="text-primary underline"
            >
              Anthropic Console
            </a>.
          </div>
        </div>

        {toggleMCP && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-mcp" className="text-sm cursor-pointer">
                Use Model Control Protocol (MCP)
              </Label>
              <Switch
                id="use-mcp"
                checked={useMCP}
                onCheckedChange={toggleMCP}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enables advanced control over Claude's responses using Anthropic's Model Control Protocol.
              This provides better control over output format and tool usage.
            </p>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">Save API Key</Button>
      </div>
    </div>
  );
}
