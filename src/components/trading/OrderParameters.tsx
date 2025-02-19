
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderParametersProps {
  amount: string;
  stopLoss: string;
  takeProfit: string;
  onAmountChange: (value: string) => void;
  onStopLossChange: (value: string) => void;
  onTakeProfitChange: (value: string) => void;
}

export const OrderParameters = ({
  amount,
  stopLoss,
  takeProfit,
  onAmountChange,
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
