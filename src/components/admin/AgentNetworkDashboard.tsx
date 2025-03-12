
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Network, UserPlus, BarChart2, MessageSquare, RefreshCw } from "lucide-react";
import { useAgentNetwork } from "@/hooks/use-agent-network";
import { AgentNetworkVisualizer } from "@/components/agent-network/AgentNetworkVisualizer";
import { ModelSelector } from "@/components/chat/settings/ModelSelector";
import { GrokSettings, ModelId } from "@/components/chat/types/GrokSettings";
import { useGrokSettings } from "@/components/chat/hooks/useGrokSettings";

export function AgentNetworkDashboard() {
  const { grokSettings, setGrokSettings } = useGrokSettings(true);
  const { isInitialized, refreshAgentState, isLoading, generateAnalysis } = useAgentNetwork();

  const [selectedTab, setSelectedTab] = useState('overview');

  const handleModelChange = (modelId: string) => {
    setGrokSettings({
      ...grokSettings,
      selectedModel: modelId as ModelId
    });
  };

  const handleTestAgentNetwork = async () => {
    await generateAnalysis({}, grokSettings.selectedModel);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Network className="mr-2 h-6 w-6" /> Agent Network Dashboard
        </h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshAgentState}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Network Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Configuration</CardTitle>
            <CardDescription>Configure the AI agent network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Primary LLM Model</h3>
              <ModelSelector 
                selectedModel={grokSettings.selectedModel} 
                onModelChange={handleModelChange} 
              />
              <p className="text-xs text-muted-foreground">
                This model will serve as the primary coordinator for the agent network
              </p>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleTestAgentNetwork}
              disabled={isLoading || !isInitialized}
            >
              Test Agent Network
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Agent Network Status</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview" className="flex items-center">
                    <Network className="mr-2 h-4 w-4" /> Overview
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center">
                    <BarChart2 className="mr-2 h-4 w-4" /> Details
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                Monitor and manage the AI agent collaborations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Active Agents</p>
                        <p className="text-2xl font-bold">8</p>
                      </div>
                      <UserPlus className="h-8 w-8 text-muted-foreground" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Messages Exchanged</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </div>
                
                <AgentNetworkVisualizer />
              </TabsContent>
              
              <TabsContent value="details" className="mt-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Detailed network information and metrics will be available here.
                  </p>
                  
                  <Card className="border border-dashed">
                    <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px]">
                      <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Detailed agent metrics coming soon</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
