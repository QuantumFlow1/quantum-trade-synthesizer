import { useState } from "react";
import { Agent } from "@/types/agent";
import { useToast } from "@/hooks/use-toast";

export const useAgents = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "trading-bot-1",
      name: "Alpha Trading AI",
      status: "active",
      type: "trading",
      performance: "+28.5% YTD",
      lastActive: "Nu",
      department: "Trading",
      expertise: ["Technical Analysis", "Pattern Recognition", "Risk Management"],
      riskLevel: "medium",
      tradingStrategy: "Mean Reversion + Trend Following",
      technicalIndicators: ["RSI", "MACD", "Bollinger Bands", "Volume Profile"],
      metrics: {
        winRate: 68.5,
        profitFactor: 2.14,
        sharpeRatio: 1.85,
        maxDrawdown: 12.3,
        totalTrades: 1247,
        successfulTrades: 854
      },
      capabilities: [
        "Real-time Market Analysis",
        "Multi-timeframe Trading",
        "Risk-adjusted Position Sizing",
        "Automated Trade Execution"
      ],
      allowedPairs: ["BTC/USD", "ETH/USD", "EUR/USD", "GBP/USD"],
      maxPositionSize: 100000,
      currentPositions: 3
    },
    {
      id: "1",
      name: "Risk Management Assistant",
      status: "active",
      type: "risk",
      performance: "97% accuracy",
      lastActive: "Nu",
      department: "Risk Management",
      expertise: ["Risk Analysis", "Portfolio Management", "Market Risk"]
    },
    {
      id: "2",
      name: "Trading Bot Alpha",
      status: "active",
      type: "trading",
      performance: "+15.4%",
      lastActive: "Nu",
      department: "Trading",
      expertise: ["Technical Analysis", "Market Making", "Trend Following"]
    },
    {
      id: "3",
      name: "Compliance Monitor",
      status: "active",
      type: "compliance",
      performance: "100% compliance",
      lastActive: "5 min geleden",
      department: "Compliance",
      expertise: ["Regulatory Compliance", "KYC/AML", "Audit Support"]
    },
    {
      id: "4",
      name: "Financial Analyst",
      status: "paused",
      type: "finance",
      performance: "98% accuracy",
      lastActive: "1 uur geleden",
      department: "Finance",
      expertise: ["Financial Analysis", "Reporting", "Budgeting"]
    },
    {
      id: "5",
      name: "Security Guardian",
      status: "active",
      type: "security",
      performance: "99.9% uptime",
      lastActive: "Nu",
      department: "Security",
      expertise: ["Threat Detection", "Access Control", "Security Monitoring"]
    },
    {
      id: "6",
      name: "Legal Advisor",
      status: "active",
      type: "legal",
      performance: "100% compliance",
      lastActive: "10 min geleden",
      department: "Legal",
      expertise: ["Regulatory Compliance", "Contract Analysis", "Legal Risk Assessment"]
    },
    {
      id: "7",
      name: "Market Analysis Bot",
      status: "active",
      type: "market_analysis",
      performance: "92% accuracy",
      lastActive: "Nu",
      department: "Analysis",
      expertise: ["Pattern Recognition", "Trend Analysis", "Market Sentiment"],
      capabilities: ["Real-time Analysis", "Multi-market Monitoring", "Predictive Analytics"],
      riskLevel: "medium"
    },
    {
      id: "8",
      name: "Portfolio Risk Analyzer",
      status: "active",
      type: "portfolio_risk",
      performance: "95% accuracy",
      lastActive: "Nu",
      department: "Risk Management",
      expertise: ["Portfolio Analysis", "Risk Assessment", "Exposure Management"],
      capabilities: ["Real-time Risk Monitoring", "Position Analysis", "Risk Alerts"],
      riskLevel: "low"
    }
  ]);

  const handleAgentAction = (agentId: string, action: "terminate" | "activate" | "pause") => {
    setAgents(currentAgents => 
      currentAgents.map(agent => {
        if (agent.id === agentId) {
          const newStatus = action === "terminate" ? "terminated" : 
                          action === "activate" ? "active" : "paused";
          return { ...agent, status: newStatus };
        }
        return agent;
      })
    );

    toast({
      title: `Agent ${action === "terminate" ? "Beëindigd" : action === "activate" ? "Geactiveerd" : "Gepauzeerd"}`,
      description: `Agent status succesvol bijgewerkt`,
    });
  };

  const handleAddAgent = () => {
    const newAgent: Agent = {
      id: `trading-bot-${agents.length + 1}`,
      name: "Nieuwe Trading AI",
      status: "paused",
      type: "trading",
      performance: "N/A",
      lastActive: "Nooit",
      department: "Trading",
      expertise: ["Technical Analysis"],
      riskLevel: "low",
      tradingStrategy: "Wacht op configuratie",
      technicalIndicators: ["RSI", "MACD"],
      metrics: {
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        totalTrades: 0,
        successfulTrades: 0
      }
    };

    setAgents(current => [...current, newAgent]);
    
    toast({
      title: "Nieuwe Trading Agent Toegevoegd",
      description: "AI Agent is klaar voor configuratie",
    });
  };

  return {
    agents,
    handleAgentAction,
    handleAddAgent
  };
};
