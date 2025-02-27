
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Check } from 'lucide-react';
import { ApiKeyFormData } from './types';

interface ApiKeyFormProps {
  formData: ApiKeyFormData;
  saved: boolean;
  isLoading: boolean;
  onInputChange: (key: keyof ApiKeyFormData, value: string) => void;
  onSave: () => void;
}

export function ApiKeyForm({ formData, saved, isLoading, onInputChange, onSave }: ApiKeyFormProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="openaiKey" className="text-sm font-medium">OpenAI API Sleutel</Label>
        <Input 
          id="openaiKey"
          type="password" 
          value={formData.openaiKey} 
          onChange={(e) => onInputChange('openaiKey', e.target.value)} 
          placeholder="sk-..." 
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">Vereist voor GPT-4o</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="claudeKey" className="text-sm font-medium">Claude API Sleutel</Label>
        <Input 
          id="claudeKey"
          type="password" 
          value={formData.claudeKey} 
          onChange={(e) => onInputChange('claudeKey', e.target.value)}
          placeholder="sk-ant-..." 
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">Vereist voor Claude 3</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="geminiKey" className="text-sm font-medium">Gemini API Sleutel</Label>
        <Input 
          id="geminiKey"
          type="password" 
          value={formData.geminiKey} 
          onChange={(e) => onInputChange('geminiKey', e.target.value)}
          placeholder="AIzaSy..." 
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">Vereist voor Gemini Pro</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deepseekKey" className="text-sm font-medium">DeepSeek API Sleutel</Label>
        <Input 
          id="deepseekKey"
          type="password" 
          value={formData.deepseekKey} 
          onChange={(e) => onInputChange('deepseekKey', e.target.value)}
          placeholder="sk-..." 
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">Vereist voor DeepSeek Coder</p>
      </div>
      
      <Button onClick={onSave} className="w-full" disabled={isLoading}>
        {saved ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Opgeslagen!
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Sleutels Opslaan
          </>
        )}
      </Button>
    </div>
  );
}
