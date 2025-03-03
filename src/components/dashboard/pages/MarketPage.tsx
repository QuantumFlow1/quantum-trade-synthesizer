
import { useState } from "react";
import { MarketHeader } from "./market/MarketHeader";
import { MarketTabs } from "./market/MarketTabs";
import { MarketDataTable } from "./market/MarketDataTable";
import { TestnetTokenTab } from "./market/TestnetTokenTab";
import { WalletConnection } from "./market/WalletConnection";
import { useMarketData } from "./market/useMarketData";
import { EnhancedMarketTab } from "./market/EnhancedMarketTab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MarketPage = () => {
  const [activeTab, setActiveTab] = useState("coins");
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
    // This function will be called when the refresh button is clicked
    console.log("Refreshing market data...");
    fetchMarketData();
  };

  // Check if marketData is not an array or empty
  const hasError = !Array.isArray(marketData);

  return (
    <div className="space-y-6">
      <MarketHeader isLoading={isLoading} onRefresh={handleRefresh} />

      <MarketTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading market data</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>We encountered an issue while loading the market data.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="w-fit"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!hasError && activeTab === "coins" && (
        <MarketDataTable 
          data={marketData} 
          isLoading={isLoading} 
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      )}

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
    </div>
  );
};
