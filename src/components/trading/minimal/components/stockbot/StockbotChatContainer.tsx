
import { Card, CardContent } from "@/components/ui/card";
import { StockbotProvider } from "../../contexts/StockbotContext";
import { StockbotChatContent } from "./StockbotChatContent";

interface StockbotChatContainerProps {
  hasApiKey?: boolean;
  marketData?: any[];
}

export const StockbotChatContainer = ({ 
  hasApiKey = false, 
  marketData = [] 
}: StockbotChatContainerProps) => {
  return (
    <Card className="flex flex-col h-[500px] shadow-md overflow-hidden">
      <StockbotProvider marketData={marketData}>
        <StockbotChatContent />
      </StockbotProvider>
    </Card>
  );
};
