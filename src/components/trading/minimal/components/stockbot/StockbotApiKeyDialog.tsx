
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StockbotApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  onSave: () => void;
}

export const StockbotApiKeyDialog: React.FC<StockbotApiKeyDialogProps> = ({
  isOpen,
  onOpenChange,
  apiKey,
  setApiKey,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Sleutel Configuratie</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Voer je API sleutel in om toegang te krijgen tot realtime marktgegevens.
          </p>
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Sleutel"
            type="password"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button onClick={onSave}>Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
