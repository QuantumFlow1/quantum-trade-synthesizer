
import { SubscriptionTiers } from "@/components/subscription/SubscriptionTiers";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
        <SubscriptionTiers />
      </div>
    </DashboardLayout>
  );
}
