
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ProfitLossRecord, TradeHistoryItem } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface PerformanceTabContentProps {
  marketName: string | null;
  tradeHistory: TradeHistoryItem[];
  profitLoss: ProfitLossRecord[];
  isLoading: boolean;
}

export const PerformanceTabContent = ({
  marketName,
  tradeHistory,
  profitLoss,
  isLoading
}: PerformanceTabContentProps) => {
  // Calculate performance metrics
  const totalTrades = tradeHistory.length;
  const winningTrades = tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss > 0).length;
  const losingTrades = tradeHistory.filter(trade => trade.profitLoss && trade.profitLoss < 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const totalProfitLoss = profitLoss.reduce((sum, record) => sum + record.realized, 0);
  const averageProfitLoss = totalTrades > 0 ? totalProfitLoss / totalTrades : 0;
  
  // Get performance timeline data (last 5 trades)
  const recentTrades = [...tradeHistory].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Performance Summary for {marketName}</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Activity className="h-8 w-8 animate-pulse text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-secondary/20 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-xl font-bold">{totalTrades}</p>
              </div>
              
              <div className="bg-secondary/20 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-xl font-bold">{winRate.toFixed(1)}%</p>
              </div>
              
              <div className="bg-secondary/20 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${formatCurrency(totalProfitLoss)}
                </p>
              </div>
              
              <div className="bg-secondary/20 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Avg. Trade</p>
                <p className={`text-xl font-bold ${averageProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${formatCurrency(averageProfitLoss)}
                </p>
              </div>
            </div>
            
            <h4 className="text-md font-medium mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent Trading History
            </h4>
            
            {recentTrades.length > 0 ? (
              <div className="space-y-2">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-2 rounded-lg border border-border">
                    <div className="flex items-center">
                      {trade.type === 'buy' ? (
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.amount} {trade.symbol}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(trade.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">${formatCurrency(trade.price)}</p>
                      {trade.profitLoss && (
                        <p className={`text-xs ${trade.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.profitLoss >= 0 ? (
                            <span className="flex items-center">
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                              +${formatCurrency(trade.profitLoss)}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                              -${formatCurrency(Math.abs(trade.profitLoss))}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No trade history available for this market</p>
              </div>
            )}
          </>
        )}
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-3">Trading Performance Timeline</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track your historical performance and view profit/loss trends over time
        </p>
        
        <div className="h-48 bg-secondary/20 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Performance chart will appear here based on your trading activity</p>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <h5 className="text-sm font-medium text-green-600 mb-1">Best Trade</h5>
            <p className="text-xs text-muted-foreground">
              {profitLoss.length > 0 
                ? `${Math.max(...profitLoss.map(p => p.percentage)).toFixed(2)}% profit on ${new Date(profitLoss.reduce((max, p) => p.percentage > max.percentage ? p : max, profitLoss[0]).timestamp).toLocaleDateString()}`
                : "No trade data available yet"}
            </p>
          </div>
          
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <h5 className="text-sm font-medium text-red-600 mb-1">Worst Trade</h5>
            <p className="text-xs text-muted-foreground">
              {profitLoss.length > 0 
                ? `${Math.min(...profitLoss.map(p => p.percentage)).toFixed(2)}% loss on ${new Date(profitLoss.reduce((min, p) => p.percentage < min.percentage ? p : min, profitLoss[0]).timestamp).toLocaleDateString()}`
                : "No trade data available yet"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
