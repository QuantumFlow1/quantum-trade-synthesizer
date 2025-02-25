
import { useState } from 'react'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { useGrok3Availability } from './grok3/useGrok3Availability'
import { useGrok3ResponseGenerator } from './grok3/useGrok3ResponseGenerator'

interface SuperAdminProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export const useSuperAdminProcessor = ({
  selectedVoice,
  playAudio,
  setChatHistory
}: SuperAdminProcessorProps) => {
  const [processingStage, setProcessingStage] = useState<string>('')
  
  // Use our base audio processor for common functionality
  const {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    generateSpeech,
    processAudio: baseProcessAudio,
    processDirectText: baseProcessDirectText,
    addAIResponseToChatHistory,
    setProcessingError
  } = useBaseAudioProcessor({
    selectedVoice,
    playAudio,
    setChatHistory
  })

  // Use our Grok3 availability hook
  const {
    grok3Available,
    setGrok3Available,
    checkGrok3Availability,
    shouldRetryGrok3
  } = useGrok3Availability()

  // Use our Grok3 response generator
  const {
    generateGrok3Response
  } = useGrok3ResponseGenerator({
    addAIResponseToChatHistory,
    generateSpeech,
    setProcessingError,
    setProcessingStage
  })

  // Function to generate a Grok3 response with all necessary parameters
  const generateFullGrok3Response = async (text: string) => {
    // Create an empty context array for now - in a real app, this would include chat history
    const context: any[] = [];
    
    await generateGrok3Response(
      text,
      context,
      checkGrok3Availability,
      grok3Available,
      shouldRetryGrok3,
      setGrok3Available
    );
  }

  // Manual function to recheck API availability
  const recheckGrok3Availability = async () => {
    console.log('Manually rechecking Grok3 API availability...')
    const isAvailable = await checkGrok3Availability()
    console.log('Grok3 availability check result:', isAvailable)
    return isAvailable
  }

  // Wrapper function to process audio with Grok3
  const processAudio = async (audioUrl: string) => {
    await baseProcessAudio(audioUrl, async (text: string) => {
      // Try to ensure we have the latest availability status
      await recheckGrok3Availability()
      
      await generateFullGrok3Response(text)
    })
  }

  // Wrapper function to process direct text input with Grok3
  const processDirectText = async (text: string) => {
    await baseProcessDirectText(text, async (text: string) => {
      // Try to ensure we have the latest availability status
      await recheckGrok3Availability()
      
      await generateFullGrok3Response(text)
    })
  }

  return {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    processingStage,
    grok3Available,
    processAudio,
    processDirectText,
    checkGrok3Availability,
    recheckGrok3Availability
  }
}
