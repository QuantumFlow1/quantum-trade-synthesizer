
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Save } from 'lucide-react';
import { GroqAgentConfig as GroqAgentConfigType } from './types/groqAgentTypes';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GroqAgentConfigProps {
  config: GroqAgentConfigType;
  onSave: (config: GroqAgentConfigType) => void;
}

export const GroqAgentConfig: React.FC<GroqAgentConfigProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<GroqAgentConfigType>({ ...config });
  const { toast } = useToast();
  
  const handleSave = () => {
    onSave(localConfig);
    toast({
      title: "Groq Agent Configuration Saved",
      description: `Groq agent has been ${localConfig.enabled ? 'enabled' : 'disabled'} with the new settings`,
    });
  };
  
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Groq LLM Agent Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="groq-enabled" className="flex items-center gap-2">
            Enable Groq LLM Agent
          </Label>
          <Switch 
            id="groq-enabled" 
            checked={localConfig.enabled}
            onCheckedChange={(checked) => setLocalConfig(prev => ({ ...prev, enabled: checked }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groq-model">Model</Label>
          <Select 
            value={localConfig.model} 
            onValueChange={(value) => setLocalConfig(prev => ({ ...prev, model: value }))}
          >
            <SelectTrigger id="groq-model">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="llama3-70b-8192">Llama 3 70B</SelectItem>
              <SelectItem value="llama3-8b-8192">Llama 3 8B</SelectItem>
              <SelectItem value="mixtral-8x7b-32768">Mixtral 8x7B</SelectItem>
              <SelectItem value="gemma-7b-it">Gemma 7B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="groq-temperature">Temperature: {localConfig.temperature.toFixed(1)}</Label>
          </div>
          <Slider 
            id="groq-temperature"
            min={0}
            max={1}
            step={0.1}
            value={[localConfig.temperature]}
            onValueChange={([value]) => setLocalConfig(prev => ({ ...prev, temperature: value }))}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Precise (0.0)</span>
            <span>Creative (1.0)</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groq-max-tokens">Max Response Tokens</Label>
          <Input 
            id="groq-max-tokens" 
            type="number" 
            value={localConfig.maxTokens} 
            onChange={(e) => setLocalConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 1024 }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groq-system-prompt">System Prompt</Label>
          <Textarea 
            id="groq-system-prompt" 
            rows={5} 
            value={localConfig.systemPrompt}
            onChange={(e) => setLocalConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
            className="resize-none"
          />
        </div>
        
        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
