
import { useState, useEffect } from 'react';

export interface Position {
  id: string;
  symbol: string;
  amount: number;
  entry_price: number;
  current_price: number;
  profit_loss: number;
  profit_loss_percentage: number;
  type: 'long' | 'short';
  timestamp: string;
}

export const usePositions = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get positions
    setTimeout(() => {
      setPositions([
        {
          id: "1",
          symbol: "BTC",
          amount: 0.15,
          entry_price: 43500,
          current_price: 42000,
          profit_loss: -225,
          profit_loss_percentage: -3.45,
          type: 'long',
          timestamp: new Date().toISOString()
        },
        {
          id: "2",
          symbol: "ETH",
          amount: 1.5,
          entry_price: 2800,
          current_price: 3000,
          profit_loss: 300,
          profit_loss_percentage: 7.14,
          type: 'long',
          timestamp: new Date().toISOString()
        }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  return { positions, isLoading };
};

export const useSimulatedPositions = () => {
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "sim1",
      symbol: "BTC",
      amount: 0.25,
      entry_price: 41000,
      current_price: 42000,
      profit_loss: 250,
      profit_loss_percentage: 2.44,
      type: 'long',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const closePosition = (positionId: string) => {
    setPositions(prev => prev.filter(p => p.id !== positionId));
  };

  return { positions, isLoading, closePosition };
};
