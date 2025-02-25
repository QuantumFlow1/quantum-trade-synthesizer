
import { useRegularUserProcessor } from './audio-processing/useRegularUserProcessor'
import { useSuperAdminProcessor } from './audio-processing/useSuperAdminProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'

interface AudioProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  isSuperAdmin?: boolean
}

export const useEdriziAudioProcessor = ({ 
  selectedVoice, 
  playAudio, 
  setChatHistory,
  isSuperAdmin = false
}: AudioProcessorProps) => {
  // Choose the appropriate processor based on user type
  const regularProcessor = useRegularUserProcessor({
    selectedVoice,
    playAudio,
    setChatHistory
  })

  const superAdminProcessor = useSuperAdminProcessor({
    selectedVoice,
    playAudio,
    setChatHistory
  })

  // Select the appropriate processor based on user type
  const processor = isSuperAdmin ? superAdminProcessor : regularProcessor

  // Return the selected processor's methods and state
  return {
    lastTranscription: processor.lastTranscription,
    lastUserInput: processor.lastUserInput,
    setLastUserInput: processor.setLastUserInput,
    isProcessing: processor.isProcessing,
    processAudio: processor.processAudio,
    processDirectText: processor.processDirectText
  }
}
