
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ServerCrash } from 'lucide-react';

export interface ChatSettingsProps {
  type: 'openai' | 'claude' | 'grok' | 'deepseek' | 'ollama';
  apiKey?: string;
  setApiKey?: (key: string) => void;
  saveApiKey?: (key: string) => void;
}

export function ChatSettings({ type, apiKey, setApiKey, saveApiKey }: ChatSettingsProps) {
  const navigateToAdminPanel = () => {
    window.location.href = '/admin/api-keys';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {type === 'openai' && 'OpenAI Settings'}
          {type === 'claude' && 'Claude Settings'}
          {type === 'grok' && 'Grok Settings'}
          {type === 'deepseek' && 'DeepSeek Settings'}
          {type === 'ollama' && 'Ollama Settings'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <ServerCrash className="h-4 w-4" />
          <AlertDescription>
            API sleutels kunnen alleen worden geconfigureerd in het Admin Paneel.
            Neem contact op met uw systeembeheerder voor toegang.
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-muted-foreground mt-2">
          {type === 'openai' && 'OpenAI API keys geven toegang tot GPT modellen voor AI chatbots en content generatie.'}
          {type === 'claude' && 'Claude API keys zijn nodig voor toegang tot Anthropic\'s Claude modellen.'}
          {type === 'grok' && 'Grok API keys geven toegang tot de nieuwste AI modellen van xAI.'}
          {type === 'deepseek' && 'DeepSeek API keys zijn nodig voor toegang tot DeepSeek\'s AI modellen.'}
          {type === 'ollama' && 'Ollama instellingen configureren verbinding met lokale Ollama server.'}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={navigateToAdminPanel}>
          Naar Admin Paneel
        </Button>
      </CardFooter>
    </Card>
  );
}
