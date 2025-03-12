
import React, { useEffect } from 'react';
import { usePortfolioManager } from './portfolio/hooks/usePortfolioManager';
import { SimulationAlert } from './portfolio/SimulationAlert';
import { EmptyAnalysisState } from './portfolio/EmptyAnalysisState';
import { RecommendationList } from './portfolio/RecommendationList';
import { PortfolioDecision } from './portfolio/PortfolioDecision';
import { LoadingDecision } from './portfolio/LoadingDecision';
import { PortfolioManagerProps } from './portfolio/types/portfolioTypes';
import { useGroqAgent } from './portfolio/hooks/useGroqAgent';
import { setGroqAgentInstance } from './portfolio/utils/recommendationUtils';

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  isSimulationMode = false,
  onSimulationToggle,
  currentData = null,
  children
}) => {
  const {
    agentRecommendations,
    portfolioDecision,
    loadingDecision,
    handleExecuteDecision,
    handleRefreshAnalysis,
    agentPerformance,
    agentAccuracy
  } = usePortfolioManager(currentData);
  
  // Initialize the Groq agent
  const groqAgent = useGroqAgent();
  
  // Set the Groq agent instance for use in recommendations
  useEffect(() => {
    if (groqAgent) {
      setGroqAgentInstance(groqAgent);
    }
  }, [groqAgent]);
  
  return (
    <div className="space-y-4">
      {isSimulationMode && onSimulationToggle && (
        <SimulationAlert onToggleSimulation={onSimulationToggle} />
      )}
      
      {children}
      
      {agentRecommendations.length === 0 ? (
        <EmptyAnalysisState 
          onRefreshAnalysis={handleRefreshAnalysis} 
          isDisabled={!currentData}
        />
      ) : (
        <>
          <RecommendationList 
            recommendations={agentRecommendations}
            agentPerformance={agentPerformance}
            agentAccuracy={agentAccuracy}
          />
          
          {loadingDecision ? (
            <LoadingDecision />
          ) : portfolioDecision ? (
            <PortfolioDecision 
              decision={portfolioDecision} 
              isSimulationMode={isSimulationMode}
              onExecuteDecision={() => handleExecuteDecision(isSimulationMode)}
            />
          ) : null}
        </>
      )}
    </div>
  );
};
