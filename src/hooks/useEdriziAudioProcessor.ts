
import { useRegularUserProcessor } from './audio-processing/useRegularUserProcessor'
import { useSuperAdminProcessor } from './audio-processing/useSuperAdminProcessor'
import { VoiceTemplate } from '@/lib/types'
import { ChatMessage } from '@/components/admin/types/chat-types'

interface AudioProcessorProps {
  selectedVoice: VoiceTemplate
  playAudio: (url: string) => void
  setChatHistory: (messages: ChatMessage[]) => void
  isSuperAdmin?: boolean
}

export const useEdriziAudioProcessor = ({ 
  selectedVoice, 
  playAudio, 
  setChatHistory,
  isSuperAdmin = false
}: AudioProcessorProps) => {
  // Create an adapter function that wraps the setChatHistory function
  // to ensure it conforms to the expected type
  const setChatHistoryAdapter: React.Dispatch<React.SetStateAction<ChatMessage[]>> = 
    (action) => {
      // Handle the functional update case
      if (typeof action === 'function') {
        setChatHistory(action([] as ChatMessage[]));
      } else {
        // Handle the direct value case
        setChatHistory(action);
      }
    };

  // Choose the appropriate processor based on user type
  const regularProcessor = useRegularUserProcessor({
    selectedVoice,
    playAudio,
    setChatHistory: setChatHistoryAdapter
  })

  const superAdminProcessor = useSuperAdminProcessor({
    selectedVoice,
    playAudio,
    setChatHistory: setChatHistoryAdapter
  })

  // Select the appropriate processor based on user type
  const processor = isSuperAdmin ? superAdminProcessor : regularProcessor

  // Return the selected processor's methods and state
  return {
    lastTranscription: processor.lastTranscription,
    lastUserInput: processor.lastUserInput,
    setLastUserInput: processor.setLastUserInput,
    isProcessing: processor.isProcessing,
    processingError: processor.processingError,
    processingStage: processor.processingStage,
    processAudio: processor.processAudio,
    processDirectText: processor.processDirectText
  }
}
