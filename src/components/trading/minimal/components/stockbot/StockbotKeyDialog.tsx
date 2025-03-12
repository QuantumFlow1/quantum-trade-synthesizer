
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { saveApiKey, hasApiKey, getApiKey } from '@/utils/apiKeyManager';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { GroqKeyValidator } from '../stockbot/widgets/GroqKeyValidator';

interface StockbotKeyDialogProps {
  isKeyDialogOpen: boolean;
  handleDialogClose: () => void;
  onSuccessfulSave?: () => void;
}

export const StockbotKeyDialog: React.FC<StockbotKeyDialogProps> = ({
  isKeyDialogOpen,
  handleDialogClose,
  onSuccessfulSave
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isKeyValidated, setIsKeyValidated] = useState(false);
  
  useEffect(() => {
    // Reset state when dialog opens
    if (isKeyDialogOpen) {
      const existingKey = getApiKey('groq') || '';
      setApiKey(existingKey);
      setSaveSuccess(false);
      setValidationError(null);
      setIsKeyValidated(false);
    }
  }, [isKeyDialogOpen]);
  
  const validateApiKey = (key: string): boolean => {
    // Basic validation for Groq API keys
    if (!key || key.trim() === '') {
      setValidationError('API key cannot be empty');
      return false;
    }
    
    if (key.trim().length < 20) {
      setValidationError('API key is too short. Groq API keys are generally longer');
      return false;
    }
    
    // Check if it starts with the expected prefix
    if (!key.startsWith('gsk_')) {
      setValidationError('Groq API key should start with "gsk_"');
      return false;
    }
    
    // Key looks valid
    setValidationError(null);
    return true;
  };
  
  const handleSave = async () => {
    if (!validateApiKey(apiKey)) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save API key to localStorage
      const success = saveApiKey('groq', apiKey);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (success) {
        toast({
          title: "API Key Saved",
          description: "Your Groq API key has been saved successfully",
          duration: 3000
        });
        setSaveSuccess(true);
        
        // Call the success callback
        if (onSuccessfulSave) {
          onSuccessfulSave();
        }
        
        // Close the dialog after a short delay
        setTimeout(() => {
          handleDialogClose();
        }, 1000);
      } else {
        toast({
          title: "Error Saving API Key",
          description: "There was a problem saving your API key",
          variant: "destructive",
          duration: 5000
        });
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClear = () => {
    saveApiKey('groq', '');
    setApiKey('');
    setSaveSuccess(false);
    setIsKeyValidated(false);
    
    toast({
      title: "API Key Removed",
      description: "Your Groq API key has been removed",
      duration: 3000
    });
  };

  const handleKeyValidationComplete = (isValid: boolean) => {
    setIsKeyValidated(isValid);
    if (isValid) {
      setValidationError(null);
    }
  };

  return (
    <Dialog open={isKeyDialogOpen} onOpenChange={(open) => {
      if (!open) handleDialogClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure API Key</DialogTitle>
          <DialogDescription>
            Enter your Groq API key to enable AI-powered responses
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="groq-api-key" className="text-sm font-medium">
                Groq API Key
              </label>
              <Input
                id="groq-api-key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setSaveSuccess(false);
                  setValidationError(null);
                  setIsKeyValidated(false);
                }}
                placeholder="gsk_..."
                className="w-full"
              />
              <div className="flex flex-col space-y-1 text-xs text-gray-500">
                <p>
                  You can get a Groq API key by signing up at <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">console.groq.com <ExternalLink size={12} className="inline ml-1" /></a>
                </p>
                <p>
                  Make sure to copy the full API key including the "gsk_" prefix.
                </p>
              </div>
              
              <GroqKeyValidator 
                apiKey={apiKey} 
                onValidationComplete={handleKeyValidationComplete} 
              />
            </div>
            
            {validationError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{validationError}</span>
              </div>
            )}
            
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span className="text-sm">API key saved successfully!</span>
              </div>
            )}
            
            {hasApiKey('groq') && !saveSuccess && !validationError && !isKeyValidated && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <span className="text-sm">You already have an API key configured. Validate it to ensure it works.</span>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-2">
              {apiKey && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={isSaving}
                >
                  Clear
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !apiKey.trim() || (!isKeyValidated && apiKey !== getApiKey('groq'))}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save API Key'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
