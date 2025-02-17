
import { LoginComponent } from "@/components/auth/LoginComponent"
import { useAuth } from "@/components/auth/AuthProvider"
import { useProfile } from "@/hooks/useProfile"
import { useTrading } from "@/hooks/useTrading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, TrendingUp, TrendingDown, BarChart2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { TradeType } from "@/types/trading"

const Index = () => {
  const { user, signOut } = useAuth()
  const { profile, isLoading: isLoadingProfile } = useProfile()
  const { tradingPairs, trades, isLoading: isLoadingTrading, createTrade } = useTrading()
  
  const [selectedPairId, setSelectedPairId] = useState<string>("")
  const [tradeType, setTradeType] = useState<TradeType>("buy")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")

  const handleCreateTrade = () => {
    if (!selectedPairId || !amount || !price) {
      return
    }

    createTrade({
      pair_id: selectedPairId,
      type: tradeType,
      amount: parseFloat(amount),
      price: parseFloat(price),
      status: 'pending'
    })

    // Reset form
    setAmount("")
    setPrice("")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <LoginComponent />
      </div>
    )
  }

  if (isLoadingProfile || isLoadingTrading) {
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

        <main className="grid gap-6 md:grid-cols-2">
          {/* Trading Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create Trade</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trading Pair</label>
                <Select onValueChange={setSelectedPairId} value={selectedPairId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trading pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {tradingPairs?.map((pair) => (
                      <SelectItem key={pair.id} value={pair.id}>
                        {pair.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Trade Type</label>
                <Select onValueChange={(value) => setTradeType(value as TradeType)} value={tradeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                />
              </div>

              <Button onClick={handleCreateTrade} className="w-full">
                Create Trade
              </Button>
            </div>
          </Card>

          {/* Recent Trades */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
            <div className="space-y-4">
              {trades?.slice(0, 5).map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {trade.trading_pairs.symbol}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          trade.type === "buy" || trade.type === "long"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {trade.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Amount: {trade.amount} • Price: ${trade.price}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Status: {trade.status}
                    </div>
                  </div>
                  {trade.ai_confidence && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">AI Confidence:</span>{" "}
                      <span
                        className={`font-medium ${
                          trade.ai_confidence > 70
                            ? "text-green-400"
                            : trade.ai_confidence > 40
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {trade.ai_confidence}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default Index
