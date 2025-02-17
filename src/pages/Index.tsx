import { LoginComponent } from "@/components/auth/LoginComponent"
import { useAuth } from "@/components/auth/AuthProvider"

const Index = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {!user ? (
        <LoginComponent />
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welkom {user.email}</h1>
          {/* Hier komen de andere componenten voor ingelogde gebruikers */}
        </div>
      )}
    </div>
  )
}

export default Index
