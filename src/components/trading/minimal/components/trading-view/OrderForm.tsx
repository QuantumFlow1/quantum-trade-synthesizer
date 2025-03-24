
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface OrderFormProps {
  currentPrice: number;
  selectedPosition?: any;
  assetType?: 'crypto' | 'stock' | 'forex' | 'commodity';
  assetSymbol?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({ 
  currentPrice, 
  selectedPosition,
  assetType = 'crypto',
  assetSymbol = 'BTC/USDT'
}) => {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState(currentPrice.toString());
  const [stopPrice, setStopPrice] = useState(currentPrice.toString());
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // If a position is selected, default to selling that position
    if (selectedPosition) {
      setSide('sell');
      setAmount(selectedPosition.amount.toString());
    }
  }, [selectedPosition]);

  useEffect(() => {
    // Calculate total based on amount and current, limit, or stop price
    const amountValue = parseFloat(amount) || 0;
    const priceValue = orderType === 'market' ? 
      currentPrice : 
      orderType === 'limit' ? 
        parseFloat(limitPrice) || currentPrice : 
        parseFloat(stopPrice) || currentPrice;
    
    setTotal(amountValue * priceValue);
  }, [amount, orderType, limitPrice, stopPrice, currentPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Display toast notification for order submission
    toast({
      title: `${side.toUpperCase()} Order Submitted`,
      description: `${orderType.toUpperCase()} order to ${side} ${amount} ${assetSymbol} at ${formatPrice(
        orderType === 'market' ? currentPrice : 
        orderType === 'limit' ? parseFloat(limitPrice) || currentPrice : 
        parseFloat(stopPrice) || currentPrice
      )}`,
    });
  };

  // Format the price based on asset type
  const formatPrice = (price: number) => {
    if (assetType === 'forex') {
      return price.toFixed(4);
    } else if (price < 1 && assetType === 'crypto') {
      return price.toFixed(6);
    } else {
      return formatCurrency(price);
    }
  };

  // Get currency symbol based on asset type
  const getCurrencySymbol = () => {
    switch (assetType) {
      case 'crypto':
        return assetSymbol.split('/')[1] || 'USDT';
      case 'forex':
        return assetSymbol.split('/')[1] || 'USD';
      default:
        return 'USD';
    }
  };

  // Get quantity unit based on asset type
  const getQuantityUnit = () => {
    switch (assetType) {
      case 'crypto':
        return assetSymbol.split('/')[0] || 'BTC';
      case 'forex':
        return 'lots';
      case 'stock':
        return 'shares';
      case 'commodity':
        return 'contracts';
      default:
        return 'units';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue={side} onValueChange={(value) => setSide(value as 'buy' | 'sell')}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Buy</TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Sell</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardContent className="p-3 space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">Order Type</label>
            <Select defaultValue={orderType} onValueChange={(value) => setOrderType(value as 'market' | 'limit' | 'stop')}>
              <SelectTrigger>
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              Amount ({getQuantityUnit()})
            </label>
            <Input 
              type="number" 
              placeholder={`Enter amount in ${getQuantityUnit()}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step={assetType === 'crypto' ? '0.01' : '1'}
              min="0"
            />
          </div>
          
          {orderType === 'limit' && (
            <div>
              <label className="text-sm font-medium mb-1 block">Limit Price</label>
              <Input 
                type="number" 
                placeholder="Enter limit price"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                step="0.01"
              />
            </div>
          )}
          
          {orderType === 'stop' && (
            <div>
              <label className="text-sm font-medium mb-1 block">Stop Price</label>
              <Input 
                type="number" 
                placeholder="Enter stop price"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                step="0.01"
              />
            </div>
          )}
          
          <div className="pt-2 border-t">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Price:</span>
              <span className="font-mono">{formatPrice(currentPrice)}</span>
            </div>
            
            {amount && (
              <div className="flex justify-between mt-1">
                <span className="text-sm text-muted-foreground">Total ({getCurrencySymbol()}):</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            variant={side === 'buy' ? 'default' : 'destructive'}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            {side === 'buy' ? 'Buy' : 'Sell'} {assetSymbol}
          </Button>
        </CardContent>
      </Card>

      {selectedPosition && side === 'sell' && (
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-3">
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Selling from your current position: {selectedPosition.amount} {assetSymbol} at {formatPrice(selectedPosition.entry_price)}
            </p>
          </CardContent>
        </Card>
      )}
    </form>
  );
};
