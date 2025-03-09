
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Info, Key } from "lucide-react";

interface ApiKeyToastProps {
  /**
   * The type of notification to display
   */
  type: "success" | "error" | "info" | "warning";
  
  /**
   * The name of the API provider (e.g., "Groq", "OpenAI")
   */
  provider: string;
  
  /**
   * The main message to display
   */
  message: string;
  
  /**
   * Optional additional description
   */
  description?: string;
  
  /**
   * Optional duration in milliseconds
   */
  duration?: number;
  
  /**
   * Optional action button configuration
   */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * A component that displays standardized toast notifications for API key operations
 */
export const apiKeyToast = ({
  type,
  provider,
  message,
  description,
  duration = 4000,
  action
}: ApiKeyToastProps) => {
  const { toast } = useToast();
  
  const getIcon = () => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "info": 
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "success": return "success";
      case "error": return "destructive";
      case "warning": return "warning";
      default: return "default";
    }
  };

  return toast({
    title: (
      <div className="flex items-center gap-2">
        {getIcon()}
        <span>{provider} API Key - {message}</span>
      </div>
    ),
    description: description,
    variant: getVariant(),
    duration: duration,
    action: action ? (
      <div 
        className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded text-xs font-medium cursor-pointer" 
        onClick={action.onClick}
      >
        {action.label}
      </div>
    ) : undefined,
  });
};

/**
 * Convenience functions for common API key toast notifications
 */

export const showApiKeySavedToast = (provider: string, keyLength?: number) => {
  return apiKeyToast({
    type: "success",
    provider,
    message: "Saved Successfully",
    description: keyLength 
      ? `Your ${provider} API key (${keyLength} characters) has been saved.` 
      : `Your ${provider} API key has been saved.`,
  });
};

export const showApiKeyErrorToast = (provider: string, errorMessage?: string) => {
  return apiKeyToast({
    type: "error",
    provider,
    message: "Error",
    description: errorMessage || `There was an issue with your ${provider} API key.`,
    duration: 5000,
  });
};

export const showApiKeyDetectedToast = (provider: string) => {
  return apiKeyToast({
    type: "success",
    provider,
    message: "Detected",
    description: `${provider} API key has been configured successfully.`,
  });
};

export const showApiKeyRemovedToast = (provider: string) => {
  return apiKeyToast({
    type: "info",
    provider,
    message: "Removed",
    description: `Your ${provider} API key has been removed.`,
  });
};

export const showApiKeyValidationToast = (provider: string, isValid: boolean, message?: string) => {
  if (isValid) {
    return apiKeyToast({
      type: "success",
      provider,
      message: "Validation Successful",
      description: message || `Your ${provider} API key is valid.`,
    });
  } else {
    return apiKeyToast({
      type: "error",
      provider,
      message: "Validation Failed",
      description: message || `Your ${provider} API key is invalid.`,
    });
  }
};
