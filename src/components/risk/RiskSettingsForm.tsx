
import { RiskSettings } from "@/types/risk";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RiskSettingsFormProps {
  settings: RiskSettings;
  onSettingsChange: (settings: RiskSettings) => void;
  onSave: () => void;
}

export const RiskSettingsForm = ({
  settings,
  onSettingsChange,
  onSave,
}: RiskSettingsFormProps) => {
  return (
    <div className="space-y-4 p-4 rounded-lg bg-secondary/20 backdrop-blur-xl border border-white/10">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Risico Niveau</Label>
          <Select
            value={settings.risk_level}
            onValueChange={(value: 'conservative' | 'moderate' | 'aggressive') => 
              onSettingsChange({ ...settings, risk_level: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer risico niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservatief</SelectItem>
              <SelectItem value="moderate">Gematigd</SelectItem>
              <SelectItem value="aggressive">Agressief</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Positiegrootte Berekening</Label>
          <Select
            value={settings.position_size_calculation}
            onValueChange={(value) => 
              onSettingsChange({ ...settings, position_size_calculation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecteer berekeningsmethode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Vaste Grootte</SelectItem>
              <SelectItem value="risk_based">Risico Gebaseerd</SelectItem>
              <SelectItem value="portfolio_percentage">Portfolio Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Risico/Rendement Doel Ratio</Label>
          <Input
            type="number"
            value={settings.risk_reward_target}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              risk_reward_target: Number(e.target.value) 
            })}
            min={0}
            step={0.1}
          />
        </div>

        <div className="space-y-2">
          <Label>Portfolio Allocatie Limiet (%)</Label>
          <Input
            type="number"
            value={settings.portfolio_allocation_limit}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              portfolio_allocation_limit: Number(e.target.value) 
            })}
            min={0}
            max={100}
          />
        </div>

        <div className="space-y-2">
          <Label>Maximale Positie Grootte</Label>
          <Input
            type="number"
            value={settings.max_position_size}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              max_position_size: Number(e.target.value) 
            })}
            min={0}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings.daily_loss_notification}
            onCheckedChange={(checked) => 
              onSettingsChange({ ...settings, daily_loss_notification: checked })}
          />
          <Label>Dagelijkse Verlies Meldingen</Label>
        </div>

        <Button 
          className="w-full"
          onClick={onSave}
        >
          Instellingen Opslaan
        </Button>
      </div>
    </div>
  );
};
