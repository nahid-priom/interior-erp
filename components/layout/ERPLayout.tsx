 "use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface ERPLayoutProps {
  children: ReactNode;
}

export function ERPLayout({ children }: ERPLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      {/* Desktop / large screen sidebar */}
      <div className="hidden md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-neutral-200 md:bg-white md:dark:border-neutral-800 md:dark:bg-neutral-950">
        <Sidebar />
      </div>

      {/* Mobile / tablet sidebar drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-full max-w-xs border-neutral-200 p-0 dark:border-neutral-800"
          onClose={() => setSidebarOpen(false)}
        >
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <DashboardContainer>
        <DashboardHeader onOpenSidebar={() => setSidebarOpen(true)} />
        {children}
      </DashboardContainer>
    </div>
  );
}

