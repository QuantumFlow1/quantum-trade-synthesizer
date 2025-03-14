
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LLM_LABELS } from '../constants';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface LLMTabsListProps {
  enabledLLMs: Record<string, boolean>;
  toggleLLM: (llm: string, enabled: boolean) => void;
  connectionStatus: Record<string, 'connected' | 'disconnected' | 'unavailable' | 'checking'>;
  activeTab: string;
  checkConnectionStatusForLLM: (llm: string) => void;
}

export function LLMTabsList({
  enabledLLMs,
  toggleLLM,
  connectionStatus,
  activeTab,
  checkConnectionStatusForLLM
}: LLMTabsListProps) {
  return (
    <TabsList className="flex justify-start w-full h-auto p-0 bg-transparent space-x-1 mb-4 border-b">
      {['deepseek', 'openai', 'grok', 'claude', 'ollama'].map((llm) => (
        <div 
          key={llm} 
          className={`relative py-2 px-4 border-b-2 ${
            activeTab === llm 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Switch
              checked={enabledLLMs[llm] || false}
              onCheckedChange={(checked) => toggleLLM(llm, checked)}
              size="sm"
              className="data-[state=checked]:bg-primary"
            />
            <TabsTrigger 
              value={llm} 
              className={`data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 ${
                !enabledLLMs[llm] ? 'opacity-50' : ''
              }`}
              disabled={!enabledLLMs[llm]}
            >
              {LLM_LABELS[llm] || llm.charAt(0).toUpperCase() + llm.slice(1)}
            </TabsTrigger>
            
            {enabledLLMs[llm] && connectionStatus[llm] === 'checking' && (
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
            )}
            
            {enabledLLMs[llm] && connectionStatus[llm] !== 'checking' && (
              <div 
                className={`h-2 w-2 rounded-full ${
                  connectionStatus[llm] === 'connected' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}
                onClick={() => checkConnectionStatusForLLM(llm)}
              />
            )}
          </div>
        </div>
      ))}
    </TabsList>
  );
}
