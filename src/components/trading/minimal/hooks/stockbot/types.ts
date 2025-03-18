
export interface StockbotMessage {
  id: string;
  role: "user" | "assistant" | "system";
  sender: "user" | "assistant" | "system";
  content: string;
  text: string;
  timestamp: Date;
  model?: string;
}

export type StockbotModel = {
  id: string;
  name: string;
  providerName: string;
};

export interface CheckApiKeyFunction {
  (): Promise<boolean>;
}
