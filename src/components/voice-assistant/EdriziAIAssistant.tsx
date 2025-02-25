
import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mic, Send, StopCircle, FileAudio, Play, X, Trash2 } from 'lucide-react'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { ChatHistory } from '@/components/admin/voice-assistant/ChatHistory'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/components/auth/AuthProvider'

export const EdriziAIAssistant = () => {
  const { toast } = useToast()
  const { user } = useAuth() // Use Auth provider to get current user
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [directText, setDirectText] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  
  // Create a user-specific storage key
  const STORAGE_KEY = user ? `edriziAIChatHistory_${user.id}` : 'edriziAIChatHistory_guest'

  // Get the EdriziAI voice template
  // Changed from const to let to allow reassignment
  let edriziVoice = VOICE_TEMPLATES.find(v => v.id === 'EdriziAI-info')
  if (!edriziVoice) {
    console.error('EdriziAI voice template not found')
    // Fallback to first available voice if EdriziAI is not found
    edriziVoice = VOICE_TEMPLATES[0]
  }

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
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processAudio,
    processDirectText
  } = useEdriziAudioProcessor({
    selectedVoice: edriziVoice,
    playAudio,
    setChatHistory
  })

  // Load chat history from localStorage on component mount or when user changes
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        if (Array.isArray(parsedHistory)) {
          setChatHistory(parsedHistory)
        }
      } catch (error) {
        console.error('Error parsing chat history:', error)
      }
    }
    
    // Add a greeting message if no history exists
    if (!savedHistory || JSON.parse(savedHistory || '[]').length === 0) {
      const greetingMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Welkom bij EdriziAI. Ik ben je Quantumflow specialist. Hoe kan ik je vandaag assisteren met je trading strategie of marktanalyse?",
        timestamp: new Date()
      }
      setChatHistory([greetingMessage])
    }
  }, [STORAGE_KEY, user]) // Re-run when STORAGE_KEY or user changes

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory))
  }, [chatHistory, STORAGE_KEY])

  const handleStopRecording = async () => {
    const audioUrl = await stopRecording()
    if (audioUrl) {
      setPreviewAudioUrl(audioUrl)
      await processAudio(audioUrl)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Fout",
        description: "Alleen audiobestanden zijn toegestaan",
        variant: "destructive",
      })
      return
    }

    const audioUrl = URL.createObjectURL(file)
    setPreviewAudioUrl(audioUrl)
    await processAudio(audioUrl)
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleDirectTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (directText.trim()) {
      processDirectText(directText)
      setDirectText('') // Clear after submission
    }
  }

  const clearHistory = () => {
    const confirmClear = window.confirm('Weet je zeker dat je de chatgeschiedenis wilt wissen?')
    if (confirmClear) {
      setChatHistory([])
      localStorage.removeItem(STORAGE_KEY)
      toast({
        title: "Chat Geschiedenis",
        description: "De chatgeschiedenis is gewist",
      })
    }
  }

  return (
    <Card className="w-full mx-auto mt-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-center flex-1">EdriziAI Quantumflow Specialist</CardTitle>
          {chatHistory.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearHistory}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Wis Geschiedenis
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat History */}
        <ChatHistory chatHistory={chatHistory} />

        {/* Text Input Form */}
        <form onSubmit={handleDirectTextSubmit} className="flex space-x-2 items-center">
          <Input
            type="text"
            placeholder="Typ een bericht naar EdriziAI..."
            value={directText}
            onChange={(e) => setDirectText(e.target.value)}
            disabled={isProcessing || isRecording || isPlaying}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!directText.trim() || isProcessing || isRecording || isPlaying}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Audio Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isProcessing || isPlaying}
              variant="outline"
              size="sm"
              className={isRecording ? "bg-red-100 hover:bg-red-200 text-red-500" : ""}
            >
              <Mic className="h-4 w-4 mr-2" />
              Start Opname
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              variant="outline"
              size="sm"
              className="bg-red-100 hover:bg-red-200 text-red-500"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Opname
            </Button>
          )}

          <Button
            onClick={triggerFileUpload}
            disabled={isRecording || isProcessing}
            variant="outline"
            size="sm"
          >
            <FileAudio className="h-4 w-4 mr-2" />
            Upload Audio
          </Button>

          {previewAudioUrl && !isPreviewPlaying ? (
            <Button
              onClick={playPreview}
              disabled={isRecording || !previewAudioUrl}
              variant="outline"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Speel Opname
            </Button>
          ) : previewAudioUrl ? (
            <Button
              onClick={stopPreview}
              disabled={isRecording || !previewAudioUrl}
              variant="outline"
              size="sm"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Afspelen
            </Button>
          ) : null}

          {previewAudioUrl && (
            <Button
              onClick={() => setPreviewAudioUrl(null)}
              variant="outline"
              size="sm"
              className="text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Wis Opname
            </Button>
          )}
        </div>

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

        {/* Status information */}
        {isProcessing && (
          <div className="text-sm text-center text-muted-foreground">
            Verwerken van audio...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
