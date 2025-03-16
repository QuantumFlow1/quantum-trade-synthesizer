
// Ollama API response types
export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    families?: string[];
    parameter_size: string;
    quantization_level?: string;
  };
}

export interface OllamaConnectionStatus {
  success: boolean;
  message: string;
  models?: OllamaModel[];
}
