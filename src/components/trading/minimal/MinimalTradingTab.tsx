
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateTradingData } from "@/utils/tradingData";
import TradingView from './components/trading-view/TradingView';
import { TradingAgents } from './components/trading-agents/TradingAgents';

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
            {/* Import and use PositionsList here */}
            <div className="space-y-2">
              {samplePositions.map((position) => (
                <div 
                  key={position.id}
                  className={`p-3 rounded-lg border ${
                    selectedPosition?.id === position.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted/50 cursor-pointer'
                  }`}
                  onClick={() => handlePositionSelect(position.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="font-medium">{position.symbol}</span>
                    </div>
                    <div className={`text-sm ${
                      position.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {position.profit_loss >= 0 ? '+' : ''}
                      ${position.profit_loss.toFixed(2)} ({position.profit_loss_percentage.toFixed(2)}%)
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>{' '}
                      <span>{position.amount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Entry Price:</span>{' '}
                      <span>${position.entry_price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
        <TradingAgents />
      </TabsContent>
    </Tabs>
  );
};
