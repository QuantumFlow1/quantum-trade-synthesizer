
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
  
  const {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    generateSpeech: baseGenerateSpeech,
    processAudio: baseProcessAudio,
    processDirectText: baseProcessDirectText,
    addAIResponseToChatHistory,
    setProcessingError
  } = useBaseAudioProcessor({
    selectedVoice,
    playAudio,
    setChatHistory
  })

  const {
    grok3Available,
    setGrok3Available,
    checkGrok3Availability,
    resetGrok3Connection,
    disableGrok3Connection,
    manuallyDisabled,
    shouldRetryGrok3
  } = useGrok3Availability()

  // Wrap the generateSpeech function to return void instead of boolean
  const generateSpeech = async (text: string): Promise<void> => {
    await baseGenerateSpeech(text);
    return;
  }

  const {
    generateGrok3Response
  } = useGrok3ResponseGenerator({
    addAIResponseToChatHistory,
    generateSpeech,
    setProcessingError,
    setProcessingStage
  })

  const generateFullGrok3Response = async (text: string): Promise<void> => {
    const context: any[] = [];
    
    try {
      // Add the user message to chat history first
      addAIResponseToChatHistory({
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date()
      });
      
      setProcessingStage('Generating AI response...');
      
      // Generate the response
      await generateGrok3Response(
        text,
        context,
        checkGrok3Availability,
        grok3Available,
        shouldRetryGrok3(),
        setGrok3Available
      );
      
      setProcessingStage('');
    } catch (error) {
      console.error("Error generating Grok3 response:", error);
      setProcessingError("Failed to generate AI response. Please try again.");
      setProcessingStage('');
    }
  }

  // Fixed: recheckGrok3Availability returns Promise<void>
  const recheckGrok3Availability = async (): Promise<void> => {
    console.log('Manually rechecking Grok3 API availability...')
    await checkGrok3Availability()
    console.log('Grok3 availability check complete')
  }

  const processAudio = async (audioUrl: string): Promise<void> => {
    await baseProcessAudio(audioUrl, async (text: string) => {
      await recheckGrok3Availability()
      await generateFullGrok3Response(text)
    })
  }

  const processDirectText = async (text: string): Promise<void> => {
    await baseProcessDirectText(text, async (text: string) => {
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
    manuallyDisabled,
    processAudio,
    processDirectText,
    checkGrok3Availability,
    recheckGrok3Availability,
    resetGrok3Connection,
    disableGrok3Connection
  }
}
