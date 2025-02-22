
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

export const LanguageSelector = ({ value, onValueChange, label }: LanguageSelectorProps) => {
  const translations: Record<PreferredLanguage, Record<string, string>> = {
    nl: {
      selectLanguage: "Selecteer een taal",
      languageLabel: "Taal",
      dutch: "Nederlands",
      english: "Engels",
      russian: "Russisch",
      armenian: "Armeens"
    },
    en: {
      selectLanguage: "Select a language",
      languageLabel: "Language",
      dutch: "Dutch",
      english: "English",
      russian: "Russian",
      armenian: "Armenian"
    },
    ru: {
      selectLanguage: "Выберите язык",
      languageLabel: "Язык",
      dutch: "Нидерландский",
      english: "Английский",
      russian: "Русский",
      armenian: "Армянский"
    },
    hy: {
      selectLanguage: "Ընտրեք լեզուն",
      languageLabel: "Լեզու",
      dutch: "Հոլանդերեն",
      english: "Անգլերեն",
      russian: "Ռուսերեն",
      armenian: "Հայերեն"
    }
  }

  const getText = (key: string) => {
    return translations[value]?.[key] || translations.en[key];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/70 flex items-center gap-2">
        <Globe className="h-4 w-4" />
        {label || getText('languageLabel')}
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
              {getText('dutch')}
            </div>
          </SelectItem>
          <SelectItem value="en" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇬🇧</span>
              {getText('english')}
            </div>
          </SelectItem>
          <SelectItem value="ru" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇷🇺</span>
              {getText('russian')}
            </div>
          </SelectItem>
          <SelectItem value="hy" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇦🇲</span>
              {getText('armenian')}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
