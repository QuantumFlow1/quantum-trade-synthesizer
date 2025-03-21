
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, BarChart2, RefreshCw, Clock, Zap, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface APIActivityMonitorProps {
  providers: Record<string, boolean>;
}

// Sample activity data - in a real app this would come from monitoring API calls
interface APIActivityLog {
  id: string;
  timestamp: Date;
  provider: string;
  model: string;
  operation: string;
  duration: number;
  status: "success" | "error" | "pending";
  tokens?: {
    input: number;
    output: number;
  };
}

export function APIActivityMonitor({ providers }: APIActivityMonitorProps) {
  const [activeTab, setActiveTab] = useState("realtime");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activityLogs, setActivityLogs] = useState<APIActivityLog[]>([]);
  const [usageStats, setUsageStats] = useState({
    total: 0,
    success: 0,
    error: 0,
    averageLatency: 0
  });
  
  // Generate demo data on mount
  useEffect(() => {
    generateDemoData();
  }, []);
  
  const generateDemoData = () => {
    setIsRefreshing(true);
    
    // Only generate sample data for providers that are configured
    const availableProviders = Object.keys(providers).filter(key => providers[key]);
    
    if (availableProviders.length === 0) {
      setActivityLogs([]);
      setUsageStats({
        total: 0,
        success: 0,
        error: 0,
        averageLatency: 0
      });
      setIsRefreshing(false);
      return;
    }
    
    const operations = ["chat.completion", "embedding", "moderation", "image.generation"];
    const models = {
      openai: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
      groq: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
      anthropic: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      gemini: ["gemini-pro", "gemini-flash"],
      deepseek: ["deepseek-chat", "deepseek-coder"],
      ollama: ["llama3", "mistral", "codellama"]
    };
    
    // Generate random logs
    const logs: APIActivityLog[] = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const provider = availableProviders[Math.floor(Math.random() * availableProviders.length)];
      const modelList = models[provider as keyof typeof models] || ["default-model"];
      const model = modelList[Math.floor(Math.random() * modelList.length)];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      const status = Math.random() > 0.9 ? "error" : "success";
      const duration = Math.floor(Math.random() * 2000) + 100; // 100-2100ms
      
      logs.push({
        id: `log-${Date.now()}-${i}`,
        timestamp: new Date(now.getTime() - Math.floor(Math.random() * 3600000)), // Past hour
        provider,
        model,
        operation,
        duration,
        status,
        tokens: {
          input: Math.floor(Math.random() * 500) + 50,
          output: Math.floor(Math.random() * 1000) + 100
        }
      });
    }
    
    // Sort by timestamp, newest first
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setActivityLogs(logs);
    
    // Calculate stats
    const successCount = logs.filter(log => log.status === "success").length;
    const totalLatency = logs.reduce((sum, log) => sum + log.duration, 0);
    
    setUsageStats({
      total: logs.length,
      success: successCount,
      error: logs.length - successCount,
      averageLatency: totalLatency / logs.length
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          API Activity Monitor
        </h2>
        <Button size="sm" variant="outline" onClick={generateDemoData} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="realtime">
            <Clock className="h-4 w-4 mr-2" />
            Realtime Activity
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart2 className="h-4 w-4 mr-2" />
            Usage Statistics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="realtime" className="space-y-4 pt-4">
          {activityLogs.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {formatTime(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{log.provider}</span>
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate" title={log.model}>
                          <span className="text-xs">{log.model}</span>
                        </TableCell>
                        <TableCell>{log.operation}</TableCell>
                        <TableCell>
                          <Badge variant={log.status === "success" ? "outline" : "destructive"}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {log.duration}ms
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No activity data available. Configure API keys to see activity logs.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageStats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">Past 24 hours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {usageStats.total ? Math.round((usageStats.success / usageStats.total) * 100) : 0}%
                </div>
                <Progress
                  value={usageStats.total ? (usageStats.success / usageStats.total) * 100 : 0}
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {Math.round(usageStats.averageLatency)}
                  <span className="text-sm ml-1 font-normal text-muted-foreground">ms</span>
                </div>
                <div className="flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">
                    {usageStats.averageLatency < 500 ? "Fast" : "Normal"} response time
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Usage by Provider */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Usage by Provider</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(providers)
                .filter(([_, isConfigured]) => isConfigured)
                .map(([provider]) => {
                  const providerLogs = activityLogs.filter(log => log.provider === provider);
                  const providerPercentage = activityLogs.length ? 
                    (providerLogs.length / activityLogs.length) * 100 : 0;
                  
                  return (
                    <div key={provider} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm capitalize">{provider}</span>
                        <span className="text-sm">{providerLogs.length} requests</span>
                      </div>
                      <Progress value={providerPercentage} className="h-2" />
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
