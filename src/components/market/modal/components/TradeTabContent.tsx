import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { BarChart, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { MarketData } from '../../types';

interface TradeTabContentProps {
  marketData: MarketData;
  amount: string;
  setAmount: (value: string) => void;
  leverage: string;
  setLeverage: (value: string) => void;
  advancedOptions: boolean;
  setAdvancedOptions: (value: boolean) => void;
  stopLoss: string;
  setStopLoss: (value: string) => void;
  takeProfit: string;
  setTakeProfit: (value: string) => void;
  handleBuyClick: () => void;
  handleSellClick: () => void;
}

export const TradeTabContent = ({
  marketData,
  amount,
  setAmount,
  leverage,
  setLeverage,
  advancedOptions,
  setAdvancedOptions,
  stopLoss,
  setStopLoss,
  takeProfit,
  setTakeProfit,
  handleBuyClick,
  handleSellClick
}: TradeTabContentProps) => {
  const form = useForm({
    defaultValues: {
      amount: amount,
      leverage: leverage,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
      advancedOptions: advancedOptions,
    },
  });

  useEffect(() => {
    form.reset({
      amount: amount,
      leverage: leverage,
      stopLoss: stopLoss,
      takeProfit: takeProfit,
      advancedOptions: advancedOptions,
    });
  }, [amount, leverage, stopLoss, takeProfit, advancedOptions, form]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leverage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leverage</FormLabel>
              <FormControl>
                <Slider
                  defaultValue={[parseFloat(leverage)]}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    setLeverage(value[0].toString());
                    field.onChange(value[0].toString());
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="advancedOptions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Advanced Options</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={advancedOptions}
                  onCheckedChange={(checked) => {
                    setAdvancedOptions(checked);
                    field.onChange(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {advancedOptions && (
          <>
            <FormField
              control={form.control}
              name="stopLoss"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop Loss</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={stopLoss}
                      onChange={(e) => {
                        setStopLoss(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="takeProfit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Take Profit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={takeProfit}
                      onChange={(e) => {
                        setTakeProfit(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-center gap-4">
          <Button className="bg-green-500 hover:bg-green-600" onClick={handleBuyClick}>
            Buy
          </Button>
          <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={handleSellClick}>
            Sell
          </Button>
        </div>
      </form>
    </Form>
  );
};
