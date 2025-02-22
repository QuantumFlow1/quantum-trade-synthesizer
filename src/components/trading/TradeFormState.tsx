
import { useState } from "react";
import { TradeOrder } from "./types";

export const useTradeFormState = () => {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderExecutionType, setOrderExecutionType] = useState<"market" | "limit" | "stop" | "stop_limit">("market");
  const [amount, setAmount] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [isSimulated, setIsSimulated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return {
    orderType,
    setOrderType,
    orderExecutionType,
    setOrderExecutionType,
    amount,
    setAmount,
    limitPrice,
    setLimitPrice,
    stopPrice,
    setStopPrice,
    stopLoss,
    setStopLoss,
    takeProfit,
    setTakeProfit,
    isSimulated,
    setIsSimulated,
    isSubmitting,
    setIsSubmitting
  };
};
