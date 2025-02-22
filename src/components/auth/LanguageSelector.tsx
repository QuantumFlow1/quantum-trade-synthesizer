
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe } from "lucide-react"
import { PreferredLanguage } from "@/types/auth"

interface LanguageSelectorProps {
  value: PreferredLanguage
  onValueChange: (value: PreferredLanguage) => void
  label?: string
}

export const LanguageSelector = ({ value, onValueChange, label = "Taal / Language" }: LanguageSelectorProps) => {
  const getLanguageLabel = (code: string) => {
    const labels: Record<string, string> = {
      nl: 'Nederlands',
      en: 'English',
      ru: 'Русский',
      hy: 'Հայերեն'
    }
    return labels[code] || code
  }

  const translations: Record<PreferredLanguage, Record<string, string>> = {
    nl: {
      selectLanguage: "Selecteer een taal",
    },
    en: {
      selectLanguage: "Select a language",
    },
    ru: {
      selectLanguage: "Выберите язык",
    },
    hy: {
      selectLanguage: "Ընտրեք լեզուն",
    }
  };

  const getText = (key: string) => {
    return translations[value]?.[key] || translations.en[key];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
        <Globe className="h-4 w-4" />
        {label}
      </label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder={getText('selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nl" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇳🇱</span>
              {getLanguageLabel('nl')}
            </div>
          </SelectItem>
          <SelectItem value="en" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇬🇧</span>
              {getLanguageLabel('en')}
            </div>
          </SelectItem>
          <SelectItem value="ru" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇷🇺</span>
              {getLanguageLabel('ru')}
            </div>
          </SelectItem>
          <SelectItem value="hy" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇦🇲</span>
              {getLanguageLabel('hy')}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
