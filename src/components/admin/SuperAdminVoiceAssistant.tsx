
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { ChatMessage } from './types/chat-types'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { useGrok3Availability } from '@/hooks/audio-processing/grok3/useGrok3Availability'
import { useToast } from '@/hooks/use-toast'
import { SuperAdminVoiceContainer } from './voice-assistant/SuperAdminVoiceContainer'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [directText, setDirectText] = useState('')
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
  const { selectedVoice } = useVoiceSelection()
  
  // Audio playback for the selected voice
  const { isPlaying, isProcessing: isAudioProcessing, playAudio } = useAudioPlayback()
  
  // Check if Grok3 API is available
  const { grok3Available, checkGrok3Availability, resetGrok3Connection } = useGrok3Availability()
  
  // Use adapter function to convert playAudio to expected signature
  const playAudioAdapter = (url: string) => {
    playAudio(url, selectedVoice.id, selectedVoice.name)
  }
  
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
    playAudio: playAudioAdapter,
    setChatHistory,
    isSuperAdmin: true
  })
  
  // Process the recorded audio
  const handleStopRecording = async () => {
    try {
      const audioUrl = await stopRecording()
      if (audioUrl) {
        setPreviewAudioUrl(audioUrl)
        
        toast({
          title: "Audio Processing",
          description: "Processing your audio recording..."
        })
        
        processAudio(audioUrl)
      } else {
        console.error('No audio URL was returned from stopRecording')
        toast({
          title: "Recording Error",
          description: "Failed to process recording. Please try again.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error in handleStopRecording:', error)
      toast({
        title: "Recording Error",
        description: "An error occurred while processing the recording.",
        variant: "destructive"
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
    checkGrok3Availability()
  }, [])
  
  return (
    <SuperAdminVoiceContainer
      selectedVoice={selectedVoice}
      directText={directText}
      setDirectText={setDirectText}
      handleDirectTextSubmit={handleDirectTextSubmit}
      isRecording={isRecording}
      isProcessing={isProcessing || isAudioProcessing}
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
      chatHistory={chatHistory}
      setChatHistory={setChatHistory}
      grok3Available={grok3Available}
      checkGrok3Availability={checkGrok3Availability}
      resetGrok3Connection={resetGrok3Connection}
      processAudio={processAudio}
    />
  )
}
