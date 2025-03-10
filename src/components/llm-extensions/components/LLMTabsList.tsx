
import { Bot, XCircle, Check, Sparkles, MessageSquare, Brain, Cpu, Settings, Loader2 } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  activeTab: string;
  checkConnectionStatusForLLM: (llm: keyof ConnectionStatus) => void;
}

export function LLMTabsList({ 
  enabledLLMs, 
  toggleLLM, 
  connectionStatus, 
  activeTab,
  checkConnectionStatusForLLM 
}: LLMTabsListProps) {
  const getStatusBadge = (status: 'connected' | 'disconnected' | 'unavailable' | 'checking') => {
    switch (status) {
      case 'connected':
        return <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200"><Check className="h-3 w-3 mr-1" /> Connected</Badge>;
      case 'disconnected':
        return <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">No API Key</Badge>;
      case 'unavailable':
        return <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Unavailable</Badge>;
      case 'checking':
        return <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Checking...</Badge>;
      default:
        return null;
    }
  };

  // Get the icon for each LLM
  const getLLMIcon = (llm: string, className: string = "h-5 w-5 mr-2") => {
    switch (llm) {
      case 'deepseek':
        return <Cpu className={className} />;
      case 'openai':
        return <Sparkles className={className} />;
      case 'grok':
        return <Brain className={className} />;
      case 'claude':
        return <MessageSquare className={className} />;
      default:
        return <Bot className={className} />;
    }
  };

  // Format LLM name for display
  const formatLLMName = (llm: string) => {
    switch (llm) {
      case 'deepseek':
        return 'DeepSeek';
      case 'openai':
        return 'OpenAI';
      case 'grok':
        return 'Grok';
      case 'claude':
        return 'Claude';
      default:
        return llm;
    }
  };

  // Handle retry connection button click
  const handleRetryConnection = (llm: keyof ConnectionStatus) => {
    checkConnectionStatusForLLM(llm);
  };

  return (
    <div className="mb-4 flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center text-gray-900 dark:text-white">
          <Bot className="h-4 w-4 mr-2" />
          Available LLM Extensions
        </h3>
        <Popover>
          <PopoverTrigger className="text-xs text-blue-600 hover:underline">
            About these extensions
          </PopoverTrigger>
          <PopoverContent className="text-sm p-4 max-w-xs">
            <p className="text-gray-900 dark:text-white">These LLM extensions allow you to integrate with various AI models. Each has its own capabilities and API requirements.</p>
            <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Toggle any extension ON to use it</li>
              <li>Each may require an API key to be set in settings</li>
              <li>Click on a tab to view and interact with that model</li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="deepseek" className="relative flex flex-col items-center justify-center py-3">
          {getLLMIcon('deepseek')}
          <span className="text-gray-900 dark:text-white font-medium">DeepSeek</span>
          <div className="mt-1">{getStatusBadge(connectionStatus.deepseek)}</div>
        </TabsTrigger>
        <TabsTrigger value="openai" className="relative flex flex-col items-center justify-center py-3">
          {getLLMIcon('openai')}
          <span className="text-gray-900 dark:text-white font-medium">OpenAI</span>
          <div className="mt-1">{getStatusBadge(connectionStatus.openai)}</div>
        </TabsTrigger>
        <TabsTrigger value="grok" className="relative flex flex-col items-center justify-center py-3">
          {getLLMIcon('grok')}
          <span className="text-gray-900 dark:text-white font-medium">Grok</span>
          <div className="mt-1">{getStatusBadge(connectionStatus.grok)}</div>
        </TabsTrigger>
        <TabsTrigger value="claude" className="relative flex flex-col items-center justify-center py-3">
          {getLLMIcon('claude')}
          <span className="text-gray-900 dark:text-white font-medium">Claude</span>
          <div className="mt-1">{getStatusBadge(connectionStatus.claude)}</div>
        </TabsTrigger>
      </TabsList>
      
      <div className="flex flex-wrap gap-4 justify-between pt-1">
        {['deepseek', 'openai', 'grok', 'claude'].map((llm) => (
          <div key={llm} className="flex items-center space-x-2">
            <Switch 
              id={`${llm}-toggle`} 
              checked={enabledLLMs[llm]}
              onCheckedChange={(checked) => toggleLLM(llm, checked)}
            />
            <Label htmlFor={`${llm}-toggle`} className="flex items-center text-gray-900 dark:text-white">
              {getLLMIcon(llm, "h-4 w-4 mr-1")}
              {formatLLMName(llm)}
            </Label>
            
            {/* Add API key configuration or retry button */}
            {connectionStatus[llm as keyof ConnectionStatus] === 'disconnected' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 h-6 px-2"
                onClick={() => window.location.href = '/dashboard/settings'}
              >
                <Settings className="h-3 w-3" />
              </Button>
            )}
            
            {connectionStatus[llm as keyof ConnectionStatus] === 'unavailable' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 h-6 px-2"
                onClick={() => handleRetryConnection(llm as keyof ConnectionStatus)}
              >
                <Loader2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
