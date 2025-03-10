
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStockbotSettings, loadStockbotSettings, saveStockbotSettings } from '../../hooks/stockbot/useStockbotSettings';

// Mock localStorage
vi.mock('../../hooks/stockbot/storage', () => ({
  loadApiKey: vi.fn(),
  saveApiKey: vi.fn(),
}));

describe('useStockbotSettings', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(JSON.stringify({ isSimulationMode: true })),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('loads settings from localStorage on init', () => {
    const { result } = renderHook(() => useStockbotSettings());
    
    expect(result.current.isSimulationMode).toBe(true);
  });

  it('updates simulation mode when changed', () => {
    const { result } = renderHook(() => useStockbotSettings());
    
    act(() => {
      result.current.setIsSimulationMode(false);
    });
    
    expect(result.current.isSimulationMode).toBe(false);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'stockbot-settings',
      JSON.stringify({ isSimulationMode: false })
    );
  });

  it('saveStockbotSettings saves to localStorage', () => {
    saveStockbotSettings({ isSimulationMode: false });
    
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'stockbot-settings',
      JSON.stringify({ isSimulationMode: false })
    );
  });

  it('loadStockbotSettings loads from localStorage', () => {
    const settings = loadStockbotSettings();
    
    expect(settings).toEqual({ isSimulationMode: true });
    expect(window.localStorage.getItem).toHaveBeenCalledWith('stockbot-settings');
  });
});
