
import { useState, useRef, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export const useAudioRecorder = () => {
  const { toast } = useToast()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const recordingTimer = useRef<number | null>(null)
  const startTime = useRef<number>(0)
  
  // Max recording duration in seconds
  const MAX_RECORDING_DURATION = 60

  // Update recording timer
  const updateRecordingTimer = useCallback(() => {
    if (!startTime.current) return
    
    const currentDuration = Math.floor((Date.now() - startTime.current) / 1000)
    setRecordingDuration(currentDuration)
    
    // Auto-stop recording if it exceeds max duration
    if (currentDuration >= MAX_RECORDING_DURATION) {
      console.log('Max recording duration reached, auto-stopping')
      stopRecording()
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      // Request audio with echo cancellation and noise suppression for better quality
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000 // 128kbps for better audio quality
      })
      
      audioChunks.current = []
      startTime.current = Date.now()
      setRecordingDuration(0)

      // Setup data handling
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      // Start the actual recording - use timeslice to get chunks every 500ms
      // This improves server processing by providing smaller chunks
      mediaRecorder.current.start(500)
      setIsRecording(true)
      
      // Start the recording timer
      recordingTimer.current = window.setInterval(updateRecordingTimer, 1000)
      
      toast({
        title: "Opname gestart",
        description: "Spreek nu...",
      })
      
      console.log('Recording started successfully')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast({
        title: "Fout",
        description: "Kon geen toegang krijgen tot de microfoon",
        variant: "destructive",
      })
    }
  }, [toast, updateRecordingTimer])

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && isRecording) {
      console.log('Stopping recording, duration:', recordingDuration)
      
      // Clear the recording timer
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current)
        recordingTimer.current = null
      }
      
      return new Promise<string>((resolve) => {
        mediaRecorder.current!.onstop = () => {
          console.log(`Recording stopped with ${audioChunks.current.length} chunks`)
          
          // Create optimized audio blob from chunks
          const audioBlob = new Blob(audioChunks.current, { 
            type: 'audio/webm;codecs=opus' 
          })
          
          console.log(`Recorded audio size: ${Math.round(audioBlob.size / 1024)}KB`)
          const audioUrl = URL.createObjectURL(audioBlob)
          setIsRecording(false)
          setRecordingDuration(0)
          startTime.current = 0
          resolve(audioUrl)
        }
        
        mediaRecorder.current!.stop()
        
        // Stop all audio tracks to release microphone
        if (mediaRecorder.current!.stream) {
          mediaRecorder.current!.stream.getTracks().forEach(track => {
            track.stop()
          })
        }
      })
    }
    
    // Clear the recording timer if something went wrong
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current)
      recordingTimer.current = null
    }
    
    setIsRecording(false)
    setRecordingDuration(0)
    return Promise.resolve(null)
  }, [isRecording, recordingDuration])

  return {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording
  }
}
