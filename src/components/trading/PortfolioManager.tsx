
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAgentNetwork } from "@/hooks/use-agent-network";
import {
  BarChart3,
  RefreshCw,
  Briefcase,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldAlert,
  ArrowRightLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioDecision, AgentRecommendation, TradeAction } from "@/types/agent";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { SimulationToggle } from "./SimulationToggle";

interface PortfolioManagerProps {
  currentData?: any;
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
}

export function PortfolioManager({
  currentData,
  isSimulationMode = false,
  onSimulationToggle
}: PortfolioManagerProps) {
  const { toast } = useToast();
  const {
    isInitialized,
    isLoading,
    activeAgents,
    getRecentAgentRecommendations,
    getRecentPortfolioDecisions,
    createPortfolioDecision,
    submitAgentRecommendation
  } = useAgentNetwork();

  const [currentTab, setCurrentTab] = useState("decisions");
  const [recommendations, setRecommendations] = useState<AgentRecommendation[]>([]);
  const [decisions, setDecisions] = useState<PortfolioDecision[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [localSimulationMode, setLocalSimulationMode] = useState<boolean>(isSimulationMode);

  useEffect(() => {
    if (isSimulationMode !== localSimulationMode) {
      setLocalSimulationMode(isSimulationMode);
    }
  }, [isSimulationMode]);

  useEffect(() => {
    if (isInitialized) {
      refreshData();
    }
  }, [isInitialized]);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      // Get recent recommendations and decisions
      const recentRecommendations = getRecentAgentRecommendations(10);
      const recentDecisions = getRecentPortfolioDecisions(10);
      
      setRecommendations(recentRecommendations);
      setDecisions(recentDecisions);
    } catch (error) {
      console.error("Error refreshing portfolio data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleSimulation = (enabled: boolean) => {
    setLocalSimulationMode(enabled);
    if (onSimulationToggle) {
      onSimulationToggle(enabled);
    }
    
    toast({
      title: enabled ? "Simulation Mode Activated" : "Simulation Mode Deactivated",
      description: enabled 
        ? "Portfolio Manager will execute trades in simulation mode." 
        : "Portfolio Manager will execute real trades.",
    });
  };

  // Generate a test recommendation
  const generateTestRecommendation = async () => {
    if (!isInitialized) return;
    
    const actions: TradeAction[] = ["BUY", "SELL", "HOLD", "SHORT", "COVER"];
    const agents = activeAgents.filter(a => a.type !== "portfolio_manager");
    
    if (agents.length === 0) return;
    
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomTicker = ["BTC", "ETH", "SOL", "AAPL", "MSFT", "GOOGL"][Math.floor(Math.random() * 6)];
    const randomPrice = Math.floor(Math.random() * 1000) + 100;
    const randomConfidence = Math.floor(Math.random() * 40) + 60;
    
    try {
      await submitAgentRecommendation(
        randomAgent.id,
        randomAction,
        randomConfidence,
        `${randomAction} recommendation for ${randomTicker} based on ${randomAgent.type} analysis`,
        randomTicker,
        randomPrice
      );
      
      refreshData();
      
      toast({
        title: "New Recommendation",
        description: `${randomAgent.name} recommended to ${randomAction} ${randomTicker}`,
      });
    } catch (error) {
      console.error("Error generating test recommendation:", error);
    }
  };

  // Execute a test portfolio decision
  const executeTestDecision = async () => {
    if (!isInitialized) return;
    
    const actions: TradeAction[] = ["BUY", "SELL", "SHORT", "COVER"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomTicker = ["BTC", "ETH", "SOL", "AAPL", "MSFT", "GOOGL"][Math.floor(Math.random() * 6)];
    const randomPrice = Math.floor(Math.random() * 1000) + 100;
    const randomAmount = Math.floor(Math.random() * 10) + 1;
    
    try {
      await createPortfolioDecision(
        randomAction,
        randomTicker,
        randomAmount,
        randomPrice,
        {
          stopLoss: randomAction === "BUY" ? randomPrice * 0.95 : randomPrice * 1.05,
          takeProfit: randomAction === "BUY" ? randomPrice * 1.1 : randomPrice * 0.9,
          confidence: Math.floor(Math.random() * 20) + 70,
          riskScore: Math.floor(Math.random() * 7) + 3,
          contributors: activeAgents.slice(0, 3).map(a => a.id),
          reasoning: `Portfolio decision to ${randomAction} ${randomTicker} based on agent recommendations and market analysis`
        }
      );
      
      refreshData();
      
      toast({
        title: "Portfolio Decision Executed",
        description: `${randomAction} ${randomAmount} ${randomTicker} at $${randomPrice}`,
      });
    } catch (error) {
      console.error("Error executing test decision:", error);
    }
  };

  const getActionColor = (action: TradeAction) => {
    switch (action) {
      case "BUY": return "text-green-500";
      case "SELL": return "text-red-500";
      case "SHORT": return "text-purple-500";
      case "COVER": return "text-blue-500";
      case "HOLD": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const getActionBadgeVariant = (action: TradeAction) => {
    switch (action) {
      case "BUY": return "success";
      case "SELL": return "destructive";
      case "SHORT": return "default";
      case "COVER": return "outline";
      case "HOLD": return "secondary";
      default: return "outline";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Briefcase className="w-5 h-5 mr-2" /> Portfolio Manager
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="mb-4">
          <SimulationToggle 
            enabled={localSimulationMode} 
            onToggle={handleToggleSimulation} 
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateTestRecommendation}
                  disabled={!isInitialized || isLoading}
                  className="flex items-center gap-1"
                >
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  <span>Generate Recommendation</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Generate a test recommendation from an agent</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  onClick={executeTestDecision}
                  disabled={!isInitialized || isLoading}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Execute Decision</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Execute a test portfolio decision</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="decisions" className="relative">
              Decisions
              {decisions.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {decisions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="relative">
              Recommendations
              {recommendations.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {recommendations.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="decisions" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Portfolio Decisions</h3>
              <Badge variant="outline" className="text-xs">
                {decisions.length} decisions
              </Badge>
            </div>
            
            <ScrollArea className="h-[300px] rounded-md border border-white/10">
              {decisions.length > 0 ? (
                <div className="space-y-2 p-2">
                  {decisions.map((decision, index) => (
                    <div key={index} className="p-3 bg-muted/20 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getActionBadgeVariant(decision.action)}>
                            {decision.action}
                          </Badge>
                          <span className="font-medium text-sm">{decision.ticker}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">${decision.price.toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {decision.amount} units
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(decision.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" />
                          <span>Risk: {decision.riskScore}/10</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Confidence</span>
                          <span>{decision.confidence}%</span>
                        </div>
                        <Progress value={decision.confidence} className="h-1.5" />
                      </div>
                      
                      {decision.stopLoss && decision.takeProfit && (
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            <span>SL: ${decision.stopLoss.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span>TP: ${decision.takeProfit.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs mt-2">{decision.reasoning}</p>
                      
                      {decision.contributors && decision.contributors.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">Contributors: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {decision.contributors.map((contributor, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[10px]">
                                {contributor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No portfolio decisions yet</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={executeTestDecision}
                      disabled={!isInitialized || isLoading}
                    >
                      Execute Test Decision
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Agent Recommendations</h3>
              <Badge variant="outline" className="text-xs">
                {recommendations.length} recommendations
              </Badge>
            </div>
            
            <ScrollArea className="h-[300px] rounded-md border border-white/10">
              {recommendations.length > 0 ? (
                <div className="space-y-2 p-2">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-muted/20 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getActionBadgeVariant(recommendation.action)}>
                            {recommendation.action}
                          </Badge>
                          {recommendation.ticker && (
                            <span className="font-medium text-sm">{recommendation.ticker}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {recommendation.price && (
                            <span className="text-sm font-medium">${recommendation.price.toLocaleString()}</span>
                          )}
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs">
                            <span className={getActionColor(recommendation.action)}>{recommendation.agentId}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Confidence</span>
                          <span>{recommendation.confidence}%</span>
                        </div>
                        <Progress value={recommendation.confidence} className="h-1.5" />
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTimestamp(recommendation.timestamp)}</span>
                      </div>
                      
                      <p className="text-xs mt-2">{recommendation.reasoning}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center space-y-2">
                    <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No agent recommendations yet</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={generateTestRecommendation}
                      disabled={!isInitialized || isLoading}
                    >
                      Generate Test Recommendation
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="pt-2 mt-2 border-t border-white/10 text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-primary">Trading Guide:</span> The Portfolio Manager consolidates recommendations from all active agents and makes final trading decisions. Always use simulation mode first to test your trading strategy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
