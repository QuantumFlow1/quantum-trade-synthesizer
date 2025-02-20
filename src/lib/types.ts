export type VoiceTemplate = {
  id: string
  name: string
  description: string
  prompt: string
}

export interface AdviceModel {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
}
