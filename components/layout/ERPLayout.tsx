"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardContainer } from "@/components/layout/DashboardContainer";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

interface ERPLayoutProps {
  children: ReactNode;
}

export function ERPLayout({ children }: ERPLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <Sidebar />
      <DashboardContainer>
        <DashboardHeader />
        {children}
      </DashboardContainer>
    </div>
  );
}

