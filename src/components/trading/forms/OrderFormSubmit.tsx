
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitTrade } from "@/services/tradeService";
import { TradeOrder } from "../types";

interface OrderFormSubmitProps {
  user: any;
  orderType: "buy" | "sell";
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  amount: string;
  currentPrice: number;
  limitPrice: string;
  stopPrice: string;
  isSimulated: boolean;
  aiAnalysis: any;
  onSubmitOrder: (order: TradeOrder) => void;
  onSubmitSuccess: () => void;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
}

const validateTradeParameters = (
  amount: string,
  orderExecutionType: string,
  limitPrice: string,
  stopPrice: string
): string | null => {
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return "Voer een geldig handelsvolume in";
  }

  if (orderExecutionType === "limit" && (!limitPrice || isNaN(Number(limitPrice)))) {
    return "Voer een geldige limietprijs in";
  }

  if (orderExecutionType === "stop" && (!stopPrice || isNaN(Number(stopPrice)))) {
    return "Voer een geldige stopprijs in";
  }

  if (orderExecutionType === "stop_limit" && 
      (!stopPrice || isNaN(Number(stopPrice)) || !limitPrice || isNaN(Number(limitPrice)))) {
    return "Voer zowel een geldige stop- als limietprijs in";
  }

  return null;
};

export const useOrderSubmit = ({
  user,
  orderType,
  orderExecutionType,
  amount,
  currentPrice,
  limitPrice,
  stopPrice,
  isSimulated,
  aiAnalysis,
  onSubmitOrder,
  onSubmitSuccess,
  onSubmitStart,
  onSubmitEnd
}: OrderFormSubmitProps) => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulier indiening gestart");

    if (!user) {
      toast({
        title: "Authenticatie vereist",
        description: "Log in om te handelen",
        variant: "destructive",
      });
      return;
    }

    const validationError = validateTradeParameters(amount, orderExecutionType, limitPrice, stopPrice);
    if (validationError) {
      toast({
        title: "Validatie fout",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    onSubmitStart();

    try {
      console.log("Order parameters validatie succesvol, bezig met indienen...");
      
      await submitTrade(
        user.id, 
        orderType, 
        orderExecutionType,
        Number(amount), 
        currentPrice,
        limitPrice ? Number(limitPrice) : undefined,
        stopPrice ? Number(stopPrice) : undefined,
        isSimulated
      );

      const order: TradeOrder = {
        type: orderType,
        orderType: orderExecutionType,
        amount: Number(amount),
        price: currentPrice,
        limitPrice: limitPrice ? Number(limitPrice) : undefined,
        stopPrice: stopPrice ? Number(stopPrice) : undefined,
        stopLoss: Number(aiAnalysis.stopLossRecommendation),
        takeProfit: Number(aiAnalysis.takeProfitRecommendation)
      };

      onSubmitOrder(order);
      toast({
        title: `${isSimulated ? "Gesimuleerde" : ""} Order Geplaatst`,
        description: `${orderType.toUpperCase()} ${orderExecutionType} order geplaatst voor ${amount} eenheden`,
      });

      onSubmitSuccess();
    } catch (error) {
      console.error("Fout bij het indienen van order:", error);
      toast({
        title: "Order Fout",
        description: error instanceof Error ? error.message : "Er is een fout opgetreden bij het plaatsen van de order",
        variant: "destructive",
      });
    } finally {
      onSubmitEnd();
    }
  };

  return { handleSubmit };
};
