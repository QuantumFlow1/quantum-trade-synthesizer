
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { OrderTypeSelector } from "./OrderTypeSelector";
import { OrderParameters } from "./OrderParameters";
import { submitTrade } from "@/services/tradeService";
import { TradeOrder } from "./types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Brain, Users, TrendingUp, AlertTriangle, Lock, Unlock, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

interface TradeOrderFormProps {
  currentPrice: number;
  onSubmitOrder: (order: TradeOrder) => void;
}

export const TradeOrderForm = ({ currentPrice, onSubmitOrder }: TradeOrderFormProps) => {
  const { toast } = useToast();
  const { user, userProfile, checkPermission } = useAuth();
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
      <Card className="p-4 bg-secondary/10 backdrop-blur-xl border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">AI Trading Analyse</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Vertrouwen: {aiAnalysis.confidence}%</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span>Risico: {aiAnalysis.riskLevel}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>Verwachte winst: {aiAnalysis.expectedProfit}</div>
            <div>Aanbeveling: {aiAnalysis.recommendation}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>Samenwerkende AI Agents: {aiAnalysis.collaboratingAgents.join(", ")}</span>
        </div>
        
        {apiEnabled && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-medium">Geavanceerde API-functies</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
                onClick={fetchAdvancedSignal}
              >
                <Zap className="w-3 h-3" />
                Genereer Signaal
              </Button>
            </div>
            
            {advancedSignal && (
              <div className="p-3 bg-primary/10 rounded-lg mt-2">
                <div className="text-sm font-medium mb-1">
                  {advancedSignal.direction} Signaal ({advancedSignal.confidence}% vertrouwen)
                </div>
                <div className="text-xs text-muted-foreground">
                  Redenering: {advancedSignal.reasoning}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

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
          <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
            <OrderTypeSelector 
              value={orderType}
              onValueChange={setOrderType}
            />

            <div className="space-y-2">
              <Label>Order Uitvoering Type</Label>
              <Select 
                value={orderExecutionType}
                onValueChange={(value: "market" | "limit" | "stop" | "stop_limit") => setOrderExecutionType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                  <SelectItem value="stop_limit">Stop Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <OrderParameters
              amount={amount}
              orderExecutionType={orderExecutionType}
              limitPrice={limitPrice}
              stopPrice={stopPrice}
              stopLoss={stopLoss}
              takeProfit={takeProfit}
              onAmountChange={setAmount}
              onLimitPriceChange={setLimitPrice}
              onStopPriceChange={setStopPrice}
              onStopLossChange={setStopLoss}
              onTakeProfitChange={setTakeProfit}
            />

            <Button 
              type="submit" 
              className={`w-full ${
                orderType === "buy" 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verwerken..." : `Plaats ${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} Order`}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="advanced">
          {apiEnabled ? (
            <div className="space-y-6 p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">API-gebaseerde Trading</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  variant="outline" 
                  onClick={fetchAdvancedSignal}
                  className="bg-primary/20 hover:bg-primary/30 border-primary/30"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Genereer Geavanceerd Signaal
                </Button>
                
                {advancedSignal && (
                  <Card className="p-4 bg-primary/10 border-primary/20">
                    <h4 className="text-md font-medium mb-2">Geavanceerd Trading Signaal</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Richting:</strong> {advancedSignal.direction}</div>
                      <div><strong>Entry Prijs:</strong> {advancedSignal.entry_price}</div>
                      <div><strong>Stop Loss:</strong> {advancedSignal.stop_loss}</div>
                      <div><strong>Take Profit:</strong> {advancedSignal.take_profit}</div>
                      <div><strong>Vertrouwen:</strong> {advancedSignal.confidence}%</div>
                      <div className="pt-2 border-t border-primary/20">
                        <strong>Redenering:</strong><br/>
                        <p className="text-muted-foreground">{advancedSignal.reasoning}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <Button
                        onClick={() => {
                          setOrderType(advancedSignal.direction.toLowerCase() === 'long' ? 'buy' : 'sell');
                          setStopLoss(advancedSignal.stop_loss.toString());
                          setTakeProfit(advancedSignal.take_profit.toString());
                          setActiveTab("standard");
                          
                          toast({
                            title: "Signaal Toegepast",
                            description: "De signaalinstellingen zijn naar het formulier gekopieerd",
                          });
                        }}
                        className="w-full"
                      >
                        Pas dit Signaal Toe op Order Formulier
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4 pt-4 border-t border-white/10">
                <OrderParameters
                  amount={amount}
                  orderExecutionType={orderExecutionType}
                  limitPrice={limitPrice}
                  stopPrice={stopPrice}
                  stopLoss={stopLoss}
                  takeProfit={takeProfit}
                  onAmountChange={setAmount}
                  onLimitPriceChange={setLimitPrice}
                  onStopPriceChange={setStopPrice}
                  onStopLossChange={setStopLoss}
                  onTakeProfitChange={setTakeProfit}
                />

                <Button 
                  type="submit" 
                  className={`w-full ${
                    orderType === "buy" 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verwerken..." : `Plaats API ${orderType.toUpperCase()} Order`}
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
              <Lock className="w-12 h-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">API Toegang Vergrendeld</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Je huidige rol geeft geen toegang tot API-gebaseerde handelsfuncties. Neem contact op met een beheerder om toegang te krijgen.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
