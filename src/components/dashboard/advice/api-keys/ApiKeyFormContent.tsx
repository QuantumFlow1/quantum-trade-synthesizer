
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { broadcastApiKeyChange } from "@/utils/apiKeyManager";
import { ApiKeyInput } from "./ApiKeyInput";
import { ApiKeySaveButton } from "./ApiKeySaveButton";

interface ApiKeyFormContentProps {
  onSave: () => void;
  onClose: () => void;
  onManualCheck?: () => void;
}

export function ApiKeyFormContent({ onSave, onClose, onManualCheck }: ApiKeyFormContentProps) {
  const { toast } = useToast();
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved API keys on component mount
  useEffect(() => {
    loadKeysFromStorage();
  }, []); // Also reload when sheet opens
  
  const loadKeysFromStorage = () => {
    const savedOpenAI = localStorage.getItem('openaiApiKey') || '';
    const savedClaude = localStorage.getItem('claudeApiKey') || '';
    const savedGemini = localStorage.getItem('geminiApiKey') || '';
    const savedDeepseek = localStorage.getItem('deepseekApiKey') || '';
    const savedGroq = localStorage.getItem('groqApiKey') || '';
    
    console.log('Loading API keys from localStorage:', {
      openai: savedOpenAI ? 'present' : 'not found',
      claude: savedClaude ? 'present' : 'not found',
      gemini: savedGemini ? 'present' : 'not found',
      deepseek: savedDeepseek ? 'present' : 'not found',
      groq: savedGroq ? 'present' : 'not found'
    });
    
    setOpenaiKey(savedOpenAI);
    setClaudeKey(savedClaude);
    setGeminiKey(savedGemini);
    setDeepseekKey(savedDeepseek);
    setGroqKey(savedGroq);
  };
  
  const saveApiKeys = async () => {
    setIsSaving(true);
    
    try {
      // Store previous values to check what changed
      const prevOpenAI = localStorage.getItem('openaiApiKey');
      const prevClaude = localStorage.getItem('claudeApiKey');
      const prevGemini = localStorage.getItem('geminiApiKey');
      const prevDeepseek = localStorage.getItem('deepseekApiKey');
      const prevGroq = localStorage.getItem('groqApiKey');
      
      let keysChanged = false;
      
      // Save new values - with explicit checking and logging
      if (openaiKey.trim()) {
        localStorage.setItem('openaiApiKey', openaiKey.trim());
        console.log('Saved OpenAI API key to localStorage');
        if (prevOpenAI !== openaiKey.trim()) keysChanged = true;
      }
      
      if (claudeKey.trim()) {
        localStorage.setItem('claudeApiKey', claudeKey.trim());
        console.log('Saved Claude API key to localStorage');
        if (prevClaude !== claudeKey.trim()) keysChanged = true;
      }
      
      if (geminiKey.trim()) {
        localStorage.setItem('geminiApiKey', geminiKey.trim());
        console.log('Saved Gemini API key to localStorage');
        if (prevGemini !== geminiKey.trim()) keysChanged = true;
      }
      
      if (deepseekKey.trim()) {
        localStorage.setItem('deepseekApiKey', deepseekKey.trim());
        console.log('Saved DeepSeek API key to localStorage');
        if (prevDeepseek !== deepseekKey.trim()) keysChanged = true;
      }
      
      if (groqKey.trim()) {
        localStorage.setItem('groqApiKey', groqKey.trim());
        console.log('Saved Groq API key to localStorage');
        if (prevGroq !== groqKey.trim()) keysChanged = true;
      }
      
      console.log('Saved API keys to localStorage:', {
        openai: openaiKey ? 'present' : 'not set',
        claude: claudeKey ? 'present' : 'not set',
        gemini: geminiKey ? 'present' : 'not set',
        deepseek: deepseekKey ? 'present' : 'not set',
        groq: groqKey ? 'present' : 'not set'
      });
      
      // Double check that Groq key was saved correctly
      if (groqKey.trim()) {
        const savedGroqKey = localStorage.getItem('groqApiKey');
        if (savedGroqKey !== groqKey.trim()) {
          console.error('Groq API key verification failed - fixing now');
          localStorage.setItem('groqApiKey', groqKey.trim());
        }
      }
      
      toast({
        title: "API sleutels opgeslagen",
        description: "Uw API sleutels zijn opgeslagen. Controleer opnieuw de verbinding.",
      });
      
      onClose();
      onSave();
      
      // Dispatch custom events for other components to pick up the change
      if (keysChanged) {
        console.log('Broadcasting API key changes');
        window.dispatchEvent(new Event('localStorage-changed'));
        window.dispatchEvent(new Event('apikey-updated'));
        broadcastApiKeyChange(true);
      }
      
      // For each API key that changed, dispatch a specific event
      if (prevOpenAI !== openaiKey && openaiKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'openai', status: 'connected' }
        }));
      }
      
      if (prevClaude !== claudeKey && claudeKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'claude', status: 'connected' }
        }));
      }
      
      if (prevDeepseek !== deepseekKey && deepseekKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'deepseek', status: 'connected' }
        }));
      }
      
      if (prevGroq !== groqKey && groqKey) {
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
          detail: { provider: 'groq', status: 'connected' }
        }));
      }
      
      // Automatically trigger a connection check
      if (onManualCheck) {
        setTimeout(() => {
          console.log('Triggering manual API key check');
          onManualCheck();
        }, 500);
      }
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het opslaan van de API sleutels.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <ApiKeyInput 
        id="openai-api-key"
        label="OpenAI API Sleutel"
        placeholder="sk-..." 
        value={openaiKey}
        onChange={setOpenaiKey}
        description="Vereist voor GPT-4 en andere OpenAI modellen"
      />
      
      <ApiKeyInput 
        id="claude-api-key"
        label="Claude API Sleutel"
        placeholder="sk-ant-..." 
        value={claudeKey}
        onChange={setClaudeKey}
        description="Vereist voor Claude modellen"
      />
      
      <ApiKeyInput 
        id="gemini-api-key"
        label="Gemini API Sleutel"
        placeholder="AIza..." 
        value={geminiKey}
        onChange={setGeminiKey}
        description="Vereist voor Gemini modellen"
      />
      
      <ApiKeyInput 
        id="deepseek-api-key"
        label="DeepSeek API Sleutel"
        placeholder="sk-..." 
        value={deepseekKey}
        onChange={setDeepseekKey}
        description="Vereist voor DeepSeek modellen"
      />
      
      <ApiKeyInput 
        id="groq-api-key"
        label="Groq API Sleutel"
        placeholder="gsk_..." 
        value={groqKey}
        onChange={setGroqKey}
        description="Vereist voor Stockbot en Groq functionaliteit"
      />
      
      <ApiKeySaveButton 
        isSaving={isSaving}
        onClick={saveApiKeys}
      />
    </div>
  );
}
