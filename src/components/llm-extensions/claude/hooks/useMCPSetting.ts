
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export function useMCPSetting() {
  const [useMCP, setUseMCP] = useState(false);
  
  // Load MCP setting
  useEffect(() => {
    const mcpSetting = localStorage.getItem('claudeUseMCP');
    if (mcpSetting) {
      setUseMCP(mcpSetting === 'true');
      console.log('Claude MCP setting loaded:', mcpSetting === 'true');
    }
  }, []);

  // Toggle MCP setting
  const toggleMCP = useCallback((enabled: boolean) => {
    setUseMCP(enabled);
    localStorage.setItem('claudeUseMCP', String(enabled));
    
    toast({
      title: `Model Control Protocol ${enabled ? 'Enabled' : 'Disabled'}`,
      description: `Claude will ${enabled ? 'now' : 'no longer'} use the Model Control Protocol.`,
      duration: 3000,
    });
    
    console.log('Claude MCP setting updated:', enabled);
  }, []);

  return { useMCP, toggleMCP };
}
