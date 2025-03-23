
import { useState, useEffect } from "react";
import { MarketHeader } from "./market/MarketHeader";
import { MarketTabs } from "./market/MarketTabs";
import { useMarketData } from "./market/useMarketData";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MarketPage = () => {
  const [activeTab, setActiveTab] = useState("enhanced");
  const [walletConnected, setWalletConnected] = useState(false);
  const { 
    marketData, 
    isLoading, 
    fetchMarketData
  } = useMarketData();

  // Ensure we have a valid tab on component mount
  useEffect(() => {
    console.log("MarketPage initialized with activeTab:", activeTab);
  }, []);

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
  };

  const handleRefresh = () => {
    console.log("Refreshing market data...");
    fetchMarketData();
  };

  // Handle tab changes explicitly with console log for debugging
  const handleTabChange = (tab: string) => {
    console.log("Changing main market tab to:", tab);
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      <MarketHeader isLoading={isLoading} onRefresh={handleRefresh} />

      <div className="h-[calc(100vh-220px)] overflow-auto">
        <MarketTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          marketData={marketData}
          isLoading={isLoading}
          walletConnected={walletConnected}
          onConnect={handleConnectWallet}
          onDisconnect={handleDisconnectWallet}
        />
      </div>
    </div>
  );
};
