
import { Input } from '@/components/ui/input'

type FileUploadSectionProps = {
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileUploadSection = ({
  fileInputRef,
  onFileUpload
}: FileUploadSectionProps) => {
  return (
    <Input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept="audio/*"
      onChange={onFileUpload}
    />
  )
}
