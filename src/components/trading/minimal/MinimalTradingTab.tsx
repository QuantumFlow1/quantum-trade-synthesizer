
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTradingData } from "@/utils/tradingData";
import TradingView from './components/trading-view/TradingView';
import { AITradingAgents } from '../components/AITradingAgents';
import PositionsList from "@/components/trading/PositionsList";

interface MinimalTradingTabProps {
  initialOpenAgentsTab?: boolean;
}

// Sample position data for demonstration
const samplePositions = [
  {
    id: "1",
    symbol: "BTC",
    amount: 0.15,
    entry_price: 43500,
    current_price: 42000,
    profit_loss: -225,
    profit_loss_percentage: -3.45,
    type: "long" as "long" | "short",
    timestamp: new Date().toISOString()
  },
  {
    id: "2",
    symbol: "ETH",
    amount: 1.5,
    entry_price: 2800,
    current_price: 3000,
    profit_loss: 300,
    profit_loss_percentage: 7.14,
    type: "long" as "long" | "short",
    timestamp: new Date().toISOString()
  }
];

export const MinimalTradingTab: React.FC<MinimalTradingTabProps> = ({ 
  initialOpenAgentsTab = false 
}) => {
  const [activeTab, setActiveTab] = useState(initialOpenAgentsTab ? 'agents' : 'chart');
  const [chartData, setChartData] = useState(generateTradingData());
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  // Simulate API check
  useEffect(() => {
    const timer = setTimeout(() => {
      setApiStatus('available');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle position selection
  const handlePositionSelect = (positionId: string) => {
    const position = samplePositions.find(p => p.id === positionId);
    setSelectedPosition(position);
    console.log("Selected position:", position);
    
    // Generate new chart data based on the selected position's symbol
    if (position) {
      // For demonstration, we're using the same generator but we could fetch specific data
      const newData = generateTradingData();
      setChartData(newData);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="chart">Trading Chart</TabsTrigger>
        <TabsTrigger value="positions">Positions</TabsTrigger>
        <TabsTrigger value="agents">Trading Agents</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chart" className="space-y-4">
        <TradingView 
          apiStatus={apiStatus} 
          chartData={chartData}
          selectedPosition={selectedPosition}
          currentPrice={42000}
        />
      </TabsContent>
      
      <TabsContent value="positions" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Your Positions</h3>
            <PositionsList 
              positions={samplePositions} 
              onPositionSelect={handlePositionSelect}
              selectedPositionId={selectedPosition?.id}
            />
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-2">Position Details</h3>
            <TradingView 
              apiStatus={apiStatus} 
              chartData={chartData}
              selectedPosition={selectedPosition}
              currentPrice={42000}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="agents" className="space-y-4">
        <AITradingAgents 
          agents={[
            {
              id: "1",
              name: "Bitcoin Trend Trader",
              type: "trader",
              description: "Analyzes Bitcoin price trends and identifies entry/exit points",
              status: "active",
              performance: { successRate: 68, tasksCompleted: 42 }
            },
            {
              id: "2",
              name: "Portfolio Advisor",
              type: "advisor",
              description: "Recommends portfolio allocations based on market conditions",
              status: "idle",
              performance: { successRate: 72, tasksCompleted: 31 }
            },
            {
              id: "3",
              name: "Risk Manager",
              type: "portfolio_manager",
              description: "Monitors positions and suggests risk management strategies",
              status: "active",
              performance: { successRate: 81, tasksCompleted: 57 }
            },
            {
              id: "4",
              name: "Market Analyst",
              type: "analyst",
              description: "Analyzes market conditions and provides insights",
              status: "idle",
              performance: { successRate: 75, tasksCompleted: 24 }
            }
          ]}
        />
      </TabsContent>
    </Tabs>
  );
};
