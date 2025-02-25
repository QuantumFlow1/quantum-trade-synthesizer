
import React, { useRef } from 'react'
import { VoiceTemplate } from '@/lib/types'
import { AudioControlsSection } from './audio-sections/AudioControlsSection'
import { DirectTextInputSection } from './audio-sections/DirectTextInputSection'
import { AudioPreviewSection } from './audio-sections/AudioPreviewSection'
import { FileUploadSection } from './audio-sections/FileUploadSection'

interface AudioSectionProps {
  selectedVoice: VoiceTemplate
  directText: string
  setDirectText: React.Dispatch<React.SetStateAction<string>>
  handleDirectTextSubmit: () => void
  isRecording: boolean
  isProcessing: boolean
  isPlaying: boolean
  startRecording: () => void
  handleStopRecording: () => Promise<void>
  previewAudioUrl: string | null
  previewAudioRef: React.RefObject<HTMLAudioElement>
  isPreviewPlaying: boolean
  playPreview: () => void
  stopPreview: () => void
  setIsPreviewPlaying: React.Dispatch<React.SetStateAction<boolean>>
  processingError: string | null
  processAudio: (url: string) => Promise<void>
}

export const AudioSection: React.FC<AudioSectionProps> = ({
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
  processAudio
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTriggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      await processAudio(url);
    }
  };
  
  const handleProcessAudio = async () => {
    if (previewAudioUrl) {
      await processAudio(previewAudioUrl);
    }
  };

  return (
    <div className="space-y-6">
      <AudioControlsSection
        isRecording={isRecording}
        isProcessing={isProcessing}
        onStartRecording={startRecording}
        onStopRecording={handleStopRecording}
        onTriggerFileUpload={handleTriggerFileUpload}
      />
      
      <DirectTextInputSection
        directText={directText}
        isPlaying={isPlaying}
        isProcessing={isProcessing}
        onTextChange={setDirectText}
        onSubmit={handleDirectTextSubmit}
      />
      
      {previewAudioUrl && (
        <AudioPreviewSection
          previewAudioUrl={previewAudioUrl}
          isPreviewPlaying={isPreviewPlaying}
          isProcessing={isProcessing}
          processingError={processingError}
          onPlayPreview={playPreview}
          onStopPreview={stopPreview}
          onProcessAudio={handleProcessAudio}
        />
      )}
      
      <audio
        ref={previewAudioRef}
        src={previewAudioUrl || undefined}
        onEnded={() => setIsPreviewPlaying(false)}
        className="hidden"
      />
      
      {processingError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Fout</p>
          <p>{processingError}</p>
        </div>
      )}
      
      <FileUploadSection
        fileInputRef={fileInputRef}
        onFileUpload={handleFileUpload}
      />
    </div>
  )
}
