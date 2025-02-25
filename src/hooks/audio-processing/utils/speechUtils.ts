
import { supabase } from '@/lib/supabase';
import { VoiceTemplate } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

interface ErrorHandlingOptions {
  setIsProcessing?: (isProcessing: boolean) => void;
  setError?: (error: string | null) => void;
}

/**
 * Generate speech from text using Eleven Labs API through Supabase Edge Function
 */
export const generateSpeechFromText = async (
  text: string,
  voice: VoiceTemplate,
  playAudio: (url: string) => void,
  options?: ErrorHandlingOptions
): Promise<void> => {
  const { setIsProcessing, setError } = options || {};
  
  try {
    if (setIsProcessing) {
      setIsProcessing(true);
    }
    
    if (!text || text.trim() === '') {
      throw new Error('No text provided for speech generation');
    }
    
    console.log(`Generating speech for text (${text.length} chars) with voice: ${voice.name}`);
    
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: {
        text,
        voice: voice.id,
      }
    });
    
    if (error) {
      console.error('Speech generation error:', error);
      throw new Error(`Speech generation failed: ${error.message}`);
    }
    
    if (!data || !data.audioUrl) {
      throw new Error('No audio URL returned from speech generation');
    }
    
    console.log('Speech generated successfully, playing audio now');
    
    // Play the generated audio
    playAudio(data.audioUrl);
    
    return data;
  } catch (error) {
    console.error('Error generating speech:', error);
    
    if (setError) {
      setError(error instanceof Error ? error.message : 'Failed to generate speech');
    }
    
    toast({
      title: 'Speech Generation Failed',
      description: error instanceof Error ? error.message : 'Failed to generate speech',
      variant: 'destructive',
    });
    
    throw error;
  } finally {
    if (setIsProcessing) {
      setIsProcessing(false);
    }
  }
};

/**
 * Create a function to play audio from a URL
 */
export const createAudioPlayer = (): (url: string) => void => {
  let audio: HTMLAudioElement | null = null;
  
  return (url: string) => {
    // Stop any currently playing audio
    if (audio) {
      audio.pause();
      audio = null;
    }
    
    // Create new audio element
    audio = new Audio(url);
    audio.play().catch(err => {
      console.error('Error playing audio:', err);
      toast({
        title: 'Audio Playback Failed',
        description: 'Failed to play the generated audio',
        variant: 'destructive',
      });
    });
  };
};
