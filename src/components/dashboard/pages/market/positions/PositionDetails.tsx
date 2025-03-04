
import React from 'react';
import { Card } from '@/components/ui/card';

interface PositionDetailsProps {
  position: any;
  showCharts: boolean;
}

export const PositionDetails: React.FC<PositionDetailsProps> = ({ 
  position, 
  showCharts 
}) => {
  if (!position) return null;
  
  return (
    <Card className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Position ID</p>
          <p className="font-medium">{position.id.slice(0, 12)}...</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Entry Price</p>
          <p className="font-medium">${position.average_entry_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="font-medium">{position.amount}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Value</p>
          <p className="font-medium">${(position.amount * position.average_entry_price).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Unrealized P&L</p>
          <p className={`font-medium ${position.unrealized_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
            ${position.unrealized_pnl.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created At</p>
          <p className="font-medium">{new Date(position.created_at).toLocaleString()}</p>
        </div>
      </div>
      
      {showCharts && (
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Position Performance</h4>
          <div className="h-[200px] bg-muted/20 rounded-md flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Position chart coming soon</p>
          </div>
        </div>
      )}
      
      {showCharts && (
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Risk Analysis</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Recommended Stop Loss</span>
              <span className="font-medium">${(position.average_entry_price * 0.95).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Recommended Take Profit</span>
              <span className="font-medium">${(position.average_entry_price * 1.15).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Risk/Reward Ratio</span>
              <span className="font-medium">1:3</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
