import { KpiCard } from "@/components/dashboard/KpiCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { BarChart } from "@/components/dashboard/BarChart";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { DataTableCard } from "@/components/dashboard/DataTableCard";
import {
  dashboardSummary,
  voucherList,
  budgetHistory,
} from "@/data/dashboard-demo";
import { recentTasks } from "@/data/tasks-demo";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FolderKanban, FileText, CheckSquare } from "lucide-react";

export default function InteriorIndexPage() {
  return (
    <>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-4 w-4" />}
          label="Total Staff"
          value={dashboardSummary.staffCount.toString()}
          helper={dashboardSummary.staffChange}
          accent="indigo"
        />
        <KpiCard
          icon={<FolderKanban className="h-4 w-4" />}
          label="Total Projects"
          value={dashboardSummary.projects.toString()}
          helper={dashboardSummary.projectsChange}
          accent="purple"
        />
        <KpiCard
          icon={<FileText className="h-4 w-4" />}
          label="Total Leads"
          value={dashboardSummary.leads.toString()}
          helper={dashboardSummary.leadsChange}
          accent="orange"
        />
        <KpiCard
          icon={<CheckSquare className="h-4 w-4" />}
          label="Active Tasks"
          value={dashboardSummary.activeTasks.toString()}
          helper={dashboardSummary.tasksChange}
          accent="green"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          title="Task completion"
          subtitle="Distribution of completed vs in-progress tasks across the ERP workflow"
        >
          <DonutChart />
        </ChartCard>
        <ChartCard
          title="Monthly payroll"
          subtitle="Net salary, tax, and loan components by month (BDT lakh)"
        >
          <BarChart />
        </ChartCard>
        <ChartCard
          title="Project revenue"
          subtitle="Consolidated income trend across all interior projects"
        >
          <IncomeChart />
        </ChartCard>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataTableCard
          title="Recent Tasks"
          subtitle="Latest operational actions across CRM, design, BOQ, procurement, and execution"
          headers={["Task", "Project", "Owner", "Status", "Due"]}
        >
          {recentTasks.slice(0, 8).map((task) => (
            <TableRow key={task.id}>
              <TableCell className="max-w-[180px] text-xs font-medium text-neutral-800 dark:text-neutral-100">
                <div className="line-clamp-2">{task.title}</div>
                <div className="text-[11px] text-muted-foreground">
                  {task.id} · {task.department}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-xs">
                {task.project}
              </TableCell>
              <TableCell className="whitespace-nowrap text-xs">
                {task.assignedTo}
              </TableCell>
              <TableCell className="w-[110px]">
                <Badge
                  className={
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "Pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }
                >
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {task.dueDate || "-"}
              </TableCell>
            </TableRow>
          ))}
        </DataTableCard>

        <div className="space-y-6">
          <DataTableCard
            title="Recent Payments"
            subtitle="Latest payment vouchers raised for interior projects"
            headers={["S/N", "Subject", "Date", "Status"]}
          >
            {voucherList.map((voucher) => (
              <TableRow key={voucher.sn}>
                <TableCell className="w-[60px] text-xs font-medium text-neutral-500">
                  {voucher.sn.toString().padStart(2, "0")}
                </TableCell>
                <TableCell className="text-sm">
                  {voucher.subject}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {voucher.date}
                </TableCell>
                <TableCell className="w-[110px]">
                  <Badge
                    className={
                      voucher.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {voucher.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </DataTableCard>

          <DataTableCard
            title="Budget History"
            subtitle="Budget vs actual utilisation across major interior projects"
            headers={[
              "S/N",
              "Budget No",
              "Budget Amount",
              "Actual Amount",
              "Date",
            ]}
          >
            {budgetHistory.map((item) => (
              <TableRow key={item.sn}>
                <TableCell className="w-[60px] text-xs font-medium text-neutral-500">
                  {item.sn.toString().padStart(2, "0")}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {item.budgetNo}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs">
                  ৳ {item.budgetAmount.toLocaleString()}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs">
                  ৳ {item.actualAmount.toLocaleString()}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </DataTableCard>
        </div>
      </section>
    </>
  );
}


