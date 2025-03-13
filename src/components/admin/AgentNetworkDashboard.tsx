
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentNetworkVisualizer } from '@/components/agent-network/AgentNetworkVisualizer';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, FileBarChart } from 'lucide-react';
import { AIAgentsList } from './AIAgentsList';
import { agentNetwork, AgentMessage, AgentTask } from '@/services/agentNetwork';
import { Agent } from '@/types/agent';

export function AgentNetworkDashboard() {
  const [activeTab, setActiveTab] = useState('agents');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  
  // Initialize agent network on component mount
  useEffect(() => {
    const initNetwork = async () => {
      setLoading(true);
      await agentNetwork.initialize();
      setLoading(false);
    };
    
    initNetwork();
  }, []);
  
  const handleRefreshNetwork = async () => {
    setLoading(true);
    await agentNetwork.refreshAgentState();
    setLoading(false);
  };
  
  const handleGenerateAnalysis = async () => {
    setLoading(true);
    const result = await agentNetwork.generateAnalysis();
    if (result.success) {
      setAnalysis(result.analysis);
    }
    setLoading(false);
  };
  
  const handleAgentAction = async (agentId: string, action: "terminate" | "activate" | "pause") => {
    setLoading(true);
    let status: "active" | "paused" | "maintenance" | "terminated";
    
    switch (action) {
      case "activate":
        status = "active";
        break;
      case "pause":
        status = "paused";
        break;
      case "terminate":
        status = "terminated";
        break;
      default:
        status = "maintenance";
    }
    
    await agentNetwork.changeAgentStatus(agentId, status);
    await agentNetwork.refreshAgentState();
    setLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Agent Network</h2>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshNetwork}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Vernieuwen
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleGenerateAnalysis}
            disabled={loading}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Analyseren
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">
            <Users className="h-4 w-4 mr-2" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="network">
            <RefreshCw className="h-4 w-4 mr-2" />
            Netwerk Visualisatie
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <FileBarChart className="h-4 w-4 mr-2" />
            Prestatie Analyse
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="mt-6">
          <AIAgentsList 
            agents={agentNetwork.agents} 
            onAction={handleAgentAction} 
          />
        </TabsContent>
        
        <TabsContent value="network" className="mt-6">
          <AgentNetworkVisualizer 
            agents={agentNetwork.agents}
            messages={agentNetwork.messages}
            tasks={agentNetwork.tasks}
            onToggle={agentNetwork.toggleAgent.bind(agentNetwork)}
          />
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-6">
          {analysis ? (
            <Card>
              <CardHeader>
                <CardTitle>Netwerk Efficiëntie Analyse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">{analysis.networkEfficiency}%</div>
                    <div className="text-sm text-muted-foreground">Netwerk Efficiëntie</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">{analysis.communicationScore}%</div>
                    <div className="text-sm text-muted-foreground">Communicatie Score</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">{analysis.resourceUtilization}%</div>
                    <div className="text-sm text-muted-foreground">Resource Gebruik</div>
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">Aanbevelingen:</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-sm bg-accent/50 p-2 rounded">{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Geen netwerkanalyse beschikbaar</p>
              <Button onClick={handleGenerateAnalysis} disabled={loading}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Genereer Analyse
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
