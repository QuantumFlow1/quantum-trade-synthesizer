
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfitLossInputsProps {
  stopLoss: string;
  takeProfit: string;
  onStopLossChange: (value: string) => void;
  onTakeProfitChange: (value: string) => void;
}

export const ProfitLossInputs = ({
  stopLoss,
  takeProfit,
  onStopLossChange,
  onTakeProfitChange,
}: ProfitLossInputsProps) => {
  return (
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
  );
};

