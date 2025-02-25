
import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/auth/AuthProvider'
import { VoiceSelector } from '../../voice-assistant/audio/VoiceSelector'
import { AudioControls } from '../../voice-assistant/audio/AudioControls'
import { TranscriptionDisplay } from '../../voice-assistant/audio/TranscriptionDisplay'
import { DirectTextInput } from '../../voice-assistant/audio/DirectTextInput'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioProcessing } from '@/hooks/use-audio-processing'
import { useVoiceGreeting } from '@/hooks/use-voice-greeting'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { SuperAdminGreeting } from './SuperAdminGreeting'
import { useAudioFileUpload } from '@/hooks/use-audio-file-upload'

export const SuperAdminVoiceContainer = () => {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const [directText, setDirectText] = useState<string>('')
  
  // Find and default to EdriziAI voice model
  const defaultVoice = VOICE_TEMPLATES.find(v => v.id === "EdriziAI-info") || VOICE_TEMPLATES[0]
  const [selectedVoice, setSelectedVoice] = useState(defaultVoice)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Early return if not super admin
  if (userProfile?.role !== 'super_admin') {
    return null
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

  const { isProcessing, processAudio } = useAudioProcessing(
    selectedVoice,
    previewAudioUrl,
    setLastTranscription
  )

  // Initialize with voice greeting
  useVoiceGreeting(selectedVoice, isPlaying)

  // Log the current voice selection at render
  console.log(`Current voice: ${selectedVoice.name} (ID: ${selectedVoice.id})`)

  const handleStopRecording = async () => {
    try {
      const audioUrl = await stopRecording()
      if (audioUrl) {
        setPreviewAudioUrl(audioUrl)
        console.log('Recording stopped, processing audio...')
        // Save what the user said when we get it
        setTimeout(async () => {
          // First get the transcription
          const response = await fetch(audioUrl)
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
            
            if (!transcriptionError && transcriptionData?.transcription) {
              setLastUserInput(transcriptionData.transcription)
            }
            
            // Then process with AI
            processAudio()
          }
          
          reader.readAsDataURL(blob)
        }, 100) // Small delay to ensure audio is ready
      }
    } catch (error) {
      console.error('Error stopping recording:', error)
      toast({
        title: "Error",
        description: "Failed to process recording",
        variant: "destructive"
      })
    }
  }

  // Use the new hook for file upload handling
  const { handleFileUpload } = useAudioFileUpload({
    setPreviewAudioUrl,
    processAudio
  })

  const handleVoiceChange = (voiceId: string) => {
    const voice = VOICE_TEMPLATES.find(v => v.id === voiceId)
    if (voice) {
      console.log(`Switching to voice: ${voice.name} (ID: ${voice.id})`)
      setSelectedVoice(voice)
      toast({
        title: "Stem gewijzigd",
        description: `Je gebruikt nu ${voice.name}`,
      })
    }
  }

  const handleDirectTextSubmit = () => {
    if (directText.trim()) {
      console.log(`Submitting text: ${directText}`)
      // Save the user input before processing
      setLastUserInput(directText)
      playAudio(directText, selectedVoice.id, selectedVoice.name)
      setDirectText('') // Clear input after submission
    }
  }

  const playTranscription = () => {
    if (lastTranscription) {
      console.log(`Playing transcription: ${lastTranscription.substring(0, 50)}...`)
      playAudio(lastTranscription, selectedVoice.id, selectedVoice.name)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">EdriziAI Super Admin Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <VoiceSelector 
          selectedVoiceId={selectedVoice.id}
          onVoiceChange={handleVoiceChange}
        />

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
          onProcessAudio={processAudio}
        />
        
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
          onEnded={() => setIsPreviewPlaying(false)}
          className="hidden"
        />
        
        <TranscriptionDisplay
          isProcessing={isProcessing}
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
