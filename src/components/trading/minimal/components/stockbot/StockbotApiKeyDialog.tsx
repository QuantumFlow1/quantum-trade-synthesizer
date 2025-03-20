
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ServerCrash } from "lucide-react";

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
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Sleutel Configuratie</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Alert variant="destructive" className="mb-4">
            <ServerCrash className="h-4 w-4" />
            <AlertDescription>
              API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
              Neem contact op met uw systeembeheerder voor toegang.
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-muted-foreground">
            API sleutels zijn nodig voor toegang tot realtime marktgegevens.
            Deze kunnen alleen door beheerders worden ingesteld.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuleren
          </Button>
          <Button onClick={navigateToAdminPanel}>Naar Admin Paneel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
