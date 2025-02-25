
import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/auth/AuthProvider'
import { VoiceSelector } from '../voice-assistant/audio/VoiceSelector'
import { AudioControls } from '../voice-assistant/audio/AudioControls'
import { TranscriptionDisplay } from '../voice-assistant/audio/TranscriptionDisplay'
import { DirectTextInput } from '../voice-assistant/audio/DirectTextInput'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioPlayback } from '@/hooks/use-audio-playback'
import { useAudioPreview } from '@/hooks/use-audio-preview'
import { useAudioProcessing } from '@/hooks/use-audio-processing'
import { useVoiceGreeting } from '@/hooks/use-voice-greeting'
import { VOICE_TEMPLATES } from '@/lib/voice-templates'
import { toast as sonnerToast } from 'sonner'
import { useToast } from '@/hooks/use-toast'

export const SuperAdminVoiceAssistant = () => {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const { isPlaying, playAudio } = useAudioPlayback()
  const [lastTranscription, setLastTranscription] = useState<string>('')
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
        // Automatically process audio after recording
        setTimeout(() => processAudio(), 100) // Small delay to ensure audio is ready
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      sonnerToast.error('Only audio files are allowed', {
        description: 'Please select a valid audio file'
      })
      return
    }

    const audioUrl = URL.createObjectURL(file)
    setPreviewAudioUrl(audioUrl)
    // Automatically process after upload
    setTimeout(() => processAudio(), 200)
  }

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
        />
      </CardContent>
    </Card>
  )
}
