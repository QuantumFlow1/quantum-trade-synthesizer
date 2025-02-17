
import { LoginComponent } from "@/components/auth/LoginComponent"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProfile } from "@/hooks/useProfile"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const Index = () => {
  const { user, signOut } = useAuth()
  const { profile, isLoading } = useProfile()

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <LoginComponent />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (profile?.status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Account Pending Approval</h1>
          <p className="text-muted-foreground">
            Your account is pending approval. Please check back later.
          </p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      </div>
    )
  }

  if (profile?.status === 'suspended') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Account Suspended</h1>
          <p className="text-muted-foreground">
            Your account has been suspended. Please contact support.
          </p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome, {profile?.first_name || user.email}
            </h1>
            <p className="text-muted-foreground">
              Role: {profile?.role} | Subscription: {profile?.subscription_tier}
            </p>
          </div>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </header>

        <main className="grid gap-6">
          {/* Role-specific content will be added here in subsequent updates */}
          <div className="p-6 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <p>
              Welcome to QuantumFlow. Your dashboard will be customized based on your role:
              {profile?.role}.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Index
