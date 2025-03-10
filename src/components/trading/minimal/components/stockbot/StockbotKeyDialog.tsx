
import React from "react";
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
  const onSaveComplete = () => {
    // Directly check if the API key was saved
    const keyExists = hasApiKey('groq');
    
    console.log("API key save completed. Key in storage:", {
      exists: keyExists,
      keyLength: keyExists ? localStorage.getItem('groqApiKey')?.length : 0
    });
    
    if (!keyExists) {
      toast({
        title: "Error Saving API Key",
        description: "The API key was not saved to storage. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "API Key Saved",
      description: "The API key was successfully saved to storage.",
      variant: "default"
    });
    
    // Force a broadcast of the API key change event to all components
    // with a small delay to avoid race conditions
    setTimeout(() => {
      broadcastApiKeyChange(true);
      
      // Wait a short delay before closing to avoid state update conflicts
      setTimeout(() => {
        handleDialogClose();
        if (onSuccessfulSave) {
          onSuccessfulSave();
        }
      }, 300);
    }, 100);
  };

  return (
    <Dialog open={isKeyDialogOpen} onOpenChange={(open) => {
      if (!open) {
        // Give the dialog time to close visually before firing close handler
        setTimeout(handleDialogClose, 100);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <ApiKeyDialogContent 
          initialTab="groq"
          onClose={onSaveComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
