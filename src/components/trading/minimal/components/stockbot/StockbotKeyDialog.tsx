
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";
import { toast } from "@/hooks/use-toast";
import { saveApiKey, hasApiKey, broadcastApiKeyChange } from "@/utils/apiKeyManager";

interface StockbotKeyDialogProps {
  isKeyDialogOpen: boolean;
  handleDialogClose: () => void;
  onSuccessfulSave?: () => void;
}

export const StockbotKeyDialog = ({
  isKeyDialogOpen,
  handleDialogClose,
  onSuccessfulSave,
}: StockbotKeyDialogProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Reset saving state when dialog opens/closes
  useEffect(() => {
    if (!isKeyDialogOpen) {
      setIsSaving(false);
    }
  }, [isKeyDialogOpen]);

  // Verify that we have a valid API key on mount
  useEffect(() => {
    if (isKeyDialogOpen) {
      const checkExistingKey = () => {
        const keyExists = hasApiKey('groq');
        const groqKey = localStorage.getItem('groqApiKey');
        
        console.log('StockbotKeyDialog - Existing API key check:', {
          exists: keyExists,
          keyLength: groqKey ? groqKey.length : 0,
          timestamp: new Date().toISOString()
        });
      };
      
      checkExistingKey();
    }
  }, [isKeyDialogOpen]);

  const onSaveComplete = () => {
    // Prevent multiple simultaneous save attempts
    if (isSaving) {
      console.log("Save operation already in progress, ignoring duplicate request");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Directly check if the API key was saved
      const keyExists = hasApiKey('groq');
      const groqKey = localStorage.getItem('groqApiKey');
      
      console.log("API key save completed. Key in storage:", {
        exists: keyExists,
        keyLength: groqKey ? groqKey.length : 0,
        keyValue: groqKey ? `${groqKey.substring(0, 3)}...${groqKey.substring(groqKey.length - 3)}` : 'none',
        timestamp: new Date().toISOString()
      });
      
      if (!keyExists || !groqKey || groqKey.trim().length === 0) {
        toast({
          title: "Error Saving API Key",
          description: "The API key was not saved to storage. Please try again.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      // Force saving to localStorage again to ensure it's there
      const forceSaveResult = saveApiKey('groq', groqKey);
      
      if (!forceSaveResult) {
        console.error("Force save of API key failed");
        toast({
          title: "Error Saving API Key",
          description: "The API key could not be saved. Please try again.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      toast({
        title: "API Key Saved",
        description: "The API key was successfully saved to storage.",
        variant: "default"
      });
      
      // Use a single timeout with all operations to prevent race conditions
      setTimeout(() => {
        try {
          // Broadcast API key change first
          broadcastApiKeyChange(true);
          
          // Then close the dialog and trigger the success callback
          handleDialogClose();
          if (onSuccessfulSave) {
            onSuccessfulSave();
          }
          
          // Finally reset the saving state
          setIsSaving(false);
        } catch (err) {
          console.error("Error in save completion process:", err);
          setIsSaving(false);
        }
      }, 300);
    } catch (err) {
      console.error("Error in API key save process:", err);
      setIsSaving(false);
    }
  };

  return (
    <Dialog 
      open={isKeyDialogOpen} 
      onOpenChange={(open) => {
        if (!open && !isSaving) {
          // Prevent closing while saving is in progress
          // Give the dialog time to close visually before firing close handler
          setTimeout(handleDialogClose, 100);
        } else if (!open && isSaving) {
          console.log("Ignoring close request while save is in progress");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <ApiKeyDialogContent 
          initialTab="groq"
          onClose={onSaveComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
