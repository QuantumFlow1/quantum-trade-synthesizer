import { useState, useEffect } from "react";
import { Brain, Users, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentConnection } from "@/hooks/use-agent-connection";
import { usePortfolioManager } from '@/components/trading/portfolio/hooks/usePortfolioManager';
import { RecommendationList } from "./portfolio/RecommendationList";
import { PortfolioDecision } from "./portfolio/PortfolioDecision";
import { LoadingDecision } from "./portfolio/LoadingDecision";
import { EmptyAnalysisState } from "./portfolio/EmptyAnalysisState";
import { SimulationAlert } from "./portfolio/SimulationAlert";

interface CollaborativeInsightsPanelProps {
  currentData?: any;
  isSimulationMode?: boolean;
}

export const CollaborativeInsightsPanel = ({ 
  currentData,
  isSimulationMode = false
}: CollaborativeInsightsPanelProps) => {
  const { 
    agentRecommendations, 
    portfolioDecision, 
    loadingDecision, 
    riskScore,
    handleExecuteDecision, 
    handleRefreshAnalysis 
  } = usePortfolioManager(currentData);

  const { 
    isConnected, 
    isVerifying, 
    activeAgents, 
    checkConnection,
    simulateConnection
  } = useAgentConnection();

  useEffect(() => {
    if (isSimulationMode && !isConnected) {
      simulateConnection(true);
    }
  }, [isSimulationMode, isConnected, simulateConnection]);

  const handleRetryConnection = () => {
    checkConnection(true);
  };

  if (!isConnected && !isSimulationMode) {
    return (
      <Card className="bg-secondary/10 backdrop-blur-xl border border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            <span>Collaborative Trading Network</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="mb-4 text-muted-foreground">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" />
              <p className="text-center">Agent network connection unavailable</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleRetryConnection}
              disabled={isVerifying}
              className="mt-2"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-secondary/10 backdrop-blur-xl border border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            <span>Collaborative Trading Network</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {isSimulationMode && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                Simulation
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1 text-xs px-2 py-0">
              <Users className="h-3 w-3" />
              <span>{activeAgents} Agents</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isSimulationMode && <SimulationAlert />}
        
        <div className="mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Agent Recommendations</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs"
              onClick={handleRefreshAnalysis}
              disabled={loadingDecision}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${loadingDecision ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {agentRecommendations.length > 0 ? (
            <RecommendationList recommendations={agentRecommendations} />
          ) : loadingDecision ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <EmptyAnalysisState 
              onRefreshAnalysis={handleRefreshAnalysis}
              isDisabled={loadingDecision}
            />
          )}
        </div>
        
        <div className="pt-2 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Portfolio Decision</h3>
          
          {loadingDecision ? (
            <LoadingDecision />
          ) : portfolioDecision ? (
            <PortfolioDecision 
              decision={portfolioDecision} 
              onExecuteDecision={() => handleExecuteDecision(isSimulationMode)}
              isSimulationMode={isSimulationMode}
            />
          ) : (
            <div className="text-center p-3 bg-secondary/20 rounded-md">
              <p className="text-sm text-muted-foreground">No decision available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
