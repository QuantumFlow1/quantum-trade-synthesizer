
export interface TradeOrder {
  type: "buy" | "sell";
  orderType: "market" | "limit" | "stop" | "stop_limit";
  amount: number;
  price: number;
  limitPrice?: number;
  stopPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface OrderFormData {
  orderType: "buy" | "sell";
  orderExecutionType: "market" | "limit" | "stop" | "stop_limit";
  amount: string;
  limitPrice: string;
  stopPrice: string;
  stopLoss: string;
  takeProfit: string;
}
