
import { TradeOrderForm } from "./TradeOrderForm";
import PositionsList from "./PositionsList";
import TransactionList from "@/components/TransactionList";
import { usePositions } from "@/hooks/use-positions";

interface TradingOrderSectionProps {
  apiStatus: 'checking' | 'available' | 'unavailable';
}

export const TradingOrderSection = ({ apiStatus }: TradingOrderSectionProps) => {
  const { positions, isLoading: positionsLoading } = usePositions();

  return (
    <div className="lg:col-span-1 space-y-6">
      <TradeOrderForm apiStatus={apiStatus} />
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Open Positions</h3>
        <PositionsList positions={positions} isLoading={positionsLoading} />
      </div>
      <TransactionList />
    </div>
  );
};

