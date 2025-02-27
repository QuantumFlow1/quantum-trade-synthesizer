
import React from 'react';
import { Button } from '@/components/ui/button';
import { Key, RefreshCw } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ApiKeyManagerProps } from './types';
import { useApiKeyManager } from './useApiKeyManager';
import { ApiKeyForm } from './ApiKeyForm';
import { AdminKeyRefresh } from './AdminKeyRefresh';
import { KeyRequirement } from './KeyRequirement';

export function ApiKeyManager({ selectedModel, apiKeys, onApiKeysChange }: ApiKeyManagerProps) {
  const {
    isOpen,
    formData,
    saved,
    isLoading,
    hasAccess,
    setIsOpen,
    handleOpenChange,
    handleInputChange,
    handleSave,
    handleRefreshAdminKeys
  } = useApiKeyManager(apiKeys, onApiKeysChange);

  // Check if the current model has an API key set
  const hasCurrentModelKey = () => {
    if (!selectedModel) return false;
    
    switch (selectedModel.id) {
      case 'openai':
      case 'gpt-4':
      case 'gpt-3.5-turbo':
        return !!apiKeys.openaiApiKey;
      case 'claude':
      case 'claude-3-haiku':
      case 'claude-3-sonnet':
      case 'claude-3-opus':
        return !!apiKeys.claudeApiKey;
      case 'gemini':
      case 'gemini-pro':
        return !!apiKeys.geminiApiKey;
      case 'deepseek':
      case 'deepseek-chat':
        return !!apiKeys.deepseekApiKey;
      default:
        return true;
    }
  };

  return (
    <div>
      <KeyRequirement 
        selectedModel={selectedModel} 
        hasCurrentModelKey={hasCurrentModelKey()}
      />
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4 text-xs"
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <Key className="h-3.5 w-3.5 mr-1" />
            )}
            API Sleutels
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>API Sleutels Beheren</DialogTitle>
            <DialogDescription>
              {hasAccess 
                ? "Je kunt je eigen API sleutels invoeren of de sleutels van de beheerder gebruiken."
                : "Voer uw API sleutels in voor de verschillende AI-modellen. Deze worden veilig opgeslagen in uw browser."}
            </DialogDescription>
          </DialogHeader>
          
          <AdminKeyRefresh 
            hasAccess={hasAccess} 
            isLoading={isLoading}
            onRefresh={handleRefreshAdminKeys}
          />
          
          <ApiKeyForm
            formData={formData}
            saved={saved}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
