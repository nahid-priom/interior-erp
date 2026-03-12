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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/lib/demo-data";

type ProductionStage =
  | "Cutting"
  | "Assembly"
  | "Lamination"
  | "Polish"
  | "QC"
  | "Ready for installation";

type WorkOrder = {
  woNo: string;
  projectCode: string;
  projectName: string;
  itemGroup: string;
  stage: ProductionStage;
  progress: number;
  dueDate: string;
};

const workOrders: WorkOrder[] = [
  {
    woNo: "WO-2401-01",
    projectCode: "INT-2401",
    projectName: projects[0].name,
    itemGroup: "Workstation Partitions",
    stage: "Lamination",
    progress: 55,
    dueDate: "2026-03-20",
  },
  {
    woNo: "WO-2401-02",
    projectCode: "INT-2401",
    projectName: projects[0].name,
    itemGroup: "Reception Counter",
    stage: "Polish",
    progress: 80,
    dueDate: "2026-03-18",
  },
  {
    woNo: "WO-2403-01",
    projectCode: "INT-2403",
    projectName: projects[2].name,
    itemGroup: "Cash Counter",
    stage: "Assembly",
    progress: 40,
    dueDate: "2026-03-22",
  },
  {
    woNo: "WO-2404-01",
    projectCode: "INT-2404",
    projectName: projects[3].name,
    itemGroup: "Dining Booth Seating",
    stage: "Cutting",
    progress: 15,
    dueDate: "2026-03-28",
  },
];

export default function ProductionWorkshopPage() {
  const activeWO = workOrders.length;
  const readyForInstall = workOrders.filter(
    (wo) => wo.stage === "Ready for installation",
  ).length;
  const avgProgress =
    workOrders.reduce((sum, wo) => sum + wo.progress, 0) / workOrders.length;

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Production &amp; Workshop</h1>
          <p className="erp-page-subtitle">
            Manage work orders, cutting lists, and production stages in the workshop.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Work Orders</CardTitle>
            <CardDescription>Items in workshop pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {activeWO}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Production Progress</CardTitle>
            <CardDescription>Across all open work orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-semibold">
              {Math.round(avgProgress)}%
            </div>
            <Progress value={avgProgress} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ready for Installation</CardTitle>
            <CardDescription>Work orders at final stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {readyForInstall}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workshop Focus</CardTitle>
            <CardDescription>Current dominant stage</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Lamination &amp; Polish</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Work Order Board</CardTitle>
            <CardDescription>
              Production pipeline from cutting to ready for installation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">Work Orders</TabsTrigger>
                <TabsTrigger value="stages">By Stage</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>WO Number</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Item Group</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.map((wo) => (
                      <TableRow key={wo.woNo}>
                        <TableCell className="font-medium">
                          {wo.woNo}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {wo.projectName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {wo.projectCode}
                          </div>
                        </TableCell>
                        <TableCell>{wo.itemGroup}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{wo.stage}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {wo.progress}%
                            </span>
                            <Progress value={wo.progress} className="w-20" />
                          </div>
                        </TableCell>
                        <TableCell>{wo.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="stages" className="mt-3 border-0 p-0">
                <div className="grid gap-4 md:grid-cols-3 text-xs">
                  {[
                    "Cutting",
                    "Assembly",
                    "Lamination",
                    "Polish",
                    "QC",
                    "Ready for installation",
                  ].map((stage) => (
                    <div
                      key={stage}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{stage}</span>
                        <Badge variant="outline">
                          {
                            workOrders.filter((wo) => wo.stage === stage)
                              .length
                          }{" "}
                          WO
                        </Badge>
                      </div>
                      {workOrders
                        .filter((wo) => wo.stage === stage)
                        .map((wo) => (
                          <div
                            key={wo.woNo}
                            className="mt-2 rounded-md bg-white p-2 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">
                                {wo.woNo}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {wo.progress}%
                              </span>
                            </div>
                            <div className="mt-1 text-[11px] text-muted-foreground">
                              {wo.itemGroup}
                            </div>
                          </div>
                        ))}
                      {workOrders.filter((wo) => wo.stage === stage).length ===
                        0 && (
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          No current work orders at this stage.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cutting List Snapshot</CardTitle>
              <CardDescription>
                Panels and components queued for cutting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">MDF &amp; Plywood Panels</span>
                  <Badge variant="secondary">INT-2404</Badge>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  54 boards to be optimised for dining booths and wall
                  paneling.
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Laminate Countertops</span>
                  <Badge variant="secondary">INT-2403</Badge>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  16 running feet for cash counter and back display.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Workflow Alignment</CardTitle>
              <CardDescription>
                Workshop stages mapped to interior project lifecycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Design → BOQ / Estimate</span>
                  <span className="text-muted-foreground">
                    Drives cutting lists
                  </span>
                </div>
                <Progress value={40} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Project Execution → Material Procurement</span>
                  <span className="text-muted-foreground">
                    Feeds workshop production
                  </span>
                </div>
                <Progress value={60} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Ready for installation → Site Execution</span>
                  <span className="text-muted-foreground">
                    Links to labour teams
                  </span>
                </div>
                <Progress value={80} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

