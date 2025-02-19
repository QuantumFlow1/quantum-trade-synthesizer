
export interface TradeOrder {
  type: "buy" | "sell";
  amount: number;
  price: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface OrderFormData {
  orderType: "buy" | "sell";
  amount: string;
  stopLoss: string;
  takeProfit: string;
}
