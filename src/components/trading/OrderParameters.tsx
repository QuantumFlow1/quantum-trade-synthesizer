
import { AmountInput } from "./inputs/AmountInput";
import { PriceInputs } from "./inputs/PriceInputs";
import { ProfitLossInputs } from "./inputs/ProfitLossInputs";

interface OrderParametersProps {
  amount: string;
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  limitPrice: string;
  stopPrice: string;
  stopLoss: string;
  takeProfit: string;
  onAmountChange: (value: string) => void;
  onLimitPriceChange: (value: string) => void;
  onStopPriceChange: (value: string) => void;
  onStopLossChange: (value: string) => void;
  onTakeProfitChange: (value: string) => void;
}

export const OrderParameters = ({
  amount,
  orderExecutionType,
  limitPrice,
  stopPrice,
  stopLoss,
  takeProfit,
  onAmountChange,
  onLimitPriceChange,
  onStopPriceChange,
  onStopLossChange,
  onTakeProfitChange,
}: OrderParametersProps) => {
  return (
    <>
      <AmountInput 
        amount={amount}
        onAmountChange={onAmountChange}
      />

      <PriceInputs
        orderExecutionType={orderExecutionType}
        limitPrice={limitPrice}
        stopPrice={stopPrice}
        onLimitPriceChange={onLimitPriceChange}
        onStopPriceChange={onStopPriceChange}
      />

      <ProfitLossInputs
        stopLoss={stopLoss}
        takeProfit={takeProfit}
        onStopLossChange={onStopLossChange}
        onTakeProfitChange={onTakeProfitChange}
      />
    </>
  );
};

