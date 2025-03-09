import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Save, Check, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiKeySettings } from '../types/GrokSettings';
import { validateApiKey } from './apiKeyUtils';
import { toast } from '@/hooks/use-toast';

interface ApiKeyDialogContentProps {
  apiKeys?: ApiKeySettings;
  onSave?: (openaiKey: string, claudeKey: string, geminiKey: string, deepseekKey: string, groqKey: string) => void;
  initialTab?: string;
  onClose?: () => void;
}

export function ApiKeyDialogContent({ apiKeys = {}, onSave, initialTab, onClose }: ApiKeyDialogContentProps) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [saved, setSaved] = useState(false);
  
  const groqInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (apiKeys) {
      setOpenaiKey(apiKeys.openaiApiKey || '');
      setClaudeKey(apiKeys.claudeApiKey || '');
      setGeminiKey(apiKeys.geminiApiKey || '');
      setDeepseekKey(apiKeys.deepseekApiKey || '');
      setGroqKey(apiKeys.groqApiKey || '');
    }
  }, [apiKeys]);
  
  useEffect(() => {
    const openKey = localStorage.getItem('openaiApiKey') || '';
    const claudeKey = localStorage.getItem('claudeApiKey') || '';
    const geminiKey = localStorage.getItem('geminiApiKey') || '';
    const deepKey = localStorage.getItem('deepseekApiKey') || '';
    const groqKey = localStorage.getItem('groqApiKey') || '';
    
    if (openKey) setOpenaiKey(openKey);
    if (claudeKey) setClaudeKey(claudeKey);
    if (geminiKey) setGeminiKey(geminiKey);
    if (deepKey) setDeepseekKey(deepKey);
    if (groqKey) setGroqKey(groqKey);
    
    if (initialTab === 'groq') {
      setTimeout(() => {
        if (groqInputRef.current) {
          groqInputRef.current.focus();
          groqInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [initialTab]);

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const text = e.clipboardData.getData('text/plain');
      console.log('Paste detected, content length:', text.length);
      setter(text);
      e.preventDefault();
    } catch (error) {
      console.error('Error pasting text:', error);
    }
  };
  
  const handleSave = () => {
    if (!validateApiKey(openaiKey, 'openai') ||
        !validateApiKey(claudeKey, 'claude') ||
        !validateApiKey(geminiKey, 'gemini') ||
        !validateApiKey(groqKey, 'groq')) {
      return;
    }
    
    console.log('Saving Groq API key:', groqKey ? `${groqKey.substring(0, 4)}...${groqKey.substring(groqKey.length - 4)}` : 'none', 'Length:', groqKey.length);
    
    if (openaiKey.trim()) localStorage.setItem('openaiApiKey', openaiKey.trim());
    if (claudeKey.trim()) localStorage.setItem('claudeApiKey', claudeKey.trim());
    if (geminiKey.trim()) localStorage.setItem('geminiApiKey', geminiKey.trim());
    if (deepseekKey.trim()) localStorage.setItem('deepseekApiKey', deepseekKey.trim());
    if (groqKey.trim()) localStorage.setItem('groqApiKey', groqKey.trim());
    
    if (onSave) {
      onSave(openaiKey, claudeKey, geminiKey, deepseekKey, groqKey);
    }
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully",
      variant: "default"
    });
    
    try {
      const broadcastChannel = new BroadcastChannel('api-key-updates');
      broadcastChannel.postMessage({ 
        hasApiKeys: true, 
        timestamp: Date.now(),
        updatedKeys: {
          openai: !!openaiKey.trim(),
          claude: !!claudeKey.trim(),
          gemini: !!geminiKey.trim(),
          deepseek: !!deepseekKey.trim(),
          groq: !!groqKey.trim()
        }
      });
      broadcastChannel.close();
    } catch (e) {
      console.error("Failed to broadcast API key update:", e);
    }
    
    console.log("Dispatching events after saving API keys");
    window.dispatchEvent(new Event('apikey-updated'));
    window.dispatchEvent(new Event('localStorage-changed'));
    window.dispatchEvent(new Event('storage'));
    
    try {
      localStorage.setItem('_dummy_key_', Date.now().toString());
      localStorage.removeItem('_dummy_key_');
    } catch (e) {
      console.error("Failed to trigger storage event:", e);
    }
    
    if (onClose) {
      setTimeout(() => onClose(), 1000);
    }
  };
  
  return (
    <>
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
            onPaste={e => handlePaste(e, setOpenaiKey)}
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
            onPaste={e => handlePaste(e, setClaudeKey)}
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
            onPaste={e => handlePaste(e, setGeminiKey)}
            placeholder="AIza..." 
          />
          <p className="text-xs text-gray-500">Vereist voor Gemini Pro</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">DeepSeek API Sleutel</label>
          <Input 
            type="password" 
            value={deepseekKey} 
            onChange={e => setDeepseekKey(e.target.value)} 
            onPaste={e => handlePaste(e, setDeepseekKey)}
            placeholder="sk-..." 
          />
          <p className="text-xs text-gray-500">Vereist voor DeepSeek Coder</p>
        </div>
        
        <div className="space-y-2" id="groq-key-field">
          <label className="text-sm font-medium">Groq API Sleutel</label>
          <div className="relative">
            <Input 
              ref={groqInputRef}
              type="password" 
              value={groqKey} 
              onChange={e => setGroqKey(e.target.value)} 
              onPaste={e => handlePaste(e, setGroqKey)}
              placeholder="gsk_..." 
              className="pr-10"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  setGroqKey(text);
                  toast({
                    title: "Geplakt",
                    description: "Inhoud uit klembord geplakt",
                    duration: 2000
                  });
                } catch (err) {
                  console.error('Fout bij plakken uit klembord:', err);
                  toast({
                    title: "Plakken mislukt",
                    description: "Kon niet plakken uit klembord",
                    variant: "destructive",
                    duration: 3000
                  });
                }
              }}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">Vereist voor Stockbot Trading Assistant</p>
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
    </>
  );
}
