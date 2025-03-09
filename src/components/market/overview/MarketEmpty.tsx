
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MarketEmptyProps {
  onRetry: () => void;
}

export const MarketEmpty: React.FC<MarketEmptyProps> = ({ onRetry }) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Geen marktdata beschikbaar</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Er is momenteel geen marktdata beschikbaar. Dit kan komen door onderhoud of een tijdelijke storing.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="w-fit"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Vernieuwen
        </Button>
      </AlertDescription>
    </Alert>
  );
};
