import { Suspense } from "react";
import { OrdersTable } from "@/features/orders/orders-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Orders</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Manage and track all delivery orders.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <OrdersTable />
      </Suspense>
    </div>
  );
}
