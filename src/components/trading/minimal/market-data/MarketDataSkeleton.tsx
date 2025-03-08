
import { Skeleton } from "@/components/ui/skeleton";

export const MarketDataSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </>
  );
};
