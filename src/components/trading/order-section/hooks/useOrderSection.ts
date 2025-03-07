
import { useState, useEffect, useRef } from "react";
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
  const prevSimModeRef = useRef(isSimulationMode);

  const handleSimulationToggle = (enabled: boolean) => {
    // Skip update if already in this mode
    if (localIsSimulationMode === enabled) return;
    
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
    // Only update if the simulation mode actually changed
    if (prevSimModeRef.current !== isSimulationMode) {
      prevSimModeRef.current = isSimulationMode;
      setLocalIsSimulationMode(isSimulationMode);
    }
  }, [isSimulationMode]);

  return {
    localIsSimulationMode,
    isKeySheetOpen,
    setIsKeySheetOpen,
    handleSimulationToggle,
    handleApiKeySave
  };
};
