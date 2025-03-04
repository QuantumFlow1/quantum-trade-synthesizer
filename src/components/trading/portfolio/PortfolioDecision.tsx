
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortfolioDecision as PortfolioDecisionType } from "@/types/agent";
import { CircleDollarSign, BarChart2, ShieldAlert } from "lucide-react";

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
  return (
    <div className="p-3 border border-white/20 rounded-md bg-primary/5">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Badge 
            className={`${decision.action === "BUY" || decision.action === "COVER" ? "bg-green-500/80" : 
                        decision.action === "SELL" || decision.action === "SHORT" ? "bg-red-500/80" : 
                        "bg-blue-500/80"}`}
          >
            {decision.action} {decision.ticker}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <CircleDollarSign className="h-3 w-3 mr-1" />
            ${decision.price}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <BarChart2 className="h-3 w-3 mr-1" />
            {decision.confidence}% confidence
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="text-xs">
          <span className="text-muted-foreground">Amount:</span>{' '}
          <span className="font-medium">{decision.amount} {decision.ticker}</span>
        </div>
        
        <div className="text-xs">
          <span className="text-muted-foreground">Risk Score:</span>{' '}
          <span className="font-medium">{decision.riskScore}/100</span>
        </div>
        
        {decision.stopLoss && (
          <div className="text-xs">
            <span className="text-muted-foreground">Stop Loss:</span>{' '}
            <span className="font-medium">${decision.stopLoss}</span>
          </div>
        )}
        
        {decision.takeProfit && (
          <div className="text-xs">
            <span className="text-muted-foreground">Take Profit:</span>{' '}
            <span className="font-medium">${decision.takeProfit}</span>
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        <p>{decision.reasoning}</p>
      </div>
      
      <Button 
        className="w-full" 
        variant="default" 
        onClick={onExecuteDecision}
      >
        {isSimulationMode ? "Simulate" : "Execute"} {decision.action} Order
      </Button>
    </div>
  );
};
