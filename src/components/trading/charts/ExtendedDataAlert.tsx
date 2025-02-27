
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ExtendedDataAlertProps {
  showExtendedData: boolean;
}

export const ExtendedDataAlert = ({ showExtendedData }: ExtendedDataAlertProps) => {
  const [showAlert, setShowAlert] = useState(false);
  
  // Handle showing extended data alert
  useEffect(() => {
    if (showExtendedData) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showExtendedData]);

  if (!showAlert) return null;

  return (
    <Alert variant="warning" className="absolute top-2 right-2 z-10 w-auto">
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        Loading extended historical data...
      </AlertDescription>
    </Alert>
  );
};
