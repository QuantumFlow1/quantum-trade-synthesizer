
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Key, AlertCircle, RefreshCw, Loader2, CheckCircle, XCircle, Info, PenLine } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClaudeSettingsProps {
  apiKey: string;
  useMCP?: boolean;
  systemPrompt?: string;
  setApiKey: (key: string) => void;
  toggleMCP?: (enabled: boolean) => void;
  updateSystemPrompt?: (prompt: string) => void;
  onClose: () => void;
}

export function ClaudeSettings({ 
  apiKey, 
  useMCP = false, 
  systemPrompt = "You are Claude, a helpful and harmless AI assistant.",
  setApiKey, 
  toggleMCP, 
  updateSystemPrompt,
  onClose 
}: ClaudeSettingsProps) {
  const [newApiKey, setNewApiKey] = useState(apiKey);
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unchecked' | 'connected' | 'disconnected'>('unchecked');
  const [mcpSupported, setMcpSupported] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<string>("api");
  const [newSystemPrompt, setNewSystemPrompt] = useState(systemPrompt);

  useEffect(() => {
    // Check connection status when component mounts or API key changes
    if (apiKey) {
      checkConnection();
    }
  }, [apiKey]);

  const checkConnection = async () => {
    if (!apiKey) {
      setConnectionStatus('disconnected');
      return;
    }

    setIsChecking(true);
    try {
      const response = await supabase.functions.invoke('claude-ping', {
        body: { 
          apiKey,
          checkMCP: useMCP
        }
      });

      if (response.error) {
        console.error('Error checking Claude connection:', response.error);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: `Error checking Claude API: ${response.error.message}`,
          variant: "destructive"
        });
      } else if (response.data?.status === 'available') {
        setConnectionStatus('connected');
        setMcpSupported(response.data?.mcpSupported || false);
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Claude API",
          duration: 3000
        });
      } else {
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Failed",
          description: response.data?.message || "Could not connect to Claude API",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Exception checking Claude connection:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    setApiKey(newApiKey);
    // After saving, check the connection again
    setTimeout(() => checkConnection(), 500);
  };

  const handleSaveSystemPrompt = () => {
    if (updateSystemPrompt) {
      updateSystemPrompt(newSystemPrompt);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Claude Settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="api">API Key</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-4 mt-4">
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

          <div className="flex justify-between">
            <Button onClick={handleSave} className="flex-1 mr-2">Save API Key</Button>
            <Button 
              variant="outline" 
              onClick={checkConnection}
              disabled={isChecking || !apiKey}
              className="whitespace-nowrap"
            >
              {isChecking ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-2" /> Test Connection</>
              )}
            </Button>
          </div>

          {/* Connection Status Display */}
          {connectionStatus !== 'unchecked' && (
            <div className="text-sm flex items-center mt-2">
              {connectionStatus === 'connected' ? (
                <><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Connected to Claude API</>
              ) : (
                <><XCircle className="h-4 w-4 mr-2 text-red-500" /> Not connected to Claude API</>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-4">
          {toggleMCP && (
            <div className="bg-secondary/30 p-3 rounded-md border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="use-mcp" className="text-sm cursor-pointer font-medium flex items-center">
                    <span>Use Model Control Protocol (MCP)</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-80">
                          <p>MCP (Model Control Protocol) provides more precise control over Claude's outputs, including:</p>
                          <ul className="list-disc pl-4 mt-1 text-xs">
                            <li>Structured JSON responses</li>
                            <li>Better tool usage for external data</li>
                            <li>More consistent formatting</li>
                          </ul>
                          <p className="text-xs mt-1">Learn more at <a href="https://github.com/modelcontextprotocol" className="underline" target="_blank" rel="noreferrer">MCP GitHub</a></p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enables advanced control over Claude's responses using Anthropic's Model Control Protocol.
                    This provides better control over output format and tool usage.
                  </p>
                </div>
                <Switch
                  id="use-mcp"
                  checked={useMCP}
                  onCheckedChange={toggleMCP}
                />
              </div>
              
              {mcpSupported !== null && (
                <div className="mt-2 text-xs">
                  {mcpSupported ? (
                    <div className="text-green-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> MCP is supported with your current API key
                    </div>
                  ) : connectionStatus === 'connected' ? (
                    <div className="text-amber-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> MCP support was not detected with your API key
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {updateSystemPrompt && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="system-prompt" className="flex items-center gap-2">
                <PenLine className="h-4 w-4" />
                System Prompt
              </Label>
              
              <Textarea
                id="system-prompt"
                value={newSystemPrompt}
                onChange={(e) => setNewSystemPrompt(e.target.value)}
                placeholder="You are Claude, a helpful and harmless AI assistant..."
                rows={6}
                className="font-mono text-sm"
              />
              
              <div className="text-xs text-muted-foreground">
                Customize Claude's behavior by setting a system prompt that defines its persona and capabilities.
                This is most effective when using MCP.
              </div>
              
              <Button onClick={handleSaveSystemPrompt} size="sm" className="mt-2">
                Save System Prompt
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
