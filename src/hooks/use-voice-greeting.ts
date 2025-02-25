
import { useRef, useEffect } from 'react'
import { VoiceTemplate } from '@/lib/types'
import { useAudioPlayback } from './use-audio-playback'

export const useVoiceGreeting = (selectedVoice: VoiceTemplate, isPlaying: boolean) => {
  const hasGreeted = useRef(false)
  const { playAudio } = useAudioPlayback()

  useEffect(() => {
    if (!hasGreeted.current && !isPlaying) {
      const greetingMessage = "Hallo! Ik ben je AI assistent. Hoe kan ik je vandaag helpen?"
      playAudio(greetingMessage, selectedVoice.id, selectedVoice.name)
      hasGreeted.current = true
    }
  }, [selectedVoice.id, selectedVoice.name, isPlaying, playAudio])
}
