
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const ApiKeyWarning: React.FC = () => {
  return (
    <Alert variant="warning">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>API Key Required</AlertTitle>
      <AlertDescription>
        No API keys found. Please add your API key in the API Keys tab to use AI agents.
      </AlertDescription>
    </Alert>
  );
};
