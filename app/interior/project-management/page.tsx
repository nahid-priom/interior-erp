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
import { projects, workflowStages } from "@/lib/demo-data";

type LifecycleStage = "Design" | "Execution" | "Installation" | "Handover";

type ProjectDashboard = {
  code: string;
  name: string;
  client: string;
  lifecycleStage: LifecycleStage;
  workflowStageIndex: number;
  progress: number;
  startDate: string;
  handoverDate: string;
};

const projectDashboards: ProjectDashboard[] = [
  {
    ...projects[0],
    lifecycleStage: "Execution",
    workflowStageIndex: workflowStages.indexOf("Project Execution"),
    progress: 62,
    startDate: "2026-01-15",
    handoverDate: "2026-05-30",
  },
  {
    ...projects[1],
    lifecycleStage: "Design",
    workflowStageIndex: workflowStages.indexOf("Design"),
    progress: 28,
    startDate: "2026-02-10",
    handoverDate: "2026-06-20",
  },
  {
    ...projects[2],
    lifecycleStage: "Installation",
    workflowStageIndex: workflowStages.indexOf("Installation"),
    progress: 78,
    startDate: "2025-12-05",
    handoverDate: "2026-03-25",
  },
  {
    ...projects[3],
    lifecycleStage: "Handover",
    workflowStageIndex: workflowStages.indexOf("Project Handover"),
    progress: 96,
    startDate: "2025-11-01",
    handoverDate: "2026-02-28",
  },
];

export default function ProjectManagementPage() {
  const activeProjects = projectDashboards.filter(
    (p) => p.lifecycleStage !== "Handover",
  ).length;
  const avgProgress =
    projectDashboards.reduce((sum, p) => sum + p.progress, 0) /
    projectDashboards.length;

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Project Management</h1>
          <p className="erp-page-subtitle">
            Monitor interior project execution from design sign-off to installation and handover.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Projects</CardTitle>
            <CardDescription>In execution or installation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {activeProjects}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Progress</CardTitle>
            <CardDescription>Portfolio completion across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-baseline gap-2">
              <div className="text-2xl font-semibold">
                {Math.round(avgProgress)}%
              </div>
            </div>
            <Progress value={avgProgress} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Near Handover</CardTitle>
            <CardDescription>Projects &gt; 80% completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {
                projectDashboards.filter(
                  (p) => p.progress >= 80,
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lifecycle Coverage</CardTitle>
            <CardDescription>Design → Execution → Installation → Handover</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={100} />
            <p className="mt-2 text-xs text-muted-foreground">
              All interior lifecycle stages are represented in the current portfolio.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Project Portfolio</CardTitle>
            <CardDescription>
              Progress and lifecycle stage mapped to the full interior workflow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList>
                <TabsTrigger value="list">Project List</TabsTrigger>
                <TabsTrigger value="timeline">Lifecycle Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Lifecycle</TableHead>
                      <TableHead>Workflow Stage</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>Target Handover</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectDashboards.map((project) => (
                      <TableRow key={project.code}>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {project.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {project.code} · {project.client}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {project.lifecycleStage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {workflowStages[project.workflowStageIndex]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {project.progress}%
                            </span>
                            <Progress
                              value={project.progress}
                              className="w-24"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{project.startDate}</TableCell>
                        <TableCell>{project.handoverDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="timeline" className="mt-3 border-0 p-0">
                <div className="space-y-4 text-xs">
                  {projectDashboards.map((project) => (
                    <div
                      key={project.code}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">
                            {project.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {project.code} · {project.client}
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {project.lifecycleStage}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <Progress value={project.progress} />
                        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                          <span>{project.startDate}</span>
                          <span>{project.handoverDate}</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px]">
                        <span>Interior Workflow Position</span>
                        <span>
                          Step {project.workflowStageIndex + 1} of{" "}
                          {workflowStages.length}:{" "}
                          {workflowStages[project.workflowStageIndex]}
                        </span>
                      </div>
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
              <CardTitle>Key Milestones</CardTitle>
              <CardDescription>
                Upcoming deadlines across execution, installation, and handover.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    Gulshan Showroom Renovation
                  </span>
                  <Badge variant="warning">Installation</Badge>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Complete lighting &amp; glass installation and move to final
                  snag list before billing and handover.
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    Uttara Restaurant Interior
                  </span>
                  <Badge variant="success">Handover</Badge>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Schedule client walkthrough, resolve pending snags, and issue
                  final invoice.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lifecycle Snapshot</CardTitle>
              <CardDescription>
                Distribution across Design, Execution, Installation, Handover.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {(["Design", "Execution", "Installation", "Handover"] as LifecycleStage[]).map(
                (stage) => {
                  const count = projectDashboards.filter(
                    (p) => p.lifecycleStage === stage,
                  ).length;
                  const percentage = Math.round(
                    (count / projectDashboards.length) * 100,
                  );
                  return (
                    <div key={stage}>
                      <div className="mb-1 flex items-center justify-between">
                        <span>{stage}</span>
                        <span className="text-muted-foreground">
                          {count} · {percentage}%
                        </span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  );
                },
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

