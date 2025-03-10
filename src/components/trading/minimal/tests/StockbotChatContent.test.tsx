
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockbotChatContent } from '../components/stockbot/StockbotChatContent';
import { StockbotProvider } from '../contexts/StockbotContext';

// Mock the components used by StockbotChatContent
vi.mock('../components/StockbotHeader', () => ({
  StockbotHeader: () => <div data-testid="stockbot-header">Mock Header</div>,
}));

vi.mock('../components/StockbotMessages', () => ({
  StockbotMessages: () => <div data-testid="stockbot-messages">Mock Messages</div>,
}));

vi.mock('../components/StockbotInput', () => ({
  StockbotInput: () => <div data-testid="stockbot-input">Mock Input</div>,
}));

vi.mock('./StockbotAlerts', () => ({
  StockbotAlerts: () => <div data-testid="stockbot-alerts">Mock Alerts</div>,
}));

vi.mock('./StockbotKeyDialog', () => ({
  StockbotKeyDialog: () => <div data-testid="stockbot-key-dialog">Mock Key Dialog</div>,
}));

describe('StockbotChatContent', () => {
  it('renders all the necessary components', () => {
    render(
      <StockbotProvider marketData={[]}>
        <StockbotChatContent />
      </StockbotProvider>
    );

    expect(screen.getByTestId('stockbot-header')).toBeInTheDocument();
    expect(screen.getByTestId('stockbot-alerts')).toBeInTheDocument();
    expect(screen.getByTestId('stockbot-messages')).toBeInTheDocument();
    expect(screen.getByTestId('stockbot-input')).toBeInTheDocument();
    expect(screen.getByTestId('stockbot-key-dialog')).toBeInTheDocument();
  });
});
