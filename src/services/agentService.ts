
import { supabase } from "@/lib/supabase";
import { Agent } from "@/types/agent";

interface AgentRecommendation {
  agentId: string;
  recommendation: string;
  confidence: number;
  timestamp: string;
  riskScore: number;
}

interface RiskAssessment {
  maxLoss: number;
  riskLevel: "low" | "medium" | "high";
  stopLossRecommendation: number;
  takeProfitRecommendation: number;
}

export const agentService = {
  // Trading aanbevelingen ophalen van AI agents
  async getTradeRecommendations(symbol: string): Promise<AgentRecommendation[]> {
    console.log('Fetching trade recommendations for:', symbol);
    
    const { data: agents, error: agentError } = await supabase
      .from('agent_collected_data')
      .select('*')
      .eq('data_type', 'trade_recommendation')
      .eq('source', symbol)
      .order('collected_at', { ascending: false })
      .limit(5);

    if (agentError) {
      console.error('Error fetching recommendations:', agentError);
      throw agentError;
    }

    return agents.map(agent => ({
      agentId: agent.agent_id,
      recommendation: agent.content.recommendation,
      confidence: agent.confidence || 0,
      timestamp: agent.collected_at,
      riskScore: agent.content.risk_score || 0
    }));
  },

  // Risico analyse van de Risk Management AI
  async getRiskAssessment(symbol: string, amount: number): Promise<RiskAssessment> {
    console.log('Getting risk assessment for:', symbol, 'amount:', amount);
    
    const { data: riskData, error: riskError } = await supabase
      .from('agent_collected_data')
      .select('*')
      .eq('data_type', 'risk_assessment')
      .eq('source', symbol)
      .order('collected_at', { ascending: false })
      .limit(1)
      .single();

    if (riskError) {
      console.error('Error fetching risk assessment:', riskError);
      throw riskError;
    }

    return {
      maxLoss: riskData.content.max_loss,
      riskLevel: riskData.content.risk_level,
      stopLossRecommendation: riskData.content.stop_loss,
      takeProfitRecommendation: riskData.content.take_profit
    };
  },

  // Trader AI agent aanbevelingen opslaan
  async saveTraderRecommendation(
    agentId: string,
    symbol: string,
    recommendation: string,
    confidence: number,
    riskScore: number
  ) {
    console.log('Saving trader recommendation');
    
    const { error } = await supabase
      .from('agent_collected_data')
      .insert({
        agent_id: agentId,
        data_type: 'trade_recommendation',
        source: symbol,
        content: {
          recommendation,
          risk_score: riskScore
        },
        confidence: confidence,
        collected_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  },

  // Risk Management AI analyse opslaan
  async saveRiskAssessment(
    agentId: string,
    symbol: string,
    assessment: RiskAssessment
  ) {
    console.log('Saving risk assessment');
    
    const { error } = await supabase
      .from('agent_collected_data')
      .insert({
        agent_id: agentId,
        data_type: 'risk_assessment',
        source: symbol,
        content: {
          max_loss: assessment.maxLoss,
          risk_level: assessment.riskLevel,
          stop_loss: assessment.stopLossRecommendation,
          take_profit: assessment.takeProfitRecommendation
        },
        confidence: 1,
        collected_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving risk assessment:', error);
      throw error;
    }
  }
};
