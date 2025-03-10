
// Type definitions for TradingView widgets

interface TradingViewWidget {
  widget: (config: TradingViewConfig) => void;
}

interface TradingViewConfig {
  autosize?: boolean;
  symbol: string;
  interval?: string;
  timezone?: string;
  theme?: string;
  style?: string;
  locale?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id: string;
  [key: string]: any;
}

declare global {
  interface Window {
    TradingView: TradingViewWidget;
  }
}

export {};
