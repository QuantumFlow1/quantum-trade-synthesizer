
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDialogState } from '../../hooks/stockbot/useDialogState';

describe('useDialogState', () => {
  it('initializes with dialog closed', () => {
    const { result } = renderHook(() => useDialogState());
    
    expect(result.current.isKeyDialogOpen).toBe(false);
  });

  it('opens dialog when showApiKeyDialog is called', () => {
    const { result } = renderHook(() => useDialogState());
    
    act(() => {
      result.current.showApiKeyDialog();
    });
    
    expect(result.current.isKeyDialogOpen).toBe(true);
  });

  it('allows setting dialog state directly', () => {
    const { result } = renderHook(() => useDialogState());
    
    act(() => {
      result.current.setIsKeyDialogOpen(true);
    });
    
    expect(result.current.isKeyDialogOpen).toBe(true);
    
    act(() => {
      result.current.setIsKeyDialogOpen(false);
    });
    
    expect(result.current.isKeyDialogOpen).toBe(false);
  });
});
