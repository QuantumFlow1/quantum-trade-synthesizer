import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/components/auth/AuthProvider'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { useGrok3Availability } from '@/hooks/audio-processing/grok3/useGrok3Availability'
import { EdriziAIHeader } from './EdriziAIHeader'
import { EdriziAITabs } from './EdriziAITabs'
import { EdriziAIChatInput } from './EdriziAIChatInput'

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const EdriziAIAssistant = () => {
  const { user, userProfile } = useAuth()
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [activeTab, setActiveTab] = useState('chat')
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  
  const { 
    grok3Available, 
    manuallyDisabled,
    checkGrok3Availability, 
    resetGrok3Connection,
    disableGrok3Connection
  } = useGrok3Availability()
  
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
  
  // Voice selection
  const { selectedVoice, handleVoiceChange } = useVoiceSelection()

  // Define selectedVoiceId and onVoiceChange for VoiceSelector
  const selectedVoiceId = selectedVoice.id
  const onVoiceChange = handleVoiceChange
  
  // Audio playback for the selected voice
  const { isPlaying, playAudio } = useAudioPlayback()
  
  // Wrapper function to adapt playAudio to the expected interface
  const playAudioWrapper = (url: string) => {
    // This adapts the playAudio function to match the signature expected by useEdriziAudioProcessor
    playAudio(url, selectedVoice.id, selectedVoice.name)
  }

  // Adapter function to update our chatHistory from the processor's messages
  const updateChatHistory = (processorMessages: any[]) => {
    setChatHistory(prevHistory => {
      const newMessages = processorMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' as const : 'bot' as const,
        timestamp: msg.timestamp || new Date()
      }))
      return [...prevHistory, ...newMessages]
    })
  }
  
  // Audio processing for the selected voice
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
    playAudio: playAudioWrapper,
    setChatHistory: updateChatHistory,
    isSuperAdmin: userProfile?.role === 'super_admin' || userProfile?.role === 'lov_trader'
  })
  
  // Voice greeting (welcome message)
  useEffect(() => {
    if (chatHistory.length === 0 && !isPlaying) {
      // Simple greeting effect
      const greetingMessage = selectedVoice.id.includes('EdriziAI') 
        ? "Welkom bij EdriziAI. Ik ben je Quantumflow specialist. Hoe kan ik je vandaag assisteren met je trading strategie of marktanalyse?"
        : "Hallo! Ik ben je AI assistent. Hoe kan ik je vandaag helpen?";
      
      playAudio(greetingMessage, selectedVoice.id, selectedVoice.name);
    }
  }, []);
  
  // Add a message to the chat history
  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      sender,
      timestamp: new Date()
    }
    
    setChatHistory(prevHistory => [...prevHistory, newMessage])
  }
  
  // Process the recorded audio
  const handleStopRecording = async () => {
    const audioUrl = await stopRecording()
    if (audioUrl) {
      setPreviewAudioUrl(audioUrl)
      
      // Process the audio
      addMessage('Audio opname wordt verwerkt...', 'user')
      processAudio(audioUrl)
    }
  }
  
  // Process the direct text input
  const handleDirectTextSubmit = () => {
    if (!lastUserInput.trim()) return
    
    // Add the message to the chat history
    addMessage(lastUserInput, 'user')
    
    // Process the direct text input
    processDirectText(lastUserInput)
  }

  // Handler for text change
  const handleTextChange = (text: string) => {
    setLastUserInput(text);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <EdriziAIHeader 
          grok3Available={grok3Available}
          selectedVoiceId={selectedVoiceId}
          onVoiceChange={onVoiceChange}
        />
      </CardHeader>
      
      <CardContent className="px-2 pb-0">
        <EdriziAITabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          chatHistory={chatHistory}
          isProcessing={isProcessing}
          processingError={processingError}
          processingStage={processingStage}
          grok3Available={grok3Available}
          resetGrok3Connection={resetGrok3Connection}
          selectedVoiceId={selectedVoiceId}
          onVoiceChange={onVoiceChange}
          setChatHistory={setChatHistory}
        />
        
        {activeTab === 'chat' && (
          <EdriziAIChatInput
            isRecording={isRecording}
            isProcessing={isProcessing}
            isPlaying={isPlaying}
            startRecording={startRecording}
            handleStopRecording={handleStopRecording}
            lastUserInput={lastUserInput}
            handleTextChange={handleTextChange}
            handleDirectTextSubmit={handleDirectTextSubmit}
          />
        )}
      </CardContent>
      
      {/* Hidden audio element for playback */}
      <audio
        ref={previewAudioRef}
        src={previewAudioUrl || undefined}
        onEnded={() => setIsPreviewPlaying(false)}
        className="hidden"
      />
    </Card>
  )
}
