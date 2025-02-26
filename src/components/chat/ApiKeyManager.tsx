
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ApiKeySettings, ModelInfo } from './types/GrokSettings';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Save, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApiKeyManagerProps {
  selectedModel: ModelInfo | undefined;
  apiKeys: ApiKeySettings;
  onApiKeysChange: (apiKeys: ApiKeySettings) => void;
}

export function ApiKeyManager({ selectedModel, apiKeys, onApiKeysChange }: ApiKeyManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openaiApiKey || '');
  const [claudeKey, setClaudeKey] = useState(apiKeys.claudeApiKey || '');
  const [geminiKey, setGeminiKey] = useState(apiKeys.geminiApiKey || '');
  const [deepseekKey, setDeepseekKey] = useState(apiKeys.deepseekApiKey || '');
  const [saved, setSaved] = useState(false);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const loadApiKeys = () => {
      const savedOpenAIKey = localStorage.getItem('openaiApiKey');
      const savedClaudeKey = localStorage.getItem('claudeApiKey');
      const savedGeminiKey = localStorage.getItem('geminiApiKey');
      const savedDeepseekKey = localStorage.getItem('deepseekApiKey');
      
      console.log('Loading API keys from localStorage:', {
        openai: savedOpenAIKey ? 'present' : 'not found',
        claude: savedClaudeKey ? 'present' : 'not found',
        gemini: savedGeminiKey ? 'present' : 'not found',
        deepseek: savedDeepseekKey ? 'present' : 'not found'
      });
      
      // Only update if keys exist in localStorage
      const keysToUpdate: ApiKeySettings = { ...apiKeys };
      
      if (savedOpenAIKey) keysToUpdate.openaiApiKey = savedOpenAIKey;
      if (savedClaudeKey) keysToUpdate.claudeApiKey = savedClaudeKey;
      if (savedGeminiKey) keysToUpdate.geminiApiKey = savedGeminiKey;
      if (savedDeepseekKey) keysToUpdate.deepseekApiKey = savedDeepseekKey;
      
      // Update state and parent component
      setOpenaiKey(keysToUpdate.openaiApiKey || '');
      setClaudeKey(keysToUpdate.claudeApiKey || '');
      setGeminiKey(keysToUpdate.geminiApiKey || '');
      setDeepseekKey(keysToUpdate.deepseekApiKey || '');
      onApiKeysChange(keysToUpdate);
    };
    
    loadApiKeys();
  }, []);

  const handleSave = () => {
    // Validate keys (simple validation - checking if not empty and proper format)
    const validateKey = (key: string, type: string): boolean => {
      if (!key) return true; // Empty key is valid (just not set)
      
      // Check if key has proper format based on provider
      if (type === 'openai' && !key.startsWith('sk-')) {
        toast({
          title: "Invalid OpenAI API Key",
          description: "OpenAI API keys should start with 'sk-'",
          variant: "destructive"
        });
        return false;
      }
      
      if (type === 'claude' && !key.startsWith('sk-ant-')) {
        toast({
          title: "Invalid Claude API Key",
          description: "Claude API keys should start with 'sk-ant-'",
          variant: "destructive"
        });
        return false;
      }
      
      if (type === 'gemini' && !key.startsWith('AIza')) {
        toast({
          title: "Invalid Gemini API Key",
          description: "Gemini API keys typically start with 'AIza'",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    };
    
    // Validate all keys
    if (!validateKey(openaiKey, 'openai') ||
        !validateKey(claudeKey, 'claude') ||
        !validateKey(geminiKey, 'gemini')) {
      return;
    }
    
    const updatedKeys: ApiKeySettings = {
      openaiApiKey: openaiKey.trim(),
      claudeApiKey: claudeKey.trim(),
      geminiApiKey: geminiKey.trim(),
      deepseekApiKey: deepseekKey.trim()
    };
    
    // Save to localStorage
    if (updatedKeys.openaiApiKey) localStorage.setItem('openaiApiKey', updatedKeys.openaiApiKey);
    if (updatedKeys.claudeApiKey) localStorage.setItem('claudeApiKey', updatedKeys.claudeApiKey);
    if (updatedKeys.geminiApiKey) localStorage.setItem('geminiApiKey', updatedKeys.geminiApiKey);
    if (updatedKeys.deepseekApiKey) localStorage.setItem('deepseekApiKey', updatedKeys.deepseekApiKey);
    
    console.log('Saved API keys to localStorage:', {
      openai: updatedKeys.openaiApiKey ? 'present' : 'not set',
      claude: updatedKeys.claudeApiKey ? 'present' : 'not set',
      gemini: updatedKeys.geminiApiKey ? 'present' : 'not set',
      deepseek: updatedKeys.deepseekApiKey ? 'present' : 'not set'
    });
    
    onApiKeysChange(updatedKeys);
    setSaved(true);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully",
      variant: "default"
    });
    
    // Reset saved status after 2 seconds
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form values if dialog is closed without saving
      setOpenaiKey(apiKeys.openaiApiKey || '');
      setClaudeKey(apiKeys.claudeApiKey || '');
      setGeminiKey(apiKeys.geminiApiKey || '');
      setDeepseekKey(apiKeys.deepseekApiKey || '');
    }
  };

  // Check if the current model needs an API key
  const currentModelNeedsKey = selectedModel?.needsApiKey || false;
  
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
      {currentModelNeedsKey && !hasCurrentModelKey() && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
          <p className="flex items-center">
            <Key className="h-4 w-4 mr-2" />
            Dit model heeft een API-sleutel nodig om te functioneren. Klik op 'API Sleutels' om deze in te stellen.
          </p>
        </div>
      )}
      
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>API Sleutels Beheren</DialogTitle>
            <DialogDescription>
              Voer uw API sleutels in voor de verschillende AI-modellen. Deze worden veilig opgeslagen in uw browser.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OpenAI API Sleutel</label>
              <Input 
                type="password" 
                value={openaiKey} 
                onChange={e => setOpenaiKey(e.target.value)} 
                placeholder="sk-..." 
              />
              <p className="text-xs text-gray-500">Vereist voor GPT-4o</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Claude API Sleutel</label>
              <Input 
                type="password" 
                value={claudeKey} 
                onChange={e => setClaudeKey(e.target.value)} 
                placeholder="sk-ant-..." 
              />
              <p className="text-xs text-gray-500">Vereist voor Claude 3</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Gemini API Sleutel</label>
              <Input 
                type="password" 
                value={geminiKey} 
                onChange={e => setGeminiKey(e.target.value)} 
                placeholder="AIzaSy..." 
              />
              <p className="text-xs text-gray-500">Vereist voor Gemini Pro</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">DeepSeek API Sleutel</label>
              <Input 
                type="password" 
                value={deepseekKey} 
                onChange={e => setDeepseekKey(e.target.value)} 
                placeholder="sk-..." 
              />
              <p className="text-xs text-gray-500">Vereist voor DeepSeek Coder</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSave} className="w-full">
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Opgeslagen!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sleutels Opslaan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
