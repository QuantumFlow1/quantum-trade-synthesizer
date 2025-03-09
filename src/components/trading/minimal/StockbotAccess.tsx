
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bot, ChevronRight, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export const StockbotAccess = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    // Check if API key exists in localStorage
    const existingKey = localStorage.getItem('groqApiKey');
    setHasApiKey(!!existingKey);
    if (existingKey) {
      setGroqApiKey(existingKey);
    }
  }, []);
  
  const handleNavigateToStockbot = () => {
    setIsChecking(true);
    
    // Store that the user wants to access Stockbot
    localStorage.setItem('openTradingAgentsTab', 'true');
    
    // Navigate to trading page - use correct path that matches our routes
    setTimeout(() => {
      navigate('/dashboard/minimal-trading');
      setIsChecking(false);
    }, 500);
  };
  
  const saveApiKey = () => {
    if (!groqApiKey.trim()) {
      toast({
        title: "API sleutel vereist",
        description: "Voer een geldige Groq API sleutel in",
        variant: "destructive"
      });
      return;
    }
    
    // Validate key format
    if (!groqApiKey.trim().startsWith('gsk_')) {
      toast({
        title: "Ongeldige API sleutel",
        description: "Groq API sleutels beginnen gewoonlijk met 'gsk_'",
        variant: "destructive"
      });
      return;
    }
    
    // Save key to localStorage
    localStorage.setItem('groqApiKey', groqApiKey.trim());
    
    toast({
      title: "API sleutel opgeslagen",
      description: "Uw Groq API sleutel is opgeslagen voor Stockbot",
      variant: "default"
    });
    
    setHasApiKey(true);
    setIsKeyDialogOpen(false);
    
    // Dispatch event to notify other components that the API key has been updated
    window.dispatchEvent(new Event('apikey-updated'));
    window.dispatchEvent(new CustomEvent('connection-status-changed', {
      detail: { provider: 'groq', status: 'connected' }
    }));
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
          
          {!hasApiKey && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>API Key Required</AlertTitle>
              <AlertDescription className="text-xs text-amber-700">
                You need to set up a Groq API key to use Stockbot's full capabilities. 
                Click the "Configure Groq API Key" button below.
              </AlertDescription>
            </Alert>
          )}
          
          {hasApiKey && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle>Pro Tip</AlertTitle>
              <AlertDescription className="text-xs text-blue-700">
                You can find Stockbot in the Trading Dashboard under the "Trading Agents" tab.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleNavigateToStockbot}
              disabled={isChecking}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-between"
            >
              <span>Access Stockbot</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button
              variant={hasApiKey ? "outline" : "secondary"}
              size="sm"
              onClick={() => setIsKeyDialogOpen(true)}
              className="w-full"
            >
              <Key className="w-4 h-4 mr-2" />
              <span>{hasApiKey ? "Update Groq API Key" : "Configure Groq API Key"}</span>
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Groq API Key Dialog */}
      <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure Groq API Key</DialogTitle>
            <DialogDescription>
              Your API key is stored securely in your browser and is required for Stockbot to access the Groq AI model.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Groq API Key</label>
              <Input
                type="password"
                placeholder="gsk_..."
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">Required for Stockbot's market analysis using Groq LLM</p>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              <p className="mt-1">Get a Groq API key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Groq's website</a></p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={saveApiKey}>Save Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
