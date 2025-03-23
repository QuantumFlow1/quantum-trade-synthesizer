
import { useState } from "react";
import { MarketHeader } from "./market/MarketHeader";
import { MarketTabs } from "./market/MarketTabs";
import { TestnetTokenTab } from "./market/TestnetTokenTab";
import { WalletConnection } from "./market/WalletConnection";
import { useMarketData } from "./market/useMarketData";
import { EnhancedMarketTab } from "./market/EnhancedMarketTab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MarketPage = () => {
  const [activeTab, setActiveTab] = useState("enhanced");
  const [walletConnected, setWalletConnected] = useState(false);
  const { 
    marketData, 
    isLoading, 
    sortField,
    sortDirection,
    handleSortChange,
    fetchMarketData
  } = useMarketData();

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

      <MarketTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <ScrollArea className="h-[calc(100vh-220px)]">
        {activeTab === "enhanced" && (
          <EnhancedMarketTab />
        )}

        {activeTab === "tokens" && (
          walletConnected ? (
            <div>
              <p className="text-center text-gray-500 py-10">
                Coming soon: Your token balances will appear here
              </p>
            </div>
          ) : (
            <WalletConnection 
              onConnect={handleConnectWallet}
              onDisconnect={handleDisconnectWallet}  
            />
          )
        )}

        {activeTab === "testnet" && <TestnetTokenTab />}
      </ScrollArea>
    </div>
  );
};
