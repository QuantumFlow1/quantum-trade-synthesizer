
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { VoiceTemplate } from '@/lib/types';
import ConnectionTest from './ConnectionTest';
import { WelcomeMessage } from './SuperAdminGreeting';
import { ChatHistorySection } from './ChatHistorySection';
import { AudioSection } from './AudioSection';
import VoiceAssistantLayout from './VoiceAssistantLayout';

interface SuperAdminVoiceContainerProps {
  selectedVoice: VoiceTemplate;
  directText: string;
  setDirectText: (text: string) => void;
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
  setIsPreviewPlaying: (isPlaying: boolean) => void;
  processingError: string | null;
  processingStage: string;
  chatHistory: any[];
  setChatHistory: (history: any[]) => void;
  grok3Available: boolean;
  checkGrok3Availability: () => Promise<boolean>;
  resetGrok3Connection: () => void;
}

export const SuperAdminVoiceContainer: React.FC<SuperAdminVoiceContainerProps> = ({
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
  resetGrok3Connection
}) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [showConnectionTest, setShowConnectionTest] = React.useState(false);
  const chatHistoryStorageKey = 'superadmin-chat-history';

  return (
    <VoiceAssistantLayout
      title="Super Admin Voice Assistant"
      selectedVoiceId={selectedVoice.id}
      onVoiceChange={() => {}} // This will be passed from parent
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
      processingStage={processingStage}
    >
      {showConnectionTest ? (
        <ConnectionTest 
          grok3Available={grok3Available} 
          resetGrok3Connection={resetGrok3Connection}
          onClose={() => setShowConnectionTest(false)}
        />
      ) : (
        <>
          <WelcomeMessage 
            selectedVoice={selectedVoice} 
            userProfile={userProfile}
            onConnectionTestClick={() => setShowConnectionTest(true)}
          />
          
          <ChatHistorySection 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory}
            storageKey={chatHistoryStorageKey}
          />
          
          <AudioSection
            isRecording={isRecording}
            isProcessing={isProcessing}
            isPlaying={isPlaying}
            directText={directText}
            previewAudioUrl={previewAudioUrl}
            isPreviewPlaying={isPreviewPlaying}
            previewAudioRef={previewAudioRef}
            selectedVoice={selectedVoice}
            processingError={processingError}
            setDirectText={setDirectText}
            startRecording={startRecording}
            handleStopRecording={handleStopRecording}
            playPreview={playPreview}
            stopPreview={stopPreview}
            processAudio={() => {}} // This will be passed from parent
            handleDirectTextSubmit={handleDirectTextSubmit}
            setIsPreviewPlaying={setIsPreviewPlaying}
          />
        </>
      )}
    </VoiceAssistantLayout>
  );
};
