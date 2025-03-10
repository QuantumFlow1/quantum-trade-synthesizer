import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { Key } from 'lucide-react';
import { saveApiKey, broadcastApiKeyChange } from '@/utils/apiKeyManager';
import { supabase } from '@/lib/supabase';
import { ApiKeySettings } from '../types/GrokSettings';
import { toast } from '@/hooks/use-toast';
import { ApiKeyTabsList } from './ApiKeyTabsList';
import { ApiKeyTabContent } from './ApiKeyTabContent';
import { ApiKeySaveButton } from './ApiKeySaveButton';

type TabType = 'openai' | 'claude' | 'gemini' | 'deepseek' | 'groq';

interface ApiKeyDialogContentProps {
  initialTab?: TabType;
  onClose?: () => void;
  apiKeys?: ApiKeySettings;
  onSave?: (openaiKey: string, claudeKey: string, geminiKey: string, deepseekKey: string, groqKey: string) => void;
}

export const ApiKeyDialogContent = ({
  initialTab = 'openai',
  onClose,
  apiKeys,
  onSave
}: ApiKeyDialogContentProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load saved API keys on component mount
  useEffect(() => {
    if (apiKeys) {
      // If apiKeys are provided as props, use them
      setOpenaiKey(apiKeys.openaiApiKey || '');
      setClaudeKey(apiKeys.claudeApiKey || '');
      setGeminiKey(apiKeys.geminiApiKey || '');
      setDeepseekKey(apiKeys.deepseekApiKey || '');
      setGroqKey(apiKeys.groqApiKey || '');
    } else {
      // Otherwise load from localStorage
      loadKeysFromStorage();
    }
  }, [apiKeys]);

  // Set active tab from initialTab prop
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadKeysFromStorage = () => {
    try {
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
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    let success = true;
    let keysChanged = false;
    
    try {
      console.log('Saving API keys...');
      
      // Keep track of previous keys to detect changes
      const prevOpenAI = localStorage.getItem('openaiApiKey');
      const prevClaude = localStorage.getItem('claudeApiKey');
      const prevGemini = localStorage.getItem('geminiApiKey');
      const prevDeepseek = localStorage.getItem('deepseekApiKey');
      const prevGroq = localStorage.getItem('groqApiKey');
      
      // If onSave prop is provided, use it first
      if (onSave) {
        onSave(openaiKey, claudeKey, geminiKey, deepseekKey, groqKey);
        
        // Also ensure Groq key is saved directly to localStorage
        if (groqKey.trim()) {
          localStorage.setItem('groqApiKey', groqKey.trim());
          console.log(`Saved Groq API key directly to localStorage: ${groqKey.substring(0, 3)}...`);
          
          if (prevGroq !== groqKey.trim()) {
            keysChanged = true;
          }
          
          // Broadcast the change
          broadcastApiKeyChange(true);
        }
      } else {
        // Otherwise use the default save behavior with direct localStorage access for more reliability
        // Save OpenAI API key
        if (openaiKey.trim()) {
          localStorage.setItem('openaiApiKey', openaiKey.trim());
          console.log('Saved OpenAI API key to localStorage');
          if (prevOpenAI !== openaiKey.trim()) keysChanged = true;
          
          if (!saveApiKey('openai', openaiKey)) {
            console.warn('saveApiKey utility failed for OpenAI key, but direct localStorage save succeeded');
          }
        }
        
        // Save Claude API key  
        if (claudeKey.trim()) {
          localStorage.setItem('claudeApiKey', claudeKey.trim());
          console.log('Saved Claude API key to localStorage');
          if (prevClaude !== claudeKey.trim()) keysChanged = true;
          
          if (!saveApiKey('claude', claudeKey)) {
            console.warn('saveApiKey utility failed for Claude key, but direct localStorage save succeeded');
          }
        }
        
        // Save Gemini API key
        if (geminiKey.trim()) {
          localStorage.setItem('geminiApiKey', geminiKey.trim());
          console.log('Saved Gemini API key to localStorage');
          if (prevGemini !== geminiKey.trim()) keysChanged = true;
          
          if (!saveApiKey('gemini', geminiKey)) {
            console.warn('saveApiKey utility failed for Gemini key, but direct localStorage save succeeded');
          }
        }
        
        // Save Deepseek API key
        if (deepseekKey.trim()) {
          localStorage.setItem('deepseekApiKey', deepseekKey.trim());
          console.log('Saved Deepseek API key to localStorage');
          if (prevDeepseek !== deepseekKey.trim()) keysChanged = true;
          
          if (!saveApiKey('deepseek', deepseekKey)) {
            console.warn('saveApiKey utility failed for Deepseek key, but direct localStorage save succeeded');
          }
        }
        
        // Save Groq API key - with multiple layers of fallback
        if (groqKey.trim()) {
          console.log(`Saving Groq API key (${groqKey.length} chars): ${groqKey.substring(0, 3)}...${groqKey.substring(groqKey.length - 3)}`);
          
          // First try direct localStorage save
          localStorage.setItem('groqApiKey', groqKey.trim());
          console.log('Saved Groq API key directly to localStorage');
          
          if (prevGroq !== groqKey.trim()) {
            keysChanged = true;
          }
          
          // Then try the utility function as backup
          if (!saveApiKey('groq', groqKey)) {
            console.warn('saveApiKey utility failed for Groq key, but direct localStorage save succeeded');
          }
          
          // Double check that the key was actually saved
          const savedGroqKey = localStorage.getItem('groqApiKey');
          if (!savedGroqKey || savedGroqKey.trim() !== groqKey.trim()) {
            console.error('Groq API key verification failed - key in localStorage does not match input');
            
            // Try one more time with a slight delay
            setTimeout(() => {
              try {
                localStorage.setItem('groqApiKey', groqKey.trim());
                console.log('Saved Groq API key in delayed fallback');
                
                // Broadcast the change again
                broadcastApiKeyChange(true);
              } catch (err) {
                console.error('Failed in delayed fallback save:', err);
              }
            }, 100);
          }
          
          // Also save to Supabase if available (for backend usage)
          try {
            await supabase.functions.invoke('save-api-key', {
              body: { keyType: 'groq', apiKey: groqKey.trim() }
            });
          } catch (error) {
            console.log('Could not save Groq key to Supabase:', error);
            // Continue even if this fails - localStorage is the primary storage
          }
        }
      }
      
      // Broadcast key changes to the app
      if (keysChanged) {
        console.log('Broadcasting API key changes');
        window.dispatchEvent(new Event('localStorage-changed'));
        window.dispatchEvent(new Event('apikey-updated'));
        broadcastApiKeyChange(true);
      }
      
      console.log('API keys saved successfully:', success);
      
      if (success) {
        toast({
          title: "API Keys Saved",
          description: "Your API keys have been saved successfully.",
          variant: "default"
        });
      } else {
        toast({
          title: "Warning",
          description: "Some API keys may not have been saved correctly.",
          variant: "warning"
        });
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving API keys:', error);
      success = false;
      
      toast({
        title: "Error",
        description: "Failed to save API keys. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
        <ApiKeyTabsList activeTab={activeTab} onTabChange={handleTabChange} />
        
        <ApiKeyTabContent
          tabId="openai"
          label="OpenAI API Key"
          placeholder="sk-..."
          value={openaiKey}
          onChange={setOpenaiKey}
          description="Used for GPT-3.5 and GPT-4 models"
        />
        
        <ApiKeyTabContent
          tabId="claude"
          label="Anthropic API Key"
          placeholder="sk-ant-..."
          value={claudeKey}
          onChange={setClaudeKey}
          description="Used for Claude models"
        />
        
        <ApiKeyTabContent
          tabId="gemini"
          label="Google Gemini API Key"
          placeholder="AIza..."
          value={geminiKey}
          onChange={setGeminiKey}
          description="Used for Google Gemini models"
        />
        
        <ApiKeyTabContent
          tabId="deepseek"
          label="DeepSeek API Key"
          placeholder="sk-..."
          value={deepseekKey}
          onChange={setDeepseekKey}
          description="Used for DeepSeek models"
        />
        
        <ApiKeyTabContent
          tabId="groq"
          label="Groq API Key"
          placeholder="gsk_..."
          value={groqKey}
          onChange={setGroqKey}
          description="Used for Groq models including LLama-3, Mixtral"
        />
      </Tabs>
      
      <ApiKeySaveButton isSaving={isSaving} onSave={handleSave} />
    </div>
  );
};
