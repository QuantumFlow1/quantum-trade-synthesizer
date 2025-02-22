
import { useState } from "react";
import { TradeOrder } from "./types";

export interface TradeFormValidation {
  amount: string | null;
  limitPrice: string | null;
  stopPrice: string | null;
  stopLoss: string | null;
  takeProfit: string | null;
}

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
  const [validation, setValidation] = useState<TradeFormValidation>({
    amount: null,
    limitPrice: null,
    stopPrice: null,
    stopLoss: null,
    takeProfit: null
  });

  const validateForm = (): boolean => {
    const newValidation: TradeFormValidation = {
      amount: null,
      limitPrice: null,
      stopPrice: null,
      stopLoss: null,
      takeProfit: null
    };

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newValidation.amount = "Voer een geldig handelsvolume in";
    }

    if (orderExecutionType === "limit" && (!limitPrice || isNaN(Number(limitPrice)))) {
      newValidation.limitPrice = "Voer een geldige limietprijs in";
    }

    if ((orderExecutionType === "stop" || orderExecutionType === "stop_limit") && 
        (!stopPrice || isNaN(Number(stopPrice)))) {
      newValidation.stopPrice = "Voer een geldige stopprijs in";
    }

    setValidation(newValidation);
    return !Object.values(newValidation).some(error => error !== null);
  };

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
    setIsSubmitting,
    validation,
    validateForm
  };
};
