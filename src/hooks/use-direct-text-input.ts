
import { useState, useCallback } from 'react'

type DirectTextInputProps = {
  playAudio: (text: string, voiceId: string, voiceName: string) => void
  selectedVoiceId: string
  selectedVoiceName: string
  setLastUserInput: (text: string) => void
}

export const useDirectTextInput = (props?: DirectTextInputProps) => {
  const [directText, setDirectText] = useState<string>('')

  // Use useCallback to memoize the handleDirectTextSubmit function
  const handleDirectTextSubmit = useCallback(() => {
    if (directText.trim() && props) {
      console.log(`Submitting text: ${directText}`)
      // Save the user input before processing
      props.setLastUserInput(directText)
      props.playAudio(directText, props.selectedVoiceId, props.selectedVoiceName)
      setDirectText('') // Clear input after submission
    }
  }, [directText, props])

  // Use useCallback to memoize the setDirectText function with debug logs
  const handleTextChange = useCallback((text: string) => {
    console.log('Setting direct text:', text)
    setDirectText(text)
  }, [])

  return {
    directText,
    setDirectText: handleTextChange,
    handleDirectTextSubmit
  }
}
