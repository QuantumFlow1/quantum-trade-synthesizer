
import { Bot, XCircle, Check } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatus {
  deepseek: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  openai: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  grok: 'connected' | 'disconnected' | 'unavailable' | 'checking';
  claude: 'connected' | 'disconnected' | 'unavailable' | 'checking';
}

interface LLMTabsListProps {
  enabledLLMs: Record<string, boolean>;
  toggleLLM: (llm: string, enabled: boolean) => void;
  connectionStatus: ConnectionStatus;
}

export function LLMTabsList({ enabledLLMs, toggleLLM, connectionStatus }: LLMTabsListProps) {
  const getStatusBadge = (status: 'connected' | 'disconnected' | 'unavailable' | 'checking') => {
    switch (status) {
      case 'connected':
        return <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" /> Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">No API Key</Badge>;
      case 'unavailable':
        return <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Unavailable</Badge>;
      case 'checking':
        return <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">Checking...</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center">
          <Bot className="h-4 w-4 mr-2" />
          Available LLM Extensions
        </h3>
        <Popover>
          <PopoverTrigger className="text-xs text-blue-600 hover:underline">
            About these extensions
          </PopoverTrigger>
          <PopoverContent className="text-sm p-4 max-w-xs">
            <p>These LLM extensions allow you to integrate with various AI models. Each has its own capabilities and API requirements.</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>Toggle any extension ON to use it</li>
              <li>Each may require an API key to be set in settings</li>
              <li>Click on a tab to view and interact with that model</li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="deepseek" className="relative">
          DeepSeek
          {getStatusBadge(connectionStatus.deepseek)}
        </TabsTrigger>
        <TabsTrigger value="openai" className="relative">
          OpenAI
          {getStatusBadge(connectionStatus.openai)}
        </TabsTrigger>
        <TabsTrigger value="grok" className="relative">
          Grok
          {getStatusBadge(connectionStatus.grok)}
        </TabsTrigger>
        <TabsTrigger value="claude" className="relative">
          Claude
          {getStatusBadge(connectionStatus.claude)}
        </TabsTrigger>
      </TabsList>
      
      <div className="flex flex-wrap gap-4 justify-between pt-1">
        <div className="flex items-center space-x-2">
          <Switch 
            id="deepseek-toggle" 
            checked={enabledLLMs.deepseek}
            onCheckedChange={(checked) => toggleLLM('deepseek', checked)}
          />
          <Label htmlFor="deepseek-toggle">DeepSeek</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="openai-toggle" 
            checked={enabledLLMs.openai}
            onCheckedChange={(checked) => toggleLLM('openai', checked)}
          />
          <Label htmlFor="openai-toggle">OpenAI</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="grok-toggle" 
            checked={enabledLLMs.grok}
            onCheckedChange={(checked) => toggleLLM('grok', checked)}
          />
          <Label htmlFor="grok-toggle">Grok</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="claude-toggle" 
            checked={enabledLLMs.claude}
            onCheckedChange={(checked) => toggleLLM('claude', checked)}
          />
          <Label htmlFor="claude-toggle">Claude</Label>
        </div>
      </div>
    </div>
  );
}
