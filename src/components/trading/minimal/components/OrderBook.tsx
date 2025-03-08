
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface OrderBookProps {
  selectedPair: string;
}

interface OrderItem {
  price: number;
  amount: number;
  total: number;
}

export const OrderBook = ({ selectedPair }: OrderBookProps) => {
  const [bids, setBids] = useState<OrderItem[]>([]);
  const [asks, setAsks] = useState<OrderItem[]>([]);

  useEffect(() => {
    // In a real app, this would fetch real order book data
    const generateOrderBookData = () => {
      const basePrice = selectedPair.includes("BTC") ? 45000 : 2500;
      const newBids: OrderItem[] = [];
      const newAsks: OrderItem[] = [];
      
      // Generate 10 mock bids (buy orders) slightly below the base price
      for (let i = 0; i < 10; i++) {
        const price = basePrice * (1 - (0.001 * (i + 1)));
        const amount = Math.random() * 2 + 0.1;
        newBids.push({
          price: parseFloat(price.toFixed(2)),
          amount: parseFloat(amount.toFixed(6)),
          total: parseFloat((price * amount).toFixed(2))
        });
      }
      
      // Generate 10 mock asks (sell orders) slightly above the base price
      for (let i = 0; i < 10; i++) {
        const price = basePrice * (1 + (0.001 * (i + 1)));
        const amount = Math.random() * 2 + 0.1;
        newAsks.push({
          price: parseFloat(price.toFixed(2)),
          amount: parseFloat(amount.toFixed(6)),
          total: parseFloat((price * amount).toFixed(2))
        });
      }
      
      // Sort bids in descending order (highest buy price first)
      newBids.sort((a, b) => b.price - a.price);
      
      // Sort asks in ascending order (lowest sell price first)
      newAsks.sort((a, b) => a.price - b.price);
      
      setBids(newBids);
      setAsks(newAsks);
    };
    
    generateOrderBookData();
    
    // Update order book every 5 seconds
    const intervalId = setInterval(generateOrderBookData, 5000);
    
    return () => clearInterval(intervalId);
  }, [selectedPair]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book: {selectedPair}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2 text-green-500">Bids (Buy)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Price</TableHead>
                  <TableHead className="w-1/3">Amount</TableHead>
                  <TableHead className="w-1/3">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids.map((bid, index) => (
                  <TableRow key={`bid-${index}`}>
                    <TableCell className="text-green-500">${bid.price.toLocaleString()}</TableCell>
                    <TableCell>{bid.amount.toFixed(6)}</TableCell>
                    <TableCell>${bid.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2 text-red-500">Asks (Sell)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Price</TableHead>
                  <TableHead className="w-1/3">Amount</TableHead>
                  <TableHead className="w-1/3">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {asks.map((ask, index) => (
                  <TableRow key={`ask-${index}`}>
                    <TableCell className="text-red-500">${ask.price.toLocaleString()}</TableCell>
                    <TableCell>{ask.amount.toFixed(6)}</TableCell>
                    <TableCell>${ask.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
