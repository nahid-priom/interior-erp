"use client";

import type { ReactNode } from "react";
import { ERPLayout } from "@/components/layout/ERPLayout";

export default function InteriorLayout({ children }: { children: ReactNode }) {
  return <ERPLayout>{children}</ERPLayout>;
}

