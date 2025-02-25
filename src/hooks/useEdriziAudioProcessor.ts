
import { useState, useEffect } from 'react'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { VoiceTemplate } from '@/lib/voice-templates'
import { useAuth } from '@/components/auth/AuthProvider'
import { supabase } from '@/lib/supabase'

interface AudioProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export const useEdriziAudioProcessor = ({ 
  selectedVoice, 
  playAudio, 
  setChatHistory 
}: AudioProcessorProps) => {
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { user, userProfile } = useAuth()

  const getUserLevel = () => {
    // Determine user level based on activity or explicitly set level
    // This is a simplified version - you might want to implement a more sophisticated approach
    return userProfile?.subscription_tier === 'premium' ? 'advanced' : 'beginner'
  }

  const processAudio = async (audioUrl: string) => {
    if (!audioUrl) return

    setIsProcessing(true)
    try {
      // First step: Process voice to get transcription
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
        body: { audioUrl }
      })

      if (transcriptionError) {
        console.error('Error processing voice:', transcriptionError)
        setIsProcessing(false)
        return
      }

      const transcription = transcriptionData?.transcription
      if (!transcription) {
        console.error('No transcription returned from service')
        setIsProcessing(false)
        return
      }

      console.log('Got transcription:', transcription)
      setLastTranscription(transcription)
      setLastUserInput(transcription)
      
      // Add user message to chat history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: transcription,
        timestamp: new Date()
      }
      
      setChatHistory(prev => [...prev, userMessage])

      // Generate trading-specific advice
      const { data: adviceData, error: adviceError } = await supabase.functions.invoke('generate-trading-advice', {
        body: { 
          message: transcription, 
          userId: user?.id,
          userLevel: getUserLevel()
        }
      })

      if (adviceError) {
        console.error('Error generating trading advice:', adviceError)
        // Fall back to regular AI response
        await generateRegularAIResponse(transcription)
        return
      }

      const advice = adviceData?.advice
      if (!advice) {
        console.error('No advice returned from trading service')
        await generateRegularAIResponse(transcription)
        return
      }

      // Add AI response to chat history
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: advice,
        timestamp: new Date()
      }
      
      setChatHistory(prev => [...prev, aiMessage])

      // Convert AI response to speech
      await generateSpeech(advice)
    } catch (error) {
      console.error('Error in audio processing flow:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const generateRegularAIResponse = async (userInput: string) => {
    try {
      // Fallback to regular AI response if trading advice fails
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
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
      
      setChatHistory(prev => [...prev, aiMessage])

      // Convert AI response to speech
      await generateSpeech(aiResponse)
    } catch (error) {
      console.error('Error generating regular AI response:', error)
    }
  }

  const generateSpeech = async (text: string) => {
    try {
      const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text, 
          voiceId: selectedVoice.id 
        }
      })

      if (speechError) {
        console.error('Error generating speech:', speechError)
        return
      }

      const audioUrl = speechData?.audioUrl
      if (!audioUrl) {
        console.error('No audio URL returned from speech service')
        return
      }

      // Play the generated audio
      playAudio(audioUrl)
    } catch (error) {
      console.error('Error in text-to-speech flow:', error)
    }
  }

  const processDirectText = async (text: string) => {
    if (!text.trim()) return

    setIsProcessing(true)
    setLastUserInput(text)

    try {
      // Add user message to chat history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      }
      
      setChatHistory(prev => [...prev, userMessage])

      // Generate trading-specific advice for text input
      const { data: adviceData, error: adviceError } = await supabase.functions.invoke('generate-trading-advice', {
        body: { 
          message: text,
          userId: user?.id,
          userLevel: getUserLevel()
        }
      })

      if (adviceError) {
        console.error('Error generating trading advice:', adviceError)
        // Fall back to regular AI response
        await generateRegularAIResponse(text)
        return
      }

      const advice = adviceData?.advice
      if (!advice) {
        console.error('No advice returned from trading service')
        await generateRegularAIResponse(text)
        return
      }

      // Add AI response to chat history
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: advice,
        timestamp: new Date()
      }
      
      setChatHistory(prev => [...prev, aiMessage])

      // Convert AI response to speech
      await generateSpeech(advice)
    } catch (error) {
      console.error('Error processing direct text:', error)
    } finally {
      setIsProcessing(false)
    }
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
