
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderParameters } from "../OrderParameters";
import { Zap, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdvancedOrderFormProps {
  apiEnabled: boolean;
  advancedSignal: any;
  fetchAdvancedSignal: () => Promise<void>;
  amount: string;
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  limitPrice: string;
  stopPrice: string;
  stopLoss: string;
  takeProfit: string;
  isSubmitting: boolean;
  orderType: "buy" | "sell";
  onAmountChange: (value: string) => void;
  onLimitPriceChange: (value: string) => void;
  onStopPriceChange: (value: string) => void;
  onStopLossChange: (value: string) => void;
  onTakeProfitChange: (value: string) => void;
  onApplySignal: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AdvancedOrderForm = ({
  apiEnabled,
  advancedSignal,
  fetchAdvancedSignal,
  amount,
  orderExecutionType,
  limitPrice,
  stopPrice,
  stopLoss,
  takeProfit,
  isSubmitting,
  orderType,
  onAmountChange,
  onLimitPriceChange,
  onStopPriceChange,
  onStopLossChange,
  onTakeProfitChange,
  onApplySignal,
  onSubmit
}: AdvancedOrderFormProps) => {
  const { toast } = useToast();

  if (!apiEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
        <Lock className="w-12 h-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">API Toegang Vergrendeld</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Je huidige rol geeft geen toegang tot API-gebaseerde handelsfuncties. Neem contact op met een beheerder om toegang te krijgen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium">API-gebaseerde Trading</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Button 
          variant="outline" 
          onClick={fetchAdvancedSignal}
          className="bg-primary/20 hover:bg-primary/30 border-primary/30"
        >
          <Zap className="w-4 h-4 mr-2" />
          Genereer Geavanceerd Signaal
        </Button>
        
        {advancedSignal && (
          <Card className="p-4 bg-primary/10 border-primary/20">
            <h4 className="text-md font-medium mb-2">Geavanceerd Trading Signaal</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Richting:</strong> {advancedSignal.direction}</div>
              <div><strong>Entry Prijs:</strong> {advancedSignal.entry_price}</div>
              <div><strong>Stop Loss:</strong> {advancedSignal.stop_loss}</div>
              <div><strong>Take Profit:</strong> {advancedSignal.take_profit}</div>
              <div><strong>Vertrouwen:</strong> {advancedSignal.confidence}%</div>
              <div className="pt-2 border-t border-primary/20">
                <strong>Redenering:</strong><br/>
                <p className="text-muted-foreground">{advancedSignal.reasoning}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-primary/20">
              <Button
                onClick={onApplySignal}
                className="w-full"
              >
                Pas dit Signaal Toe op Order Formulier
              </Button>
            </div>
          </Card>
        )}
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4 mt-4 pt-4 border-t border-white/10">
        <OrderParameters
          amount={amount}
          orderExecutionType={orderExecutionType}
          limitPrice={limitPrice}
          stopPrice={stopPrice}
          stopLoss={stopLoss}
          takeProfit={takeProfit}
          onAmountChange={onAmountChange}
          onLimitPriceChange={onLimitPriceChange}
          onStopPriceChange={onStopPriceChange}
          onStopLossChange={onStopLossChange}
          onTakeProfitChange={onTakeProfitChange}
        />

        <Button 
          type="submit" 
          className={`w-full ${
            orderType === "buy" 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verwerken..." : `Plaats API ${orderType.toUpperCase()} Order`}
        </Button>
      </form>
    </div>
  );
};
