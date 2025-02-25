
import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useStopRecording } from '@/hooks/use-stop-recording'
import { DirectTextInput } from '@/components/voice-assistant/audio/DirectTextInput'
import { AudioControls } from '@/components/voice-assistant/audio/AudioControls'
import { AudioPreview } from './AudioPreview'
import { ChatHistory } from './ChatHistory'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '../types/chat-types'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

// Local storage key for chat history
const CHAT_HISTORY_STORAGE_KEY = 'edriziAIChatHistory'

type SuperAdminVoiceContainerProps = {
  edriziVoice: VoiceTemplate
}

export const SuperAdminVoiceContainer = ({ edriziVoice }: SuperAdminVoiceContainerProps) => {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [directText, setDirectText] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState(edriziVoice)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Initialize chat history from local storage
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY)
    if (savedHistory) {
      try {
        // Parse stored JSON and convert string dates back to Date objects
        const parsedHistory = JSON.parse(savedHistory)
        return parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      } catch (e) {
        console.error('Failed to parse chat history from localStorage:', e)
        return []
      }
    }
    return []
  })

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(chatHistory))
  }, [chatHistory])

  const {
    previewAudioUrl,
    setPreviewAudioUrl,
    isPreviewPlaying,
    setIsPreviewPlaying,
    previewAudioRef,
    playPreview,
    stopPreview
  } = useAudioPreview()

  const {
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processAudio,
    processDirectText
  } = useEdriziAudioProcessor({
    selectedVoice,
    playAudio,
    setChatHistory
  })

  const { handleStopRecording } = useStopRecording({
    stopRecording,
    setPreviewAudioUrl,
    processAudio: () => processAudio(previewAudioUrl),
    selectedVoice,
    setLastUserInput
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      return
    }

    const audioUrl = URL.createObjectURL(file)
    setPreviewAudioUrl(audioUrl)
    setTimeout(() => processAudio(audioUrl), 200)
  }

  const handleDirectTextSubmit = () => {
    if (directText.trim()) {
      processDirectText(directText)
      setDirectText('')
    }
  }

  const clearChatHistory = () => {
    setChatHistory([])
    localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">EdriziAI Super Admin Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {/* Chat history section with clear button */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Chat History</h3>
            {chatHistory.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={clearChatHistory}
                className="h-8"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <ChatHistory chatHistory={chatHistory} />
        </div>

        <DirectTextInput
          directText={directText}
          isPlaying={isPlaying}
          onTextChange={setDirectText}
          onSubmit={handleDirectTextSubmit}
        />

        <div className="relative">
          <div className="absolute inset-0 w-full h-0.5 bg-border -top-2" />
        </div>

        <AudioControls
          isRecording={isRecording}
          isProcessing={isProcessing}
          previewAudioUrl={previewAudioUrl}
          isPreviewPlaying={isPreviewPlaying}
          onStartRecording={startRecording}
          onStopRecording={handleStopRecording}
          onTriggerFileUpload={() => fileInputRef.current?.click()}
          onPlayPreview={playPreview}
          onStopPreview={stopPreview}
          onProcessAudio={() => processAudio(previewAudioUrl)}
        />
        
        <AudioPreview 
          previewAudioUrl={previewAudioUrl}
          isPreviewPlaying={isPreviewPlaying}
          onPlayPreview={playPreview}
          onStopPreview={stopPreview}
          onProcessAudio={() => processAudio(previewAudioUrl)}
          isProcessing={isProcessing}
        />
        
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="audio/*"
          onChange={handleFileUpload}
        />

        <audio 
          ref={previewAudioRef}
          src={previewAudioUrl || undefined}
          onEnded={() => setIsPreviewPlaying(false)}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
