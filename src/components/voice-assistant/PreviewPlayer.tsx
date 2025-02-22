
import { useRef } from 'react'

type PreviewPlayerProps = {
  audioUrl: string | null
  onEnded: () => void
}

export const PreviewPlayer = ({ audioUrl, onEnded }: PreviewPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  return (
    <audio 
      ref={audioRef}
      src={audioUrl || undefined}
      onEnded={onEnded}
      className="hidden"
    />
  )
}

