
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Save, Check } from 'lucide-react';
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
  
  // Load API keys from props when they change
  useEffect(() => {
    if (apiKeys) {
      setOpenaiKey(apiKeys.openaiApiKey || '');
      setClaudeKey(apiKeys.claudeApiKey || '');
      setGeminiKey(apiKeys.geminiApiKey || '');
      setDeepseekKey(apiKeys.deepseekApiKey || '');
      setGroqKey(apiKeys.groqApiKey || '');
    }
  }, [apiKeys]);
  
  // Load API keys from localStorage when dialog opens
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
    
    // If initialTab is 'groq', scroll to the Groq section
    if (initialTab === 'groq') {
      setTimeout(() => {
        const groqField = document.getElementById('groq-key-field');
        if (groqField) {
          groqField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          groqField.focus();
        }
      }, 100);
    }
  }, [initialTab]);
  
  const handleSave = () => {
    // Validate keys
    if (!validateApiKey(openaiKey, 'openai') ||
        !validateApiKey(claudeKey, 'claude') ||
        !validateApiKey(geminiKey, 'gemini') ||
        !validateApiKey(groqKey, 'groq')) {
      return;
    }
    
    // Save keys to localStorage
    localStorage.setItem('openaiApiKey', openaiKey.trim());
    localStorage.setItem('claudeApiKey', claudeKey.trim());
    localStorage.setItem('geminiApiKey', geminiKey.trim());
    localStorage.setItem('deepseekApiKey', deepseekKey.trim());
    localStorage.setItem('groqApiKey', groqKey.trim());
    
    // Call onSave callback if provided
    if (onSave) {
      onSave(openaiKey, claudeKey, geminiKey, deepseekKey, groqKey);
    }
    
    // Show saved animation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully",
      variant: "default"
    });
    
    // Trigger an event to notify that the API key has been updated
    window.dispatchEvent(new Event('apikey-updated'));
    
    // Close dialog if onClose is provided
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
            placeholder="sk-..." 
          />
          <p className="text-xs text-gray-500">Vereist voor DeepSeek Coder</p>
        </div>
        
        <div className="space-y-2" id="groq-key-field">
          <label className="text-sm font-medium">Groq API Sleutel</label>
          <Input 
            type="password" 
            value={groqKey} 
            onChange={e => setGroqKey(e.target.value)} 
            placeholder="gsk_..." 
          />
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
