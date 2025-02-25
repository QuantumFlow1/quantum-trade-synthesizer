
import { LoaderIcon, XCircle, Bot } from 'lucide-react'

type EdriziAIProcessingIndicatorProps = {
  isProcessing: boolean;
  processingError: string | null;
  processingStage?: string;
}

export const EdriziAIProcessingIndicator = ({ isProcessing, processingError, processingStage }: EdriziAIProcessingIndicatorProps) => {
  if (!isProcessing && !processingError) return null;

  return (
    <>
      {/* Processing state indicators */}
      {isProcessing && (
        <div className="flex justify-start">
          <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted mr-12 flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            <div className="flex items-center">
              <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
              <p className="text-sm">{processingStage || "Verwerken..."}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error indicator */}
      {processingError && (
        <div className="flex justify-start">
          <div className="rounded-lg px-4 py-2 max-w-[80%] bg-destructive text-destructive-foreground mr-12 flex items-center">
            <XCircle className="w-4 h-4 mr-2" />
            <p className="text-sm">{processingError}</p>
          </div>
        </div>
      )}
    </>
  )
}
