import { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, Badge } from "@/components/ui/card";
import { useFinancialModels } from "@/hooks/use-financial-models";

interface RiskSettings {
  position_size_calculation: string;
  risk_reward_target: number;
  portfolio_allocation_limit: number;
  daily_loss_notification: boolean;
  risk_level: 'conservative' | 'moderate' | 'aggressive';
  max_position_size: number;
  max_daily_loss: number;
  max_leverage: number;
}

const defaultRiskSettings: Partial<RiskSettings> = {
  position_size_calculation: 'fixed',
  risk_reward_target: 2,
  portfolio_allocation_limit: 20,
  daily_loss_notification: true,
  risk_level: 'moderate',
  max_position_size: 1000,
  max_daily_loss: 100,
  max_leverage: 2
};

const RiskManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<RiskSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { models, isLoading: modelsLoading } = useFinancialModels();

  const riskMetrics = [
    {
      name: "Portfolio Risk",
      value: 65,
      maxValue: 100,
      status: "medium",
    },
    {
      name: "Leverage Gebruik",
      value: 32,
      maxValue: 100,
      status: "low",
    },
    {
      name: "Drawdown",
      value: 15,
      maxValue: 100,
      status: "low",
    },
  ];

  useEffect(() => {
    if (user) {
      loadRiskSettings();
    }
  }, [user]);

  const loadRiskSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('risk_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newSettings, error: createError } = await supabase
          .from('risk_settings')
          .insert([{ 
            user_id: user.id,
            ...defaultRiskSettings
          }])
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
        
        toast({
          title: "Risk Settings Created",
          description: "Default risk settings have been created for your account",
        });
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading risk settings:', error);
      toast({
        title: "Error",
        description: "Could not load risk settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveRiskSettings = async () => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from('risk_settings')
        .upsert({
          user_id: user.id,
          ...settings
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Risk settings updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving risk settings:', error);
      toast({
        title: "Error",
        description: "Could not save risk settings",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading risk settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Risk Management</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
        >
          <Settings2 className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit Settings"}
        </Button>
      </div>

      {isEditing && settings ? (
        <div className="space-y-4 p-4 rounded-lg bg-secondary/20 backdrop-blur-xl border border-white/10">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select
                value={settings.risk_level}
                onValueChange={(value: 'conservative' | 'moderate' | 'aggressive') => 
                  setSettings({ ...settings, risk_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Position Size Calculation</Label>
              <Select
                value={settings.position_size_calculation}
                onValueChange={(value) => 
                  setSettings({ ...settings, position_size_calculation: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select calculation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Size</SelectItem>
                  <SelectItem value="risk_based">Risk Based</SelectItem>
                  <SelectItem value="portfolio_percentage">Portfolio Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Risk/Reward Target Ratio</Label>
              <Input
                type="number"
                value={settings.risk_reward_target}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  risk_reward_target: Number(e.target.value) 
                })}
                min={0}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Portfolio Allocation Limit (%)</Label>
              <Input
                type="number"
                value={settings.portfolio_allocation_limit}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  portfolio_allocation_limit: Number(e.target.value) 
                })}
                min={0}
                max={100}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.daily_loss_notification}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, daily_loss_notification: checked })}
              />
              <Label>Daily Loss Notifications</Label>
            </div>

            <Button 
              className="w-full"
              onClick={saveRiskSettings}
            >
              Save Settings
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {riskMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{metric.name}</span>
                <span
                  className={`text-sm font-medium ${
                    metric.status === "high"
                      ? "text-red-400"
                      : metric.status === "medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {metric.value}%
                </span>
              </div>
              <Progress value={metric.value} max={metric.maxValue} className="h-2" />
            </div>
          ))}

          {!modelsLoading && models && models.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Model Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models.map((model) => {
                  const latestMetrics = model.financial_metrics.reduce((acc: Record<string, number>, metric) => {
                    acc[metric.metric_type] = metric.value;
                    return acc;
                  }, {});

                  return (
                    <Card key={model.id} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{model.name}</h4>
                        <Badge variant={model.is_active ? "default" : "secondary"}>
                          {model.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Sharpe Ratio</span>
                          <span>{latestMetrics.sharpe_ratio?.toFixed(2) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Sortino Ratio</span>
                          <span>{latestMetrics.sortino_ratio?.toFixed(2) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Max Drawdown</span>
                          <span>{(latestMetrics.max_drawdown * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">ROI</span>
                          <span className={latestMetrics.roi >= 0 ? "text-green-500" : "text-red-500"}>
                            {latestMetrics.roi?.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Risk Warnings</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Portfolio concentration in BTC above 30%</li>
              <li>• Margin usage approaching limit</li>
              {settings?.daily_loss_notification && (
                <li>• Daily loss limit: ${settings.max_daily_loss}</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskManagement;
