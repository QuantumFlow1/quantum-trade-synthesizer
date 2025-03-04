import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StandardOrderForm } from "./order-form/StandardOrderForm";
import { AdvancedOrderForm } from "./order-form/AdvancedOrderForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimulationToggle } from "./SimulationToggle";
import { ApiStatusAlert } from "./components/ApiStatusAlert";
import { useApiStatus } from "./hooks/useApiStatus";
import { useSimulatedOrder } from "./hooks/useSimulatedOrder";

interface TradeOrderFormProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
}

export const TradeOrderForm = ({ 
  apiStatus: externalApiStatus = 'unavailable', 
  isSimulationMode = false,
  onSimulationToggle
}: TradeOrderFormProps) => {
  const [orderMode, setOrderMode] = useState<string>("standard");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderExecutionType, setOrderExecutionType] = useState<"market" | "limit" | "stop" | "stop_limit">("market");
  const [amount, setAmount] = useState<string>("0.01");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number>(42000);
  const [advancedSignal, setAdvancedSignal] = useState<any>(null);
  const [localSimulationMode, setLocalSimulationMode] = useState<boolean>(isSimulationMode);
  
  const { toast } = useToast();
  const { apiStatus: localApiStatus, isVerifying, verifyApiStatus } = useApiStatus(externalApiStatus);
  const { isSubmitting, setIsSubmitting, handleSimulatedOrder } = useSimulatedOrder();

  useEffect(() => {
    if (externalApiStatus !== localApiStatus) {
      // Sync with external API status if provided
    }
    if (isSimulationMode !== localSimulationMode) {
      setLocalSimulationMode(isSimulationMode);
    }
  }, [externalApiStatus, isSimulationMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPrice = currentPrice + (Math.random() * 200 - 100);
      setCurrentPrice(Math.round(newPrice * 100) / 100);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  const handleToggleSimulation = (enabled: boolean) => {
    setLocalSimulationMode(enabled);
    if (onSimulationToggle) {
      onSimulationToggle(enabled);
    }
    
    toast({
      title: enabled ? "Simulation Mode Activated" : "Simulation Mode Deactivated",
      description: enabled 
        ? "You can now trade with fake money to test strategies risk-free." 
        : "Returned to normal trading mode.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localApiStatus !== 'available' && !localSimulationMode) {
      toast({
        title: "Trading Niet Beschikbaar",
        description: "Trading services zijn momenteel niet beschikbaar. Probeer het later opnieuw of gebruik simulatiemodus.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    if (localSimulationMode) {
      handleSimulatedOrder(orderType, amount, currentPrice, orderMode, advancedSignal);
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

  const handleSignalApplied = (direction: string, stopLossValue: string, takeProfitValue: string) => {
    setOrderType(direction.toLowerCase() as "buy" | "sell");
    setStopLoss(stopLossValue);
    setTakeProfit(takeProfitValue);
  };

  const handleRetryConnection = () => {
    verifyApiStatus();
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

  const isApiAvailable = localApiStatus === 'available' || localSimulationMode;
  const isApiChecking = localApiStatus === 'checking' || isVerifying;

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <ApiStatusAlert 
        isChecking={isApiChecking}
        isAvailable={isApiAvailable}
        onRetryConnection={handleRetryConnection}
        simulationMode={localSimulationMode}
      />
      
      <div className="mb-4">
        <SimulationToggle 
          enabled={localSimulationMode} 
          onToggle={handleToggleSimulation} 
        />
      </div>
      
      <Tabs defaultValue="standard" onValueChange={setOrderMode}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {localSimulationMode ? "Simulatie Order" : "Order Formulier"}
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
            isSimulationMode={localSimulationMode}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedOrderForm
            currentPrice={currentPrice}
            advancedSignal={advancedSignal}
            setAdvancedSignal={setAdvancedSignal}
            apiEnabled={true}
            apiAvailable={isApiAvailable}
            onSignalApplied={handleSignalApplied}
            onSubmit={handleSubmit}
            isSimulationMode={localSimulationMode}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
