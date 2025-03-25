
import React from 'react';
import { MarketTabs } from '@/components/dashboard/pages/market/MarketTabs';
import { useMarketWebSocket } from '@/hooks/use-market-websocket';

const MarketPage: React.FC = () => {
  const { marketData, connectionStatus, reconnect } = useMarketWebSocket();
  const [activeTab, setActiveTab] = React.useState('enhanced');
  const [walletConnected, setWalletConnected] = React.useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Market Overview</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Status: {connectionStatus === 'connected' ? 'Online' : 'Connecting...'}
          </span>
        </div>
      </div>

      <MarketTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        marketData={marketData}
        isLoading={connectionStatus === 'connecting'}
        walletConnected={walletConnected}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />
    </div>
  );
};

export default MarketPage;
