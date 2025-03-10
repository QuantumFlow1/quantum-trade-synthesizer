
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CoinsIcon, Settings, AlertTriangle } from 'lucide-react';
import { CryptoAssistant } from './CryptoAssistant';
import { StockbotKeyDialog } from '../minimal/components/stockbot/StockbotKeyDialog';
import { hasApiKey } from '@/utils/apiKeyManager';

export function CryptoAssistantWidget() {
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [hasGroqKey, setHasGroqKey] = useState(false);
  
  // Check if we have API keys set up
  useEffect(() => {
    checkApiKey();
    
    // Set up listener for API key changes
    window.addEventListener('storage', checkApiKey);
    window.addEventListener('apikey-updated', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
      window.removeEventListener('apikey-updated', checkApiKey);
    };
  }, []);
  
  const checkApiKey = () => {
    const groqKeyAvailable = hasApiKey('groq');
    setHasGroqKey(groqKeyAvailable);
    
    // If we have no key, show the configuration
    if (!groqKeyAvailable) {
      setShowConfiguration(true);
    }
  };
  
  return (
    <Card className="col-span-full lg:col-span-8 shadow-md">
      <CardHeader className="py-3">
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <CoinsIcon className="w-5 h-5 mr-2" />
            Crypto Market Assistant
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowConfiguration(true)}
          >
            <Settings className="h-4 w-4 mr-1.5" />
            Configure
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {!hasGroqKey ? (
          <div className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">API Key Required</h3>
            <p className="text-gray-600 mb-4">
              To use the Crypto Assistant, you need to configure your Groq API key.
              This powers the AI models that provide market analysis and insights.
            </p>
            <Button 
              onClick={() => setShowConfiguration(true)}
              className="mx-auto"
            >
              <Settings className="h-4 w-4 mr-1.5" />
              Configure API Key
            </Button>
          </div>
        ) : (
          <CryptoAssistant />
        )}
      </CardContent>
      
      {/* API Key Configuration Dialog */}
      <StockbotKeyDialog
        isKeyDialogOpen={showConfiguration}
        handleDialogClose={() => setShowConfiguration(false)}
        onSuccessfulSave={() => {
          setHasGroqKey(true);
          setShowConfiguration(false);
        }}
      />
    </Card>
  );
}
