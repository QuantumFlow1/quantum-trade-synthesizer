
import { supabase } from '@/lib/supabase'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

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
  const { toast } = useToast()
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

  const generateRegularAIResponse = async (userInput: string) => {
    try {
      setProcessingStage('Falling back to regular AI response')
      
      // Fallback to regular AI response
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
        body: { prompt: userInput }
      })

      if (aiError) {
        console.error('Error generating AI response:', aiError)
        setProcessingError('Failed to generate AI response.')
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

  const generateGrok3Response = async (userInput: string, context: any[] = []) => {
    try {
      setProcessingStage('Connecting to Grok3 API')
      console.log('Generating response with Grok3 API for super admin...')
      
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: userInput,
          context: context
        }
      })

      if (error) {
        console.error('Error calling Grok3 API:', error)
        setProcessingError('Failed to connect to Grok3 API. Falling back to regular AI.')
        toast({
          title: "Grok3 API Error",
          description: "Falling back to standard AI response",
          variant: "destructive"
        })
        // Fall back to regular AI response
        await generateRegularAIResponse(userInput)
        return
      }

      const aiResponse = data?.response
      if (!aiResponse) {
        console.error('No response returned from Grok3 API')
        setProcessingError('No response received from Grok3 API. Falling back to regular AI.')
        await generateRegularAIResponse(userInput)
        return
      }

      console.log('Got Grok3 response:', aiResponse.substring(0, 100) + '...')
      setProcessingStage('Processing Grok3 response')

      // Add AI response to chat history
      addAIResponseToChatHistory(aiResponse)

      // Convert AI response to speech
      await generateSpeech(aiResponse)
      
      toast({
        title: "Success",
        description: "Grok3 response generated successfully",
      })
    } catch (error) {
      console.error('Error generating Grok3 response:', error)
      setProcessingError('Error with Grok3 response. Falling back to regular AI.')
      // Fall back to regular AI response
      await generateRegularAIResponse(userInput)
    }
  }

  const processAudio = async (audioUrl: string) => {
    await baseProcessAudio(audioUrl, generateGrok3Response)
  }

  const processDirectText = async (text: string) => {
    await baseProcessDirectText(text, generateGrok3Response)
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
