
import { Button } from "@/components/ui/card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bot, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export const StockbotAccess = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  
  const handleNavigateToStockbot = () => {
    setIsChecking(true);
    
    // Store that the user wants to access Stockbot
    localStorage.setItem('openTradingAgentsTab', 'true');
    
    // Navigate to trading page
    setTimeout(() => {
      navigate('/dashboard/minimal-trading');
      setIsChecking(false);
    }, 500);
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 pb-2">
        <CardTitle className="flex items-center text-lg">
          <Bot className="w-5 h-5 mr-2 text-blue-500" />
          Stockbot Trading Assistant
        </CardTitle>
        <CardDescription>
          AI-powered trading recommendations and analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Get AI-powered trading recommendations based on market analysis, technical indicators,
            and sentiment data. Stockbot helps you make more informed trading decisions.
          </p>
          
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle>Pro Tip</AlertTitle>
            <AlertDescription className="text-xs text-blue-700">
              You can find Stockbot in the Trading Dashboard under the "Trading Agents" tab.
            </AlertDescription>
          </Alert>
          
          <Button 
            onClick={handleNavigateToStockbot}
            disabled={isChecking}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-between"
          >
            <span>Access Stockbot</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
