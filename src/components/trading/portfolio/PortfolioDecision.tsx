
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PortfolioDecision as PortfolioDecisionType } from "@/types/agent";
import { AlertTriangle, ArrowDown, ArrowUp, Check, Pause } from "lucide-react";

interface PortfolioDecisionProps {
  decision: PortfolioDecisionType;
  isSimulationMode: boolean;
  onExecuteDecision: () => void;
}

export const PortfolioDecision: React.FC<PortfolioDecisionProps> = ({
  decision,
  isSimulationMode,
  onExecuteDecision
}) => {
  const getActionColor = (action: string) => {
    switch (action) {
      case "BUY":
      case "COVER":
        return "text-green-500";
      case "SELL":
      case "SHORT":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };
  
  const getActionIcon = (action: string) => {
    switch (action) {
      case "BUY":
      case "COVER":
        return <ArrowUp className="h-4 w-4" />;
      case "SELL":
      case "SHORT":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <Pause className="h-4 w-4" />;
    }
  };
  
  const getRiskBadge = (score: number) => {
    if (score < 40) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-xs">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          Low Risk
        </div>
      );
    } else if (score < 70) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full text-xs">
          <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
          Medium Risk
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs">
          <AlertTriangle className="h-3 w-3" />
          High Risk
        </div>
      );
    }
  };
  
  return (
    <Card className="border border-primary/20 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${getActionColor(decision.action)} bg-opacity-20`}>
              {getActionIcon(decision.action)}
            </div>
            <div className="font-semibold">
              {decision.action} {decision.ticker}
            </div>
          </div>
          {getRiskBadge(decision.riskScore)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Amount</div>
            <div className="text-sm font-medium">{decision.amount} {decision.ticker}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="text-sm font-medium">${decision.price.toLocaleString()}</div>
          </div>
          
          {decision.stopLoss && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Stop Loss</div>
              <div className="text-sm font-medium text-red-500">${decision.stopLoss.toLocaleString()}</div>
            </div>
          )}
          
          {decision.takeProfit && (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Take Profit</div>
              <div className="text-sm font-medium text-green-500">${decision.takeProfit.toLocaleString()}</div>
            </div>
          )}
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Confidence</div>
            <div className="flex items-center gap-2">
              <div className="relative w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    decision.confidence > 75 ? 'bg-green-500' : 
                    decision.confidence > 50 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${decision.confidence}%` }}
                />
              </div>
              <span className="text-xs font-medium">{decision.confidence}%</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-1">Reasoning</div>
          <p className="text-xs">{decision.reasoning}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={onExecuteDecision}
          >
            <Check className="h-4 w-4 mr-2" />
            {isSimulationMode ? "Simulate Trade" : "Execute Trade"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
