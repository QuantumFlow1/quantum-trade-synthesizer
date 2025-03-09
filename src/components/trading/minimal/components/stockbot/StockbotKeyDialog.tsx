
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";

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
    // Wait a short delay before closing to avoid state update conflicts
    setTimeout(() => {
      handleDialogClose();
      if (onSuccessfulSave) {
        onSuccessfulSave();
      }
    }, 100);
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
