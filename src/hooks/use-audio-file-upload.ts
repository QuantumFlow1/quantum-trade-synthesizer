
import { useState } from 'react'
import { toast } from 'sonner'

type AudioFileUploadProps = {
  setPreviewAudioUrl: (url: string) => void
  processAudio: () => void
}

export const useAudioFileUpload = ({ 
  setPreviewAudioUrl, 
  processAudio 
}: AudioFileUploadProps) => {
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast.error('Only audio files are allowed', {
        description: 'Please select a valid audio file'
      })
      return
    }

    const audioUrl = URL.createObjectURL(file)
    setPreviewAudioUrl(audioUrl)
    // Automatically process after upload
    setTimeout(() => processAudio(), 200)
  }

  return {
    handleFileUpload
  }
}
