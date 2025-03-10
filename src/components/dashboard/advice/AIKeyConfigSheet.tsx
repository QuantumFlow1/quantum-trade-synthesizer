
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ApiKeyTriggerButton } from "./api-keys/ApiKeyTriggerButton";
import { ApiKeyFormContent } from "./api-keys/ApiKeyFormContent";
import { useEffect } from "react";

interface AIKeyConfigSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  onManualCheck?: () => void;
}

export function AIKeyConfigSheet({ isOpen, onOpenChange, onSave, onManualCheck }: AIKeyConfigSheetProps) {
  // Make sure keys are loaded when the sheet opens
  useEffect(() => {
    if (isOpen) {
      console.log("API Key config sheet opened");
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <ApiKeyTriggerButton />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>API Sleutels Instellen</SheetTitle>
        </SheetHeader>
        <ApiKeyFormContent 
          onSave={onSave} 
          onClose={() => onOpenChange(false)}
          onManualCheck={onManualCheck}
        />
      </SheetContent>
    </Sheet>
  );
}
