
import { supabase } from "@/lib/supabase"
import { useToast } from '@/hooks/use-toast'
import { handleSpeechGenerationError } from './errorHandlingUtils'

export const preprocessTextForVoice = async (
  text: string,
  voiceId: string
): Promise<string> => {
  const { toast } = useToast()
  let textToSpeak = text
  
  // Only process AI responses for EdriziAI voices
  if (voiceId.includes('EdriziAI')) {
    console.log(`Processing text with AI before speaking for ${voiceId}`)
    
    try {
      // Pre-process to handle URL or web access mentions
      if (text.includes('http') || text.includes('www.') || 
          text.includes('website') || text.includes('link') || 
          text.includes('open') || text.includes('browse')) {
        console.log('Detected possible web access request, handling specially')
        
        // Create a friendly response explaining limitations
        return "Ik kan geen externe websites openen of bezoeken. Als AI-assistent kan ik geen toegang krijgen tot internet links of webpagina's. Ik kan je wel helpen met trading informatie, analyse en educatie op basis van mijn training. Hoe kan ik je verder helpen met je trading vragen?"
      }

      // Regular processing path - First try Grok3 API for advanced responses
      console.log('Attempting to use Grok3 API first...')
      const { data: grokData, error: grokError } = await supabase.functions.invoke('grok3-response', {
        body: {
          message: text,
          context: []
        }
      })
      
      if (!grokError && grokData?.response) {
        console.log(`Grok3 generated response: ${grokData.response}`)
        return grokData.response
      }

      console.log('Falling back to standard AI processing...')
      
      // Fallback to generate-ai-response function if Grok3 fails
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-ai-response', {
        body: {
          prompt: text,
          voiceId: voiceId
        }
      })
      
      if (aiError) {
        console.error('AI processing error:', aiError)
        toast({
          title: "AI Fout",
          description: "Er was een probleem bij het genereren van een AI-antwoord",
          variant: "destructive",
        })
        return text
      }
      
      if (aiData?.response) {
        console.log(`AI generated response: ${aiData.response}`)
        return aiData.response
      }
    } catch (aiError) {
      handleSpeechGenerationError(aiError, 'AI text preprocessing')
      console.error('Failed to process with AI, using original text:', aiError)
    }
  }
  
  return textToSpeak
}
