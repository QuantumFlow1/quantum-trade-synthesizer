
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BookCheck, Users, Sparkles, History, TrendingUp, AreaChart } from "lucide-react";
import { SimulationToggle } from "./SimulationToggle";
import { SimulationAlert } from "./portfolio/SimulationAlert";
import { EmptyAnalysisState } from "./portfolio/EmptyAnalysisState";
import { RecommendationList } from "./portfolio/RecommendationList";
import { PortfolioDecision } from "./portfolio/PortfolioDecision";
import { LoadingDecision } from "./portfolio/LoadingDecision";
import { AgentCollaboration } from "./portfolio/AgentCollaboration";
import { usePortfolioManager } from "./portfolio/usePortfolioManager";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  // Enable simulation mode by default if nothing is passed
  const [localSimulationMode, setLocalSimulationMode] = useState(isSimulationMode === undefined ? true : isSimulationMode);
  const [activeTab, setActiveTab] = useState<string>("recommendations");
  
  const {
    agentRecommendations,
    portfolioDecision,
    loadingDecision,
    collaborationMessages,
    collaborationScore,
    activeDiscussions,
    agentPerformance,
    agentAccuracy,
    backtestResults,
    tradingAgents,
    handleExecuteDecision,
    handleRefreshAnalysis
  } = usePortfolioManager(currentData);

  // Handle simulation toggle locally if no external handler is provided
  const handleSimulationToggle = (enabled: boolean) => {
    setLocalSimulationMode(enabled);
    if (onSimulationToggle) {
      onSimulationToggle(enabled);
    } else {
      toast({
        title: enabled ? "Simulation Mode Enabled" : "Simulation Mode Disabled",
        description: enabled ? "Using simulated data for portfolio analysis" : "Using real market data for portfolio analysis",
      });
    }
  };

  // Use local simulation mode if no external state is provided
  const effectiveSimulationMode = isSimulationMode === undefined ? localSimulationMode : isSimulationMode;

  return (
    <Card className="backdrop-blur-md border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Portfolio Manager
            </CardTitle>
            <CardDescription>
              Multi-agent AI trading system with collaborative decision making
            </CardDescription>
          </div>
          {(onSimulationToggle || isSimulationMode === undefined) && (
            <SimulationToggle 
              enabled={effectiveSimulationMode} 
              onToggle={handleSimulationToggle} 
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {effectiveSimulationMode && <SimulationAlert />}
        
        <div className="space-y-3">
          {agentRecommendations.length > 0 ? (
            <>
              <Tabs defaultValue="recommendations" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-2">
                  <TabsTrigger value="recommendations" className="flex items-center gap-1.5">
                    <Brain className="h-4 w-4" />
                    <span>Agent Recommendations</span>
                    <Badge variant="outline" className="ml-1 text-xs">
                      {agentRecommendations.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="backtesting" className="flex items-center gap-1.5">
                    <History className="h-4 w-4" />
                    <span>Backtesting</span>
                  </TabsTrigger>
                  <TabsTrigger value="accuracy" className="flex items-center gap-1.5">
                    <AreaChart className="h-4 w-4" />
                    <span>Accuracy Metrics</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="recommendations" className="mt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Agent Recommendations:
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      {agentRecommendations.length} agents
                    </Badge>
                  </div>
                  
                  <RecommendationList 
                    recommendations={agentRecommendations} 
                    agentPerformance={agentPerformance}
                    agentAccuracy={agentAccuracy}
                  />
                  
                  {collaborationMessages && collaborationMessages.length > 0 && (
                    <AgentCollaboration 
                      messages={collaborationMessages} 
                      collaborationScore={collaborationScore}
                      activeDiscussions={activeDiscussions}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="backtesting" className="mt-0">
                  <div className="mb-3">
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <History className="h-4 w-4 text-primary" />
                      Agent Backtesting Results:
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Historical performance of our trading agents based on recent market conditions and predictions.
                    </p>
                    
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {tradingAgents.map(agent => {
                        const agentBacktests = backtestResults.filter(test => test.agentId === agent.id);
                        const correctCount = agentBacktests.filter(test => test.isCorrect).length;
                        const accuracy = agentBacktests.length > 0 
                          ? Math.round((correctCount / agentBacktests.length) * 100) 
                          : 0;
                          
                        return (
                          <div key={agent.id} className="p-3 bg-card rounded-md border border-border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{agent.name}</div>
                              <Badge variant={accuracy > 70 ? "success" : accuracy > 50 ? "outline" : "destructive"}>
                                {accuracy}% Accuracy
                              </Badge>
                            </div>
                            
                            <div className="mb-2">
                              <div className="text-xs text-muted-foreground">Recent Predictions:</div>
                              <div className="grid grid-cols-5 gap-1 mt-1">
                                {agentBacktests.slice(0, 5).map((test, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`text-xs p-1 rounded flex flex-col items-center ${
                                      test.isCorrect ? 'bg-green-500/10 border border-green-500/30' : 
                                                     'bg-red-500/10 border border-red-500/30'
                                    }`}
                                  >
                                    <span className={`font-medium ${test.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                      {test.predictedAction}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(test.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <div className="text-muted-foreground">Prediction Types:</div>
                                <div className="mt-1 flex gap-2">
                                  <span className="px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/30 text-blue-500">
                                    BUY: {agentBacktests.filter(t => t.predictedAction === "BUY").length}
                                  </span>
                                  <span className="px-1.5 py-0.5 bg-red-500/10 rounded border border-red-500/30 text-red-500">
                                    SELL: {agentBacktests.filter(t => t.predictedAction === "SELL").length}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Confidence Range:</div>
                                <div className="mt-1">
                                  {Math.min(...agentBacktests.map(t => t.confidence))}% - 
                                  {Math.max(...agentBacktests.map(t => t.confidence))}%
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="accuracy" className="mt-0">
                  <div className="mb-3">
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Agent Accuracy Metrics:
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Detailed accuracy metrics showing prediction reliability and confidence intervals.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tradingAgents.map(agent => {
                        const accuracy = agentAccuracy[agent.id];
                        if (!accuracy) return null;
                        
                        return (
                          <div key={agent.id} className="p-3 bg-card rounded-md border border-border">
                            <div className="font-medium mb-2">{agent.name}</div>
                            
                            <div className="space-y-3 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="text-xs text-muted-foreground">Overall Accuracy:</div>
                                  <div className={`font-medium ${
                                    accuracy.overall > 70 ? 'text-green-500' : 
                                    accuracy.overall > 50 ? 'text-yellow-500' : 
                                    'text-red-500'
                                  }`}>{accuracy.overall}%</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Recent Accuracy:</div>
                                  <div className={`font-medium ${
                                    accuracy.recent > 70 ? 'text-green-500' : 
                                    accuracy.recent > 50 ? 'text-yellow-500' : 
                                    'text-red-500'
                                  }`}>{accuracy.recent}%</div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Confidence Interval:</div>
                                <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className="absolute left-0 top-0 h-full bg-primary/30 rounded-full"
                                    style={{ 
                                      left: `${accuracy.confidence[0]}%`, 
                                      width: `${accuracy.confidence[1] - accuracy.confidence[0]}%` 
                                    }}
                                  />
                                  <div 
                                    className="absolute left-0 top-0 h-full bg-primary rounded-full"
                                    style={{ left: `${accuracy.overall}%`, width: "2px" }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs mt-1">
                                  <span>{accuracy.confidence[0]}%</span>
                                  <span>{accuracy.confidence[1]}%</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Prediction History:</div>
                                <div className="grid grid-cols-5 gap-1">
                                  {accuracy.predictionHistory.slice(0, 5).map((prediction, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`text-xs p-1 rounded text-center ${
                                        prediction.correct ? 'bg-green-500/10 text-green-500' : 
                                                         'bg-red-500/10 text-red-500'
                                      }`}
                                    >
                                      {prediction.prediction}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              {portfolioDecision && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <BookCheck className="h-4 w-4 text-primary" />
                    Portfolio Decision:
                  </h3>
                  <PortfolioDecision 
                    decision={portfolioDecision} 
                    isSimulationMode={effectiveSimulationMode}
                    onExecuteDecision={() => handleExecuteDecision(effectiveSimulationMode)}
                  />
                </div>
              )}
              
              {loadingDecision && <LoadingDecision />}
            </>
          ) : (
            <EmptyAnalysisState 
              onRefreshAnalysis={handleRefreshAnalysis}
              isDisabled={!currentData}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
