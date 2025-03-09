
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Check, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Shows a standardized toast notification for API key success
 */
export const showApiKeyDetectedToast = (serviceName: string) => {
  toast({
    title: `${serviceName} API Key Detected`,
    description: "API key has been configured successfully",
    variant: "default",
    duration: 5000,
  });
};

/**
 * Shows a standardized toast notification for API key errors
 */
export const showApiKeyErrorToast = (serviceName: string, errorMessage: string) => {
  toast({
    title: `${serviceName} API Key Error`,
    description: errorMessage || "Failed to configure API key",
    variant: "destructive",
    duration: 8000,
  });
};

/**
 * Shows a standardized toast notification for API key info
 */
export const showApiKeyInfoToast = (message: string) => {
  toast({
    title: "API Key Info",
    description: message,
    variant: "default",
    duration: 5000,
  });
};

/**
 * Shows a standardized toast notification for API key warnings
 */
export const showApiKeyWarningToast = (message: string) => {
  toast({
    title: "API Key Warning",
    description: message,
    variant: "default",
    duration: 6000,
  });
};

/**
 * Shows a toast notification for a successful API key save
 */
export const showApiKeySavedToast = (serviceName: string) => {
  toast({
    title: `${serviceName} API Key Saved`,
    description: "API key has been saved successfully",
    variant: "default",
    duration: 5000,
  });
};

/**
 * Shows a toast notification for when API keys are removed
 */
export const showApiKeyRemovedToast = (serviceName: string) => {
  toast({
    title: `${serviceName} API Key Removed`,
    description: "API key has been removed",
    variant: "default",
    duration: 5000,
  });
};

/**
 * Shows a toast notification for when all API keys are refreshed
 */
export const showAllApiKeysRefreshedToast = () => {
  toast({
    title: "API Keys Refreshed",
    description: "All API keys have been refreshed",
    variant: "default",
    duration: 5000,
  });
};

/**
 * Shows a toast notification for API key validation status
 */
export const showApiKeyValidationToast = (serviceName: string, isValid: boolean, message?: string) => {
  if (isValid) {
    toast({
      title: `${serviceName} API Key Valid`,
      description: message || "The API key format is valid",
      variant: "default",
      duration: 3000,
    });
  } else {
    toast({
      title: `${serviceName} API Key Invalid`,
      description: message || "The API key format is invalid",
      variant: "destructive",
      duration: 5000,
    });
  }
};

// Component versions of toast notifications are below, using strings for titles
// instead of ReactElements to avoid type errors

/**
 * Component version of the API key success notification
 */
export const ApiKeySuccessToast = ({ serviceName }: { serviceName: string }) => {
  toast({
    title: `${serviceName} API Key Configured`,
    description: "API key has been set up successfully",
    duration: 3000,
  });
  return null;
};

/**
 * Component version of the API key error notification
 */
export const ApiKeyErrorToast = ({ serviceName, errorMessage }: { serviceName: string, errorMessage?: string }) => {
  toast({
    title: `${serviceName} API Key Error`,
    description: errorMessage || "Failed to configure API key",
    variant: "destructive",
    duration: 3000,
  });
  return null;
};

/**
 * Component version of the API key info notification
 */
export const ApiKeyInfoToast = ({ message }: { message: string }) => {
  toast({
    title: "API Key Info",
    description: message,
    duration: 3000,
  });
  return null;
};

/**
 * Component version of the API key warning notification
 */
export const ApiKeyWarningToast = ({ message }: { message: string }) => {
  toast({
    title: "API Key Warning",
    description: message,
    duration: 3000,
  });
  return null;
};
