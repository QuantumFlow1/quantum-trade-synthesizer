
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApiKeyMonitor } from '../../hooks/stockbot/useApiKeyMonitor';

// Mock dependencies
vi.mock('../../hooks/stockbot/useApiKeyValidator', () => ({
  useApiKeyValidator: () => ({
    validateGroqApiKey: vi.fn().mockResolvedValue(false)
  })
}));

vi.mock('../../hooks/stockbot/useApiKeyEvents', () => ({
  useApiKeyEvents: vi.fn()
}));

vi.mock('@/utils/apiKeyManager', () => ({
  broadcastApiKeyChange: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

describe('useApiKeyMonitor', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with hasGroqKey as false', async () => {
    const setIsSimulationMode = vi.fn();
    const { result } = renderHook(() => useApiKeyMonitor(true, setIsSimulationMode));
    
    expect(result.current.hasGroqKey).toBe(false);
  });

  it('checkGroqApiKey returns the current key status', async () => {
    const setIsSimulationMode = vi.fn();
    const { result } = renderHook(() => useApiKeyMonitor(true, setIsSimulationMode));
    
    let status;
    await act(async () => {
      status = await result.current.checkGroqApiKey();
    });
    
    expect(status).toBe(false);
  });

  it('setManuallySetMode updates the manuallySetMode ref', () => {
    const setIsSimulationMode = vi.fn();
    const { result } = renderHook(() => useApiKeyMonitor(true, setIsSimulationMode));
    
    act(() => {
      result.current.setManuallySetMode(true);
    });
    
    // Since we're testing a ref, we can't directly check its value
    // This is an indirect test via the checkGroqApiKey function's behavior
    
    // Validate that when manuallySetMode is true, checkGroqApiKey won't change simulation mode
    act(() => {
      result.current.checkGroqApiKey();
    });
    
    expect(setIsSimulationMode).not.toHaveBeenCalled();
  });
});
