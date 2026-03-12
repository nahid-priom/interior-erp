import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects, clients, workflowStages } from "@/lib/demo-data";

const clientProject = {
  code: "INT-2401",
  name: projects[0].name,
  client: clients[2],
  currentWorkflowStage: "Project Execution",
  overallProgress: 64,
};

const clientMilestones = [
  {
    label: "Design Approval",
    stage: "Client Approval",
    completed: true,
    date: "2026-02-18",
  },
  {
    label: "Material Procurement",
    stage: "Material Procurement",
    completed: true,
    date: "2026-03-05",
  },
  {
    label: "Site Installation",
    stage: "Installation",
    completed: false,
    date: "2026-04-10 (target)",
  },
  {
    label: "Final Billing & Handover",
    stage: "Project Handover",
    completed: false,
    date: "2026-05-30 (target)",
  },
];

const clientPayments = [
  {
    invoiceNo: "INV-2401",
    date: "2026-02-20",
    description: "Advance payment 35%",
    amount: 1470000,
    status: "Paid",
  },
  {
    invoiceNo: "INV-2401B",
    date: "2026-03-25 (planned)",
    description: "Progress billing 40%",
    amount: 1680000,
    status: "Upcoming",
  },
  {
    invoiceNo: "INV-2401C",
    date: "2026-05-30 (planned)",
    description: "Final billing & retention",
    amount: 1050000,
    status: "Upcoming",
  },
];

const clientUpdates = [
  {
    date: "2026-03-11",
    title: "Workstations partition framing completed on Level 06",
    detail:
      "Carpentry team has completed framing. Electrical conduit routing will begin from 14 March.",
  },
  {
    date: "2026-03-08",
    title: "Reception 3D concept approved",
    detail:
      "Final 3D view of reception counter confirmed. Laminate and lighting specs frozen for procurement.",
  },
  {
    date: "2026-03-02",
    title: "BOQ & quotation confirmed",
    detail:
      "Total project value confirmed at BDT 4.2M including furniture, lighting, and branding.",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function ClientPortalPage() {
  const stageIndex = workflowStages.indexOf(
    clientProject.currentWorkflowStage as any,
  );
  const workflowCompletion =
    stageIndex === -1
      ? 0
      : Math.round(((stageIndex + 1) / workflowStages.length) * 100);

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Client Project Portal</h1>
          <p className="erp-page-subtitle">
            A clean overview of your interior project progress, approvals, and payments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <Card className="border-0 bg-white/70 shadow-sm">
          <CardHeader>
            <CardTitle>{clientProject.name}</CardTitle>
            <CardDescription>
              Project code {clientProject.code} for {clientProject.client}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Overall Progress
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {clientProject.overallProgress}%
                </div>
                <Progress value={clientProject.overallProgress} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Current Stage
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                  <Badge variant="secondary">
                    {clientProject.currentWorkflowStage}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Step {stageIndex + 1} of {workflowStages.length} in your
                  interior project workflow.
                </p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Workflow Completion
                </div>
                <div className="mt-1 text-2xl font-semibold">
                  {workflowCompletion}%
                </div>
                <Progress value={workflowCompletion} />
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                Your Interior Workflow Journey
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {workflowStages.map((stage, index) => {
                  const completed = index <= stageIndex;
                  return (
                    <div
                      key={stage}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                        completed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      <span className="text-[10px] font-semibold">
                        {index + 1}
                      </span>
                      <span>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/70 shadow-sm">
          <CardHeader>
            <CardTitle>At a Glance</CardTitle>
            <CardDescription>
              Quick summary of where your project stands.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Design Approvals
                </div>
                <div className="mt-0.5 text-sm font-medium">
                  All key areas approved
                </div>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Material Procurement
                </div>
                <div className="mt-0.5 text-sm font-medium">
                  Major items ordered
                </div>
              </div>
              <Badge variant="secondary">On Track</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Site Readiness
                </div>
                <div className="mt-0.5 text-sm font-medium">
                  Workstations &amp; partitions in progress
                </div>
              </div>
              <Badge variant="warning">In Progress</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)]">
        <Card className="border-0 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle>Your Project Details</CardTitle>
            <CardDescription>
              Milestones, approvals, and site updates for your project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="milestones">
              <TabsList>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="updates">Project Updates</TabsTrigger>
              </TabsList>

              <TabsContent value="milestones" className="mt-4 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Workflow Stage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientMilestones.map((m) => (
                      <TableRow key={m.label}>
                        <TableCell className="font-medium">
                          {m.label}
                        </TableCell>
                        <TableCell>{m.stage}</TableCell>
                        <TableCell>
                          <Badge
                            variant={m.completed ? "success" : "secondary"}
                          >
                            {m.completed ? "Completed" : "Upcoming"}
                          </Badge>
                        </TableCell>
                        <TableCell>{m.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="updates" className="mt-4 border-0 p-0">
                <div className="space-y-3 text-xs">
                  {clientUpdates.map((u) => (
                    <div
                      key={u.title}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          {u.date}
                        </span>
                        <Badge variant="outline">Site Update</Badge>
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {u.title}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {u.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 shadow-sm">
          <CardHeader>
            <CardTitle>Payments &amp; Statements</CardTitle>
            <CardDescription>
              View what has been paid and upcoming instalments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientPayments.map((p) => (
                  <TableRow key={p.invoiceNo}>
                    <TableCell className="font-medium">
                      {p.invoiceNo}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium">
                        {p.description}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {p.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      {currencyFormatter.format(p.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.status === "Paid" ? "success" : "secondary"
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="rounded-lg bg-slate-50 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium">Project Financial Summary</span>
              </div>
              <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Total Project Value</span>
                  <span>{currencyFormatter.format(4200000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Paid Till Date</span>
                  <span>{currencyFormatter.format(1470000)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Balance (Incl. upcoming instalments)</span>
                  <span>{currencyFormatter.format(2730000)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

