
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { VoiceAssistantLayout } from './voice-assistant/VoiceAssistantLayout'
import { AudioSection } from './voice-assistant/AudioSection'
import { ChatHistorySection } from './voice-assistant/ChatHistorySection'
import { WelcomeMessage } from './voice-assistant/WelcomeMessage'
import { ConnectionTest } from './voice-assistant/ConnectionTest'
import { ChatMessage } from './types/chat-types'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { useGrok3Availability } from '@/hooks/audio-processing/grok3/useGrok3Availability'
import { useToast } from '@/hooks/use-toast'
import { useRef } from 'react'

export const SuperAdminVoiceAssistant = () => {
  console.log('SuperAdminVoiceAssistant component is rendering')
  
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [showConnectionTest, setShowConnectionTest] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [directText, setDirectText] = useState('')
  const chatHistoryStorageKey = 'superadmin-chat-history'
  
  const previewAudioRef = useRef<HTMLAudioElement>(null)
  
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
  
  // Voice selection (default to EdriziAI Admin voice)
  const defaultVoice = 'EdriziAI-admin'
  const { selectedVoice, handleVoiceChange } = useVoiceSelection(defaultVoice)
  
  // Audio playback for the selected voice
  const { isPlaying, playAudio } = useAudioPlayback()
  
  // Check if Grok3 API is available
  const { grok3Available, checkGrok3Availability, resetGrok3Connection } = useGrok3Availability()
  
  // Enhanced Audio processing with Grok3 integration 
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
    selectedVoice,
    playAudio,
    setChatHistory,
    isSuperAdmin: true
  })
  
  // Process the recorded audio
  const handleStopRecording = async () => {
    try {
      const audioUrl = await stopRecording()
      if (audioUrl) {
        setPreviewAudioUrl(audioUrl)
        
        // Process the audio right away
        toast({
          title: 'Audio Processing',
          description: 'Processing your audio recording...'
        })
        
        processAudio(audioUrl)
      } else {
        console.error('No audio URL was returned from stopRecording')
        toast({
          title: 'Recording Error',
          description: 'Failed to process recording. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error in handleStopRecording:', error)
      toast({
        title: 'Recording Error',
        description: 'An error occurred while processing the recording.',
        variant: 'destructive'
      })
    }
  }
  
  // Process direct text input
  const handleDirectTextSubmit = () => {
    if (!directText.trim()) return
    
    setLastUserInput(directText)
    processDirectText(directText)
    setDirectText('')
  }
  
  useEffect(() => {
    // Check if Grok3 API is available on component mount
    checkGrok3Availability()
  }, [checkGrok3Availability])
  
  return (
    <VoiceAssistantLayout>
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
            processAudio={processAudio}
            handleDirectTextSubmit={handleDirectTextSubmit}
            setIsPreviewPlaying={setIsPreviewPlaying}
          />
        </>
      )}
    </VoiceAssistantLayout>
  )
}
