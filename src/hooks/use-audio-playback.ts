
import { useState, useRef } from 'react'
import { generateSpeechFromText } from './audio-processing/utils/speechGenerationUtils'
import { createAndPlayAudioBlob } from './audio-processing/utils/audioPlaybackUtils'
import { preprocessTextForVoice } from './audio-processing/utils/textPreprocessingUtils'

export const useAudioPlayback = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = async (text: string, voiceId: string, voiceName: string) => {
    if (!text || isPlaying || isProcessing) return
    
    setIsPlaying(true)
    setIsProcessing(true)
    
    try {
      // Preprocess the text if needed
      const processedText = await preprocessTextForVoice(text, voiceId)
      
      // Generate speech from processed text
      const audioContent = await generateSpeechFromText(
        processedText, 
        voiceId, 
        voiceName,
        setIsPlaying,
        setIsProcessing
      )
      
      if (!audioContent) {
        return
      }
      
      // Play the audio
      await createAndPlayAudioBlob(
        audioContent,
        processedText,
        voiceName,
        audioRef,
        setIsPlaying,
        setIsProcessing
      )
    } catch (error) {
      console.error('Error in audio playback flow:', error)
      setIsPlaying(false)
      setIsProcessing(false)
    }
  }

  return {
    isPlaying,
    isProcessing,
    playAudio
  }
}
