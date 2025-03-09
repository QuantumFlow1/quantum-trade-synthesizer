
import { toast } from "@/hooks/use-toast";
import { ApiKeySettings } from '../types/GrokSettings';

/**
 * Standardized toast notifications for API key operations
 */

export const showApiKeySavedToast = (provider: string) => {
  toast({
    title: `${provider} API Key Saved`,
    description: `Your ${provider} API key has been saved successfully.`,
    variant: "success",
    duration: 4000,
  });
};

export const showApiKeyErrorToast = (provider: string, message?: string) => {
  toast({
    title: `${provider} API Key Error`,
    description: message || `There was an issue with your ${provider} API key.`,
    variant: "destructive",
    duration: 5000,
  });
};

export const showApiKeyDetectedToast = (provider: string, keyLength?: number) => {
  toast({
    title: `${provider} API Key Detected`,
    description: `${provider} API key has been configured successfully${keyLength ? ` (${keyLength} characters)` : ''}.`,
    variant: "success",
    duration: 3000,
  });
};

export const showApiKeyRemovedToast = (provider: string) => {
  toast({
    title: `${provider} API Key Removed`,
    description: `Your ${provider} API key has been removed.`,
    duration: 3000,
  });
};

export const showApiKeyReloadToast = (keysStatus: { [key: string]: boolean }) => {
  const keysFound = Object.entries(keysStatus).filter(([_, exists]) => exists).map(([key]) => key);
  
  if (keysFound.length > 0) {
    toast({
      title: "API Keys Refreshed",
      description: `Found keys for: ${keysFound.join(', ')}`,
      variant: "success",
      duration: 3000,
    });
  } else {
    toast({
      title: "API Keys Refreshed",
      description: "No API keys were found.",
      duration: 3000,
    });
  }
};

export const showAllApiKeysRefreshedToast = () => {
  toast({
    title: "API Keys Reloaded",
    description: "All components have been notified to reload API keys.",
    duration: 3000,
  });
};

export const showApiKeyValidationErrorToast = (provider: string, reason: string) => {
  toast({
    title: `Invalid ${provider} API Key`,
    description: reason,
    variant: "destructive",
    duration: 5000,
  });
};
