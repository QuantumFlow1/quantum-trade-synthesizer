
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderParametersProps {
  amount: string;
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  limitPrice: string;
  stopPrice: string;
  stopLoss: string;
  takeProfit: string;
  onAmountChange: (value: string) => void;
  onLimitPriceChange: (value: string) => void;
  onStopPriceChange: (value: string) => void;
  onStopLossChange: (value: string) => void;
  onTakeProfitChange: (value: string) => void;
}

export const OrderParameters = ({
  amount,
  orderExecutionType,
  limitPrice,
  stopPrice,
  stopLoss,
  takeProfit,
  onAmountChange,
  onLimitPriceChange,
  onStopPriceChange,
  onStopLossChange,
  onTakeProfitChange,
}: OrderParametersProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="bg-background/50"
          placeholder="Enter amount..."
        />
      </div>

      {(orderExecutionType === "limit" || orderExecutionType === "stop_limit") && (
        <div className="space-y-2">
          <Label htmlFor="limitPrice">Limit Price</Label>
          <Input
            id="limitPrice"
            type="number"
            value={limitPrice}
            onChange={(e) => onLimitPriceChange(e.target.value)}
            className="bg-background/50"
            placeholder="Enter limit price..."
          />
        </div>
      )}

      {(orderExecutionType === "stop" || orderExecutionType === "stop_limit") && (
        <div className="space-y-2">
          <Label htmlFor="stopPrice">Stop Price</Label>
          <Input
            id="stopPrice"
            type="number"
            value={stopPrice}
            onChange={(e) => onStopPriceChange(e.target.value)}
            className="bg-background/50"
            placeholder="Enter stop price..."
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stopLoss">Stop Loss</Label>
          <Input
            id="stopLoss"
            type="number"
            value={stopLoss}
            onChange={(e) => onStopLossChange(e.target.value)}
            className="bg-background/50"
            placeholder="Optional..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="takeProfit">Take Profit</Label>
          <Input
            id="takeProfit"
            type="number"
            value={takeProfit}
            onChange={(e) => onTakeProfitChange(e.target.value)}
            className="bg-background/50"
            placeholder="Optional..."
          />
        </div>
      </div>
    </>
  );
};
