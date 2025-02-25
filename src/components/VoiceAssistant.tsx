
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { EdriziAIHeader } from './voice-assistant/EdriziAIHeader'
import { EdriziAITabs } from './voice-assistant/EdriziAITabs'
import { EdriziAIChatInput } from './voice-assistant/EdriziAIChatInput'
import { DirectTextInput } from './voice-assistant/audio/DirectTextInput'
import { ChatMessage } from '@/components/admin/types/chat-types'

// Define a mapping interface to convert between ChatMessage and local message format
interface LocalChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function VoiceAssistant() {
  const [activeTab, setActiveTab] = useState('chat')
  const [chatHistory, setChatHistory] = useState<LocalChatMessage[]>([])
  const previewAudioRef = useRef<HTMLAudioElement>(null)
  
  // Voice selection
  const { selectedVoice, handleVoiceChange } = useVoiceSelection()
  
  // Audio Recorder
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  
  // Audio Preview
  const { 
    previewAudioUrl, 
    setPreviewAudioUrl, 
    isPreviewPlaying, 
    setIsPreviewPlaying, 
    playPreview, 
    stopPreview 
  } = useAudioPreview()
  
  // Audio Playback
  const { isPlaying, playAudio } = useAudioPlayback()
  
  // Adapter function to update our local chatHistory from the processor's messages
  const updateChatHistory = (processorMessages: ChatMessage[]) => {
    const newLocalMessages = processorMessages.map(msg => ({
      id: msg.id,
      text: msg.content,
      sender: msg.role === 'user' ? 'user' as const : 'bot' as const,
      timestamp: msg.timestamp
    }))
    
    setChatHistory(prevHistory => {
      // Convert only the new messages that aren't already in the history
      const existingIds = new Set(prevHistory.map(msg => msg.id))
      const uniqueNewMessages = newLocalMessages.filter(msg => !existingIds.has(msg.id))
      return [...prevHistory, ...uniqueNewMessages]
    })
  }
  
  // Audio processing with Grok3 support
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
    playAudio: (url: string) => playAudio(url, selectedVoice.id, selectedVoice.name),
    setChatHistory: updateChatHistory,
    isSuperAdmin: false
  })
  
  // Handle stop recording and process audio
  const handleStopRecording = async () => {
    try {
      const audioUrl = await stopRecording()
      if (audioUrl) {
        setPreviewAudioUrl(audioUrl)
        await processAudio(audioUrl)
      }
    } catch (error) {
      console.error('Error in handleStopRecording:', error)
    }
  }
  
  // Handle direct text input
  const handleDirectTextSubmit = async () => {
    if (!lastUserInput.trim()) return
    
    try {
      const textToProcess = lastUserInput
      setLastUserInput('')
      await processDirectText(textToProcess)
    } catch (error) {
      console.error('Error processing direct text input:', error)
    }
  }
  
  // Mock data for display (in a real app, we would fetch this from an API)
  const grok3Available = false // Always false for regular user mode
  const manuallyDisabled = false // Not applicable in regular user mode
  
  // Mock functions for display
  const resetGrok3Connection = async () => {
    console.log('This is a regular user mode, Grok3 connection is not available')
  }
  
  return (
    <Card className="w-full max-w-[800px] mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <EdriziAIHeader
          grok3Available={grok3Available}
          manuallyDisabled={manuallyDisabled}
          selectedVoiceId={selectedVoice.id}
          onVoiceChange={handleVoiceChange}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        <EdriziAITabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          chatHistory={chatHistory}
          isProcessing={isProcessing}
          processingError={processingError}
          processingStage={processingStage}
          grok3Available={grok3Available}
          manuallyDisabled={manuallyDisabled}
          resetGrok3Connection={resetGrok3Connection}
          selectedVoiceId={selectedVoice.id}
          onVoiceChange={handleVoiceChange}
          setChatHistory={setChatHistory}
        />
        
        {activeTab === 'chat' && (
          <div className="px-3 pb-3">
            <EdriziAIChatInput
              isRecording={isRecording}
              isProcessing={isProcessing}
              isPlaying={isPlaying}
              startRecording={startRecording}
              handleStopRecording={handleStopRecording}
              lastUserInput={lastUserInput}
              handleTextChange={setLastUserInput}
              handleDirectTextSubmit={handleDirectTextSubmit}
            />
          </div>
        )}
        
        {/* Preview audio player (hidden) */}
        <audio ref={previewAudioRef} src={previewAudioUrl || ''} />
      </CardContent>
    </Card>
  )
}
