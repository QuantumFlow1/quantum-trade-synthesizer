
import { useState } from 'react'
import { useToast } from './use-toast'

type AudioFileUploadProps = {
  setPreviewAudioUrl: (url: string | null) => void
  processAudio: () => void
}

export const useAudioFileUpload = ({
  setPreviewAudioUrl,
  processAudio
}: AudioFileUploadProps) => {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast({
        title: "Error",
        description: "Only audio files are allowed",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      const audioUrl = URL.createObjectURL(file)
      setPreviewAudioUrl(audioUrl)
      
      // Process the uploaded audio after a short delay
      // to ensure the audio URL is set
      setTimeout(() => processAudio(), 200)
      
      toast({
        title: "File Uploaded",
        description: "Audio file has been uploaded and is being processed",
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: "Error",
        description: "Failed to upload audio file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return {
    handleFileUpload,
    isUploading
  }
}
