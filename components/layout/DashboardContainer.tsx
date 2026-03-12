import type { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950">
      <div className="erp-container space-y-6">{children}</div>
    </main>
  );
}

