
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
        <SubscriptionTiers />
      </div>
    </DashboardLayout>
  );
}
