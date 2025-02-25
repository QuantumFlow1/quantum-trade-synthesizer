
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useStopRecording } from '@/hooks/use-stop-recording'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { Bot } from 'lucide-react'
import { VoiceTemplate } from '@/lib/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { ConnectionTest } from './ConnectionTest'
import { ChatHistorySection } from './ChatHistorySection'
import { AudioSection } from './AudioSection'
import { useAdminChatHistory } from './useAdminChatHistory'

type SuperAdminVoiceContainerProps = {
  edriziVoice: VoiceTemplate
}

export const SuperAdminVoiceContainer = ({ edriziVoice }: SuperAdminVoiceContainerProps) => {
  const { user } = useAuth()
  // Create a user-specific storage key for super admin
  const CHAT_HISTORY_STORAGE_KEY = user ? `edriziAISuperAdminChatHistory_${user.id}` : 'edriziAISuperAdminChatHistory'
  
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio: originalPlayAudio } = useAudioPlayback()
  const [directText, setDirectText] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState(edriziVoice)
  
  // Use the extracted hook for chat history management
  const { chatHistory, setChatHistory } = useAdminChatHistory(CHAT_HISTORY_STORAGE_KEY)

  const {
    previewAudioUrl,
    setPreviewAudioUrl,
    isPreviewPlaying,
    setIsPreviewPlaying,
    previewAudioRef,
    playPreview,
    stopPreview
  } = useAudioPreview()

  const playAudioWrapper = (url: string) => {
    originalPlayAudio(url, selectedVoice.id, selectedVoice.name)
  }

  const {
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processAudio,
    processDirectText
  } = useEdriziAudioProcessor({
    selectedVoice,
    playAudio: playAudioWrapper,
    setChatHistory,
    isSuperAdmin: true // Set this to true for super admin features
  })

  const { handleStopRecording } = useStopRecording({
    stopRecording,
    setPreviewAudioUrl,
    processAudio: () => processAudio(previewAudioUrl),
    selectedVoice,
    setLastUserInput
  })

  const handleDirectTextSubmit = () => {
    if (directText.trim()) {
      processDirectText(directText)
      setDirectText('')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          EdriziAI Super Admin Assistant
        </CardTitle>
        <div className="flex justify-end">
          <ConnectionTest />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <ChatHistorySection 
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          storageKey={CHAT_HISTORY_STORAGE_KEY}
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
  )
}
