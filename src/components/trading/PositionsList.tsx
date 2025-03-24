
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface Position {
  id: string;
  symbol: string;
  amount: number;
  entry_price: number;
  current_price: number;
  profit_loss: number;
  profit_loss_percentage: number;
  type: "long" | "short";
  timestamp: string;
}

interface PositionsListProps {
  positions: Position[];
  isLoading?: boolean;
  onPositionSelect?: (id: string) => void;
  selectedPositionId?: string;
}

const PositionsList: React.FC<PositionsListProps> = ({
  positions,
  isLoading = false,
  onPositionSelect,
  selectedPositionId
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-center text-muted-foreground py-8">
            No open positions found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-2">
        <div className="space-y-2">
          {positions.map((position) => (
            <div 
              key={position.id}
              className={`p-3 rounded-lg border ${
                selectedPositionId === position.id 
                  ? 'bg-primary/10 border-primary' 
                  : 'hover:bg-muted/50 cursor-pointer'
              }`}
              onClick={() => onPositionSelect && onPositionSelect(position.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <span className="font-medium">{position.symbol}</span>
                  <Badge 
                    variant={position.type === "long" ? "default" : "destructive"}
                    className="ml-2 text-xs"
                  >
                    {position.type}
                  </Badge>
                </div>
                <div className={`text-sm ${
                  position.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {position.profit_loss >= 0 ? '+' : ''}
                  {formatCurrency(position.profit_loss)} ({position.profit_loss_percentage.toFixed(2)}%)
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount:</span>{' '}
                  <span>{position.amount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Entry Price:</span>{' '}
                  <span>{formatCurrency(position.entry_price)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current Price:</span>{' '}
                  <span>{formatCurrency(position.current_price)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{' '}
                  <span>{new Date(position.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionsList;
