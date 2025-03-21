
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APIProviderList } from "./APIProviderList";
import { APIActivityMonitor } from "./APIActivityMonitor";
import { APIKeysConfiguration } from "./APIKeysConfiguration";
import { hasApiKey, getAvailableProviders } from "@/utils/apiKeyManager";
import { toast } from "@/components/ui/use-toast";
import { Bot, Key, Activity, Settings } from "lucide-react";

export function APIManager() {
  const [activeTab, setActiveTab] = useState("providers");
  const [availableProviders, setAvailableProviders] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load available API providers on mount
  useEffect(() => {
    refreshProviders();
  }, []);

  // Function to refresh provider status
  const refreshProviders = () => {
    setIsRefreshing(true);
    setAvailableProviders(getAvailableProviders());
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };
  
  // Check for new API keys when visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshProviders();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.includes('ApiKey')) {
        refreshProviders();
        
        // Show toast notification when API key is updated from another tab
        toast({
          title: "API Key Updated",
          description: `An API key was updated in another tab`,
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('api-key-update', refreshProviders);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('api-key-update', refreshProviders);
    };
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Key className="h-5 w-5 mr-2" />
          AI API Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="providers">
              <Bot className="h-4 w-4 mr-2" />
              LLM Providers
            </TabsTrigger>
            <TabsTrigger value="keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity Monitor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="space-y-4">
            <APIProviderList 
              providers={availableProviders} 
              onRefresh={refreshProviders}
              isRefreshing={isRefreshing}
            />
          </TabsContent>
          
          <TabsContent value="keys" className="space-y-4">
            <APIKeysConfiguration 
              providers={availableProviders}
              onConfigured={refreshProviders}
            />
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <APIActivityMonitor providers={availableProviders} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default APIManager;
