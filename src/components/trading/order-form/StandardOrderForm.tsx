import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderTypeSelector } from "../OrderTypeSelector";
import { OrderParameters } from "../OrderParameters";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TradeOrder } from "../types";
import { AIAnalysisPanel } from "./AIAnalysisPanel";

interface StandardOrderFormProps {
  orderType: "buy" | "sell";
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  amount: string;
  limitPrice: string;
  stopPrice: string;
  stopLoss: string;
  takeProfit: string;
  isSubmitting: boolean;
  stopLossRecommendation: number;
  takeProfitRecommendation: number;
  apiStatus?: 'checking' | 'available' | 'unavailable';
  aiAnalysis?: {
    confidence: number;
    riskLevel: string;
    recommendation: string;
    expectedProfit: string;
    stopLossRecommendation: number;
    takeProfitRecommendation: number;
    collaboratingAgents: string[];
  };
  isSimulationMode?: boolean;
  onOrderTypeChange: (value: "buy" | "sell") => void;
  onOrderExecutionTypeChange: (value: "market" | "limit" | "stop" | "stop_limit") => void;
  onAmountChange: (value: string) => void;
  onLimitPriceChange: (value: string) => void;
  onStopPriceChange: (value: string) => void;
  onStopLossChange: (value: string) => void;
  onTakeProfitChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StandardOrderForm = ({ 
  orderType,
  orderExecutionType,
  amount,
  limitPrice,
  stopPrice,
  stopLoss,
  takeProfit,
  isSubmitting,
  stopLossRecommendation,
  takeProfitRecommendation,
  apiStatus = 'unavailable',
  aiAnalysis,
  isSimulationMode = false,
  onOrderTypeChange,
  onOrderExecutionTypeChange,
  onAmountChange,
  onLimitPriceChange,
  onStopPriceChange,
  onStopLossChange,
  onTakeProfitChange,
  onSubmit
}: StandardOrderFormProps) => {
  return (
    <div className="space-y-4">
      {/* AI Analyse Panel */}
      <AIAnalysisPanel 
        aiAnalysis={aiAnalysis} 
        isOnline={apiStatus === 'available'} 
      />
      
      <form onSubmit={onSubmit} className="space-y-4 p-4 bg-secondary/20 backdrop-blur-xl rounded-lg border border-white/10">
        {isSimulationMode && (
          <div className="mb-2 p-2 bg-blue-500/10 rounded-md">
            <p className="text-sm text-blue-500">
              Simulatiemodus actief - Er worden geen echte orders geplaatst
            </p>
          </div>
        )}
        
        <OrderTypeSelector 
          value={orderType}
          onValueChange={onOrderTypeChange}
        />

        <div className="space-y-2">
          <Label>Order Uitvoering Type</Label>
          <Select 
            value={orderExecutionType}
            onValueChange={(value: "market" | "limit" | "stop" | "stop_limit") => onOrderExecutionTypeChange(value)}
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
          onAmountChange={onAmountChange}
          onLimitPriceChange={onLimitPriceChange}
          onStopPriceChange={onStopPriceChange}
          onStopLossChange={onStopLossChange}
          onTakeProfitChange={onTakeProfitChange}
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
          {isSubmitting ? "Verwerken..." : `Plaats ${isSimulationMode ? "Gesimuleerde " : ""}${orderType.toUpperCase()} ${orderExecutionType.toUpperCase()} Order`}
        </Button>
      </form>
    </div>
  );
};
