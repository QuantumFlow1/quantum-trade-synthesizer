
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
}

export const AmountInput = ({ amount, onAmountChange }: AmountInputProps) => {
  return (
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
  );
};

