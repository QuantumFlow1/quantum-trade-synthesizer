
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PortfolioDecision as PortfolioDecisionType } from "@/types/agent";
import { 
  CircleDollarSign, 
  BarChart2, 
  ShieldAlert, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

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
  // Risk level calculations
  const getRiskLevelColor = (score: number) => {
    if (score < 30) return "bg-green-500";
    if (score < 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getRiskLevelText = (score: number) => {
    if (score < 30) return "Low Risk";
    if (score < 60) return "Medium Risk";
    return "High Risk";
  };

  // Risk metrics
  const riskMetrics = [
    {
      name: "Market Volatility",
      value: decision.riskScore > 50 ? 75 : 40,
      icon: <Activity className="h-3 w-3 mr-1" />
    },
    {
      name: "Position Size",
      value: decision.amount > 0.03 ? 65 : 30, 
      icon: <CircleDollarSign className="h-3 w-3 mr-1" />
    },
    {
      name: "Downside Risk",
      value: Math.min(Math.round(decision.riskScore * 1.2), 100),
      icon: <TrendingDown className="h-3 w-3 mr-1" />
    }
  ];

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
      
      <div className="grid grid-cols-2 gap-2 mb-3">
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
      
      {/* Risk Analysis Visualization */}
      <div className="mb-3 p-2 border border-white/10 rounded bg-black/20">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-xs">
            <ShieldAlert className="h-3 w-3" />
            <span>Risk Analysis</span>
          </div>
          <Badge 
            className={`text-[10px] ${getRiskLevelColor(decision.riskScore)}`}
          >
            {getRiskLevelText(decision.riskScore)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {/* Overall Risk Meter */}
          <div>
            <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
              <span>Overall Risk</span>
              <span>{decision.riskScore}%</span>
            </div>
            <Progress 
              value={decision.riskScore} 
              className="h-1.5" 
              indicatorClassName={getRiskLevelColor(decision.riskScore)}
            />
          </div>
          
          {/* Risk Metrics */}
          {riskMetrics.map((metric, index) => (
            <div key={index}>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground mb-1">
                <span className="flex items-center">{metric.icon} {metric.name}</span>
                <span>{metric.value}%</span>
              </div>
              <Progress 
                value={metric.value} 
                className="h-1.5" 
                indicatorClassName={getRiskLevelColor(metric.value)}
              />
            </div>
          ))}
        </div>
        
        {/* Risk/Reward Visualization */}
        {decision.takeProfit && decision.stopLoss && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <div className="text-[10px] text-muted-foreground mb-1">Risk/Reward Ratio</div>
            <div className="relative h-4 bg-black/20 rounded overflow-hidden">
              <div 
                className="absolute top-0 h-full bg-red-500/30" 
                style={{ 
                  width: `${Math.abs((decision.price - decision.stopLoss) / (decision.price)) * 100}%`,
                  left: 0
                }}
              ></div>
              <div 
                className="absolute top-0 h-full bg-green-500/30" 
                style={{ 
                  width: `${Math.abs((decision.takeProfit - decision.price) / (decision.price)) * 100}%`,
                  right: 0
                }}
              ></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-0.5 h-full w-1 bg-white/30"></div>
            </div>
            <div className="flex justify-between text-[10px] mt-0.5">
              <span className="text-red-400">Risk: ${Math.abs(decision.price - decision.stopLoss).toFixed(2)}</span>
              <span className="text-green-400">Reward: ${Math.abs(decision.takeProfit - decision.price).toFixed(2)}</span>
            </div>
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
