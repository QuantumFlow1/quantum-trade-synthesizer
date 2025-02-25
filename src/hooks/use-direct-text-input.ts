
import { useState } from 'react'

type DirectTextInputProps = {
  playAudio: (text: string, voiceId: string, voiceName: string) => void
  selectedVoiceId: string
  selectedVoiceName: string
  setLastUserInput: (text: string) => void
}

export const useDirectTextInput = ({
  playAudio,
  selectedVoiceId,
  selectedVoiceName,
  setLastUserInput
}: DirectTextInputProps) => {
  const [directText, setDirectText] = useState<string>('')

  const handleDirectTextSubmit = () => {
    if (directText.trim()) {
      console.log(`Submitting text: ${directText}`)
      // Save the user input before processing
      setLastUserInput(directText)
      playAudio(directText, selectedVoiceId, selectedVoiceName)
      setDirectText('') // Clear input after submission
    }
  }

  return {
    directText,
    setDirectText,
    handleDirectTextSubmit
  }
}
