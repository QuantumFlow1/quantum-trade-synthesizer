
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState, useRef } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { VoiceSelector } from '@/components/voice-assistant/audio/VoiceSelector'
import { AudioControls } from '@/components/voice-assistant/audio/AudioControls'
import { TranscriptionDisplay } from '@/components/voice-assistant/audio/TranscriptionDisplay'
import { DirectTextInput } from '@/components/voice-assistant/audio/DirectTextInput'
import { useStopRecording } from '@/hooks/use-stop-recording'
import { useToast } from '@/hooks/use-toast'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { supabase } from '@/lib/supabase'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  
  // If not super admin, don't render anything
  if (userProfile?.role !== 'super_admin') {
    return null
  }

  // Find the EdriziAI voice template
  const edriziVoice = VOICE_TEMPLATES.find(v => v.id === 'EdriziAI-info')
  if (!edriziVoice) {
    console.error('EdriziAI voice template not found')
    return null
  }

  return <SuperAdminVoiceContainer edriziVoice={edriziVoice} />
}

const SuperAdminVoiceContainer = ({ edriziVoice }) => {
  const { toast } = useToast()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const [directText, setDirectText] = useState<string>('')
  const [selectedVoice, setSelectedVoice] = useState(edriziVoice)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    previewAudioUrl,
    setPreviewAudioUrl,
    isPreviewPlaying,
    setIsPreviewPlaying,
    previewAudioRef,
    playPreview,
    stopPreview
  } = useAudioPreview()

  // Process audio function
  const processAudio = async () => {
    if (!previewAudioUrl) return

    try {
      const response = await fetch(previewAudioUrl)
      const blob = await response.blob()
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split('base64,')[1]
        
        // Get transcription
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
          body: { 
            audioData: base64Data,
            voiceTemplate: selectedVoice.prompt
          }
        })

        if (transcriptionError) {
          console.error('Transcription error:', transcriptionError)
          toast({
            title: "Error",
            description: "Failed to transcribe recording",
            variant: "destructive"
          })
          return
        }

        if (!transcriptionData?.transcription) {
          console.error('No transcription received')
          toast({
            title: "Error",
            description: "No transcription received from the server",
            variant: "destructive"
          })
          return
        }

        console.log(`User said: ${transcriptionData.transcription}`)
        setLastUserInput(transcriptionData.transcription)
        
        // Process through AI for a response
        try {
          console.log('Getting AI response for EdriziAI')
          const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
            body: {
              prompt: transcriptionData.transcription,
              voiceId: selectedVoice.id
            }
          })
          
          if (aiError) {
            console.error('AI response error:', aiError)
            toast({
              title: "AI Error",
              description: "Failed to generate an AI response",
              variant: "destructive",
            })
            return
          }
          
          if (aiData?.response) {
            console.log(`AI response: ${aiData.response}`)
            setLastTranscription(aiData.response)
            
            // Automatically play back the response
            playAudio(aiData.response, selectedVoice.id, selectedVoice.name)
          } else {
            console.error('No AI response received')
            toast({
              title: "AI Error",
              description: "No AI response received",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error('Error processing with AI:', error)
          toast({
            title: "AI Error",
            description: "Failed to process with AI",
            variant: "destructive",
          })
        }
      }
      
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Error processing audio:', error)
      toast({
        title: "Error",
        description: "Failed to process audio",
        variant: "destructive",
      })
    }
  }

  const { handleStopRecording } = useStopRecording({
    stopRecording,
    setPreviewAudioUrl,
    processAudio,
    selectedVoice,
    setLastUserInput
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Error",
        description: "Only audio files are allowed",
        variant: "destructive",
      })
      return
    }

    const audioUrl = URL.createObjectURL(file)
    setPreviewAudioUrl(audioUrl)
    setTimeout(() => processAudio(), 200)
  }

  const handleDirectTextSubmit = () => {
    if (directText.trim()) {
      setLastUserInput(directText)
      
      // For EdriziAI, process the text through the AI first
      supabase.functions.invoke('generate-ai-response', {
        body: {
          prompt: directText,
          voiceId: selectedVoice.id
        }
      }).then(({ data, error }) => {
        if (error) {
          console.error('AI processing error:', error)
          toast({
            title: "AI Error",
            description: "Failed to generate an AI response",
            variant: "destructive",
          })
          return
        }
        
        if (data?.response) {
          console.log(`AI generated response: ${data.response}`)
          setLastTranscription(data.response)
          playAudio(data.response, selectedVoice.id, selectedVoice.name)
        } else {
          console.error('No AI response received')
          toast({
            title: "AI Error",
            description: "No AI response received",
            variant: "destructive",
          })
        }
      }).catch(error => {
        console.error('Failed to process with AI:', error)
        toast({
          title: "AI Error",
          description: "Failed to process with AI",
          variant: "destructive",
        })
      }).finally(() => {
        setDirectText('')
      })
    }
  }

  const playTranscription = () => {
    if (lastTranscription) {
      playAudio(lastTranscription, selectedVoice.id, selectedVoice.name)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">EdriziAI Super Admin Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
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
          isProcessing={false}
          previewAudioUrl={previewAudioUrl}
          isPreviewPlaying={isPreviewPlaying}
          onStartRecording={startRecording}
          onStopRecording={handleStopRecording}
          onTriggerFileUpload={() => fileInputRef.current?.click()}
          onPlayPreview={playPreview}
          onStopPreview={stopPreview}
          onProcessAudio={processAudio}
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
        
        <TranscriptionDisplay
          isProcessing={false}
          lastTranscription={lastTranscription}
          voiceName={selectedVoice.name}
          isPlaying={isPlaying}
          onPlay={playTranscription}
          isRecording={isRecording}
          lastUserInput={lastUserInput}
        />
      </CardContent>
    </Card>
  )
}
