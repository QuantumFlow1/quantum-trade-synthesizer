
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketErrorProps {
  errorMessage?: string;
  onRetry: () => void;
}

export const MarketError: React.FC<MarketErrorProps> = ({ 
  errorMessage, 
  onRetry 
}) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Er is een probleem opgetreden</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>De marktdata kon niet correct worden verwerkt: {errorMessage || "Verbinding verbroken"}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="w-fit"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Opnieuw proberen
        </Button>
      </AlertDescription>
    </Alert>
  );
};
