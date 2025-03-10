
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockbotChat } from '../StockbotChat';

// Mock the StockbotChatContainer used by StockbotChat
vi.mock('../components/stockbot/StockbotChatContainer', () => ({
  StockbotChatContainer: ({ hasApiKey, marketData }) => (
    <div data-testid="stockbot-chat-container">
      <div data-testid="has-api-key">{hasApiKey ? 'true' : 'false'}</div>
      <div data-testid="market-data-length">{marketData.length}</div>
    </div>
  ),
}));

describe('StockbotChat', () => {
  it('passes props correctly to the StockbotChatContainer', () => {
    const marketData = [{ symbol: 'BTC', price: 50000 }];
    render(<StockbotChat hasApiKey={true} marketData={marketData} />);
    
    expect(screen.getByTestId('stockbot-chat-container')).toBeInTheDocument();
    expect(screen.getByTestId('has-api-key').textContent).toBe('true');
    expect(screen.getByTestId('market-data-length').textContent).toBe('1');
  });

  it('uses default props when none are provided', () => {
    render(<StockbotChat />);
    
    expect(screen.getByTestId('has-api-key').textContent).toBe('false');
    expect(screen.getByTestId('market-data-length').textContent).toBe('0');
  });
});
