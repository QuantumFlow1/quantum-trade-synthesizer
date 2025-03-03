
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
  marketData: any;
  marketName: any;
  orderType: any;
  amount: any;
  setAmount: any;
  leverage: any;
  setLeverage: any;
  side: any;
  setSide: any;
  orderPrice: any;
  setOrderPrice: any;
  advancedOptions: any;
  setAdvancedOptions: any;
  // Add the missing prop
  setOrderType: any;
  // Add other props that might be missing based on the error
  latestData?: any;
  isPriceUp?: any;
  change24h?: any;
  handleBuyClick?: any;
  handleSellClick?: any;
  stopLoss?: any;
  setStopLoss?: any;
  takeProfit?: any;
  setTakeProfit?: any;
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
  setAdvancedOptions,
  // Include the new props in the component destructuring
  setOrderType,
  latestData,
  isPriceUp,
  change24h,
  handleBuyClick,
  handleSellClick,
  stopLoss,
  setStopLoss,
  takeProfit,
  setTakeProfit
}: TradeTabContentProps) => {
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

        {/* Add order type selection if setOrderType is available */}
        {setOrderType && (
          <div className="space-y-2">
            <Label htmlFor="orderType">Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

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

        {/* Add stop loss and take profit if they exist */}
        {advancedOptions && setStopLoss && (
          <div className="space-y-2">
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Input
              id="stopLoss"
              type="number"
              placeholder="Stop Loss"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
            />
          </div>
        )}

        {advancedOptions && setTakeProfit && (
          <div className="space-y-2">
            <Label htmlFor="takeProfit">Take Profit</Label>
            <Input
              id="takeProfit"
              type="number"
              placeholder="Take Profit"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between text-sm text-muted-foreground">
          <p>Estimated Fee: 0.0012 BTC</p>
          <p>
            Available Balance: {marketData?.price || 'N/A'} USD
          </p>
        </div>

        {/* Use buy/sell handlers if available */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            className="w-full bg-green-500 hover:bg-green-600" 
            onClick={handleBuyClick || (() => alert('Buy Clicked!'))}
          >
            Buy {marketName}
          </Button>
          <Button 
            className="w-full bg-red-500 hover:bg-red-600" 
            onClick={handleSellClick || (() => alert('Sell Clicked!'))}
          >
            Sell {marketName}
          </Button>
        </div>

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
