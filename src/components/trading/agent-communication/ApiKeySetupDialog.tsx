
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ServerCrash } from "lucide-react";

interface ApiKeySetupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApiKeySetupDialog({ isOpen, onClose }: ApiKeySetupDialogProps) {
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI API Sleutels</DialogTitle>
          <DialogDescription>
            API sleutels zijn nodig voor AI-agent interacties.
          </DialogDescription>
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
            Toegang tot AI-functies vereist geldige API sleutels die door een beheerder 
            moeten worden ingesteld in het Admin Paneel.
          </p>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Annuleren</Button>
          <Button onClick={navigateToAdminPanel}>Naar Admin Paneel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
