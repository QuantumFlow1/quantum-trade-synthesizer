
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStockbotMessages } from '../../hooks/stockbot/useStockbotMessages';

// Mock dependencies
vi.mock('../../hooks/stockbot/storage', () => ({
  loadMessages: vi.fn().mockReturnValue([]),
  saveMessages: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

vi.mock('../../hooks/stockbot/responseSimulator', () => ({
  generateStockbotResponse: vi.fn().mockReturnValue({
    id: 'mock-id',
    sender: 'assistant',
    role: 'assistant',
    content: 'Mock response',
    text: 'Mock response',
    timestamp: new Date()
  })
}));

describe('useStockbotMessages', () => {
  const mockCheckApiKey = vi.fn().mockResolvedValue(true);
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with empty messages', () => {
    const { result } = renderHook(() => 
      useStockbotMessages([], true, false, mockCheckApiKey)
    );
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.inputMessage).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('allows setting input message', () => {
    const { result } = renderHook(() => 
      useStockbotMessages([], true, false, mockCheckApiKey)
    );
    
    act(() => {
      result.current.setInputMessage('test message');
    });
    
    expect(result.current.inputMessage).toBe('test message');
  });

  it('sends message and gets response in simulation mode', async () => {
    const { result } = renderHook(() => 
      useStockbotMessages([], true, true, mockCheckApiKey)
    );
    
    // Set input message
    act(() => {
      result.current.setInputMessage('test message');
    });
    
    // Send message
    await act(async () => {
      await result.current.handleSendMessage();
    });
    
    // Verify messages are updated
    expect(result.current.messages.length).toBe(2);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[0].content).toBe('test message');
    expect(result.current.messages[1].role).toBe('assistant');
  });

  it('clears messages when clearChat is called', () => {
    const { result } = renderHook(() => 
      useStockbotMessages([], true, true, mockCheckApiKey)
    );
    
    // Add a message
    act(() => {
      result.current.setInputMessage('test message');
    });
    
    act(async () => {
      await result.current.handleSendMessage();
    });
    
    expect(result.current.messages.length).toBe(2);
    
    // Clear messages
    act(() => {
      result.current.clearChat();
    });
    
    expect(result.current.messages).toEqual([]);
  });
});
