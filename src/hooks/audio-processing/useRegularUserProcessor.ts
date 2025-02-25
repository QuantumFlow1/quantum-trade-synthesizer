
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface RegularUserProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export const useRegularUserProcessor = ({
  selectedVoice,
  playAudio,
  setChatHistory
}: RegularUserProcessorProps) => {
  const { toast } = useToast()
  const { user, userProfile } = useAuth()
  const [processingStage, setProcessingStage] = useState<string>('')
  
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

  const getUserLevel = () => {
    // Determine user level based on userProfile or default to beginner
    // This checks if the userProfile has a role property set to 'trader' or 'admin'
    if (userProfile?.role === 'trader' || userProfile?.role === 'admin') {
      return 'advanced'
    }
    return 'beginner'
  }

  const generateRegularAIResponse = async (userInput: string) => {
    try {
      setProcessingStage('Generating standard AI response')
      
      // Fallback to regular AI response if trading advice fails
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
        body: { prompt: userInput }
      })

      if (aiError) {
        console.error('Error generating AI response:', aiError)
        setProcessingError('Failed to generate AI response. Please try again.')
        toast({
          title: "AI Error",
          description: "Failed to generate AI response",
          variant: "destructive"
        })
        return
      }

      const aiResponse = aiData?.response
      if (!aiResponse) {
        console.error('No response returned from AI service')
        setProcessingError('No response received from AI service.')
        toast({
          title: "AI Error",
          description: "No response received from AI service",
          variant: "destructive"
        })
        return
      }

      // Add AI response to chat history
      addAIResponseToChatHistory(aiResponse)

      // Convert AI response to speech
      await generateSpeech(aiResponse)
    } catch (error) {
      console.error('Error generating regular AI response:', error)
      setProcessingError('Failed to generate AI response. Please try again later.')
    }
  }

  const processUserMessage = async (message: string, previousMessages: any[] = []) => {
    try {
      setProcessingStage('Generating trading advice')
      
      // Generate trading-specific advice
      const { data: adviceData, error: adviceError } = await supabase.functions.invoke('generate-trading-advice', {
        body: { 
          message, 
          userId: user?.id,
          userLevel: getUserLevel()
        }
      })

      if (adviceError) {
        console.error('Error generating trading advice:', adviceError)
        setProcessingError('Failed to generate trading advice. Falling back to regular AI.')
        toast({
          title: "Trading Advice Error",
          description: "Falling back to standard AI response",
          variant: "warning"
        })
        // Fall back to regular AI response
        await generateRegularAIResponse(message)
        return
      }

      const advice = adviceData?.advice
      if (!advice) {
        console.error('No advice returned from trading service')
        setProcessingError('No advice received. Falling back to regular AI.')
        await generateRegularAIResponse(message)
        return
      }

      // Add AI response to chat history
      addAIResponseToChatHistory(advice)

      // Convert AI response to speech
      await generateSpeech(advice)
      
      toast({
        title: "Success",
        description: "Trading advice generated successfully",
      })
    } catch (error) {
      console.error('Error processing user message:', error)
      setProcessingError('An error occurred. Falling back to regular AI.')
      // Fall back to regular AI response as a last resort
      await generateRegularAIResponse(message)
    }
  }

  const processAudio = async (audioUrl: string) => {
    await baseProcessAudio(audioUrl, processUserMessage)
  }

  const processDirectText = async (text: string) => {
    await baseProcessDirectText(text, processUserMessage)
  }

  return {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    processingError,
    processingStage,
    processAudio,
    processDirectText
  }
}
