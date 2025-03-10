
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StockbotChatContainer } from '../components/stockbot/StockbotChatContainer';

// Mock the child component
vi.mock('../components/stockbot/StockbotChatContent', () => ({
  StockbotChatContent: () => <div data-testid="stockbot-chat-content">Mock Content</div>,
}));

describe('StockbotChatContainer', () => {
  it('renders the card container with StockbotChatContent', () => {
    render(<StockbotChatContainer hasApiKey={false} marketData={[]} />);
    
    // Check for the Card component
    expect(document.querySelector('.h-\\[500px\\]')).toBeInTheDocument();
    
    // Check for the StockbotChatContent
    expect(screen.getByTestId('stockbot-chat-content')).toBeInTheDocument();
  });
});
