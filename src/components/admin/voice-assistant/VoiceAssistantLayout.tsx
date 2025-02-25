
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceTemplate } from '@/lib/types';

export interface VoiceAssistantLayoutProps {
  title: string;
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
  directText: string;
  setDirectText: React.Dispatch<React.SetStateAction<string>>;
  handleDirectTextSubmit: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  startRecording: () => void;
  handleStopRecording: () => void;
  previewAudioUrl: string | null;
  previewAudioRef: React.RefObject<HTMLAudioElement>;
  isPreviewPlaying: boolean;
  playPreview: () => void;
  stopPreview: () => void;
  setIsPreviewPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  processingError: string | null;
  processingStage: string;
  children?: React.ReactNode;
}

export const VoiceAssistantLayout: React.FC<VoiceAssistantLayoutProps> = ({
  title,
  selectedVoiceId,
  onVoiceChange,
  directText,
  setDirectText,
  handleDirectTextSubmit,
  isRecording,
  isProcessing,
  isPlaying,
  startRecording,
  handleStopRecording,
  previewAudioUrl,
  previewAudioRef,
  isPreviewPlaying,
  playPreview,
  stopPreview,
  setIsPreviewPlaying,
  processingError,
  processingStage,
  children
}) => {
  return (
    <Card className="bg-card w-full max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="voice" className="flex-1">Voice Control</TabsTrigger>
            <TabsTrigger value="chat" className="flex-1">Chat History</TabsTrigger>
            <TabsTrigger value="connection" className="flex-1">Connection Test</TabsTrigger>
          </TabsList>
          
          {/* Voice Control Tab */}
          <TabsContent value="voice" className="space-y-6">
            {/* Render child components */}
            {children}
          </TabsContent>
          
          {/* Chat History Tab */}
          <TabsContent value="chat">
            <div className="p-4 h-[500px] overflow-y-auto border rounded-md bg-background">
              <p className="text-muted-foreground">Chat history will appear here...</p>
            </div>
          </TabsContent>
          
          {/* Connection Test Tab */}
          <TabsContent value="connection">
            <div className="p-4 h-[500px] overflow-y-auto border rounded-md bg-background">
              <p className="text-muted-foreground">Connection test results will appear here...</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
