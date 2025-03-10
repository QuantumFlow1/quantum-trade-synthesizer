
import React, { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';
import { saveApiKey, broadcastApiKeyChange } from '@/utils/apiKeyManager';
import { DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { ApiKeySettings } from '../types/GrokSettings';
import { toast } from '@/hooks/use-toast';

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
    
    try {
      console.log('Saving API keys...');
      
      // If onSave prop is provided, use it first
      if (onSave) {
        onSave(openaiKey, claudeKey, geminiKey, deepseekKey, groqKey);
        
        // Also ensure Groq key is saved directly to localStorage
        if (groqKey.trim()) {
          localStorage.setItem('groqApiKey', groqKey.trim());
          console.log(`Saved Groq API key directly to localStorage: ${groqKey.substring(0, 3)}...`);
          
          // Broadcast the change
          broadcastApiKeyChange(true);
        }
      } else {
        // Otherwise use the default save behavior
        // Save OpenAI API key
        if (openaiKey.trim()) {
          if (!saveApiKey('openai', openaiKey)) {
            success = false;
          }
        }
        
        // Save Claude API key  
        if (claudeKey.trim()) {
          if (!saveApiKey('claude', claudeKey)) {
            success = false;
          }
        }
        
        // Save Gemini API key
        if (geminiKey.trim()) {
          if (!saveApiKey('gemini', geminiKey)) {
            success = false;
          }
        }
        
        // Save Deepseek API key
        if (deepseekKey.trim()) {
          if (!saveApiKey('deepseek', deepseekKey)) {
            success = false;
          }
        }
        
        // Save Groq API key - with multiple layers of fallback
        if (groqKey.trim()) {
          console.log(`Saving Groq API key (${groqKey.length} chars): ${groqKey.substring(0, 3)}...${groqKey.substring(groqKey.length - 3)}`);
          
          // Try the utility function first
          let groqSaveSuccess = saveApiKey('groq', groqKey);
          
          if (!groqSaveSuccess) {
            console.error('Failed to save Groq API key with saveApiKey utility');
            
            // Fallback: try direct localStorage save
            try {
              localStorage.setItem('groqApiKey', groqKey.trim());
              console.log('Saved Groq API key directly to localStorage');
              groqSaveSuccess = true;
              
              // Manually broadcast the change
              broadcastApiKeyChange(true);
            } catch (err) {
              console.error('Failed to save Groq API key directly to localStorage:', err);
              success = false;
            }
          } else {
            console.log('Successfully saved Groq API key with saveApiKey utility');
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

  return (
    <div className="space-y-4 py-2 pb-4">
      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="claude">Claude</TabsTrigger>
          <TabsTrigger value="gemini">Gemini</TabsTrigger>
          <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
          <TabsTrigger value="groq">Groq</TabsTrigger>
        </TabsList>
        
        <TabsContent value="openai" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">Used for GPT-3.5 and GPT-4 models</p>
          </div>
        </TabsContent>
        
        <TabsContent value="claude" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claude-key">Anthropic API Key</Label>
            <Input
              id="claude-key"
              type="password"
              placeholder="sk-ant-..."
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">Used for Claude models</p>
          </div>
        </TabsContent>
        
        <TabsContent value="gemini" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini-key">Google Gemini API Key</Label>
            <Input
              id="gemini-key"
              type="password"
              placeholder="AIza..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">Used for Google Gemini models</p>
          </div>
        </TabsContent>
        
        <TabsContent value="deepseek" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
            <Input
              id="deepseek-key"
              type="password"
              placeholder="sk-..."
              value={deepseekKey}
              onChange={(e) => setDeepseekKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">Used for DeepSeek models</p>
          </div>
        </TabsContent>
        
        <TabsContent value="groq" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groq-key">Groq API Key</Label>
            <Input
              id="groq-key"
              type="password"
              placeholder="gsk_..."
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">Used for Groq models including LLama-3, Mixtral</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button 
          type="submit" 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full mt-4"
        >
          {isSaving ? (
            <>
              <span className="mr-2">Saving...</span>
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Save API Key
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};
