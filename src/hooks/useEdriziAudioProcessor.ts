
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'
import { ChatMessage } from '@/components/admin/types/chat-types'
import { VoiceTemplate } from '@/lib/types'

type UseEdriziAudioProcessorParams = {
  selectedVoice: VoiceTemplate;
  playAudio: (text: string, voiceId: string, voiceName: string) => void;
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const useEdriziAudioProcessor = ({
  selectedVoice,
  playAudio,
  setChatHistory
}: UseEdriziAudioProcessorParams) => {
  const { toast } = useToast()
  const [lastTranscription, setLastTranscription] = useState<string>('')
  const [lastUserInput, setLastUserInput] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  const processAudio = async (audioUrl: string | null) => {
    if (!audioUrl) return

    setIsProcessing(true)
    try {
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split('base64,')[1]
        
        // Get transcription
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('process-voice', {
          body: { 
            audioData: base64Data,
            voiceTemplate: selectedVoice.prompt
          }
        })

        if (transcriptionError) {
          console.error('Transcription error:', transcriptionError)
          toast({
            title: "Error",
            description: "Failed to transcribe recording",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }

        if (!transcriptionData?.transcription) {
          console.error('No transcription received')
          toast({
            title: "Error",
            description: "No transcription received from the server",
            variant: "destructive"
          })
          setIsProcessing(false)
          return
        }

        console.log(`User said: ${transcriptionData.transcription}`)
        setLastUserInput(transcriptionData.transcription)
        
        // Add user message to chat history
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: transcriptionData.transcription,
          timestamp: new Date()
        }
        setChatHistory(prev => [...prev, userMessage])
        
        // Process through AI for a response
        try {
          console.log('Getting AI response for EdriziAI')
          const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
            body: {
              prompt: transcriptionData.transcription,
              voiceId: selectedVoice.id
            }
          })
          
          if (aiError) {
            console.error('AI response error:', aiError)
            toast({
              title: "AI Error",
              description: "Failed to generate an AI response",
              variant: "destructive",
            })
            setIsProcessing(false)
            return
          }
          
          if (aiData?.response) {
            console.log(`AI response: ${aiData.response}`)
            setLastTranscription(aiData.response)
            
            // Add AI response to chat history
            const assistantMessage: ChatMessage = {
              id: Date.now().toString() + '-response',
              role: 'assistant',
              content: aiData.response,
              timestamp: new Date()
            }
            setChatHistory(prev => [...prev, assistantMessage])
            
            // Automatically play back the response
            playAudio(aiData.response, selectedVoice.id, selectedVoice.name)
          } else {
            console.error('No AI response received')
            toast({
              title: "AI Error",
              description: "No AI response received",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error('Error processing with AI:', error)
          toast({
            title: "AI Error",
            description: "Failed to process with AI",
            variant: "destructive",
          })
        }
      }
      
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Error processing audio:', error)
      toast({
        title: "Error",
        description: "Failed to process audio",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const processDirectText = async (text: string) => {
    if (!text.trim()) return
    
    setIsProcessing(true)
    setLastUserInput(text)
    
    // Add user message to chat history
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }
    setChatHistory(prev => [...prev, userMessage])
    
    // For EdriziAI, process the text through the AI
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-response', {
        body: {
          prompt: text,
          voiceId: selectedVoice.id
        }
      })
      
      if (error) {
        console.error('AI processing error:', error)
        toast({
          title: "AI Error",
          description: "Failed to generate an AI response",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }
      
      if (data?.response) {
        console.log(`AI generated response: ${data.response}`)
        setLastTranscription(data.response)
        
        // Add AI response to chat history
        const assistantMessage: ChatMessage = {
          id: Date.now().toString() + '-response',
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }
        setChatHistory(prev => [...prev, assistantMessage])
        
        playAudio(data.response, selectedVoice.id, selectedVoice.name)
      } else {
        console.error('No AI response received')
        toast({
          title: "AI Error",
          description: "No AI response received",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Failed to process with AI:', error)
      toast({
        title: "AI Error",
        description: "Failed to process with AI",
        variant: "destructive",
      })
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
