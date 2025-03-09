
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";

interface StockbotKeyDialogProps {
  isKeyDialogOpen: boolean;
  handleDialogClose: () => void;
}

export const StockbotKeyDialog = ({
  isKeyDialogOpen,
  handleDialogClose,
}: StockbotKeyDialogProps) => {
  return (
    <Dialog open={isKeyDialogOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <ApiKeyDialogContent 
          initialTab="groq"
          onClose={handleDialogClose}
        />
      </DialogContent>
    </Dialog>
  );
};
