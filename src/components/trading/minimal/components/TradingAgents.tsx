
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Bot, Brain, Key, LineChart, Lock, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface TradingAgentsProps {
  hasApiKey: boolean;
  showApiKeyDialog: () => void;
}

export const TradingAgents = ({ hasApiKey, showApiKeyDialog }: TradingAgentsProps) => {
  const [activeTab, setActiveTab] = useState("stockbot");
  const [showStrategyDialog, setShowStrategyDialog] = useState(false);
  const [simulating, setSimulating] = useState(false);
  
  const startSimulation = () => {
    if (!hasApiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your Groq API key to use this feature",
        variant: "destructive"
      });
      return;
    }
    
    setSimulating(true);
    
    toast({
      title: "Simulation Started",
      description: "The trading agent is now running a simulation",
      duration: 3000
    });
    
    // Simulate for 3 seconds then stop
    setTimeout(() => {
      setSimulating(false);
      
      toast({
        title: "Simulation Complete",
        description: "The trading agent has completed the simulation",
        duration: 3000
      });
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stockbot">
            <Bot className="w-4 h-4 mr-2" />
            Stockbot
          </TabsTrigger>
          <TabsTrigger value="trend-trader">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trend Trader
          </TabsTrigger>
          <TabsTrigger value="ai-analyst">
            <Brain className="w-4 h-4 mr-2" />
            AI Analyst
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stockbot" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    Stockbot Trading Assistant
                    {hasApiKey ? (
                      <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="ml-2 bg-amber-100 text-amber-800" variant="outline">Setup Required</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>AI-powered trading assistance and recommendations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasApiKey ? (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle>API Key Required</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    You need to configure a Groq API key to use Stockbot's features.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm">
                    Stockbot analyzes market trends, technical indicators, and sentiment data to provide trading recommendations.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-slate-50">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Market Sentiment</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 font-medium">Bullish</span>
                          <span className="text-sm">68%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-slate-50">
                      <CardHeader className="py-2">
                        <CardTitle className="text-sm">Risk Level</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-600 font-medium">Moderate</span>
                          <span className="text-sm">58%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "58%" }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                      <Bot className="h-3.5 w-3.5 mr-1" />
                      Latest Recommendation
                    </h4>
                    <p className="text-sm text-blue-700">
                      Based on current market analysis, consider adding small positions to BTC during price dips around $60,000. Set stop-loss at $57,500.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2">
              {!hasApiKey ? (
                <Button onClick={showApiKeyDialog} className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Configure API Key
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setShowStrategyDialog(true)} className="w-full sm:w-auto">
                    <LineChart className="w-4 h-4 mr-2" />
                    Configure Strategy
                  </Button>
                  <Button onClick={startSimulation} disabled={simulating} className="w-full sm:w-auto">
                    {simulating ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Running Simulation...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Run Simulation
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="trend-trader" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Trend Trader
                <Badge className="ml-2 bg-slate-100 text-slate-800" variant="outline">
                  Coming Soon
                </Badge>
              </CardTitle>
              <CardDescription>Automated trend-following trading system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 text-center max-w-md">
                  Trend Trader is coming soon. This feature will automatically trade based on identified market trends.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" disabled className="w-full opacity-70">
                <ArrowRight className="w-4 h-4 mr-2" />
                Unlock Feature (Coming Soon)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-analyst" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                AI Market Analyst
                <Badge className="ml-2 bg-slate-100 text-slate-800" variant="outline">
                  Coming Soon
                </Badge>
              </CardTitle>
              <CardDescription>In-depth AI-powered market analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 text-center max-w-md">
                  AI Market Analyst is coming soon. This feature will provide detailed analysis of market conditions and sector performance.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" disabled className="w-full opacity-70">
                <ArrowRight className="w-4 h-4 mr-2" />
                Unlock Feature (Coming Soon)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Trading Strategy</DialogTitle>
            <DialogDescription>
              Set your preferred parameters for automated trading strategies.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="risk-level" className="text-right">
                Risk Level
              </Label>
              <Input
                id="risk-level"
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max-allocation" className="text-right">
                Max Allocation
              </Label>
              <Input
                id="max-allocation"
                defaultValue="20%"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="strategy" className="text-right">
                Strategy Type
              </Label>
              <select id="strategy" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="trend">Trend Following</option>
                <option value="meanrev">Mean Reversion</option>
                <option value="breakout">Breakout</option>
                <option value="ml">Machine Learning</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={() => setShowStrategyDialog(false)}>Save Strategy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
