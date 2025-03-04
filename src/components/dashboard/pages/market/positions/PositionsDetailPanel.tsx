
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import PositionsList from '@/components/trading/PositionsList';
import { PositionDetails } from './PositionDetails';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Info, Brain, BookOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PortfolioManager } from '@/components/trading/PortfolioManager';

interface PositionsDetailPanelProps {
  positions: any[];
  isLoading: boolean;
  showCharts: boolean;
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
}

export const PositionsDetailPanel: React.FC<PositionsDetailPanelProps> = ({ 
  positions, 
  isLoading,
  showCharts,
  isSimulationMode = false,
  onSimulationToggle
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6 gap-2">
        <h2 className="text-2xl font-bold">Trading Positions</h2>
        <Badge variant="outline" className="ml-2 flex items-center gap-1">
          <Brain className="h-3 w-3" />
          <span>AI Powered</span>
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="ml-2 flex items-center gap-1 cursor-help">
                <Info className="h-3 w-3" />
                <span>Trade Guide</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div>
                <p className="font-medium mb-1">AI Hedge Fund Trading Guide:</p>
                <ul className="text-xs space-y-1">
                  <li>• Always set stop losses and take profits</li>
                  <li>• Start with simulation mode to test strategies</li>
                  <li>• Monitor specialized agent recommendations</li>
                  <li>• Diversify trading approaches using multiple strategies</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" /> 
              Your Positions
            </h3>
            <PositionsList 
              positions={positions} 
              isLoading={isLoading} 
              onPositionSelect={(id) => setSelectedPosition(id)}
              selectedPositionId={selectedPosition}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-primary" /> 
              AI Trading Guide
            </h3>
            <Card className="p-4">
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">Tips from our AI Hedge Fund system:</p>
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <Badge className="mt-0.5" variant="secondary">1</Badge>
                    <p>Use the portfolio manager to get insights from specialized agents</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="mt-0.5" variant="secondary">2</Badge>
                    <p>Follow risk management rules and set appropriate stop-losses</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="mt-0.5" variant="secondary">3</Badge>
                    <p>Evaluate multiple agent perspectives before making decisions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="mt-0.5" variant="secondary">4</Badge>
                    <p>Start with simulation mode and track results over time</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Position Details</h3>
            {selectedPosition ? (
              <PositionDetails 
                position={positions.find(p => p.id === selectedPosition)} 
                showCharts={showCharts}
              />
            ) : (
              <Card className="p-6 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
                  <p>Select a position to view detailed information</p>
                  <p className="text-sm mt-2">Trading guide: Always analyze market trends before opening a position</p>
                </div>
              </Card>
            )}
          </div>
          
          <div>
            <PortfolioManager 
              isSimulationMode={isSimulationMode}
              onSimulationToggle={onSimulationToggle}
              currentData={selectedPosition ? positions.find(p => p.id === selectedPosition) : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
