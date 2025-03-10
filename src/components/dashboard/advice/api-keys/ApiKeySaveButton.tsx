
import { Button } from "@/components/ui/button";

interface ApiKeySaveButtonProps {
  isSaving: boolean;
  onClick: () => void;
}

export function ApiKeySaveButton({ isSaving, onClick }: ApiKeySaveButtonProps) {
  return (
    <Button 
      className="w-full mt-4" 
      onClick={onClick}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <span className="animate-spin mr-2">⟳</span>
          Opslaan...
        </>
      ) : (
        "Opslaan"
      )}
    </Button>
  );
}
