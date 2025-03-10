
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { StockbotProvider, useStockbot } from '../contexts/StockbotContext';
import { loadApiKey, saveApiKey } from '../hooks/stockbot/storage';

// Mock dependencies
vi.mock('../hooks/stockbot/storage', () => ({
  loadApiKey: vi.fn(),
  saveApiKey: vi.fn(),
  hasAnyApiKey: vi.fn().mockReturnValue(false),
  loadMessages: vi.fn().mockReturnValue([]),
  saveMessages: vi.fn(),
}));

vi.mock('@/utils/apiKeyManager', () => ({
  hasApiKey: vi.fn().mockReturnValue(false),
  broadcastApiKeyChange: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Test component that uses the StockbotContext
const TestConsumer = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isSimulationMode,
    setIsSimulationMode,
    apiKeyStatus,
    isKeyDialogOpen,
    showApiKeyDialog,
    handleDialogClose,
  } = useStockbot();

  return (
    <div>
      <div data-testid="message-count">{messages.length}</div>
      <div data-testid="input-message">{inputMessage}</div>
      <div data-testid="is-loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="simulation-mode">{isSimulationMode ? 'simulation' : 'api'}</div>
      <div data-testid="api-key-exists">{apiKeyStatus.exists ? 'exists' : 'not-exists'}</div>
      <div data-testid="dialog-open">{isKeyDialogOpen ? 'open' : 'closed'}</div>
      <button data-testid="set-input" onClick={() => setInputMessage('test message')}>
        Set Input
      </button>
      <button data-testid="set-simulation" onClick={() => setIsSimulationMode(!isSimulationMode)}>
        Toggle Simulation
      </button>
      <button data-testid="show-dialog" onClick={showApiKeyDialog}>
        Show Dialog
      </button>
      <button data-testid="close-dialog" onClick={handleDialogClose}>
        Close Dialog
      </button>
    </div>
  );
};

describe('StockbotContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('provides initial state correctly', () => {
    render(
      <StockbotProvider marketData={[]}>
        <TestConsumer />
      </StockbotProvider>
    );

    expect(screen.getByTestId('message-count').textContent).toBe('0');
    expect(screen.getByTestId('input-message').textContent).toBe('');
    expect(screen.getByTestId('is-loading').textContent).toBe('not-loading');
    expect(screen.getByTestId('simulation-mode').textContent).toBe('simulation');
    expect(screen.getByTestId('api-key-exists').textContent).toBe('not-exists');
    expect(screen.getByTestId('dialog-open').textContent).toBe('closed');
  });

  it('allows setting input message', () => {
    render(
      <StockbotProvider marketData={[]}>
        <TestConsumer />
      </StockbotProvider>
    );

    fireEvent.click(screen.getByTestId('set-input'));
    expect(screen.getByTestId('input-message').textContent).toBe('test message');
  });

  it('allows toggling simulation mode', () => {
    render(
      <StockbotProvider marketData={[]}>
        <TestConsumer />
      </StockbotProvider>
    );

    expect(screen.getByTestId('simulation-mode').textContent).toBe('simulation');
    fireEvent.click(screen.getByTestId('set-simulation'));
    expect(screen.getByTestId('simulation-mode').textContent).toBe('api');
  });

  it('handles dialog open/close correctly', async () => {
    render(
      <StockbotProvider marketData={[]}>
        <TestConsumer />
      </StockbotProvider>
    );

    expect(screen.getByTestId('dialog-open').textContent).toBe('closed');
    
    // Open dialog
    fireEvent.click(screen.getByTestId('show-dialog'));
    expect(screen.getByTestId('dialog-open').textContent).toBe('open');
    
    // Close dialog
    fireEvent.click(screen.getByTestId('close-dialog'));
    
    // We need to wait because there's setTimeout in the handleDialogClose 
    await waitFor(() => {
      expect(screen.getByTestId('dialog-open').textContent).toBe('closed');
    });
  });
});
