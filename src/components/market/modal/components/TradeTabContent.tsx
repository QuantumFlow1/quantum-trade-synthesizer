import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowDownUp, Settings, AlertTriangle } from 'lucide-react';
import { MarketData } from '@/components/market/types';

interface TradeTabContentProps {
  marketData: MarketData;
  marketName: string | null; // marketName property
  orderType: string; // orderType property
  amount: string;
  setAmount: (value: string) => void;
  leverage: string;
  setLeverage: (value: string) => void;
  side: "buy" | "sell";
  setSide: (value: "buy" | "sell") => void;
  orderPrice: string;
  setOrderPrice: (value: string) => void;
  advancedOptions: boolean;
  setAdvancedOptions: (value: boolean) => void;
}

export const TradeTabContent = ({
  marketData,
  marketName,
  orderType,
  amount,
  setAmount,
  leverage,
  setLeverage,
  side,
  setSide,
  orderPrice,
  setOrderPrice,
  advancedOptions,
  setAdvancedOptions
}) => {
  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {side === "buy" ? "Buy" : "Sell"} {marketName}
          </h2>
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <Switch id="advanced" onCheckedChange={setAdvancedOptions} />
            <Label htmlFor="advanced" className="text-sm">
              Advanced
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leverage">Leverage</Label>
          <Select value={leverage} onValueChange={setLeverage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="1x" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 5, 10, 20].map((l) => (
                <SelectItem key={l} value={l.toString()}>
                  {l}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {advancedOptions && (
          <div className="space-y-2">
            <Label htmlFor="price">Order Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Market Price"
              value={orderPrice}
              onChange={(e) => setOrderPrice(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between text-sm text-muted-foreground">
          <p>Estimated Fee: 0.0012 BTC</p>
          <p>
            Available Balance: {marketData?.price || 'N/A'} USD
          </p>
        </div>

        <Button className="w-full" onClick={() => alert('Trade Placed!')}>
          {side === "buy" ? "Buy" : "Sell"} {marketName}
        </Button>

        <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">High Volatility Warning</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Trading {marketName} involves significant risk due to high market
            volatility. Please trade with caution.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
