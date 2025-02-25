
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VoiceTemplate } from '@/lib/types'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useDirectTextInput } from '@/hooks/use-direct-text-input'
import { useSuperAdminProcessor } from '@/hooks/audio-processing/useSuperAdminProcessor'
import { VoiceAssistantLayout } from './VoiceAssistantLayout'
import { ChatHistorySection } from './ChatHistorySection'
import { AudioSection } from './AudioSection'
import { ChatMessage } from '@/components/admin/types/chat-types'

type SuperAdminVoiceContainerProps = {
  edriziVoice: VoiceTemplate
}

export const SuperAdminVoiceContainer = ({ edriziVoice }: SuperAdminVoiceContainerProps) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const STORAGE_KEY = 'superAdminChatHistory'
  
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
  } = useSuperAdminProcessor({
    selectedVoice: edriziVoice,
    playAudio: (url: string) => playAudio(url),
    setChatHistory: setChatHistory
  })

  // Stop recording
  const handleStopRecording = async () => {
    const audioUrl = await stopRecording()
    if (audioUrl) {
      setPreviewAudioUrl(audioUrl)
      processAudio(audioUrl)
    }
  }

  const handleDirectTextSubmit = () => {
    processDirectText(directText)
    setDirectText('')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      return
    }

    const audioUrl = URL.createObjectURL(file)
    processAudio(audioUrl)
  }

  return (
    <div className="flex flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>EdriziAI Super Admin Voice Assistant</CardTitle>
        </CardHeader>
        <CardContent className="pl-4 pb-4 relative">
          <ChatHistorySection 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory}
            storageKey={STORAGE_KEY}
          />

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
    </div>
  )
}
