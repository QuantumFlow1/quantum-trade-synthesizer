
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface Currency {
  symbol: string;
  name: string;
  network: string;
  min: number;
  max: number;
}

interface CurrencySelectorProps {
  selectedCurrency: string;
  setSelectedCurrency: (value: string) => void;
  currencies: Currency[];
  id: string;
}

export const CurrencySelector = ({
  selectedCurrency,
  setSelectedCurrency,
  currencies,
  id
}: CurrencySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Select Currency</Label>
      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map(currency => (
            <SelectItem key={currency.symbol} value={currency.symbol}>
              <div className="flex items-center gap-2">
                <span>{currency.symbol}</span>
                <span className="text-xs text-muted-foreground">({currency.name})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
