
import { useState, useEffect, useRef } from 'react'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mic, MicOff, Send, LoaderIcon, XCircle, MessageSquare, Bot, User, Sparkles, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { DirectTextInput } from './audio/DirectTextInput'
import { AudioControls } from './audio/AudioControls'
import { VoiceSelector } from './audio/VoiceSelector'
import { TranscriptionDisplay } from './audio/TranscriptionDisplay'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useVoiceGreeting } from '@/hooks/use-voice-greeting'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useVoiceSelection } from '@/hooks/use-voice-selection'
import { useEdriziAudioProcessor } from '@/hooks/useEdriziAudioProcessor'
import { supabase } from '@/lib/supabase'
import { useGrok3Availability } from '@/hooks/audio-processing/grok3/useGrok3Availability'
import { VoiceTemplate } from '@/lib/types'

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const EdriziAIAssistant = () => {
  const { user, userProfile } = useAuth()
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [showControls, setShowControls] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const chatBoxRef = useRef<HTMLDivElement | null>(null)
  
  const { grok3Available, checkGrok3Availability, resetGrok3Connection } = useGrok3Availability()
  
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

  // Adapter function to convert our ChatMessage to the expected type
  const adaptChatHistory = (messages: ChatMessage[]) => {
    return messages.map(msg => ({
      id: msg.id,
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.text,
      timestamp: msg.timestamp
    }))
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
  const handleDirectTextSubmit = (text: string) => {
    if (!text.trim()) return
    
    // Add the message to the chat history
    addMessage(text, 'user')
    
    // Process the direct text input
    processDirectText(text)
  }

  // Handler for text change
  const handleTextChange = (text: string) => {
    setLastUserInput(text);
  }
  
  // Scroll to the bottom of the chat when the chat history changes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [chatHistory])

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle>Edrizi AI Assistant</CardTitle>
            <CardDescription>Je persoonlijke AI-assistent</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={grok3Available ? "default" : "outline"} className="flex items-center space-x-1">
              {grok3Available ? (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>Grok3 Actief</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3" />
                  <span>Standaard AI</span>
                </>
              )}
            </Badge>
            <VoiceSelector 
              selectedVoiceId={selectedVoiceId}
              onVoiceChange={onVoiceChange}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 pb-0">
        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center px-3">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="settings">Instellingen</TabsTrigger>
            </TabsList>
            
            {activeTab === 'chat' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => resetGrok3Connection()}
                disabled={isProcessing}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Test Verbinding
              </Button>
            )}
          </div>
          
          <TabsContent value="chat" className="m-0 p-0">
            <div 
              ref={chatContainerRef}
              className="relative rounded-md h-[400px] mb-2 p-3"
            >
              <div 
                ref={chatBoxRef}
                className="h-full overflow-y-auto pr-2 space-y-4"
              >
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                    <Bot className="w-12 h-12 mb-4 opacity-20" />
                    <p>
                      Welkom bij de Edrizi AI Assistant!<br/>
                      Ik ben hier om al je vragen te beantwoorden.
                    </p>
                    <p className="text-sm mt-2">
                      Begin een gesprek door te typen of op de microfoonknop te klikken.
                    </p>
                  </div>
                ) : (
                  chatHistory.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`rounded-lg px-4 py-2 max-w-[80%] flex ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground ml-12' 
                            : 'bg-muted mr-12'
                        }`}
                      >
                        <div className="mr-2 mt-1">
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="whitespace-pre-line text-sm">{message.text}</p>
                          <p className="text-xs opacity-50 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Processing state indicators */}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted mr-12 flex items-center">
                      <Bot className="w-4 h-4 mr-2" />
                      <div className="flex items-center">
                        <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                        <p className="text-sm">{processingStage || "Verwerken..."}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Error indicator */}
                {processingError && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-4 py-2 max-w-[80%] bg-destructive text-destructive-foreground mr-12 flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      <p className="text-sm">{processingError}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat input area */}
            <div className="p-3 border-t">
              <div className="flex space-x-2">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={isRecording ? handleStopRecording : startRecording}
                  disabled={isProcessing || isPlaying}
                  className="flex-shrink-0"
                >
                  {isRecording ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                
                <DirectTextInput
                  onTextChange={handleTextChange}
                  onSubmit={handleDirectTextSubmit}
                  disabled={isRecording || isProcessing || isPlaying}
                  placeholder="Typ je bericht..."
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="p-3">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Grok3 API Status</h3>
                <div className="flex items-center mt-2 space-x-2">
                  <div className={`w-3 h-3 rounded-full ${grok3Available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-sm">
                    {grok3Available 
                      ? "Grok3 API is beschikbaar en actief" 
                      : "Grok3 API is niet beschikbaar, standaard AI wordt gebruikt"}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => resetGrok3Connection()}
                  disabled={isProcessing}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Test Verbinding
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Spraakassistent</h3>
                <p className="text-sm text-muted-foreground">
                  Selecteer de stem die gebruikt wordt voor de AI Assistant
                </p>
                <div className="mt-2">
                  <VoiceSelector 
                    selectedVoiceId={selectedVoiceId}
                    onVoiceChange={onVoiceChange}
                  />
                </div>
              </div>
              
              <div>
                <Button
                  variant="outline"
                  onClick={() => setChatHistory([])}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Wis Chatgeschiedenis
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
