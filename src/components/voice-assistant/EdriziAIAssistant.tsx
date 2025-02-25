
import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mic, Send, StopCircle, FileAudio, Play, X, Trash2, BookOpen, BadgeDollarSign, TrendingUp } from 'lucide-react'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { ChatHistory } from '@/components/admin/voice-assistant/ChatHistory'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/components/auth/AuthProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const EdriziAIAssistant = () => {
  const { toast } = useToast()
  const { user, userProfile } = useAuth() // Use Auth provider to get current user
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio: originalPlayAudio } = useAudioPlayback()
  const [directText, setDirectText] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [activeTab, setActiveTab] = useState<string>('chat')
  const previewAudioRef = useRef<HTMLAudioElement>(null)
  
  // Check if user is super admin
  const isSuperAdmin = userProfile?.role === 'super_admin'
  
  // Create a user-specific storage key
  const STORAGE_KEY = user ? `edriziAIChatHistory_${user.id}` : 'edriziAIChatHistory_guest'

  // If user is super admin, don't render this component
  // This prevents conflicts between the two voice assistants
  useEffect(() => {
    if (isSuperAdmin) {
      console.log('EdriziAIAssistant not rendering for super admin')
    } else {
      console.log('EdriziAIAssistant rendering for regular user')
    }
  }, [isSuperAdmin])

  if (isSuperAdmin) {
    return null
  }

  // Common trading questions for quick access
  const quickQuestions = [
    "Wat zijn de beste handelsstrategieën voor beginners?",
    "Hoe kan ik mijn risico beheren bij het handelen?",
    "Kun je de huidige markttrends analyseren?",
    "Wat zijn de tekenen van een bullish of bearish markt?",
    "Hoe stel ik een stop-loss en take-profit in?"
  ]

  // Get the appropriate EdriziAI voice template for regular users
  let edriziVoice = VOICE_TEMPLATES.find(v => v.id === 'EdriziAI-info')
  
  if (!edriziVoice) {
    console.error('EdriziAI voice template not found')
    // Fallback to first available voice if preferred voice is not found
    edriziVoice = VOICE_TEMPLATES[0]
    console.log('Falling back to voice:', edriziVoice.name)
  } else {
    console.log('Using voice:', edriziVoice.name, 'for regular user')
  }

  const {
    previewAudioUrl,
    setPreviewAudioUrl,
    isPreviewPlaying,
    setIsPreviewPlaying,
    playPreview,
    stopPreview
  } = useAudioPreview()

  // Create a wrapper for playAudio to match the expected signature
  const playAudioWrapper = (url: string) => {
    originalPlayAudio(url, edriziVoice.id, edriziVoice.name)
  }

  const {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processAudio,
    processDirectText
  } = useEdriziAudioProcessor({
    selectedVoice: edriziVoice,
    playAudio: playAudioWrapper,
    setChatHistory,
    isSuperAdmin: false // Explicitly set to false for regular users
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
        content: "Welkom bij EdriziAI. Ik ben je Quantumflow trading specialist. Ik kan je helpen met marktanalyse, trading strategieën, risicobeheer en educatieve content om je handelsvaardigheden te verbeteren. Hoe kan ik je vandaag assisteren?",
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

  const handleQuickQuestion = (question: string) => {
    processDirectText(question)
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
          <CardTitle className="text-center flex-1">
            EdriziAI Quantumflow Specialist
          </CardTitle>
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
        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              <Mic className="h-4 w-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Leren</span>
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trading</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="space-y-4">
            {/* Chat History */}
            <ChatHistory chatHistory={chatHistory} />

            {/* Text Input Form */}
            <form onSubmit={handleDirectTextSubmit} className="flex space-x-2 items-center">
              <Input
                type="text"
                placeholder={`Typ een bericht naar ${edriziVoice.name}...`}
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
          </TabsContent>
          
          <TabsContent value="learn" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-medium">Basis Trading Principes</h3>
                  <p className="text-sm text-muted-foreground">Leer over fundamentele concepten zoals support, resistance en trends.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => processDirectText("Leg uit wat support en resistance is in trading")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Beginnen Met Leren
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-medium">Risicobeheer</h3>
                  <p className="text-sm text-muted-foreground">Ontdek hoe je risico's effectief kunt beheren bij het handelen.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => processDirectText("Hoe kan ik het risico in mijn trades beheren?")}
                  >
                    <BadgeDollarSign className="h-4 w-4 mr-2" />
                    Leer Over Risicobeheer
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-medium">Technische Analyse</h3>
                  <p className="text-sm text-muted-foreground">Leer grafiekpatronen en indicatoren te lezen.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => processDirectText("Wat zijn de meest gebruikte technische indicatoren?")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Verken Technische Analyse
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-medium">Trading Psychologie</h3>
                  <p className="text-sm text-muted-foreground">Begrijp de emotionele aspecten van trading en hoe je ze kunt beheersen.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => processDirectText("Hoe kan ik emoties onder controle houden tijdens het traden?")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ontdek Trading Psychologie
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trading" className="space-y-4">
            <h3 className="font-medium mb-2">Veelgestelde Trading Vragen</h3>
            <div className="grid grid-cols-1 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-2 text-left"
                  onClick={() => handleQuickQuestion(question)}
                >
                  <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{question}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Stel een Gerichte Trading Vraag</h3>
              <form onSubmit={handleDirectTextSubmit} className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Stel je trading vraag hier..."
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
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="audio/*"
        onChange={handleFileUpload}
      />

      <audio 
        ref={previewAudioRef}
        src={previewAudioUrl || undefined}
        onEnded={() => stopPreview()}
        className="hidden"
      />
    </Card>
  )
}
