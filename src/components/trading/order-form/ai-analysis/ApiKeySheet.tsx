
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ServerCrash } from "lucide-react";

export interface ApiKeySheetProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeyStatus: 'available' | 'unavailable' | 'checking';
}

export const ApiKeySheet = ({
  isOpen,
  onClose,
  apiKeyStatus,
}: ApiKeySheetProps) => {
  const navigateToAdminPanel = () => {
    // Set flag to open API Keys tab directly when redirected
    localStorage.setItem('current-api-tab', 'apimanager');
    window.location.href = '/admin';
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>AI API Sleutels</SheetTitle>
          <SheetDescription>
            API sleutels zijn nodig voor AI-analyses en trading aanbevelingen.
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <Alert variant="destructive" className="mb-4">
            <ServerCrash className="h-4 w-4" />
            <AlertDescription>
              API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
              Neem contact op met uw systeembeheerder voor toegang.
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-muted-foreground mt-4">
            API sleutels zijn nodig voor:
          </p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc pl-4">
            <li>Realtime marktupdates</li>
            <li>AI-gestuurde handelsaanbevelingen</li>
            <li>Risico- en winstanalyse per trade</li>
          </ul>
        </div>
        
        <SheetFooter>
          <Button onClick={onClose} variant="outline">Annuleren</Button>
          <Button onClick={navigateToAdminPanel}>Naar API Manager</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
