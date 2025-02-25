
import { supabase } from '@/lib/supabase'
import { useBaseAudioProcessor } from './useBaseAudioProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'

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
  const {
    lastTranscription,
    lastUserInput,
    setLastUserInput,
    isProcessing,
    generateSpeech,
    processAudio: baseProcessAudio,
    processDirectText: baseProcessDirectText,
    addAIResponseToChatHistory
  } = useBaseAudioProcessor({
    selectedVoice,
    playAudio,
    setChatHistory
  })

  const generateRegularAIResponse = async (userInput: string) => {
    try {
      // Fallback to regular AI response
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
        body: { prompt: userInput }
      })

      if (aiError) {
        console.error('Error generating AI response:', aiError)
        return
      }

      const aiResponse = aiData?.response
      if (!aiResponse) {
        console.error('No response returned from AI service')
        return
      }

      // Add AI response to chat history
      addAIResponseToChatHistory(aiResponse)

      // Convert AI response to speech
      await generateSpeech(aiResponse)
    } catch (error) {
      console.error('Error generating regular AI response:', error)
    }
  }

  const generateGrok3Response = async (userInput: string, context: any[] = []) => {
    try {
      console.log('Generating response with Grok3 API for super admin...')
      
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: userInput,
          context: context
        }
      })

      if (error) {
        console.error('Error calling Grok3 API:', error)
        // Fall back to regular AI response
        await generateRegularAIResponse(userInput)
        return
      }

      const aiResponse = data?.response
      if (!aiResponse) {
        console.error('No response returned from Grok3 API')
        await generateRegularAIResponse(userInput)
        return
      }

      console.log('Got Grok3 response:', aiResponse.substring(0, 100) + '...')

      // Add AI response to chat history
      addAIResponseToChatHistory(aiResponse)

      // Convert AI response to speech
      await generateSpeech(aiResponse)
    } catch (error) {
      console.error('Error generating Grok3 response:', error)
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
    processAudio,
    processDirectText
  }
}
