
import { useModalCore } from './useModalCore';
import { useTradeHistory } from './useTradeHistory';
import { usePositions } from './usePositions';
import { useTradeActions } from './useTradeActions';
import { ChartData } from '../../types';

interface UseModalDataProps {
  marketName: string | null;
  marketData: ChartData[];
  onClose: () => void;
}

export const useModalData = (props: UseModalDataProps) => {
  const core = useModalCore(props);
  
  const tradeHistory = useTradeHistory({
    marketName: core.marketName,
    userId: core.user?.id || null,
    latestPrice: core.latestData.price,
    previousPrice: core.previousPrice
  });
  
  const positions = usePositions({
    marketName: core.marketName,
    userId: core.user?.id || null
  });
  
  const tradeActions = useTradeActions({
    marketName: core.marketName,
    userId: core.user?.id || null,
    latestPrice: core.latestData.price
  });

  // Combine position state from different hooks
  if (positions.hasPositions !== core.hasPositions) {
    core.setHasPositions(positions.hasPositions);
  }

  const handleBuyClick = async () => {
    await tradeActions.handleBuyClick(
      core.amount,
      core.stopLoss,
      core.takeProfit,
      core.advancedOptions,
      core.setHasPositions,
      core.setCurrentTab
    );
  };

  const handleSellClick = async () => {
    await tradeActions.handleSellClick(
      core.amount,
      core.stopLoss,
      core.takeProfit,
      core.advancedOptions
    );
  };

  return {
    // Form state
    amount: core.amount,
    setAmount: core.setAmount,
    leverage: core.leverage,
    setLeverage: core.setLeverage,
    orderType: core.orderType,
    setOrderType: core.setOrderType,
    hasPositions: core.hasPositions,
    setHasPositions: core.setHasPositions,
    stopLoss: core.stopLoss,
    setStopLoss: core.setStopLoss,
    takeProfit: core.takeProfit,
    setTakeProfit: core.setTakeProfit,
    advancedOptions: core.advancedOptions,
    setAdvancedOptions: core.setAdvancedOptions,
    
    // Trade history
    ...tradeHistory,
    
    // Market data
    fullMarketData: core.fullMarketData,
    latestData: core.latestData,
    previousPrice: core.previousPrice,
    isPriceUp: core.isPriceUp,
    change24h: core.change24h,
    
    // Actions
    handleBuyClick,
    handleSellClick,
    
    // UI state
    currentTab: core.currentTab,
    setCurrentTab: core.setCurrentTab
  };
};
