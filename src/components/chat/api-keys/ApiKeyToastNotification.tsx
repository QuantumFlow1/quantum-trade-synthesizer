
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
 * Component version of the API key success notification
 */
export const ApiKeySuccessToast = ({ serviceName }: { serviceName: string }) => {
  return (
    <div className="flex items-start">
      <div className="mr-2">
        <Check className="h-5 w-5 text-green-500" />
      </div>
      <div>
        <h3 className="font-medium">{serviceName} API Key Configured</h3>
        <p className="text-sm text-gray-500">API key has been set up successfully</p>
      </div>
    </div>
  );
};

/**
 * Component version of the API key error notification
 */
export const ApiKeyErrorToast = ({ serviceName, errorMessage }: { serviceName: string, errorMessage?: string }) => {
  return (
    <div className="flex items-start">
      <div className="mr-2">
        <X className="h-5 w-5 text-red-500" />
      </div>
      <div>
        <h3 className="font-medium">{serviceName} API Key Error</h3>
        <p className="text-sm text-gray-500">{errorMessage || "Failed to configure API key"}</p>
      </div>
    </div>
  );
};

/**
 * Component version of the API key info notification
 */
export const ApiKeyInfoToast = ({ message }: { message: string }) => {
  return (
    <div className="flex items-start">
      <div className="mr-2">
        <Info className="h-5 w-5 text-blue-500" />
      </div>
      <div>
        <h3 className="font-medium">API Key Info</h3>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};

/**
 * Component version of the API key warning notification
 */
export const ApiKeyWarningToast = ({ message }: { message: string }) => {
  return (
    <div className="flex items-start">
      <div className="mr-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
      </div>
      <div>
        <h3 className="font-medium">API Key Warning</h3>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};
