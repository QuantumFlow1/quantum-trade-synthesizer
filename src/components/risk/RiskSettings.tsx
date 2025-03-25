
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRiskSettings } from '@/hooks/use-risk-settings';

export const RiskSettings = () => {
  const { riskSettings, updateRiskSettings } = useRiskSettings();
  const [updatedSettings, setUpdatedSettings] = useState(riskSettings);

  const handleSave = () => {
    updateRiskSettings(updatedSettings);
  };

  const handleChange = (key: string, value: any) => {
    setUpdatedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Risk Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="position_size_calculation">Position Size Calculation</Label>
          <Select 
            value={updatedSettings.position_size_calculation}
            onValueChange={(value) => handleChange('position_size_calculation', value)}
          >
            <SelectTrigger id="position_size_calculation">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="risk-based">Risk-Based</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="risk_reward_target">Risk/Reward Target</Label>
          <Input 
            id="risk_reward_target" 
            type="number" 
            value={updatedSettings.risk_reward_target}
            onChange={(e) => handleChange('risk_reward_target', parseFloat(e.target.value))}
            min={0}
            step={0.1}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="portfolio_allocation_limit">Portfolio Allocation Limit (%)</Label>
          <Input 
            id="portfolio_allocation_limit" 
            type="number" 
            value={updatedSettings.portfolio_allocation_limit}
            onChange={(e) => handleChange('portfolio_allocation_limit', parseFloat(e.target.value))}
            min={0}
            max={100}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="risk_level">Risk Level</Label>
          <Select 
            value={updatedSettings.risk_level}
            onValueChange={(value: 'conservative' | 'moderate' | 'aggressive') => handleChange('risk_level', value)}
          >
            <SelectTrigger id="risk_level">
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
          <Label htmlFor="max_position_size">Max Position Size</Label>
          <Input 
            id="max_position_size" 
            type="number" 
            value={updatedSettings.max_position_size}
            onChange={(e) => handleChange('max_position_size', parseFloat(e.target.value))}
            min={0}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max_daily_loss">Max Daily Loss</Label>
          <Input 
            id="max_daily_loss" 
            type="number" 
            value={updatedSettings.max_daily_loss}
            onChange={(e) => handleChange('max_daily_loss', parseFloat(e.target.value))}
            min={0}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max_leverage">Max Leverage</Label>
          <Input 
            id="max_leverage" 
            type="number" 
            value={updatedSettings.max_leverage}
            onChange={(e) => handleChange('max_leverage', parseFloat(e.target.value))}
            min={1}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="daily_loss_notification"
            checked={updatedSettings.daily_loss_notification}
            onCheckedChange={(checked) => handleChange('daily_loss_notification', checked)}
          />
          <Label htmlFor="daily_loss_notification">Daily Loss Notifications</Label>
        </div>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
};
