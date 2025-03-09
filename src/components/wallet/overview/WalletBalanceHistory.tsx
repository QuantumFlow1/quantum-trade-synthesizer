
import React from "react";
import { Card } from "@/components/ui/card";
import { WalletType } from "../types/walletTypes";
import { BalanceAreaChart } from "./charts/BalanceAreaChart";
import { 
  generateMockBalanceData, 
  BalanceHistoryDataPoint 
} from "./utils/balanceHistoryUtils";

interface WalletBalanceHistoryProps {
  currency: string;
  walletType: WalletType;
  data?: BalanceHistoryDataPoint[];
}

export const WalletBalanceHistory = ({ 
  currency, 
  walletType,
  data 
}: WalletBalanceHistoryProps) => {
  // Generate mock data if none provided
  const balanceData = React.useMemo(() => {
    return data || generateMockBalanceData(walletType);
  }, [data, walletType]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Balance History (12 Months)</h3>
      <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
        <div className="h-72">
          <BalanceAreaChart 
            data={balanceData}
            currency={currency}
            walletType={walletType}
          />
        </div>
      </Card>
    </div>
  );
};
