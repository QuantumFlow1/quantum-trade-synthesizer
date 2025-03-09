
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAdvicePanel } from "@/components/dashboard/AIAdvicePanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight, Bot, Brain, Code, Key, LineChart, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useDashboardNavigation } from "@/hooks/use-dashboard-navigation";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { ApiKeyDialogContent } from "@/components/chat/api-keys/ApiKeyDialogContent";

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
  const navigate = useNavigate();
  const { openTradingAgentsTab } = useDashboardNavigation();
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  
  // Function to navigate to different AI tools
  const handleNavigate = (destination: string, action?: () => void) => {
    if (action) {
      action();
      return;
    }
    
    if (destination.startsWith('/')) {
      navigate(destination);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">AI Tools</h2>
        <p className="text-muted-foreground">
          Advanced AI capabilities to enhance your trading experience
        </p>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <Key className="h-4 w-4 text-blue-500" />
        <AlertTitle>API Key Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>Most AI features require an API key to connect to external AI services.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-fit"
            onClick={() => setIsApiKeyDialogOpen(true)}
          >
            <Key className="h-4 w-4 mr-2" />
            Configure API Keys
          </Button>
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Trading Advice */}
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
        
        {/* Trading Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-blue-500" />
              Trading Agents
              <Badge className="ml-2 bg-blue-100 text-blue-800" variant="outline">
                Active
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
                <Button onClick={() => handleNavigate('', openTradingAgentsTab)} className="mt-2">
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
        
        {/* Stockbot Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-teal-500" />
              Stockbot Chat
              <Badge className="ml-2 bg-teal-100 text-teal-800" variant="outline">
                Active
              </Badge>
            </CardTitle>
            <CardDescription>
              Chat with an AI assistant specialized in stock trading and market analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-teal-50 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-medium">Stockbot Chat</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Get market insights, trading advice, and answer your questions about financial markets.
              </p>
              <Button onClick={() => handleNavigate('/dashboard/trading')} className="mt-2">
                Chat with Stockbot
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* LLM Extensions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-indigo-500" />
              Advanced LLM Models
              <Badge className="ml-2 bg-indigo-100 text-indigo-800" variant="outline">
                Available
              </Badge>
            </CardTitle>
            <CardDescription>
              Access powerful language models like Claude, OpenAI, and DeepSeek for advanced analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-medium">LLM Extensions</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Access specialized AI models for financial analysis, research, and content generation.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                <Button onClick={() => handleNavigate('/dashboard/llm')} variant="outline" className="mt-2">
                  Open LLM Extensions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Market Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2 text-emerald-500" />
              AI Market Analysis
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
                <LineChart className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-700">Coming Soon</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Advanced AI market analysis is currently in development and will be available soon.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" disabled className="w-full opacity-70">
              <ArrowRight className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
        
        {/* Trading Advisor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-amber-500" />
              AI Trading Advisor
              <Badge className="ml-2 bg-slate-100 text-slate-800" variant="outline">
                Coming Soon
              </Badge>
            </CardTitle>
            <CardDescription>
              Personalized trading strategy recommendations based on your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-700">Coming Soon</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Our AI Trading Advisor will provide personalized trade recommendations based on your risk profile.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" disabled className="w-full opacity-70">
              <ArrowRight className="w-4 h-4 mr-2" />
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {apiStatus === 'unavailable' && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Connection Required</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>Some AI tools require API keys to function properly. Please configure your API keys in settings.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-fit"
              onClick={() => setIsApiKeyDialogOpen(true)}
            >
              <Key className="h-4 w-4 mr-2" />
              Configure API Keys
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Configure API Keys</DialogTitle>
            <DialogDescription>
              Enter your API keys for different AI services below. These are stored locally in your browser.
            </DialogDescription>
          </DialogHeader>
          <ApiKeyDialogContent 
            initialTab="groq" 
            onClose={() => setIsApiKeyDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
