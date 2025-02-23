
import { useState } from "react";
import { TradeOrder } from "./types";
import { BulkOrderModal } from "./BulkOrderModal";
import { useTradeAnalysis } from "@/hooks/use-trade-analysis";
import { AnalysisPanel } from "./panels/AnalysisPanel";
import { AutomatedTradingPanel } from "./AutomatedTradingPanel";
import { OrderForm } from "./forms/OrderForm";

interface TradeOrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
}

export const TradeOrderForm = ({ currentPrice, onSubmitOrder }: TradeOrderFormProps) => {
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const { aiAnalysis, isAnalyzing } = useTradeAnalysis({
    isActive: true,
    riskLevel: "medium",
    isRapidMode: false,
    simulationMode: false
  });

  const handleBulkOrderClick = () => {
    console.log("Opening bulk order modal");
    setIsBulkModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisPanel 
          aiAnalysis={aiAnalysis}
          onBulkOrderClick={handleBulkOrderClick}
        />
        <div>
          <AutomatedTradingPanel simulationMode={isSimulated} />
        </div>
      </div>
      
      <OrderForm 
        currentPrice={currentPrice}
        onSubmitOrder={onSubmitOrder}
        isSimulated={isSimulated}
        setIsSimulated={setIsSimulated}
      />

      <BulkOrderModal 
        isOpen={isBulkModalOpen}
        onOpenChange={setIsBulkModalOpen}
      />
    </div>
  );
};

