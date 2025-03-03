import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StandardOrderForm } from "./order-form/StandardOrderForm";
import { AdvancedOrderForm } from "./order-form/AdvancedOrderForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";
import { SimulationToggle } from "./SimulationToggle";

interface TradeOrderFormProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
}

export const TradeOrderForm = ({ apiStatus = 'unavailable' }: TradeOrderFormProps) => {
  const [orderMode, setOrderMode] = useState<string>("standard");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderExecutionType, setOrderExecutionType] = useState<"market" | "limit" | "stop" | "stop_limit">("market");
  const [amount, setAmount] = useState<string>("0.01");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number>(42000);
  const [advancedSignal, setAdvancedSignal] = useState<any>(null);
  const [localApiStatus, setLocalApiStatus] = useState<'checking' | 'available' | 'unavailable'>(apiStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    if (apiStatus !== localApiStatus) {
      setLocalApiStatus(apiStatus);
    }
  }, [apiStatus]);

  useEffect(() => {
    if (localApiStatus === 'checking') {
      verifyApiStatus();
    }
  }, [localApiStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = currentPrice + (Math.random() * 200 - 100);
      setCurrentPrice(Math.round(newPrice * 100) / 100);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const checkAPIAvailability = async () => {
    try {
      const hasOpenAI = await fetchAdminApiKey('openai');
      const hasClaude = await fetchAdminApiKey('claude');
      const hasGemini = await fetchAdminApiKey('gemini');
      const hasDeepseek = await fetchAdminApiKey('deepseek');
      
      const openaiKey = localStorage.getItem('openaiApiKey');
      const claudeKey = localStorage.getItem('claudeApiKey');
      const geminiKey = localStorage.getItem('geminiApiKey');
      const deepseekKey = localStorage.getItem('deepseekApiKey');
      
      const hasAnyKey = !!(hasOpenAI || hasClaude || hasGemini || hasDeepseek || 
                          openaiKey || claudeKey || geminiKey || deepseekKey);
      
      console.log("TradeOrderForm: API sleutels beschikbaarheidscontrole:", {
        adminKeys: {
          openai: !!hasOpenAI,
          claude: !!hasClaude,
          gemini: !!hasGemini,
          deepseek: !!hasDeepseek
        },
        localStorageKeys: {
          openai: !!openaiKey,
          claude: !!claudeKey,
          gemini: !!geminiKey,
          deepseek: !!deepseekKey
        },
        hasAnyKey
      });
      
      if (!hasAnyKey) {
        console.log("TradeOrderForm: Geen API sleutels beschikbaar");
        setLocalApiStatus('unavailable');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("TradeOrderForm: Fout bij controleren API sleutels:", error);
      return false;
    }
  };

  const verifyApiStatus = async () => {
    setIsVerifying(true);
    try {
      const hasKeys = await checkAPIAvailability();
      
      if (!hasKeys) {
        console.log("TradeOrderForm: Geen API sleutels beschikbaar");
        setLocalApiStatus('unavailable');
        setIsVerifying(false);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      setLocalApiStatus('available');
      console.log("TradeOrderForm: API is available");
    } catch (error) {
      console.error("TradeOrderForm: Failed to verify API status:", error);
      setLocalApiStatus('unavailable');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localApiStatus !== 'available') {
      toast({
        title: "Trading Niet Beschikbaar",
        description: "Trading services zijn momenteel niet beschikbaar. Probeer het later opnieuw.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    if (isSimulationMode) {
      handleSimulatedOrder();
    } else {
      setTimeout(() => {
        toast({
          title: "Order Geplaatst",
          description: `Uw ${orderType === "buy" ? "KOOP" : "VERKOOP"} ${orderExecutionType.toUpperCase()} order voor ${amount} BTC is succesvol geplaatst.`,
        });
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const handleSimulatedOrder = async () => {
    try {
      const simulationRequest = {
        simulation: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          pair_id: "00000000-0000-0000-0000-000000000000",
          type: orderType === "buy" ? "long" : "short",
          amount: Number(amount),
          entry_price: currentPrice,
          strategy: orderMode === "standard" ? "manual" : 
                   advancedSignal ? "ai-assisted" : "manual",
          simulation_type: "daytrading"
        }
      };
      
      const { data, error } = await supabase.functions.invoke('trade-simulation', {
        body: simulationRequest
      });
      
      if (error) throw error;
      
      toast({
        title: "Simulatie Gestart",
        description: `Uw ${orderType === "buy" ? "LONG" : "SHORT"} simulatie voor ${amount} BTC is succesvol gestart tegen $${currentPrice}.`,
      });
    } catch (error) {
      console.error("Error creating simulation:", error);
      toast({
        title: "Simulatie Fout",
        description: "Er is een fout opgetreden bij het starten van de simulatie. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignalApplied = (direction: string, stopLossValue: string, takeProfitValue: string) => {
    setOrderType(direction.toLowerCase() as "buy" | "sell");
    setStopLoss(stopLossValue);
    setTakeProfit(takeProfitValue);
  };

  const handleRetryConnection = () => {
    setLocalApiStatus('checking');
    toast({
      title: "Opnieuw verbinden",
      description: "Verbinding met trading services wordt gecontroleerd..."
    });
  };

  const stopLossPercentage = orderType === "buy" ? 5 : 7;
  const takeProfitPercentage = orderType === "buy" ? 10 : 12;
  const stopLossRecommendation = orderType === "buy" 
    ? currentPrice * (1 - stopLossPercentage/100) 
    : currentPrice * (1 + stopLossPercentage/100);
  const takeProfitRecommendation = orderType === "buy" 
    ? currentPrice * (1 + takeProfitPercentage/100) 
    : currentPrice * (1 - takeProfitPercentage/100);

  const aiAnalysis = {
    confidence: 78,
    riskLevel: "Medium",
    recommendation: orderType === "buy" ? "Buy with stop-loss" : "Sell with limit",
    expectedProfit: `${takeProfitPercentage}% if executed correctly`,
    stopLossRecommendation: Math.round(stopLossRecommendation * 100) / 100,
    takeProfitRecommendation: Math.round(takeProfitRecommendation * 100) / 100,
    collaboratingAgents: ["TrendAnalyzer", "RiskProfiler", "VolatilityMonitor"]
  };

  const isApiAvailable = localApiStatus === 'available';
  const isApiChecking = localApiStatus === 'checking' || isVerifying;

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      {isApiChecking && (
        <div className="mb-4 p-2 bg-blue-500/10 rounded-md flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2 text-blue-500 animate-spin" />
            Controleren van verbinding met trading services...
          </div>
        </div>
      )}
      
      {!isApiAvailable && !isApiChecking && (
        <div className="mb-4 p-2 bg-red-500/10 rounded-md flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Trading services niet beschikbaar. U kunt de interface bekijken maar geen orders plaatsen.
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRetryConnection}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Opnieuw proberen
          </Button>
        </div>
      )}
      
      <div className="mb-4">
        <SimulationToggle 
          enabled={isSimulationMode} 
          onToggle={setIsSimulationMode} 
        />
      </div>
      
      <Tabs defaultValue="standard" onValueChange={setOrderMode}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isSimulationMode ? "Simulatie Order" : "Order Formulier"}
          </h2>
          <TabsList>
            <TabsTrigger value="standard">Standaard</TabsTrigger>
            <TabsTrigger value="advanced">Geavanceerd</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="standard">
          <StandardOrderForm
            orderType={orderType}
            orderExecutionType={orderExecutionType}
            amount={amount}
            limitPrice={limitPrice}
            stopPrice={stopPrice}
            stopLoss={stopLoss}
            takeProfit={takeProfit}
            isSubmitting={isSubmitting}
            stopLossRecommendation={stopLossRecommendation}
            takeProfitRecommendation={takeProfitRecommendation}
            apiStatus={localApiStatus}
            aiAnalysis={aiAnalysis}
            onOrderTypeChange={setOrderType}
            onOrderExecutionTypeChange={setOrderExecutionType}
            onAmountChange={setAmount}
            onLimitPriceChange={setLimitPrice}
            onStopPriceChange={setStopPrice}
            onStopLossChange={setStopLoss}
            onTakeProfitChange={setTakeProfit}
            onSubmit={handleSubmit}
            isSimulationMode={isSimulationMode}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedOrderForm
            currentPrice={currentPrice}
            advancedSignal={advancedSignal}
            setAdvancedSignal={setAdvancedSignal}
            apiEnabled={isApiAvailable}
            apiAvailable={isApiAvailable}
            onSignalApplied={handleSignalApplied}
            onSubmit={handleSubmit}
            isSimulationMode={isSimulationMode}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
