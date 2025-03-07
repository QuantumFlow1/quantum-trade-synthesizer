
import React from "react";
import { TabsContent as UITabsContent } from "@/components/ui/tabs";
import { TradingTabContent } from "../TradingTabContent";
import { IndicatorType } from "../charts/types/types";
import { TradingDataPoint } from "@/utils/tradingData";

interface TabsContentProps {
  data: TradingDataPoint[];
  chartType: "candles" | "line" | "area" | "bars";
  scale: number;
  indicator: IndicatorType;
  setIndicator: (indicator: IndicatorType) => void;
  showReplayMode: boolean;
  isLoading: boolean;
}

const TabsContent: React.FC<TabsContentProps> = ({
  data,
  chartType,
  scale,
  indicator,
  setIndicator,
  showReplayMode,
  isLoading
}) => {
  return (
    <>
      <UITabsContent value="price">
        <TradingTabContent 
          tabValue="price"
          data={data}
          chartType={chartType}
          scale={scale}
          indicator={indicator}
          setIndicator={setIndicator}
          showReplayMode={showReplayMode}
          isLoading={isLoading}
        />
      </UITabsContent>

      <UITabsContent value="volume">
        <TradingTabContent 
          tabValue="volume"
          data={data}
          chartType={chartType}
          scale={scale}
          indicator={indicator}
          setIndicator={setIndicator}
          showReplayMode={false}
          isLoading={isLoading}
        />
      </UITabsContent>

      <UITabsContent value="indicators">
        <TradingTabContent 
          tabValue="indicators"
          data={data}
          chartType={chartType}
          scale={scale}
          indicator={indicator}
          setIndicator={setIndicator}
          showReplayMode={false}
          isLoading={isLoading}
        />
      </UITabsContent>
    </>
  );
};

export default TabsContent;
