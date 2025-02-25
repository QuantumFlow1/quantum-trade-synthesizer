
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { VoiceSelector } from '@/components/voice-assistant/audio/VoiceSelector'
import { AudioControls } from '@/components/voice-assistant/audio/AudioControls'
import { TranscriptionDisplay } from '@/components/voice-assistant/audio/TranscriptionDisplay'
import { DirectTextInput } from '@/components/voice-assistant/audio/DirectTextInput'
import { useRef } from 'react'

type VoiceAssistantLayoutProps = {
  title: string
  selectedVoiceId: string
  onVoiceChange: (voiceId: string) => void
  directText: string
  isPlaying: boolean
  onDirectTextChange: (text: string) => void
  onDirectTextSubmit: () => void
  isRecording: boolean
  isProcessing: boolean
  previewAudioUrl: string | null
  isPreviewPlaying: boolean
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayPreview: () => void
  onStopPreview: () => void
  onProcessAudio: () => void
  lastTranscription: string
  voiceName: string
  onPlayTranscription: () => void
  lastUserInput?: string
  previewAudioRef: React.RefObject<HTMLAudioElement>
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const VoiceAssistantLayout = ({
  title,
  selectedVoiceId,
  onVoiceChange,
  directText,
  isPlaying,
  onDirectTextChange,
  onDirectTextSubmit,
  isRecording,
  isProcessing,
  previewAudioUrl,
  isPreviewPlaying,
  onStartRecording,
  onStopRecording,
  onPlayPreview,
  onStopPreview,
  onProcessAudio,
  lastTranscription,
  voiceName,
  onPlayTranscription,
  lastUserInput,
  previewAudioRef,
  fileInputRef,
  onFileUpload
}: VoiceAssistantLayoutProps) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <VoiceSelector 
          selectedVoiceId={selectedVoiceId}
          onVoiceChange={onVoiceChange}
        />

        <DirectTextInput
          directText={directText}
          isPlaying={isPlaying}
          onTextChange={onDirectTextChange}
          onSubmit={onDirectTextSubmit}
        />

        <div className="relative">
          <div className="absolute inset-0 w-full h-0.5 bg-border -top-2" />
        </div>

        <AudioControls
          isRecording={isRecording}
          isProcessing={isProcessing}
          previewAudioUrl={previewAudioUrl}
          isPreviewPlaying={isPreviewPlaying}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onTriggerFileUpload={() => fileInputRef.current?.click()}
          onPlayPreview={onPlayPreview}
          onStopPreview={onStopPreview}
          onProcessAudio={onProcessAudio}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={onFileUpload}
        />

        <audio 
          ref={previewAudioRef}
          src={previewAudioUrl || undefined}
          onEnded={() => onStopPreview()}
          className="hidden"
        />
        
        <TranscriptionDisplay
          isProcessing={isProcessing}
          lastTranscription={lastTranscription}
          voiceName={voiceName}
          isPlaying={isPlaying}
          onPlay={onPlayTranscription}
          isRecording={isRecording}
          lastUserInput={lastUserInput}
        />
      </CardContent>
    </Card>
  )
}
