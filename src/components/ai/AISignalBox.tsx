
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertCircle, Zap, ArrowRight } from 'lucide-react';

interface AISignal {
  id: string;
  ticker: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  price: number;
  confidence: number;
  timeframe: 'SHORT' | 'MEDIUM' | 'LONG';
  reasoning: string;
  timestamp: Date;
}

interface AISignalBoxProps {
  signals: AISignal[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function AISignalBox({ signals, isLoading, onRefresh }: AISignalBoxProps) {
  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Zap className="mr-2 h-5 w-5 text-primary" />
            AI-gegenereerde Handelssignalen
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1"></div>
            ) : null}
            Vernieuwen
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {signals.length === 0 && !isLoading ? (
          <div className="text-center p-4 bg-muted/50 rounded-md">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Geen signalen beschikbaar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-md animate-pulse">
                  <div className="h-6 bg-muted/80 rounded-md w-1/3 mb-2"></div>
                  <div className="h-4 bg-muted/60 rounded-md w-2/3 mb-2"></div>
                  <div className="h-4 bg-muted/60 rounded-md w-full"></div>
                </div>
              ))
            ) : (
              signals.map((signal) => (
                <div key={signal.id} className="p-3 border rounded-md hover:bg-secondary/5 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Badge 
                        variant={signal.action === 'BUY' ? 'default' : signal.action === 'SELL' ? 'destructive' : 'secondary'}
                        className="mr-2"
                      >
                        {signal.action}
                      </Badge>
                      <span className="font-semibold">{signal.ticker}</span>
                      <span className="text-muted-foreground text-sm ml-2">${signal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex items-center">
                      {signal.action === 'BUY' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : signal.action === 'SELL' ? (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      ) : null}
                      <Badge variant="outline" className="text-xs">
                        {signal.confidence}% zekerheid
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{signal.reasoning}</p>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
