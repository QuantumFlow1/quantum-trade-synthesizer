
import { useState } from 'react';

/**
 * Hook for managing API key dialog state
 */
export const useDialogState = () => {
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);

  const showApiKeyDialog = () => {
    setIsKeyDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsKeyDialogOpen(false);
  };

  return {
    isKeyDialogOpen,
    setIsKeyDialogOpen,
    showApiKeyDialog,
    handleDialogClose
  };
};
