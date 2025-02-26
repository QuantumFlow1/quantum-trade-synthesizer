
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { TaskAndModelSectionProps } from "./types";
import { AI_MODELS } from "../types/GrokSettings";
import { getModelDisplayName } from "./utils";

export default function TaskAndModelSection({
  task,
  setTask,
  selectedModel,
  onModelChange
}: TaskAndModelSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="task">
          Task Description
        </label>
        <Textarea
          id="task"
          placeholder="What would you like the AI to help you with? (e.g., 'Write a poem about the sea')"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="min-h-20 resize-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="model">
          AI Model
        </label>
        <Select 
          value={selectedModel} 
          onValueChange={onModelChange}
        >
          <SelectTrigger id="model">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {AI_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {getModelDisplayName(model.id)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
