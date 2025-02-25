
import { ReactNode } from 'react'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '../types/chat-types'
import { AudioSection } from './AudioSection'
import { ChatHistorySection } from './ChatHistorySection'
import { ConnectionTest } from './ConnectionTest'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SuperAdminGreeting } from './SuperAdminGreeting'

interface SuperAdminVoiceContainerProps {
  selectedVoice: VoiceTemplate;
  directText: string;
  setDirectText: React.Dispatch<React.SetStateAction<string>>;
  handleDirectTextSubmit: () => void;
  isRecording: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  startRecording: () => void;
  handleStopRecording: () => Promise<void>;
  previewAudioUrl: string | null;
  previewAudioRef: React.RefObject<HTMLAudioElement>;
  isPreviewPlaying: boolean;
  playPreview: () => void;
  stopPreview: () => void;
  setIsPreviewPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  processingError: string | null;
  processingStage: string;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  grok3Available: boolean;
  checkGrok3Availability: () => Promise<boolean>;
  resetGrok3Connection: () => Promise<void>;
  processAudio: (url: string) => Promise<void>;
}

export const SuperAdminVoiceContainer = ({
  selectedVoice,
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
  chatHistory,
  setChatHistory,
  grok3Available,
  checkGrok3Availability,
  resetGrok3Connection,
  processAudio
}: SuperAdminVoiceContainerProps) => {
  return (
    <Tabs defaultValue="voice" className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="voice">Voice Control</TabsTrigger>
        <TabsTrigger value="chat">Chat History</TabsTrigger>
        <TabsTrigger value="connection">Connection Test</TabsTrigger>
      </TabsList>
      
      <TabsContent value="voice" className="space-y-4">
        <SuperAdminGreeting />
        
        <AudioSection
          selectedVoice={selectedVoice}
          directText={directText}
          setDirectText={setDirectText}
          handleDirectTextSubmit={handleDirectTextSubmit}
          isRecording={isRecording}
          isProcessing={isProcessing}
          isPlaying={isPlaying}
          startRecording={startRecording}
          handleStopRecording={handleStopRecording}
          previewAudioUrl={previewAudioUrl}
          previewAudioRef={previewAudioRef}
          isPreviewPlaying={isPreviewPlaying}
          playPreview={playPreview}
          stopPreview={stopPreview}
          setIsPreviewPlaying={setIsPreviewPlaying}
          processingError={processingError}
          processAudio={processAudio}
        />
      </TabsContent>
      
      <TabsContent value="chat">
        <ChatHistorySection
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          storageKey="superadmin-chat-history"
        />
      </TabsContent>
      
      <TabsContent value="connection">
        <ConnectionTest
          grok3Available={grok3Available}
          checkGrok3Availability={checkGrok3Availability}
          resetGrok3Connection={resetGrok3Connection}
        />
      </TabsContent>
    </Tabs>
  )
}
