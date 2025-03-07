
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface UseOrderSectionProps {
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  apiKeysAvailable?: boolean;
}

export const useOrderSection = ({
  isSimulationMode = false,
  onSimulationToggle,
  apiKeysAvailable = false
}: UseOrderSectionProps) => {
  const [localIsSimulationMode, setLocalIsSimulationMode] = useState(isSimulationMode);
  const [isKeySheetOpen, setIsKeySheetOpen] = useState(false);

  const handleSimulationToggle = (enabled: boolean) => {
    setLocalIsSimulationMode(enabled);
    
    if (onSimulationToggle) {
      onSimulationToggle(enabled);
    } else {
      if (enabled) {
        toast({
          title: "Simulation Mode Enabled",
          description: "You can now test trading without using real funds",
          duration: 3000,
        });
      }
    }
  };
  
  const handleApiKeySave = () => {
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved successfully. Reconnecting to services...",
      duration: 3000,
    });
    
    setIsKeySheetOpen(false);
  };

  useEffect(() => {
    setLocalIsSimulationMode(isSimulationMode);
  }, [isSimulationMode]);

  return {
    localIsSimulationMode,
    isKeySheetOpen,
    setIsKeySheetOpen,
    handleSimulationToggle,
    handleApiKeySave
  };
};
