
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
    console.log("Form submission started");

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to trade",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid trading amount",
        variant: "destructive",
      });
      return;
    }

    onSubmitStart();

    try {
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
        title: `${isSimulated ? "Simulated" : ""} Order Placed`,
        description: `${orderType.toUpperCase()} ${orderExecutionType} order placed for ${amount} units`,
      });

      onSubmitSuccess();
    } finally {
      onSubmitEnd();
    }
  };

  return { handleSubmit };
};
