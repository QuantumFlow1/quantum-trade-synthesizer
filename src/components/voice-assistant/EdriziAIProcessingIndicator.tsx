
import { LoaderIcon, XCircle, Bot, Mic, BrainCircuit, Volume } from 'lucide-react'

type EdriziAIProcessingIndicatorProps = {
  isProcessing: boolean;
  processingError: string | null;
  processingStage?: string;
}

export const EdriziAIProcessingIndicator = ({ isProcessing, processingError, processingStage }: EdriziAIProcessingIndicatorProps) => {
  if (!isProcessing && !processingError) return null;

  const getStageIcon = () => {
    switch(processingStage) {
      case 'Transcribing audio':
        return <Mic className="w-4 h-4 mr-2" />;
      case 'Generating AI response':
      case 'Terugvallen naar standaard AI':
      case 'Generating response':
        return <BrainCircuit className="w-4 h-4 mr-2" />;
      case 'Generating speech':
      case 'Converting to speech':
        return <Volume className="w-4 h-4 mr-2" />;
      default:
        return <LoaderIcon className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <>
      {/* Processing state indicators with refined UI */}
      {isProcessing && (
        <div className="flex justify-start">
          <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted mr-12 flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            <div className="flex items-center">
              <div className="flex items-center">
                {getStageIcon()}
                <p className="text-sm font-medium">{processingStage || "Verwerken..."}</p>
              </div>
              <div className="ml-2 flex space-x-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0s" }}></span>
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }}></span>
              </div>
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
