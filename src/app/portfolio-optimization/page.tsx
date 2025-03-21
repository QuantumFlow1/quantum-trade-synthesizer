
import { QuantumPortfolioOptimizer } from "@/components/portfolio/QuantumPortfolioOptimizer";
import { Card } from "@/components/ui/card";

export default function PortfolioOptimizationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quantum Portfolio Optimization</h1>
      
      <div className="mb-6">
        <Card className="p-4 bg-primary/5">
          <h2 className="text-xl font-semibold mb-2">QUBO Formulation for Portfolio Optimization</h2>
          <p className="mb-4">
            This page implements portfolio optimization using a Quantum-Inspired approach 
            based on Quadratic Unconstrained Binary Optimization (QUBO).
          </p>
          <pre className="p-4 bg-muted rounded-md overflow-x-auto">
            f(x) = -θ₁∑ᵢxᵢrᵢ + θ₂(∑ᵢxᵢpᵢ - b)² + θ₃∑ᵢ,ⱼxᵢcov(pᵢ,pⱼ)xⱼ
          </pre>
          <p className="mt-4">Where:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>xᵢ ∈ {'{0,1}'} are binary variables (1 = buy, 0 = don't buy)</li>
            <li>rᵢ = expected return of asset i</li>
            <li>pᵢ = price of asset i</li>
            <li>b = budget constraint</li>
            <li>θ₁, θ₂, θ₃ = weights for returns, budget, and diversification</li>
          </ul>
        </Card>
      </div>
      
      <QuantumPortfolioOptimizer />
    </div>
  );
}
