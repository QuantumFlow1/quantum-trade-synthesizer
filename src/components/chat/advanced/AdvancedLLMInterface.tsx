
import { useNavigate } from "react-router-dom";
import AdvancedLLMContainer from "./AdvancedLLMContainer";
import AdvancedLLMHeader from "./AdvancedLLMHeader";
import ContentGenerationSection from "./ContentGenerationSection";
import HistorySection from "./HistorySection";
import ParametersSection from "./ParametersSection";
import TaskAndModelSection from "./TaskAndModelSection";
import { useAdvancedLLM } from "./hooks/useAdvancedLLM";
import { getModelDisplayName } from "./utils";

/**
 * Advanced LLM Interface
 * A more sophisticated interface for interacting with LLM models
 */
export default function AdvancedLLMInterface() {
  const navigate = useNavigate();
  
  // Get all state and handlers from the hook
  const advancedLLM = useAdvancedLLM();
  
  // Get the display name for the selected model
  const selectedModelName = getModelDisplayName(advancedLLM.selectedModel);
  
  const handleExit = () => {
    navigate("/");
  };
  
  return (
    <div>
      <AdvancedLLMContainer>
        {/* Header with dynamic model name */}
        <AdvancedLLMHeader 
          selectedModelName={selectedModelName}
          onExit={handleExit}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-[calc(100vh-80px)] overflow-hidden">
          {/* Left Column: Task and Model Selection */}
          <div className="col-span-1 space-y-6 overflow-y-auto">
            <TaskAndModelSection
              task={advancedLLM.task}
              setTask={advancedLLM.setTask}
              selectedModel={advancedLLM.selectedModel}
              onModelChange={advancedLLM.handleModelChange}
            />
            
            <ParametersSection
              temperature={advancedLLM.temperature}
              setTemperature={advancedLLM.setTemperature}
              maxTokens={advancedLLM.maxTokens}
              setMaxTokens={advancedLLM.setMaxTokens}
              handleGenerate={advancedLLM.handleGenerate}
              isLoading={advancedLLM.isGenerating}
            />
            
            <HistorySection
              history={advancedLLM.history}
            />
          </div>
          
          {/* Right Column: Content Generation */}
          <div className="col-span-1 md:col-span-2 flex flex-col h-full overflow-hidden">
            <ContentGenerationSection
              messages={advancedLLM.messages}
              inputMessage={advancedLLM.inputMessage}
              setInputMessage={advancedLLM.setInputMessage}
              onSendMessage={advancedLLM.handleSendMessage}
              isGenerating={advancedLLM.isGenerating}
              selectedModelName={selectedModelName}
            />
          </div>
        </div>
      </AdvancedLLMContainer>
    </div>
  );
}
