
export type VoiceTemplate = {
  id: string
  name: string
  description: string
  prompt: string // Making sure prompt is required, not optional
}

export interface AdviceModel {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
}
