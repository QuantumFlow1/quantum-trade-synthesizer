
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook for toggling LLM extensions and showing notifications
 */
export function useExtensionsToggle(
  enabledLLMs: Record<string, boolean>,
  setEnabledLLMs: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  activeTab: string,
  setActiveTab: React.Dispatch<React.SetStateAction<string>>,
  checkConnectionStatusForLLM: (llm: string) => Promise<boolean>
) {
  const toggleLLM = useCallback((llm: string, enabled: boolean) => {
    console.log(`Toggling ${llm} to ${enabled ? 'enabled' : 'disabled'}`);
    
    setEnabledLLMs(prev => {
      const updated = { ...prev, [llm]: enabled };
      // Save immediately to ensure it persists
      localStorage.setItem('enabledLLMs', JSON.stringify(updated));
      return updated;
    });
    
    if (enabled) {
      // Check connection when enabling
      checkConnectionStatusForLLM(llm);
      // Switch to the tab if enabling
      setActiveTab(llm);
      
      toast({
        title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} Enabled`,
        description: `${llm.charAt(0).toUpperCase() + llm.slice(1)} is now available`,
        duration: 3000,
      });
    } else {
      toast({
        title: `${llm.charAt(0).toUpperCase() + llm.slice(1)} Disabled`,
        description: `${llm.charAt(0).toUpperCase() + llm.slice(1)} has been disabled`,
        duration: 3000,
      });
      
      // If disabling the active tab, switch to another enabled tab
      if (activeTab === llm) {
        const newActiveTab = Object.entries(enabledLLMs)
          .filter(([key, val]) => key !== llm && val)
          .map(([key]) => key)[0] || 'grok';
        
        setActiveTab(newActiveTab);
      }
    }
  }, [activeTab, enabledLLMs, setEnabledLLMs, setActiveTab, checkConnectionStatusForLLM]);

  return { toggleLLM };
}
