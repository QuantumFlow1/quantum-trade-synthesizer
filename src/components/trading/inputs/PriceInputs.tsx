
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceInputsProps {
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  limitPrice: string;
  stopPrice: string;
  onLimitPriceChange: (value: string) => void;
  onStopPriceChange: (value: string) => void;
}

export const PriceInputs = ({
  orderExecutionType,
  limitPrice,
  stopPrice,
  onLimitPriceChange,
  onStopPriceChange,
}: PriceInputsProps) => {
  return (
    <>
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
    </>
  );
};

