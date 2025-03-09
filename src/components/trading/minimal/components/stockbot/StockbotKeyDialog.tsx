
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";
import { toast } from "@/hooks/use-toast";

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
    // Verify the key actually got saved to localStorage
    const savedGroqKey = localStorage.getItem("groqApiKey");
    
    console.log("API key save completed. Key in storage:", {
      exists: !!savedGroqKey,
      length: savedGroqKey ? savedGroqKey.length : 0,
      firstChars: savedGroqKey ? savedGroqKey.substring(0, 4) : 'none',
      lastChars: savedGroqKey ? savedGroqKey.substring(savedGroqKey.length - 4) : 'none'
    });
    
    if (!savedGroqKey) {
      toast({
        title: "Error Saving API Key",
        description: "The API key was not saved to storage. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Force dispatch events to ensure other components are notified
    window.dispatchEvent(new Event('apikey-updated'));
    window.dispatchEvent(new Event('localStorage-changed'));
    window.dispatchEvent(new Event('storage'));
    
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
