
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface OrderTypeSelectorProps {
  value: "buy" | "sell";
  onValueChange: (value: "buy" | "sell") => void;
}

export const OrderTypeSelector = ({ value, onValueChange }: OrderTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Order Type</Label>
      <RadioGroup
        value={value}
        onValueChange={(value) => onValueChange(value as "buy" | "sell")}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="buy" id="buy" />
          <Label htmlFor="buy" className="flex items-center space-x-2 cursor-pointer">
            <ArrowUpCircle className="w-4 h-4 text-green-500" />
            <span>Buy</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sell" id="sell" />
          <Label htmlFor="sell" className="flex items-center space-x-2 cursor-pointer">
            <ArrowDownCircle className="w-4 h-4 text-red-500" />
            <span>Sell</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
