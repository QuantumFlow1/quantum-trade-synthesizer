
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiStatusAlertProps {
  apiStatus: string;
}

export const ApiStatusAlert = ({ apiStatus }: ApiStatusAlertProps) => {
  if (apiStatus !== 'unavailable') return null;
  
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertDescription>
        Market data API is currently unavailable. Using simulated data instead.
      </AlertDescription>
    </Alert>
  );
};
