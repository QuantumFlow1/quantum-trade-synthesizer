
import { TradeOrderForm } from "./TradeOrderForm";
import PositionsList from "./PositionsList";
import TransactionList from "@/components/TransactionList";
import { usePositions } from "@/hooks/use-positions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TradingOrderSectionProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const TradingOrderSection = ({ apiStatus }: TradingOrderSectionProps) => {
  const { positions, isLoading: positionsLoading } = usePositions();

  return (
    <div className="lg:col-span-1 space-y-6">
      {apiStatus === 'unavailable' && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Issue</AlertTitle>
          <AlertDescription>
            Trading services are currently unavailable. You can view data but trading functionality is limited.
          </AlertDescription>
        </Alert>
      )}
      
      {apiStatus === 'checking' && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Checking Trading Services</AlertTitle>
          <AlertDescription>
            Verifying connection to trading services...
          </AlertDescription>
        </Alert>
      )}
      
      <TradeOrderForm apiStatus={apiStatus} />
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Open Positions</h3>
        <PositionsList positions={positions} isLoading={positionsLoading} />
      </div>
      <TransactionList />
    </div>
  );
};
