
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const ApiStatusAlert = ({ apiStatus }: { apiStatus: string }) => {
  if (apiStatus === 'available') {
    return null;
  }

  return (
    <Alert variant={apiStatus === 'checking' ? "default" : "destructive"}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {apiStatus === 'checking' ? 'API status controleren...' : 'API verbinding mislukt'}
      </AlertTitle>
      <AlertDescription>
        {apiStatus === 'checking'
          ? 'Een moment geduld, we controleren de API status.'
          : 'Er kon geen verbinding worden gemaakt met de trading API. Probeer het later opnieuw.'}
      </AlertDescription>
    </Alert>
  );
};

export const LoadingState = () => {
  return (
    <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 border rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-muted-foreground">Trading gegevens worden geladen...</p>
      </div>
    </div>
  );
};
