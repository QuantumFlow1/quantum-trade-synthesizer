
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, BookCheck, Users, Sparkles } from "lucide-react";
import { SimulationToggle } from "./SimulationToggle";
import { SimulationAlert } from "./portfolio/SimulationAlert";
import { EmptyAnalysisState } from "./portfolio/EmptyAnalysisState";
import { RecommendationList } from "./portfolio/RecommendationList";
import { PortfolioDecision } from "./portfolio/PortfolioDecision";
import { LoadingDecision } from "./portfolio/LoadingDecision";
import { AgentCollaboration } from "./portfolio/AgentCollaboration";
import { usePortfolioManager } from "./portfolio/usePortfolioManager";
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
  // Enable simulation mode by default if nothing is passed
  const [localSimulationMode, setLocalSimulationMode] = useState(isSimulationMode === undefined ? true : isSimulationMode);
  
  const {
    agentRecommendations,
    portfolioDecision,
    loadingDecision,
    collaborationMessages,
    agentPerformance,
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
              />
              
              {collaborationMessages && collaborationMessages.length > 0 && (
                <AgentCollaboration messages={collaborationMessages} />
              )}
              
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
