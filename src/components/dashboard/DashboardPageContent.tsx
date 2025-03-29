
import React from 'react';
import { AIMarketAnalysis } from '@/components/market/AIMarketAnalysis';
import { CollaborativeInsightsPanel } from '@/components/trading/CollaborativeInsightsPanel';
import { StockbotChat } from '@/components/trading/minimal/StockbotChat';
import VoiceAssistant from '@/components/VoiceAssistant';

interface DashboardPageContentProps {
  activePage: string;
  apiStatus: 'checking' | 'available' | 'unavailable';
  showVirtualEnvironment: boolean;
  visibleWidgets: {
    apiAccess?: boolean;
  };
  openAgentsTab: () => void;
  openTradingAgentsTab: () => void;
}

export const DashboardPageContent = ({ 
  activePage,
  apiStatus,
  showVirtualEnvironment,
  visibleWidgets,
  openAgentsTab,
  openTradingAgentsTab
}: DashboardPageContentProps) => {
  // Mock market data for demonstration purposes
  const mockMarketData = {
    symbol: 'BTC',
    price: 62549.23,
    change24h: 2.5,
    volume: 28500000000,
    high24h: 63100.50,
    low24h: 61200.75,
    market: 'Cryptocurrency',
    timestamp: Date.now(), // Convert to number
    high: 63100.50,
    low: 61200.75
  };

  // We'll render different content based on the active page
  switch (activePage) {
    case 'overview':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h1 className="text-2xl font-bold col-span-full">Dashboard Overview</h1>
          <AIMarketAnalysis marketData={mockMarketData} />
          <CollaborativeInsightsPanel currentData={mockMarketData} isSimulationMode={true} />
        </div>
      );
    
    case 'ai':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h1 className="text-2xl font-bold col-span-full">AI Tools</h1>
          <div className="col-span-full md:col-span-1">
            <StockbotChat />
          </div>
          <div className="col-span-full md:col-span-1">
            <VoiceAssistant />
          </div>
        </div>
      );
    
    // Add cases for other pages as needed
    case 'market':
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Market Analysis</h1>
          <AIMarketAnalysis marketData={mockMarketData} className="w-full" />
        </div>
      );
    
    case 'trading':
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Trading Platform</h1>
          <CollaborativeInsightsPanel currentData={mockMarketData} isSimulationMode={false} />
        </div>
      );
    
    case 'risk':
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Risk Management</h1>
          <p>Risk management tools and analysis will be displayed here.</p>
        </div>
      );
    
    default:
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p>Select a section from the navigation menu.</p>
        </div>
      );
  }
};
