
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PreferredLanguage } from "@/types/auth"

interface LanguageSelectorProps {
  value: PreferredLanguage
  onValueChange: (value: PreferredLanguage) => void
}

export const LanguageSelector = ({ value, onValueChange }: LanguageSelectorProps) => {
  const getLanguageLabel = (code: string) => {
    const labels: Record<string, string> = {
      nl: 'Nederlands',
      en: 'English',
      ru: 'Русский',
      hy: 'Հայերեն'
    }
    return labels[code] || code
  }

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecteer een taal" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nl">{getLanguageLabel('nl')}</SelectItem>
        <SelectItem value="en">{getLanguageLabel('en')}</SelectItem>
        <SelectItem value="ru">{getLanguageLabel('ru')}</SelectItem>
        <SelectItem value="hy">{getLanguageLabel('hy')}</SelectItem>
      </SelectContent>
    </Select>
  )
}
