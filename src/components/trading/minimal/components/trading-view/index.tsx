
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiStatusAlert, LoadingState } from "./ApiStatusAlert";
import { Spinner } from "@/components/ui/spinner";

interface TradingViewProps {
  chartData: any[];
  apiStatus: string;
  useRealData?: boolean;
}

export const TradingView = ({ chartData, apiStatus, useRealData = false }: TradingViewProps) => {
  const hasValidData = chartData && chartData.length > 0;
  
  if (apiStatus === 'checking') {
    return <LoadingState />;
  }

  if (!hasValidData) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 rounded-lg border">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Geen geldige chartdata beschikbaar</p>
          <p className="text-gray-400 text-sm">Controleer de verbinding of API-status</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            BTC/USD {useRealData ? "Live Price" : "Simulated Price"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-80 flex items-center justify-center">
          <div className="text-center">
            <Spinner className="h-8 w-8 mx-auto mb-4" />
            <p className="text-muted-foreground">Chart data wordt geladen...</p>
          </div>
        </CardContent>
      </Card>
      
      <ApiStatusAlert apiStatus={apiStatus} />
    </div>
  );
};
