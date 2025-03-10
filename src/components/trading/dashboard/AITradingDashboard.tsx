
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StockbotKeyDialog } from '../minimal/components/stockbot/StockbotKeyDialog';
import { Button } from '@/components/ui/button';
import { Bot, Settings, CoinsIcon, ArrowRight } from 'lucide-react';
import { CryptoAssistantWidget } from '../crypto/CryptoAssistantWidget';
import { hasApiKey } from '@/utils/apiKeyManager';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function AITradingDashboard() {
  const [activeTab, setActiveTab] = useState('crypto');
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [hasGroqKey, setHasGroqKey] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkApiKey();
    
    // Set up listener for API key changes
    window.addEventListener('storage', checkApiKey);
    window.addEventListener('apikey-updated', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
      window.removeEventListener('apikey-updated', checkApiKey);
    };
  }, []);
  
  const checkApiKey = () => {
    const groqKeyAvailable = hasApiKey('groq');
    setHasGroqKey(groqKeyAvailable);
  };
  
  const handleOpenKeyDialog = () => {
    setIsKeyDialogOpen(true);
  };
  
  const handleCloseKeyDialog = () => {
    setIsKeyDialogOpen(false);
    checkApiKey();
  };
  
  const navigateToChat = () => {
    navigate('/dashboard/ai-chat');
    toast({
      title: "AI Chat Opened",
      description: "You can now chat with multiple AI models",
      duration: 3000
    });
  };
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">AI Trading Dashboard</h2>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleOpenKeyDialog}>
            <Settings className="h-4 w-4 mr-2" />
            API Keys
          </Button>
          
          <Button onClick={navigateToChat}>
            <Bot className="h-4 w-4 mr-2" />
            Open AI Chat
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="crypto">
            <CoinsIcon className="h-4 w-4 mr-2" />
            Crypto Assistant
          </TabsTrigger>
          <TabsTrigger value="stocks">
            <Bot className="h-4 w-4 mr-2" />
            Stock Assistant
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="crypto" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <CryptoAssistantWidget />
          </div>
        </TabsContent>
        
        <TabsContent value="stocks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Market AI Advisor</CardTitle>
              <CardDescription>
                Analyze market trends and get trading recommendations using AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>The Stock Market AI Advisor is coming soon. Configure your API key to be notified when it's available.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleOpenKeyDialog}>
                <Settings className="h-4 w-4 mr-2" />
                Configure API Key
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Key Configuration Dialog */}
      <StockbotKeyDialog
        isKeyDialogOpen={isKeyDialogOpen}
        handleDialogClose={handleCloseKeyDialog}
        onSuccessfulSave={() => {
          setHasGroqKey(true);
          handleCloseKeyDialog();
        }}
      />
    </div>
  );
}

export default AITradingDashboard;
