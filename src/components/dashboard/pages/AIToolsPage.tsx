
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAdvicePanel } from "@/components/dashboard/AIAdvicePanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Bot, Brain, Sparkles } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AIToolsPageProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
  showApiAccess?: boolean;
  openTradingAgents?: () => void;
}

export const AIToolsPage = ({ 
  apiStatus = 'checking', 
  showApiAccess = false,
  openTradingAgents
}: AIToolsPageProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">AI Tools</h2>
        <p className="text-muted-foreground">
          Advanced AI capabilities to enhance your trading experience
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              AI Trading Advice
              {apiStatus === 'available' && (
                <Badge className="ml-2 bg-green-100 text-green-700" variant="outline">
                  Available
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Get personalized trading insights and advice powered by advanced language models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIAdvicePanel apiStatus={apiStatus} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-blue-500" />
              Trading Agents
              <Badge className="ml-2 bg-blue-100 text-blue-800" variant="outline">
                Beta
              </Badge>
            </CardTitle>
            <CardDescription>
              AI-powered agents that can analyze markets and execute trades on your behalf
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            {apiStatus === 'available' ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                  <Bot className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium">Trading Agents Ready</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Our AI trading agents can analyze market conditions, identify opportunities, 
                  and help you make better trading decisions.
                </p>
                <Button onClick={openTradingAgents} className="mt-2">
                  Launch Trading Agents
                </Button>
              </div>
            ) : apiStatus === 'unavailable' ? (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle>API Not Available</AlertTitle>
                <AlertDescription>
                  Trading agents require API connection. Check your API keys in settings.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-emerald-500" />
              Market Analysis
              <Badge className="ml-2 bg-slate-100 text-slate-800" variant="outline">
                Coming Soon
              </Badge>
            </CardTitle>
            <CardDescription>
              Deep AI-powered analysis of market trends and patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-700">Coming Soon</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Advanced AI market analysis is currently in development and will be available soon.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full opacity-70">
              <ArrowRight className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
