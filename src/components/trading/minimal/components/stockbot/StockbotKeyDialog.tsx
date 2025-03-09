
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";
import { toast } from "@/hooks/use-toast";
import { saveApiKey, hasApiKey } from "@/utils/apiKeyManager";

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
    
    // Wait a short delay before closing to avoid state update conflicts
    setTimeout(() => {
      handleDialogClose();
      if (onSuccessfulSave) {
        onSuccessfulSave();
      }
    }, 300);
  };

  return (
    <Dialog open={isKeyDialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <ApiKeyDialogContent 
          initialTab="groq"
          onClose={onSaveComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
