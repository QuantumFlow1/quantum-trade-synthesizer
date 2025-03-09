
import { useState, useCallback } from "react";

/**
 * Hook for managing dialog state
 */
export const useDialogState = () => {
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  const showApiKeyDialog = useCallback(() => {
    setIsKeyDialogOpen(true);
  }, []);
  
  return {
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    showApiKeyDialog
  };
};
