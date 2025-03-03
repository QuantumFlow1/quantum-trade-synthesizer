
import React, { useState } from 'react';
import { EnhancedMarketPage } from '../EnhancedMarketPage';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PositionsList from '@/components/trading/PositionsList';
import { usePositions } from '@/hooks/use-positions';
import { Activity, BarChart3, Eye, EyeOff, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EnhancedMarketTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('market');
  const { positions, isLoading } = usePositions();
  const [showCharts, setShowCharts] = useState(true);

  const toggleChartsVisibility = () => {
    setShowCharts(!showCharts);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="market" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Market Overview</span>
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Positions</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Transactions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="mt-6">
          <EnhancedMarketPage />
        </TabsContent>

        <TabsContent value="positions" className="mt-6">
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleChartsVisibility}
              className="flex items-center gap-2"
            >
              {showCharts ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Hide Charts</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Show Charts</span>
                </>
              )}
            </Button>
          </div>
          <PositionsDetailPanel 
            positions={positions} 
            isLoading={isLoading} 
            showCharts={showCharts}
          />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card className="p-6">
            <TransactionList />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Create a specialized positions panel with detailed information
const PositionsDetailPanel: React.FC<{ 
  positions: any[];
  isLoading: boolean;
  showCharts: boolean;
}> = ({ 
  positions, 
  isLoading,
  showCharts
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Your Positions</h3>
        <PositionsList 
          positions={positions} 
          isLoading={isLoading} 
          onPositionSelect={(id) => setSelectedPosition(id)}
          selectedPositionId={selectedPosition}
        />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-4">Position Details</h3>
        {selectedPosition ? (
          <PositionDetails 
            position={positions.find(p => p.id === selectedPosition)} 
            showCharts={showCharts}
          />
        ) : (
          <Card className="p-6 text-center text-muted-foreground">
            <p>Select a position to view detailed information</p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Position details component showing more information about a selected position
const PositionDetails: React.FC<{ 
  position: any;
  showCharts: boolean;
}> = ({ position, showCharts }) => {
  if (!position) return null;
  
  return (
    <Card className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Position ID</p>
          <p className="font-medium">{position.id.slice(0, 12)}...</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Entry Price</p>
          <p className="font-medium">${position.average_entry_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="font-medium">{position.amount}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Value</p>
          <p className="font-medium">${(position.amount * position.average_entry_price).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Unrealized P&L</p>
          <p className={`font-medium ${position.unrealized_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
            ${position.unrealized_pnl.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created At</p>
          <p className="font-medium">{new Date(position.created_at).toLocaleString()}</p>
        </div>
      </div>
      
      {showCharts && (
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Position Performance</h4>
          <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Position chart coming soon</p>
          </div>
        </div>
      )}
      
      {showCharts && (
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Risk Analysis</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Recommended Stop Loss</span>
              <span className="font-medium">${(position.average_entry_price * 0.95).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Recommended Take Profit</span>
              <span className="font-medium">${(position.average_entry_price * 1.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Risk/Reward Ratio</span>
              <span className="font-medium">1:3</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// Import the TransactionList component
import TransactionList from '@/components/TransactionList';

