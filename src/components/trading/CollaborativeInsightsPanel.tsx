
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAgentNetwork } from "@/hooks/use-agent-network";
import { 
  Brain, 
  RefreshCw, 
  Network, 
  ExternalLink, 
  MessageSquare, 
  BarChart,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { AI_MODELS, ModelId } from "@/components/chat/types/GrokSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CollaborativeInsightsPanelProps {
  currentData?: any;
}

export function CollaborativeInsightsPanel({ currentData }: CollaborativeInsightsPanelProps) {
  const { toast } = useToast();
  const { 
    isInitialized, 
    isLoading, 
    activeAgents, 
    agentMessages,
    collaborationSessions,
    lastAnalysis, 
    generateAnalysis,
    sendMessage
  } = useAgentNetwork();
  
  const [selectedModel, setSelectedModel] = useState<ModelId>('grok3');
  const [showAgents, setShowAgents] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [currentTab, setCurrentTab] = useState("insights");
  
  useEffect(() => {
    // Generate initial analysis when component mounts
    if (isInitialized && !lastAnalysis) {
      handleGenerateInsights();
    }
  }, [isInitialized, lastAnalysis]);
  
  const handleGenerateInsights = async () => {
    try {
      await generateAnalysis(currentData, selectedModel);
      toast({
        title: "Insights Generated",
        description: "Collaborative trading insights have been updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate collaborative insights. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value as ModelId);
  };
  
  const handleSendTestMessage = async () => {
    if (activeAgents.length < 2) return;
    
    const randomAgent1 = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    let randomAgent2;
    do {
      randomAgent2 = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    } while (randomAgent2.id === randomAgent1.id);
    
    const success = await sendMessage(
      randomAgent1.id,
      randomAgent2.id,
      `Test message from ${randomAgent1.name} to ${randomAgent2.name}`
    );
    
    if (success) {
      toast({
        title: "Test Message Sent",
        description: `From ${randomAgent1.name} to ${randomAgent2.name}`,
        duration: 2000,
      });
    }
  };
  
  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };
  
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Brain className="w-5 h-5 mr-2" /> Collaborative AI Insights
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowAgents(!showAgents)}
          >
            <Network className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateInsights}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="agents" className="relative">
              Agents
              {activeAgents.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeAgents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              Messages
              {agentMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {agentMessages.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Gathering collaborative insights...</p>
              </div>
            ) : lastAnalysis ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="text-sm whitespace-pre-line">{lastAnalysis}</div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 mb-2">
                    <Network className="h-3 w-3" />
                    <span>Generated by {activeAgents.length} collaborating AI agents</span>
                  </div>
                  
                  {collaborationSessions && collaborationSessions.length > 0 && (
                    <div className="mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Latest session: {new Date(collaborationSessions[0].createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  
                  <Collapsible open={showAgents} onOpenChange={setShowAgents}>
                    <CollapsibleTrigger asChild>
                      <Button variant="link" className="h-auto p-0 text-xs">
                        {showAgents ? 'Hide contributing agents' : 'Show contributing agents'}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {activeAgents.map(agent => (
                          <div key={agent.id} className="text-xs bg-muted/50 p-2 rounded flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getAgentStatusColor(agent.status)}`} />
                            {agent.name}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Brain className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No insights generated yet</p>
                <Button onClick={handleGenerateInsights}>Generate Insights</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="agents" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Active Agents</h3>
              <Badge variant="outline" className="text-xs">
                {activeAgents.length} agents
              </Badge>
            </div>
            
            <ScrollArea className="h-[220px] rounded-md border border-white/10">
              {activeAgents.length > 0 ? (
                <div className="space-y-2 p-2">
                  {activeAgents.map(agent => (
                    <div key={agent.id} className="p-2 bg-muted/20 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getAgentStatusColor(agent.status)}`} />
                          <span className="font-medium text-sm">{agent.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {agent.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{agent.description}</p>
                      {agent.performance && (
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-xs flex items-center gap-1">
                            <BarChart className="h-3 w-3" />
                            <span>{Math.round(agent.performance.successRate * 100)}% success</span>
                          </div>
                          <div className="text-xs flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>{agent.performance.tasksCompleted} tasks</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <p className="text-sm text-muted-foreground">No active agents</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Agent Messages</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleSendTestMessage}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Test Message
                </Button>
                <Badge variant="outline" className="text-xs">
                  {agentMessages.length} messages
                </Badge>
              </div>
            </div>
            
            <ScrollArea className="h-[220px] rounded-md border border-white/10">
              {agentMessages.length > 0 ? (
                <div className="space-y-2 p-2">
                  {agentMessages.slice().reverse().map(message => (
                    <div key={message.id} className="p-2 bg-muted/20 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <span>{message.fromAgent}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{message.toAgent}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs">{message.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary AI Model</label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                This model will coordinate the collaborative analysis.
              </p>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                asChild
              >
                <a href="/admin/agent-network" className="flex items-center justify-center gap-1">
                  <Network className="h-4 w-4" />
                  <span>Open Full Agent Network Dashboard</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
