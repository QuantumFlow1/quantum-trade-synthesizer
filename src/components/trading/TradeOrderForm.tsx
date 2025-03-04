
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardOrderForm } from "./order-form/StandardOrderForm";
import { AdvancedOrderForm } from "./order-form/AdvancedOrderForm";
import { SimulationToggle } from "./SimulationToggle";
import { StatusAlert } from "./components/StatusAlert";
import { TradeOrderProvider, useTradeOrder } from "./context/TradeOrderContext";

interface TradeOrderFormProps {
  apiStatus?: 'checking' | 'available' | 'unavailable';
  isSimulationMode?: boolean;
  onSimulationToggle?: (enabled: boolean) => void;
}

// This is the inner component that uses the context
const TradeOrderFormContent = () => {
  const { 
    orderMode, 
    setOrderMode,
    orderType,
    setOrderType,
    orderExecutionType,
    amount,
    limitPrice,
    stopPrice,
    stopLoss,
    takeProfit,
    isSubmitting,
    currentPrice,
    advancedSignal,
    setAdvancedSignal,
    apiStatus,
    isVerifying,
    simulationMode,
    setSimulationMode,
    handleSubmit,
    handleSignalApplied,
    aiAnalysis
  } = useTradeOrder();

  const isApiAvailable = apiStatus === 'available' || simulationMode;
  const isApiChecking = apiStatus === 'checking' || isVerifying;

  return (
    <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
      <StatusAlert 
        isApiChecking={isApiChecking} 
        isApiAvailable={isApiAvailable} 
        isSimulationMode={simulationMode} 
      />
      
      <div className="mb-4">
        <SimulationToggle 
          enabled={simulationMode} 
          onToggle={setSimulationMode} 
        />
      </div>
      
      <Tabs defaultValue="standard" onValueChange={setOrderMode}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {simulationMode ? "Simulatie Order" : "Order Formulier"}
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
            stopLossRecommendation={aiAnalysis.stopLossRecommendation}
            takeProfitRecommendation={aiAnalysis.takeProfitRecommendation}
            apiStatus={apiStatus}
            aiAnalysis={aiAnalysis}
            onOrderTypeChange={setOrderType}
            onSubmit={handleSubmit}
            isSimulationMode={simulationMode}
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
            isSimulationMode={simulationMode}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// This is the wrapper component that provides the context
export const TradeOrderForm = ({ 
  apiStatus = 'unavailable', 
  isSimulationMode = false,
  onSimulationToggle
}: TradeOrderFormProps) => {
  return (
    <TradeOrderProvider 
      initialApiStatus={apiStatus} 
      initialSimulationMode={isSimulationMode} 
      onSimulationToggle={onSimulationToggle}
    >
      <TradeOrderFormContent />
    </TradeOrderProvider>
  );
};
