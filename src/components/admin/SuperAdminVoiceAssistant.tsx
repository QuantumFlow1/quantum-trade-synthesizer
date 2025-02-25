
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { ChatMessage } from './types/chat-types'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useSuperAdminProcessor } from '@/hooks/audio-processing/useSuperAdminProcessor'
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
    grok3Available,
    resetGrok3Connection,
    processAudio,
    processDirectText
  } = useSuperAdminProcessor({
    selectedVoice,
    playAudio: playAudioAdapter,
    setChatHistory
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
        
        await processAudio(audioUrl)
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
  const handleDirectTextSubmit = async () => {
    if (!directText.trim()) return
    
    try {
      // Store the text before clearing the input
      const textToProcess = directText
      
      // Clear the input field immediately for better UX
      setDirectText('')
      
      // Set the last user input for display
      setLastUserInput(textToProcess)
      
      // Process the direct text input
      await processDirectText(textToProcess)
    } catch (error) {
      console.error('Error in handleDirectTextSubmit:', error)
      toast({
        title: "Text Processing Error",
        description: "An error occurred while processing your message.",
        variant: "destructive"
      })
    }
  }
  
  useEffect(() => {
    // Check Grok3 availability on component mount
    resetGrok3Connection()
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
      checkGrok3Availability={resetGrok3Connection}
      resetGrok3Connection={resetGrok3Connection}
      processAudio={processAudio}
    />
  )
}
