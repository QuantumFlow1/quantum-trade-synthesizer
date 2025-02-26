
import { useState } from 'react';
import { ApiKeySettings, ModelInfo } from './types/GrokSettings';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApiKeys } from './api-keys/hooks/useApiKeys';
import { ApiKeyDialog } from './api-keys/components/ApiKeyDialog';

interface ApiKeyManagerProps {
  selectedModel: ModelInfo | undefined;
  apiKeys: ApiKeySettings;
  onApiKeysChange: (apiKeys: ApiKeySettings) => void;
}

export function ApiKeyManager({ selectedModel, apiKeys, onApiKeysChange }: ApiKeyManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    openaiKey,
    setOpenaiKey,
    claudeKey,
    setClaudeKey,
    geminiKey,
    setGeminiKey,
    deepseekKey,
    setDeepseekKey,
    saved,
    handleSave
  } = useApiKeys(apiKeys, onApiKeysChange);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setOpenaiKey(apiKeys.openaiApiKey || '');
      setClaudeKey(apiKeys.claudeApiKey || '');
      setGeminiKey(apiKeys.geminiApiKey || '');
      setDeepseekKey(apiKeys.deepseekApiKey || '');
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 text-xs"
          >
            <Key className="h-3.5 w-3.5 mr-1" />
            API Sleutels
          </Button>
        </DialogTrigger>
        <ApiKeyDialog
          openaiKey={openaiKey}
          setOpenaiKey={setOpenaiKey}
          claudeKey={claudeKey}
          setClaudeKey={setClaudeKey}
          geminiKey={geminiKey}
          setGeminiKey={setGeminiKey}
          deepseekKey={deepseekKey}
          setDeepseekKey={setDeepseekKey}
          saved={saved}
          onSave={handleSave}
        />
      </Dialog>
    </div>
  );
}
