
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

export const ErrorState = ({ errorMessage, onRetry }: ErrorStateProps) => {
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
