
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APIKeysConfiguration } from '@/components/apimanager/APIKeysConfiguration';
import { GroqApiKeyForm } from '@/components/trading/portfolio/settings/GroqApiKeyForm';
import { RiskSettings } from '@/types/risk';
import { RiskSettingsForm } from '@/components/risk/RiskSettingsForm';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('api-keys');
  const [riskSettings, setRiskSettings] = React.useState<RiskSettings>({
    risk_level: 'moderate',
    position_size_calculation: 'risk_based',
    risk_reward_target: 2.5,
    portfolio_allocation_limit: 25,
    max_position_size: 5000,
    daily_loss_notification: true
  });

  const handleRiskSettingsChange = (settings: RiskSettings) => {
    setRiskSettings(settings);
  };

  const handleSaveRiskSettings = () => {
    // Here you would typically save the settings to a database or localStorage
    console.log('Saving risk settings:', riskSettings);
    // Example of using localStorage
    localStorage.setItem('riskSettings', JSON.stringify(riskSettings));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">API Key Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <APIKeysConfiguration 
                  providers={{
                    openai: false,
                    groq: false,
                    anthropic: false,
                    gemini: false,
                    deepseek: false,
                    ollama: false
                  }}
                  onConfigured={() => console.log("API keys configured")}
                />
              </div>
              <div>
                <GroqApiKeyForm />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Risk Management Settings</h2>
            <RiskSettingsForm 
              settings={riskSettings}
              onSettingsChange={handleRiskSettingsChange}
              onSave={handleSaveRiskSettings}
            />
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Appearance Settings</h2>
            <p>Appearance settings will be available soon.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
