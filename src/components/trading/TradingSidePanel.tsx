
import { TradeOrderForm } from "./TradeOrderForm";
import TransactionList from "../TransactionList";
import PositionsList from "./PositionsList";

interface TradingSidePanelProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
  positions: any[];
  isLoading: boolean;
}

export const TradingSidePanel = ({ 
  apiStatus, 
  positions, 
  isLoading 
}: TradingSidePanelProps) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <TradeOrderForm apiStatus={apiStatus} />
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Open Positions</h3>
        <PositionsList positions={positions} isLoading={isLoading} />
      </div>
      <TransactionList />
    </div>
  );
};
