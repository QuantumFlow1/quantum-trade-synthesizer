import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VoiceTemplate } from '@/lib/types'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useStopRecording } from '@/hooks/use-stop-recording'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useDirectTextInput } from '@/hooks/use-direct-text-input'
import { VoiceAssistantLayout } from './VoiceAssistantLayout'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { ChatHistorySection } from './ChatHistorySection'
import { AudioSection } from './AudioSection'

type SuperAdminVoiceContainerProps = {
  edriziVoice: VoiceTemplate
}

export const SuperAdminVoiceContainer = ({ edriziVoice }: SuperAdminVoiceContainerProps) => {
  const [chatHistory, setChatHistory] = useState([])
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  
  // Audio recorder
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  
  // Audio preview
  const { 
    previewAudioUrl, 
    setPreviewAudioUrl, 
    isPreviewPlaying, 
    setIsPreviewPlaying, 
    playPreview, 
    stopPreview 
  } = useAudioPreview()
  
  // Audio playback
  const { isPlaying, playAudio } = useAudioPlayback()
  
  // Direct text input
  const { directText, setDirectText } = useDirectTextInput()

  // Audio processing
  const { 
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    processingStage,
    processAudio,
    processDirectText
  } = useEdriziAudioProcessor({
    selectedVoice: edriziVoice,
    playAudio: (url: string) => playAudio(lastTranscription, edriziVoice.id, edriziVoice.name),
    setChatHistory: setChatHistory,
    isSuperAdmin: true
  })

  // Stop recording
  const { handleStopRecording } = useStopRecording({
    stopRecording,
    setPreviewAudioUrl,
    processAudio,
    selectedVoice: edriziVoice,
    setLastUserInput
  })

  const handleDirectTextSubmit = () => {
    processDirectText(directText)
  }

  return (
    <VoiceAssistantLayout>
      <Card>
        <CardHeader>
          <CardTitle>EdriziAI Super Admin Voice Assistant</CardTitle>
        </CardHeader>
        <CardContent className="pl-4 pb-4 relative">
          <ChatHistorySection chatHistory={chatHistory} />

          <AudioSection
            isRecording={isRecording}
            isProcessing={isProcessing}
            isPlaying={isPlaying}
            directText={directText}
            previewAudioUrl={previewAudioUrl}
            isPreviewPlaying={isPreviewPlaying}
            previewAudioRef={previewAudioRef}
            selectedVoice={edriziVoice}
            processingError={processingError}
            setDirectText={setDirectText}
            startRecording={startRecording}
            handleStopRecording={handleStopRecording}
            playPreview={playPreview}
            stopPreview={stopPreview}
            processAudio={processAudio}
            handleDirectTextSubmit={handleDirectTextSubmit}
            setIsPreviewPlaying={setIsPreviewPlaying}
          />
        </CardContent>
      </Card>
    </VoiceAssistantLayout>
  )
}
