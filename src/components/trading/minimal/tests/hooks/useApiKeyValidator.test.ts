
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useApiKeyValidator } from '../../hooks/stockbot/useApiKeyValidator';

// Mock dependencies
vi.mock('@/utils/apiKeyManager', () => ({
  hasApiKey: vi.fn().mockReturnValue(false)
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { available: false },
        error: null
      })
    }
  }
}));

describe('useApiKeyValidator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns false when no API key exists locally or on server', async () => {
    const { result } = renderHook(() => useApiKeyValidator());
    
    const valid = await result.current.validateGroqApiKey();
    
    expect(valid).toBe(false);
  });

  it('returns true when API key exists locally', async () => {
    const { hasApiKey } = require('@/utils/apiKeyManager');
    hasApiKey.mockReturnValueOnce(true);
    
    const { result } = renderHook(() => useApiKeyValidator());
    
    const valid = await result.current.validateGroqApiKey();
    
    expect(valid).toBe(true);
  });

  it('checks server for admin keys when local key doesnt exist', async () => {
    const { supabase } = require('@/lib/supabase');
    supabase.functions.invoke.mockResolvedValueOnce({
      data: { available: true },
      error: null
    });
    
    const { result } = renderHook(() => useApiKeyValidator());
    
    const valid = await result.current.validateGroqApiKey();
    
    expect(valid).toBe(true);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('check-api-keys', {
      body: { service: 'groq' }
    });
  });

  it('handles errors when checking server keys', async () => {
    const { supabase } = require('@/lib/supabase');
    supabase.functions.invoke.mockResolvedValueOnce({
      data: null,
      error: new Error('Server error')
    });
    
    const { result } = renderHook(() => useApiKeyValidator());
    
    const valid = await result.current.validateGroqApiKey();
    
    expect(valid).toBe(false);
  });
});
