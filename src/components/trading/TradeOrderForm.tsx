
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { submitTrade } from "@/services/tradeService";
import { TradeOrder } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Unlock } from "lucide-react";
import { AIAnalysisPanel } from "./order-form/AIAnalysisPanel";
import { AdvancedSignalPanel } from "./order-form/AdvancedSignalPanel";
import { StandardOrderForm } from "./order-form/StandardOrderForm";
import { AdvancedOrderForm } from "./order-form/AdvancedOrderForm";
import { supabase } from "@/lib/supabase";

interface TradeOrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
}

export const TradeOrderForm = ({ currentPrice, onSubmitOrder }: TradeOrderFormProps) => {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [orderExecutionType, setOrderExecutionType] = useState<"market" | "limit" | "stop" | "stop_limit">("market");
  const [amount, setAmount] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [stopPrice, setStopPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("standard");
  const [apiEnabled, setApiEnabled] = useState(false);
  const [advancedSignal, setAdvancedSignal] = useState<any>(null);

  // Check if trader has API access
  useEffect(() => {
    if (userProfile?.api_access || userProfile?.role === 'lov_trader') {
      setApiEnabled(true);
    }
  }, [userProfile]);

  // Gesimuleerde AI agent analyse
  const aiAnalysis = {
    confidence: 85,
    riskLevel: "medium",
    recommendation: "long",
    expectedProfit: "2.3%",
    stopLossRecommendation: currentPrice * 0.98,
    takeProfitRecommendation: currentPrice * 1.035,
    collaboratingAgents: ["Trading AI", "Risk Manager", "Market Analyzer"]
  };

  // Functie om geavanceerde signalen op te halen
  const fetchAdvancedSignal = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: `Generate a trading signal for the current market conditions. Current price: ${currentPrice}. Format the response as JSON with fields: direction (LONG/SHORT), entry_price, stop_loss, take_profit, confidence (0-100), reasoning`,
          context: []
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Parse the response to extract JSON
      if (data && data.response) {
        try {
          // Look for JSON in the string response
          const jsonMatch = data.response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);
            setAdvancedSignal(jsonData);
            
            // Auto-fill form with signal data
            if (jsonData.direction) {
              setOrderType(jsonData.direction.toLowerCase() === 'long' ? 'buy' : 'sell');
            }
            if (jsonData.stop_loss) {
              setStopLoss(jsonData.stop_loss.toString());
            }
            if (jsonData.take_profit) {
              setTakeProfit(jsonData.take_profit.toString());
            }
            
            toast({
              title: "Geavanceerd signaal ontvangen",
              description: `${jsonData.direction} signaal met ${jsonData.confidence}% vertrouwen`,
            });
          } else {
            toast({
              title: "Signaal verwerking mislukt",
              description: "Kon het signaal niet extraheren uit de respons",
              variant: "destructive",
            });
          }
        } catch (parseError) {
          console.error("Error parsing signal:", parseError);
          toast({
            title: "Signaal verwerking mislukt",
            description: "Kon het signaal niet verwerken",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching advanced signal:", error);
      toast({
        title: "API Fout",
        description: "Kon geen geavanceerd signaal ophalen",
        variant: "destructive",
      });
    }
  };

  const handleApplySignal = () => {
    if (advancedSignal) {
      setOrderType(advancedSignal.direction.toLowerCase() === 'long' ? 'buy' : 'sell');
      setStopLoss(advancedSignal.stop_loss.toString());
      setTakeProfit(advancedSignal.take_profit.toString());
      setActiveTab("standard");
      
      toast({
        title: "Signaal Toegepast",
        description: "De signaalinstellingen zijn naar het formulier gekopieerd",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authenticatie Vereist",
        description: "Log in om te kunnen handelen",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Ongeldig Bedrag",
        description: "Voer een geldig handelsvolume in",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitTrade(
        user.id, 
        orderType, 
        orderExecutionType,
        Number(amount), 
        currentPrice,
        limitPrice ? Number(limitPrice) : undefined,
        stopPrice ? Number(stopPrice) : undefined
      );

      const order: TradeOrder = {
        type: orderType,
        orderType: orderExecutionType,
        amount: Number(amount),
        price: currentPrice,
        limitPrice: limitPrice ? Number(limitPrice) : undefined,
        stopPrice: stopPrice ? Number(stopPrice) : undefined,
        stopLoss: stopLoss ? Number(stopLoss) : Number(aiAnalysis.stopLossRecommendation),
        takeProfit: takeProfit ? Number(takeProfit) : Number(aiAnalysis.takeProfitRecommendation)
      };

      onSubmitOrder(order);
      toast({
        title: "Order Geplaatst",
        description: `${orderType.toUpperCase()} ${orderExecutionType} order geplaatst voor ${amount} eenheden`,
      });

      // Reset formulier
      setAmount("");
      setLimitPrice("");
      setStopPrice("");
      setStopLoss("");
      setTakeProfit("");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Fout",
        description: "Kon order niet plaatsen. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Panel */}
      <AIAnalysisPanel aiAnalysis={aiAnalysis} />
      
      {/* Advanced Signal Panel (conditionally rendered) */}
      <AdvancedSignalPanel 
        apiEnabled={apiEnabled} 
        currentPrice={currentPrice}
        advancedSignal={advancedSignal}
        setAdvancedSignal={setAdvancedSignal}
        onSignalApplied={handleApplySignal}
      />

      {/* Order Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="standard">
            Standaard Trading
          </TabsTrigger>
          <TabsTrigger value="advanced" disabled={!apiEnabled}>
            <div className="flex items-center gap-1">
              {apiEnabled ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              <span>API Trading</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
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
            stopLossRecommendation={aiAnalysis.stopLossRecommendation}
            takeProfitRecommendation={aiAnalysis.takeProfitRecommendation}
            onOrderTypeChange={setOrderType}
            onOrderExecutionTypeChange={setOrderExecutionType}
            onAmountChange={setAmount}
            onLimitPriceChange={setLimitPrice}
            onStopPriceChange={setStopPrice}
            onStopLossChange={setStopLoss}
            onTakeProfitChange={setTakeProfit}
            onSubmit={handleSubmit}
          />
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedOrderForm
            apiEnabled={apiEnabled}
            advancedSignal={advancedSignal}
            fetchAdvancedSignal={fetchAdvancedSignal}
            amount={amount}
            orderExecutionType={orderExecutionType}
            limitPrice={limitPrice}
            stopPrice={stopPrice}
            stopLoss={stopLoss}
            takeProfit={takeProfit}
            isSubmitting={isSubmitting}
            orderType={orderType}
            onAmountChange={setAmount}
            onLimitPriceChange={setLimitPrice}
            onStopPriceChange={setStopPrice}
            onStopLossChange={setStopLoss}
            onTakeProfitChange={setTakeProfit}
            onApplySignal={handleApplySignal}
            onSubmit={handleSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
