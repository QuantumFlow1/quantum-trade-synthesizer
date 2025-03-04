
import React from 'react';
import { ArrowUp, ArrowDown, Zap, AlertTriangle, ShieldCheck, LineChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiskMetric } from "@/types/risk";
import { PortfolioDecision as PortfolioDecisionType } from '@/types/agent';

interface PortfolioDecisionProps {
  decision: PortfolioDecisionType;
  isSimulationMode?: boolean;
  onExecuteDecision: () => void;
}

export const PortfolioDecision: React.FC<PortfolioDecisionProps> = ({ 
  decision, 
  isSimulationMode = false,
  onExecuteDecision
}) => {
  // Calculate risk level from the risk score
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low Risk', color: 'bg-green-500', textColor: 'text-green-500' };
    if (score < 70) return { level: 'Medium Risk', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { level: 'High Risk', color: 'bg-red-500', textColor: 'text-red-500' };
  };
  
  // Get risk level visualization info
  const riskScore = decision.riskScore || 35; // Default to 35 if not provided
  const { level, color, textColor } = getRiskLevel(riskScore);
  
  // Generate risk metrics for visualization
  const riskMetrics: RiskMetric[] = [
    {
      name: 'Market Volatility',
      value: Math.min(riskScore * 0.8, 100),
      maxValue: 100,
      status: riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high'
    },
    {
      name: 'Position Size',
      value: Math.min(decision.amount * 20, 100),
      maxValue: 100,
      status: decision.amount < 0.1 ? 'low' : decision.amount < 0.5 ? 'medium' : 'high'
    },
    {
      name: 'Downside Risk',
      value: Math.min((decision.price - (decision.stopLoss || 0)) / decision.price * 200, 100),
      maxValue: 100,
      status: decision.stopLoss ? 'medium' : 'high'
    }
  ];
  
  // Action icon based on decision type
  const ActionIcon = decision.action === 'BUY' ? ArrowUp : ArrowDown;
  const actionColor = decision.action === 'BUY' ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <Badge variant="outline" className={`${actionColor} font-semibold`}>
            <ActionIcon className="h-3 w-3 mr-1" />
            {decision.action} {decision.ticker}
          </Badge>
          
          <div className="mt-1 text-xs text-muted-foreground">
            {new Date(decision.timestamp).toLocaleString()}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium">${decision.price}</div>
          <div className="flex items-center mt-1">
            <Zap className="h-3 w-3 text-yellow-500 mr-1" />
            <span className="text-xs">{decision.confidence}% confidence</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col p-2 rounded bg-secondary/20">
          <span className="text-xs text-muted-foreground">Amount</span>
          <span className="text-sm font-medium">{decision.amount} {decision.ticker}</span>
        </div>
        <div className="flex flex-col p-2 rounded bg-secondary/20">
          <span className="text-xs text-muted-foreground">Risk Score</span>
          <span className="text-sm font-medium">{riskScore}/100</span>
        </div>
        <div className="flex flex-col p-2 rounded bg-secondary/20">
          <span className="text-xs text-muted-foreground">Stop Loss</span>
          <span className="text-sm font-medium">${decision.stopLoss}</span>
        </div>
        <div className="flex flex-col p-2 rounded bg-secondary/20">
          <span className="text-xs text-muted-foreground">Take Profit</span>
          <span className="text-sm font-medium">${decision.takeProfit}</span>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-medium">Risk Analysis</h4>
          <Badge variant={riskScore > 60 ? "destructive" : "outline"} className="text-xs px-1.5 py-0">
            {riskScore > 60 ? <AlertTriangle className="h-3 w-3 mr-1" /> : <ShieldCheck className="h-3 w-3 mr-1" />}
            {level}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {riskMetrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{metric.name}</span>
                <span>{Math.round(metric.value)}%</span>
              </div>
              <Progress value={metric.value} max={metric.maxValue} className={
                metric.status === 'low' ? "h-1.5 bg-secondary" : 
                metric.status === 'medium' ? "h-1.5 bg-secondary" : 
                "h-1.5 bg-secondary"
              } indicatorClassName={
                metric.status === 'low' ? "bg-green-500" : 
                metric.status === 'medium' ? "bg-yellow-500" : 
                "bg-red-500"
              } />
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-1 mb-3">
        <h4 className="text-xs font-medium">Risk/Reward Ratio</h4>
        <div className="flex h-1.5 rounded-full overflow-hidden">
          <div className="bg-red-500" style={{ width: `${30}%` }}></div>
          <div className="bg-green-500" style={{ width: `${70}%` }}></div>
        </div>
        <div className="flex justify-between text-xs">
          <span>Risk: ${decision.price - (decision.stopLoss || decision.price * 0.95)}</span>
          <span>Reward: ${(decision.takeProfit || decision.price * 1.1) - decision.price}</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-4 mt-3">
        <LineChart className="h-3 w-3 inline-block mr-1" />
        <span>{decision.reasoning}</span>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" size="sm">
            {isSimulationMode ? `Simulate ${decision.action} Order` : `Execute ${decision.action} Order`}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {decision.action} Order</DialogTitle>
            <DialogDescription>
              You are about to {decision.action.toLowerCase()} {decision.amount} {decision.ticker} at ${decision.price}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{decision.amount} {decision.ticker}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">${decision.price}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-medium">${(decision.amount * decision.price).toFixed(2)}</span>
            </div>
            {decision.stopLoss && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Stop Loss:</span>
                <span className="font-medium">${decision.stopLoss}</span>
              </div>
            )}
            {decision.takeProfit && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Take Profit:</span>
                <span className="font-medium">${decision.takeProfit}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant={isSimulationMode ? "outline" : "default"}>
                {isSimulationMode ? "Simulation" : "Live Trading"}
              </Badge>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onExecuteDecision}>
              {isSimulationMode ? "Simulate Order" : "Execute Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
