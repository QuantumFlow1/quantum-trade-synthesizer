
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SimulationToggle } from "../trading/SimulationToggle";
import { TradeAction, AgentRecommendation, PortfolioDecision } from "@/types/agent";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Pause, 
  AlertCircle, 
  CheckCircle, 
  Brain,
  BarChart2,
  ShieldAlert,
  CircleDollarSign,
  BookCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortfolioManagerProps {
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
  currentData?: any;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  isSimulationMode = false,
  onSimulationToggle,
  currentData
}) => {
  const { toast } = useToast();
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [portfolioDecision, setPortfolioDecision] = useState<PortfolioDecision | null>(null);
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [riskScore, setRiskScore] = useState(35); // 0-100 scale

  useEffect(() => {
    if (currentData) {
      generateSimulatedRecommendations();
    }
  }, [currentData]);

  const generateSimulatedRecommendations = () => {
    const ticker = currentData?.symbol || "BTC";
    const currentPrice = currentData?.price || 45000;
    const randomSeed = Math.random();
    
    const actionTypes: TradeAction[] = ["BUY", "SELL", "HOLD", "SHORT", "COVER"];
    
    const newRecommendations: AgentRecommendation[] = [
      {
        agentId: "value-investor-001",
        action: randomSeed > 0.7 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL"),
        confidence: Math.round(60 + randomSeed * 30),
        reasoning: `Based on fundamental analysis, the current ${ticker} price at $${currentPrice} ${randomSeed > 0.6 ? "represents a good value" : "is slightly overvalued"}.`,
        ticker,
        price: currentPrice,
        timestamp: new Date().toISOString()
      },
      {
        agentId: "technical-analyst-001",
        action: randomSeed > 0.5 ? "BUY" : "SELL",
        confidence: Math.round(50 + randomSeed * 40),
        reasoning: `Technical indicators show ${randomSeed > 0.5 ? "bullish" : "bearish"} momentum on ${ticker} with ${randomSeed > 0.7 ? "strong" : "moderate"} volume.`,
        ticker,
        price: currentPrice,
        timestamp: new Date().toISOString()
      },
      {
        agentId: "sentiment-analyst-001",
        action: randomSeed > 0.6 ? "BUY" : (randomSeed > 0.3 ? "HOLD" : "SELL"),
        confidence: Math.round(40 + randomSeed * 50),
        reasoning: `Market sentiment analysis indicates ${randomSeed > 0.6 ? "positive" : "mixed"} outlook for ${ticker} based on news and social media.`,
        ticker,
        price: currentPrice,
        timestamp: new Date().toISOString()
      }
    ];
    
    setAgentRecommendations(newRecommendations);
    
    setLoadingDecision(true);
    setTimeout(() => {
      const majorityAction = calculateMajorityAction(newRecommendations);
      const averageConfidence = Math.round(
        newRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) / newRecommendations.length
      );
      
      const newDecision: PortfolioDecision = {
        action: majorityAction,
        ticker,
        amount: randomSeed > 0.7 ? 0.05 : (randomSeed > 0.4 ? 0.02 : 0.01),
        price: currentPrice,
        stopLoss: majorityAction === "BUY" ? Math.round(currentPrice * 0.95) : undefined,
        takeProfit: majorityAction === "BUY" ? Math.round(currentPrice * 1.15) : undefined,
        confidence: averageConfidence,
        riskScore: Math.round(30 + randomSeed * 40),
        contributors: newRecommendations.map(rec => rec.agentId),
        reasoning: `Consensus among ${newRecommendations.length} specialized agents suggests a ${majorityAction} action with ${averageConfidence}% confidence.`,
        timestamp: new Date().toISOString()
      };
      
      setPortfolioDecision(newDecision);
      setRiskScore(newDecision.riskScore);
      setLoadingDecision(false);
    }, 1500);
  };

  const calculateMajorityAction = (recommendations: AgentRecommendation[]): TradeAction => {
    const actionCounts: Record<TradeAction, number> = {
      "BUY": 0,
      "SELL": 0,
      "HOLD": 0,
      "SHORT": 0,
      "COVER": 0
    };
    
    recommendations.forEach(rec => {
      actionCounts[rec.action]++;
    });
    
    let majorityAction: TradeAction = "HOLD";
    let maxCount = 0;
    
    (Object.keys(actionCounts) as TradeAction[]).forEach(action => {
      if (actionCounts[action] > maxCount) {
        maxCount = actionCounts[action];
        majorityAction = action;
      }
    });
    
    return majorityAction;
  };

  const handleExecuteDecision = () => {
    if (!portfolioDecision) return;
    
    toast({
      title: `${portfolioDecision.action} Order ${isSimulationMode ? "Simulated" : "Executed"}`,
      description: `${portfolioDecision.action} ${portfolioDecision.amount} ${portfolioDecision.ticker} at $${portfolioDecision.price}`,
      variant: "default", // Changed from "success" to "default" to fix the type error
    });
    
    setPortfolioDecision(null);
    setAgentRecommendations([]);
  };

  const handleRefreshAnalysis = () => {
    setPortfolioDecision(null);
    setAgentRecommendations([]);
    generateSimulatedRecommendations();
    
    toast({
      title: "Analysis Refresh Requested",
      description: "Generating new agent recommendations and portfolio decision",
    });
  };

  return (
    <Card className="backdrop-blur-md border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Portfolio Manager
            </CardTitle>
            <CardDescription>
              AI-powered trading decisions from specialized agents
            </CardDescription>
          </div>
          {onSimulationToggle && (
            <SimulationToggle 
              enabled={isSimulationMode} 
              onToggle={onSimulationToggle} 
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isSimulationMode && (
          <Alert variant="success" className="bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              Simulation mode active. Trade decisions will not affect real balances.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-3">
          {agentRecommendations.length > 0 ? (
            <>
              <h3 className="text-sm font-medium">Agent Recommendations:</h3>
              <div className="space-y-2">
                {agentRecommendations.map((rec, index) => (
                  <div key={index} className="p-2 border border-white/10 rounded-md bg-background/50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1">
                        <Badge className="text-xs" variant="outline">
                          {rec.agentId.split('-')[0]}
                        </Badge>
                        <Badge 
                          className={`text-xs ${rec.action === "BUY" || rec.action === "COVER" ? "bg-green-500/80" : 
                                            rec.action === "SELL" || rec.action === "SHORT" ? "bg-red-500/80" : 
                                            "bg-blue-500/80"}`}
                        >
                          {rec.action}
                        </Badge>
                      </div>
                      <Badge className="text-xs" variant="outline">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
              
              {portfolioDecision && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <BookCheck className="h-4 w-4 text-primary" />
                    Portfolio Decision:
                  </h3>
                  <div className="p-3 border border-white/20 rounded-md bg-primary/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`${portfolioDecision.action === "BUY" || portfolioDecision.action === "COVER" ? "bg-green-500/80" : 
                                      portfolioDecision.action === "SELL" || portfolioDecision.action === "SHORT" ? "bg-red-500/80" : 
                                      "bg-blue-500/80"}`}
                        >
                          {portfolioDecision.action} {portfolioDecision.ticker}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          <CircleDollarSign className="h-3 w-3 mr-1" />
                          ${portfolioDecision.price}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <BarChart2 className="h-3 w-3 mr-1" />
                          {portfolioDecision.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Amount:</span>{' '}
                        <span className="font-medium">{portfolioDecision.amount} {portfolioDecision.ticker}</span>
                      </div>
                      
                      <div className="text-xs">
                        <span className="text-muted-foreground">Risk Score:</span>{' '}
                        <span className="font-medium">{portfolioDecision.riskScore}/100</span>
                      </div>
                      
                      {portfolioDecision.stopLoss && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Stop Loss:</span>{' '}
                          <span className="font-medium">${portfolioDecision.stopLoss}</span>
                        </div>
                      )}
                      
                      {portfolioDecision.takeProfit && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Take Profit:</span>{' '}
                          <span className="font-medium">${portfolioDecision.takeProfit}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      <p>{portfolioDecision.reasoning}</p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant="default" 
                      onClick={handleExecuteDecision}
                    >
                      {isSimulationMode ? "Simulate" : "Execute"} {portfolioDecision.action} Order
                    </Button>
                  </div>
                </div>
              )}
              
              {loadingDecision && (
                <div className="flex justify-center py-4">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                    <p className="text-xs text-muted-foreground">Generating portfolio decision...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center">
              <Brain className="h-8 w-8 text-primary/50 mx-auto mb-2" />
              <h3 className="text-sm font-medium mb-1">No Active Analysis</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Generate AI trading recommendations and portfolio decisions
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshAnalysis}
                disabled={!currentData}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze Market
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
