
import { useRef, useEffect } from 'react'
import { VoiceTemplate } from '@/lib/types'
import { useAudioPlayback } from './use-audio-playback'

export const useVoiceGreeting = (selectedVoice: VoiceTemplate, isPlaying: boolean) => {
  const hasGreeted = useRef(false)
  const { playAudio } = useAudioPlayback()

  useEffect(() => {
    const handleGreeting = async () => {
      if (!hasGreeted.current && !isPlaying) {
        const greetingMessage = "Hallo! Ik ben je AI assistent. Hoe kan ik je vandaag helpen?"
        hasGreeted.current = true // Set this before playing to prevent multiple greetings
        try {
          await playAudio(greetingMessage, selectedVoice.id, selectedVoice.name)
        } catch (error) {
          console.error('Error playing greeting:', error)
          hasGreeted.current = false // Reset if playback fails
        }
      }
    }

    handleGreeting()
  }, [selectedVoice.id, selectedVoice.name, isPlaying, playAudio])
}
