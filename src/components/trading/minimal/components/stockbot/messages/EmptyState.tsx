
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasApiKey: boolean;
  onConfigureApiKey: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  hasApiKey, 
  onConfigureApiKey 
}) => {
  return (
    <div className="text-center text-gray-500 h-full flex flex-col items-center justify-center">
      <p className="mb-2">Hello! I'm Stockbot, your virtual trading assistant. How can I help you today?</p>
      {!hasApiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2 max-w-md text-sm text-amber-700">
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Note: This is a simulated response. For personalized AI-powered analysis, admin API keys are being checked.
          </p>
        </div>
      )}
    </div>
  );
};
