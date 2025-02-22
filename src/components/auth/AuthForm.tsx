
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { PreferredLanguage, UserRole } from '@/types/auth'
import { LanguageSelector } from './LanguageSelector'
import { RoleSelector } from './RoleSelector'

interface AuthFormProps {
  isRegistering: boolean
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  selectedRole: UserRole
  setSelectedRole: (value: UserRole) => void
  language: PreferredLanguage
  setLanguage: (value: PreferredLanguage) => void
}

export const AuthForm = ({
  isRegistering,
  isLoading,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  selectedRole,
  setSelectedRole,
  language,
  setLanguage,
}: AuthFormProps) => {
  const translations: Record<PreferredLanguage, Record<string, string>> = {
    nl: {
      email: "E-mailadres",
      password: "Wachtwoord",
      loading: "Even geduld...",
      register: "Registreren",
      login: "Inloggen",
      roleSelect: "Selecteer rol",
      languageSelect: "Selecteer taal"
    },
    en: {
      email: "Email",
      password: "Password",
      loading: "Loading...",
      register: "Register",
      login: "Login",
      roleSelect: "Select role",
      languageSelect: "Select language"
    },
    ru: {
      email: "Электронная почта",
      password: "Пароль",
      loading: "Загрузка...",
      register: "Регистрация",
      login: "Вход",
      roleSelect: "Выберите роль",
      languageSelect: "Выберите язык"
    },
    hy: {
      email: "Էլ. փոստ",
      password: "Գաղտնաբառ",
      loading: "Սպասեք...",
      register: "Գրանցվել",
      login: "Մուտք",
      roleSelect: "Ընտրեք դերը",
      languageSelect: "Ընտրեք լեզուն"
    }
  };

  const getText = (key: string) => {
    return translations[language]?.[key] || translations.en[key];
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder={getText('email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder={getText('password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {isRegistering && (
        <>
          <div className="space-y-2">
            <RoleSelector 
              value={selectedRole}
              onValueChange={setSelectedRole}
              label={getText('roleSelect')}
            />
          </div>
          <div className="space-y-2">
            <LanguageSelector
              value={language}
              onValueChange={(value) => {
                setLanguage(value);
                localStorage.setItem('preferred_language', value);
              }}
              label={getText('languageSelect')}
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        <Mail className="mr-2 h-4 w-4" />
        {isLoading 
          ? getText('loading')
          : (isRegistering ? getText('register') : getText('login'))}
      </Button>
    </form>
  );
};
