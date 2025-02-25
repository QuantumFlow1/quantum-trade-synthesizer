
import { useState } from 'react'
import { useToast } from './use-toast'

export const useDirectTextInput = (
  onSubmit: (text: string) => Promise<void>
) => {
  const [directText, setDirectText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleTextChange = (text: string) => {
    setDirectText(text)
  }

  const handleSubmit = async () => {
    if (!directText.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      // Store text before clearing
      const textToSubmit = directText
      // Clear immediately for better UX
      setDirectText('')
      
      // Process the text
      await onSubmit(textToSubmit)
    } catch (error) {
      console.error('Error submitting text:', error)
      toast({
        title: 'Error',
        description: 'Failed to process your message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    directText,
    setDirectText,
    handleTextChange,
    handleSubmit,
    isSubmitting
  }
}
