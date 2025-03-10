
import { StockbotChatContainer } from "./components/stockbot/StockbotChatContainer";

interface StockbotChatProps {
  hasApiKey?: boolean;
  marketData?: any[];
}

export const StockbotChat = ({ 
  hasApiKey = false, 
  marketData = [] 
}: StockbotChatProps) => {
  return <StockbotChatContainer hasApiKey={hasApiKey} marketData={marketData} />;
};
