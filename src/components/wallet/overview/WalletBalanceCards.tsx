
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface WalletBalanceCardsProps {
  balance: number;
  availableBalance: number;
  lockedBalance: number;
  performanceToday: number;
  currency: string;
}

export const WalletBalanceCards = ({
  balance,
  availableBalance,
  lockedBalance,
  performanceToday,
  currency
}: WalletBalanceCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
        <div className="text-sm text-muted-foreground">Total Balance</div>
        <div className="text-2xl font-bold">{currency}{balance.toLocaleString()}</div>
        <div className="mt-2 flex items-center">
          <div className={`text-xs flex items-center ${performanceToday >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {performanceToday >= 0 ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {Math.abs(performanceToday).toFixed(2)}% today
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
        <div className="text-sm text-muted-foreground">Available Balance</div>
        <div className="text-2xl font-bold">{currency}{availableBalance.toLocaleString()}</div>
        <div className="mt-2 text-xs text-muted-foreground">
          Available for trading
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/20 backdrop-blur-sm">
        <div className="text-sm text-muted-foreground">Locked Balance</div>
        <div className="text-2xl font-bold">{currency}{lockedBalance.toLocaleString()}</div>
        <div className="mt-2 text-xs text-muted-foreground">
          In active trades/orders
        </div>
      </Card>
    </div>
  );
};
