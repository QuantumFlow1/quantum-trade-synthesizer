
import { Button } from "@/components/ui/button";

interface OrderSubmitButtonProps {
  orderType: "buy" | "sell";
  isSimulated: boolean;
  orderExecutionType: string;
  isSubmitting: boolean;
  isAnalyzing: boolean;
}

export const OrderSubmitButton = ({
  orderType,
  isSimulated,
  orderExecutionType,
  isSubmitting,
  isAnalyzing
}: OrderSubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className={`w-full ${
        orderType === "buy" 
          ? "bg-green-500 hover:bg-green-600" 
          : "bg-red-500 hover:bg-red-600"
      }`}
      disabled={isSubmitting || isAnalyzing}
    >
      {isSubmitting ? "Processing..." : isAnalyzing ? "Analyzing..." : `Place ${isSimulated ? "Simulated" : ""} ${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} Order`}
    </Button>
  );
};
