
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
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {isRegistering && (
        <>
          <RoleSelector 
            value={selectedRole}
            onValueChange={setSelectedRole}
          />
          <LanguageSelector
            value={language}
            onValueChange={setLanguage}
          />
        </>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        <Mail className="mr-2 h-4 w-4" />
        {isLoading 
          ? "Even geduld..." 
          : (isRegistering ? "Registreren" : "Login")}
      </Button>
    </form>
  )
}
