
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useMarketData } from "./market/useMarketData";
import { MarketHeader } from "./market/MarketHeader";
import { MarketTabs } from "./market/MarketTabs";

export const MarketPage = () => {
  const [activeTab, setActiveTab] = useState<string>("api");
  
  const {
    isLoading,
    sortField,
    sortDirection,
    selectedMarket,
    uniqueMarkets,
    sortedAndFilteredData,
    fetchMarketData,
    toggleSortDirection,
    handleSortChange,
    setSelectedMarket,
  } = useMarketData();

  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <MarketHeader isLoading={isLoading} onRefresh={fetchMarketData} />

        <MarketTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoading={isLoading}
          selectedMarket={selectedMarket}
          setSelectedMarket={setSelectedMarket}
          sortDirection={sortDirection}
          toggleSortDirection={toggleSortDirection}
          sortField={sortField}
          handleSortChange={handleSortChange}
          sortedAndFilteredData={sortedAndFilteredData}
          uniqueMarkets={uniqueMarkets}
        />
      </Card>
    </div>
  );
};
