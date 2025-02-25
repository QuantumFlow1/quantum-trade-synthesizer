
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "@/components/admin/types/chat-types";
import { createUserMessage, createAssistantMessage } from "./messageUtils";

export const transcribeAudio = async (
  audioBlob: Blob
): Promise<{ transcription?: string; error?: string }> => {
  try {
    console.log("Starting audio transcription...");
    
    // Convert Blob to File
    const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" });

    // Create form data
    const formData = new FormData();
    formData.append("audio", audioFile);

    // Call the Supabase Edge Function for transcription
    const { data, error } = await supabase.functions.invoke("process-voice", {
      body: formData,
    });

    if (error) {
      console.error("Transcription error:", error);
      return { error: `Transcription failed: ${error.message}` };
    }

    if (!data?.transcription) {
      console.error("No transcription returned:", data);
      return { error: "No transcription returned from API" };
    }

    console.log("Transcription successful:", data.transcription);
    return { transcription: data.transcription };
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    return { error: `Transcription error: ${error}` };
  }
};

export const generateAIResponse = async (
  userInput: string,
  context: ChatMessage[] = []
): Promise<{ response?: string; error?: string }> => {
  try {
    console.log("Generating AI response for:", userInput);
    console.log("Context:", context);

    // Call the Supabase Edge Function for AI response
    const { data, error } = await supabase.functions.invoke("generate-ai-response", {
      body: {
        message: userInput,
        context: context,
      },
    });

    if (error) {
      console.error("AI response error:", error);
      return { error: `AI response failed: ${error.message}` };
    }

    if (!data?.response) {
      console.error("No AI response returned:", data);
      return { error: "No response returned from AI API" };
    }

    console.log("AI response successful:", data.response);
    return { response: data.response };
  } catch (error) {
    console.error("Error in generateAIResponse:", error);
    return { error: `AI response error: ${error}` };
  }
};

export const generateTextToSpeech = async (
  text: string,
  voiceId: string
): Promise<{ audioUrl?: string; error?: string }> => {
  try {
    console.log("Generating speech for:", text);
    console.log("Using voice ID:", voiceId);

    // Call the Supabase Edge Function for text-to-speech
    const { data, error } = await supabase.functions.invoke("text-to-speech", {
      body: {
        text: text,
        voice_id: voiceId,
      },
    });

    if (error) {
      console.error("Text-to-speech error:", error);
      return { error: `Text-to-speech failed: ${error.message}` };
    }

    if (!data?.audio_url) {
      console.error("No audio URL returned:", data);
      return { error: "No audio URL returned from TTS API" };
    }

    console.log("Text-to-speech successful:", data.audio_url);
    return { audioUrl: data.audio_url };
  } catch (error) {
    console.error("Error in generateTextToSpeech:", error);
    return { error: `Text-to-speech error: ${error}` };
  }
};
