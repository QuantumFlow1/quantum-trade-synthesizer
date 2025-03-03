
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { ChartData, MarketData } from "../types";
import { useModalData } from "./hooks/useModalData";
import { ModalHeader } from "./components/ModalHeader";
import { ChartTabContent } from "./components/ChartTabContent";
import { TradeTabContent } from "./components/TradeTabContent";
import { PositionsTabContent } from "./components/PositionsTabContent";
import { PerformanceTabContent } from "./components/PerformanceTabContent";

interface MarketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketName: string | null;
  marketData: ChartData[];
}

export const MarketDetailModal = ({
  isOpen,
  onClose,
  marketName,
  marketData
}: MarketDetailModalProps) => {
  const [currentTab, setCurrentTab] = useState<string>("chart");
  
  const {
    amount,
    setAmount,
    leverage,
    setLeverage,
    orderType,
    setOrderType,
    hasPositions,
    setHasPositions,
    stopLoss,
    setStopLoss,
    takeProfit,
    setTakeProfit,
    advancedOptions,
    setAdvancedOptions,
    tradeHistory,
    profitLoss,
    isHistoryLoading,
    fullMarketData,
    latestData,
    previousPrice,
    isPriceUp,
    change24h,
    handleBuyClick,
    handleSellClick
  } = useModalData({ marketName, marketData, onClose });

  useEffect(() => {
    // Reset tab to chart when opening modal
    if (isOpen) {
      setCurrentTab("chart");
    }
  }, [isOpen]);

  if (!marketName || !marketData.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <ModalHeader 
          marketName={marketName} 
          latestData={latestData} 
          isPriceUp={isPriceUp} 
        />

        <Tabs defaultValue="chart" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="chart">Price & Chart</TabsTrigger>
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="positions" disabled={!hasPositions}>Your Positions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-6">
            <ChartTabContent 
              marketData={fullMarketData}
              marketName={marketName}
              data={marketData}
              isPriceUp={isPriceUp}
            />
          </TabsContent>
          
          <TabsContent value="trade">
            <TradeTabContent 
              marketData={fullMarketData}
              marketName={marketName}
              amount={amount}
              setAmount={setAmount}
              leverage={leverage}
              setLeverage={setLeverage}
              orderType={orderType}
              setOrderType={setOrderType}
              latestData={latestData}
              isPriceUp={isPriceUp}
              change24h={change24h}
              handleBuyClick={handleBuyClick}
              handleSellClick={handleSellClick}
              stopLoss={stopLoss}
              setStopLoss={setStopLoss}
              takeProfit={takeProfit}
              setTakeProfit={setTakeProfit}
              advancedOptions={advancedOptions}
              setAdvancedOptions={setAdvancedOptions}
            />
          </TabsContent>
          
          <TabsContent value="positions">
            <PositionsTabContent 
              marketName={marketName}
              hasPositions={hasPositions}
              amount={amount}
              leverage={leverage}
              latestData={latestData}
              isPriceUp={isPriceUp}
              setCurrentTab={setCurrentTab}
            />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceTabContent
              marketName={marketName}
              tradeHistory={tradeHistory}
              profitLoss={profitLoss}
              isLoading={isHistoryLoading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
