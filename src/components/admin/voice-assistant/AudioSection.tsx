
import React from 'react'
import { VoiceTemplate } from '@/lib/types'
import { AudioControlsSection } from './audio-sections/AudioControlsSection'
import { DirectTextInputSection } from './audio-sections/DirectTextInputSection'
import { AudioPreviewSection } from './audio-sections/AudioPreviewSection'
import { AudioPreview } from './AudioPreview'
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
  return (
    <div className="space-y-6">
      <AudioControlsSection
        isRecording={isRecording}
        isProcessing={isProcessing}
        isPlaying={isPlaying}
        startRecording={startRecording}
        handleStopRecording={handleStopRecording}
      />
      
      <DirectTextInputSection
        directText={directText}
        isPlaying={isPlaying}
        isProcessing={isProcessing}
        onTextChange={setDirectText}
        onSubmit={handleDirectTextSubmit}
      />
      
      <AudioPreviewSection
        previewAudioUrl={previewAudioUrl}
        isPreviewPlaying={isPreviewPlaying}
        playPreview={playPreview}
        stopPreview={stopPreview}
      />
      
      <AudioPreview 
        previewAudioRef={previewAudioRef}
        previewAudioUrl={previewAudioUrl}
        setIsPreviewPlaying={setIsPreviewPlaying}
      />
      
      {processingError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Fout</p>
          <p>{processingError}</p>
        </div>
      )}
      
      <FileUploadSection processAudio={processAudio} />
    </div>
  )
}
