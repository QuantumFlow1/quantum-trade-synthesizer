
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ApiKeySettings, ModelInfo } from '../types/GrokSettings';
import { useAuth } from '@/components/auth/AuthProvider';
import { hasApiKeyAccess } from '@/utils/auth-utils';
import { fetchAdminApiKey } from '../services/utils/apiHelpers';
import { 
  validateApiKey, 
  saveApiKeysToLocalStorage, 
  loadApiKeysFromStorage,
  loadAdminApiKeys
} from './api-key-utils';
import { ApiKeyFormData } from './types';

export function useApiKeyManager(apiKeys: ApiKeySettings, onApiKeysChange: (apiKeys: ApiKeySettings) => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ApiKeyFormData>({
    openaiKey: apiKeys.openaiApiKey || '',
    claudeKey: apiKeys.claudeApiKey || '',
    geminiKey: apiKeys.geminiApiKey || '',
    deepseekKey: apiKeys.deepseekApiKey || '',
  });
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth();
  
  const hasAccess = hasApiKeyAccess(userProfile);

  // Resets form when dialog is closed
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form values if dialog is closed without saving
      setFormData({
        openaiKey: apiKeys.openaiApiKey || '',
        claudeKey: apiKeys.claudeApiKey || '',
        geminiKey: apiKeys.geminiApiKey || '',
        deepseekKey: apiKeys.deepseekApiKey || '',
      });
    }
  };

  // Load API keys from localStorage and admin database on component mount
  useEffect(() => {
    const loadKeys = async () => {
      setIsLoading(true);
      
      try {
        // Start with the keys from localStorage
        const keysFromStorage = loadApiKeysFromStorage();
        
        // If the user has API key access, try to load from admin database
        const keysToUpdate: ApiKeySettings = { ...apiKeys };
        
        if (keysFromStorage.openaiApiKey) keysToUpdate.openaiApiKey = keysFromStorage.openaiApiKey;
        if (keysFromStorage.claudeApiKey) keysToUpdate.claudeApiKey = keysFromStorage.claudeApiKey;
        if (keysFromStorage.geminiApiKey) keysToUpdate.geminiApiKey = keysFromStorage.geminiApiKey;
        if (keysFromStorage.deepseekApiKey) keysToUpdate.deepseekApiKey = keysFromStorage.deepseekApiKey;
        
        if (hasAccess) {
          console.log('User has API key access, checking admin database');
          const adminKeys = await loadAdminApiKeys();
          
          // Only update if we don't already have a key
          if (!keysToUpdate.openaiApiKey && adminKeys.openaiApiKey) {
            keysToUpdate.openaiApiKey = adminKeys.openaiApiKey;
          }
          
          if (!keysToUpdate.claudeApiKey && adminKeys.claudeApiKey) {
            keysToUpdate.claudeApiKey = adminKeys.claudeApiKey;
          }
          
          if (!keysToUpdate.geminiApiKey && adminKeys.geminiApiKey) {
            keysToUpdate.geminiApiKey = adminKeys.geminiApiKey;
          }
          
          if (!keysToUpdate.deepseekApiKey && adminKeys.deepseekApiKey) {
            keysToUpdate.deepseekApiKey = adminKeys.deepseekApiKey;
          }
        }
        
        // Update form state and parent component
        setFormData({
          openaiKey: keysToUpdate.openaiApiKey || '',
          claudeKey: keysToUpdate.claudeApiKey || '',
          geminiKey: keysToUpdate.geminiApiKey || '',
          deepseekKey: keysToUpdate.deepseekApiKey || '',
        });
        
        onApiKeysChange(keysToUpdate);
        
        console.log('API keys loaded successfully:', {
          openai: keysToUpdate.openaiApiKey ? 'present' : 'not found',
          claude: keysToUpdate.claudeApiKey ? 'present' : 'not found',
          gemini: keysToUpdate.geminiApiKey ? 'present' : 'not found',
          deepseek: keysToUpdate.deepseekApiKey ? 'present' : 'not found'
        });
      } catch (error) {
        console.error('Error loading API keys:', error);
        toast({
          title: "Error loading API keys",
          description: "There was a problem retrieving your API keys.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadKeys();
  }, [userProfile?.id]);

  // Update formData on input change
  const handleInputChange = (key: keyof ApiKeyFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Save API keys
  const handleSave = () => {
    // Validate all keys
    if (!validateApiKey(formData.openaiKey, 'openai') ||
        !validateApiKey(formData.claudeKey, 'claude') ||
        !validateApiKey(formData.geminiKey, 'gemini')) {
      return;
    }
    
    const updatedKeys: ApiKeySettings = {
      openaiApiKey: formData.openaiKey.trim(),
      claudeApiKey: formData.claudeKey.trim(),
      geminiApiKey: formData.geminiKey.trim(),
      deepseekApiKey: formData.deepseekKey.trim()
    };
    
    // Save to localStorage
    saveApiKeysToLocalStorage(updatedKeys);
    
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

  // Refresh admin API keys
  const handleRefreshAdminKeys = async () => {
    setIsLoading(true);
    
    try {
      // Clear local storage to force a refresh
      localStorage.removeItem('openaiApiKey');
      localStorage.removeItem('claudeApiKey');
      localStorage.removeItem('geminiApiKey');
      localStorage.removeItem('deepseekApiKey');
      
      // Try to fetch fresh admin keys
      const adminOpenAIKey = await fetchAdminApiKey('openai');
      const adminClaudeKey = await fetchAdminApiKey('claude');
      const adminGeminiKey = await fetchAdminApiKey('gemini');
      const adminDeepseekKey = await fetchAdminApiKey('deepseek');
      
      const keysToUpdate: ApiKeySettings = { ...apiKeys };
      
      if (adminOpenAIKey) {
        keysToUpdate.openaiApiKey = adminOpenAIKey;
        localStorage.setItem('openaiApiKey', adminOpenAIKey);
      }
      
      if (adminClaudeKey) {
        keysToUpdate.claudeApiKey = adminClaudeKey;
        localStorage.setItem('claudeApiKey', adminClaudeKey);
      }
      
      if (adminGeminiKey) {
        keysToUpdate.geminiApiKey = adminGeminiKey;
        localStorage.setItem('geminiApiKey', adminGeminiKey);
      }
      
      if (adminDeepseekKey) {
        keysToUpdate.deepseekApiKey = adminDeepseekKey;
        localStorage.setItem('deepseekApiKey', adminDeepseekKey);
      }
      
      // Update form state
      setFormData({
        openaiKey: keysToUpdate.openaiApiKey || '',
        claudeKey: keysToUpdate.claudeApiKey || '',
        geminiKey: keysToUpdate.geminiApiKey || '',
        deepseekKey: keysToUpdate.deepseekApiKey || '',
      });
      
      onApiKeysChange(keysToUpdate);
      
      toast({
        title: "Admin Keys Refreshed",
        description: "Successfully loaded the latest API keys from the admin database",
        variant: "default"
      });
    } catch (error) {
      console.error('Error refreshing admin API keys:', error);
      toast({
        title: "Error Refreshing Keys",
        description: "There was a problem retrieving the admin API keys.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
