
import React from 'react';
import { Button } from "@/components/ui/button";
import { DollarSign, BarChart2 } from 'lucide-react';

export const MarketActions: React.FC = () => {
  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button className="bg-green-500 hover:bg-green-600">
        <DollarSign className="h-4 w-4 mr-2" />
        Buy
      </Button>
      <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
        <DollarSign className="h-4 w-4 mr-2" />
        Sell
      </Button>
      <Button variant="outline">
        <BarChart2 className="h-4 w-4 mr-2" />
        Trade
      </Button>
    </div>
  );
};
