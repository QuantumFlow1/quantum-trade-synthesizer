
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceTemplate } from '@/lib/types';
import { UserProfile } from '@/types/auth';

export const SuperAdminGreeting: React.FC = () => {
  return (
    <Card className="w-full bg-gradient-to-br from-slate-100 to-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Bot className="h-5 w-5 text-indigo-600" />
          <span>Super Admin Voice Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          This is the super admin interface for the voice assistant system. 
          You can test audio processing, manage voice templates, and monitor system performance.
        </p>
      </CardContent>
    </Card>
  );
};

interface WelcomeMessageProps {
  selectedVoice: VoiceTemplate;
  userProfile: UserProfile | null;
  onConnectionTestClick: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  selectedVoice, 
  userProfile, 
  onConnectionTestClick 
}) => {
  return (
    <Card className="w-full bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Bot className="h-5 w-5 text-indigo-400" />
          <span>Welcome to Admin Voice Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          I'm your administrative voice assistant. You can speak to me or enter text directly.
          I can help you monitor system status, process tasks, and provide information about the trading platform.
        </p>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onConnectionTestClick}
            className="text-xs text-indigo-300 border-indigo-800"
          >
            Check Connections
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
