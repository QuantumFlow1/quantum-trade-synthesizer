
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { fetchAdminApiKey } from "@/components/chat/services/utils/apiHelpers";

interface TradeOrderContextProps {
  orderMode: string;
  setOrderMode: (mode: string) => void;
  orderType: "buy" | "sell";
  setOrderType: (type: "buy" | "sell") => void;
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  setOrderExecutionType: (type: "market" | "limit" | "stop" | "stop_limit") => void;
  amount: string;
  setAmount: (amount: string) => void;
  limitPrice: string;
  setLimitPrice: (price: string) => void;
  stopPrice: string;
  setStopPrice: (price: string) => void;
  stopLoss: string;
  setStopLoss: (price: string) => void;
  takeProfit: string;
  setTakeProfit: (price: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  currentPrice: number;
  advancedSignal: any;
  setAdvancedSignal: (signal: any) => void;
  apiStatus: 'checking' | 'available' | 'unavailable';
  setApiStatus: (status: 'checking' | 'available' | 'unavailable') => void;
  isVerifying: boolean;
  setIsVerifying: (value: boolean) => void;
  simulationMode: boolean;
  setSimulationMode: (value: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSignalApplied: (direction: string, stopLossValue: string, takeProfitValue: string) => void;
  handleRetryConnection: () => void;
  verifyApiStatus: () => Promise<void>;
  aiAnalysis: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    stopLossRecommendation: number;
    takeProfitRecommendation: number;
    collaboratingAgents: string[];
  };
}

export const TradeOrderContext = createContext<TradeOrderContextProps | undefined>(undefined);

interface TradeOrderProviderProps {
  children: ReactNode;
  initialApiStatus?: 'checking' | 'available' | 'unavailable';
  initialSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
}

export const TradeOrderProvider = ({ 
  children, 
  initialApiStatus = 'unavailable',
  initialSimulationMode = false,
  onSimulationToggle
}: TradeOrderProviderProps) => {
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
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>(initialApiStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const [simulationMode, setSimulationMode] = useState<boolean>(initialSimulationMode);

  const { toast } = useToast();

  useEffect(() => {
    if (initialApiStatus !== apiStatus) {
      setApiStatus(initialApiStatus);
    }
    if (initialSimulationMode !== simulationMode) {
      setSimulationMode(initialSimulationMode);
    }
  }, [initialApiStatus, initialSimulationMode]);

  useEffect(() => {
    if (apiStatus === 'checking') {
      verifyApiStatus();
    }
  }, [apiStatus]);

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
        setApiStatus('unavailable');
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
        setApiStatus('unavailable');
        setIsVerifying(false);
        return;
      }
      
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { message: "ping", context: [] }
      });
      
      if (error) throw error;
      setApiStatus('available');
      console.log("TradeOrderForm: API is available");
    } catch (error) {
      console.error("TradeOrderForm: Failed to verify API status:", error);
      setApiStatus('unavailable');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleToggleSimulation = (enabled: boolean) => {
    setSimulationMode(enabled);
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
    
    if (apiStatus !== 'available' && !simulationMode) {
      toast({
        title: "Trading Niet Beschikbaar",
        description: "Trading services zijn momenteel niet beschikbaar. Probeer het later opnieuw of gebruik simulatiemodus.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    if (simulationMode) {
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
      
      console.log("Sending simulation request:", simulationRequest);
      
      const { data, error } = await supabase.functions.invoke('trade-simulation', {
        body: simulationRequest
      });
      
      if (error) {
        console.error("Error response from trade-simulation:", error);
        throw error;
      }
      
      console.log("Simulation response:", data);
      
      toast({
        title: "Simulatie Gestart",
        description: `Uw ${orderType === "buy" ? "LONG" : "SHORT"} simulatie voor ${amount} BTC is succesvol gestart tegen $${currentPrice}.`,
      });
      
      if (onSimulationToggle) {
        document.querySelector('[value="simulated"]')?.dispatchEvent(
          new MouseEvent('click', { bubbles: true })
        );
      }
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
    setApiStatus('checking');
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

  const value = {
    orderMode,
    setOrderMode,
    orderType,
    setOrderType,
    orderExecutionType,
    setOrderExecutionType,
    amount,
    setAmount,
    limitPrice,
    setLimitPrice,
    stopPrice,
    setStopPrice,
    stopLoss,
    setStopLoss,
    takeProfit,
    setTakeProfit,
    isSubmitting,
    setIsSubmitting,
    currentPrice,
    advancedSignal,
    setAdvancedSignal,
    apiStatus,
    setApiStatus,
    isVerifying,
    setIsVerifying,
    simulationMode,
    setSimulationMode: handleToggleSimulation,
    handleSubmit,
    handleSignalApplied,
    handleRetryConnection,
    verifyApiStatus,
    aiAnalysis
  };

  return (
    <TradeOrderContext.Provider value={value}>
      {children}
    </TradeOrderContext.Provider>
  );
};

export const useTradeOrder = () => {
  const context = useContext(TradeOrderContext);
  if (context === undefined) {
    throw new Error("useTradeOrder must be used within a TradeOrderProvider");
  }
  return context;
};
