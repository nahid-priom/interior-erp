"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileSpreadsheet,
  Briefcase,
  CheckSquare,
  ShoppingCart,
  Boxes,
  Factory,
  Users2,
  Banknote,
  BadgeDollarSign,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/interior", icon: LayoutDashboard },
  { label: "CRM / Leads", href: "/interior/leads-crm", icon: Users },
  { label: "Design Projects", href: "/interior/design-concept", icon: FolderKanban },
  { label: "BOQ & Estimation", href: "/interior/boq-estimation", icon: FileSpreadsheet },
  { label: "Project Management", href: "/interior/project-management", icon: Briefcase },
  { label: "Task Management", href: "/interior/task-management", icon: CheckSquare },
  { label: "Procurement", href: "/interior/procurement-purchase", icon: ShoppingCart },
  { label: "Inventory", href: "/interior/inventory-warehouse", icon: Boxes },
  { label: "Production", href: "/interior/production-workshop", icon: Factory },
  { label: "Labour & Contractors", href: "/interior/labour-contractors", icon: Users2 },
  { label: "Finance", href: "/interior/finance-accounting", icon: Banknote },
  { label: "HR & Payroll", href: "/interior/hr-payroll", icon: BadgeDollarSign },
  { label: "Client Portal", href: "/interior/client-portal", icon: ExternalLink },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white px-4 py-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-sm">
          IE
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Interior ERP
          </div>
          <div className="text-xs text-neutral-500">
            Interior Design Management System
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 text-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/interior" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50",
                isActive &&
                  "bg-indigo-50 text-indigo-600 shadow-sm hover:bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

