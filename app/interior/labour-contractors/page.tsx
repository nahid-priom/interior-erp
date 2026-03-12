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
import { contractors, projects } from "@/lib/demo-data";

type WorkType = "Carpentry" | "Electrical" | "Painting" | "Glass" | "Ceiling";

type LabourTeam = {
  name: string;
  workType: WorkType;
  assignedProject: string;
  projectCode: string;
  attendance: number;
  billingThisMonth: number;
};

const labourTeams: LabourTeam[] = [
  {
    name: contractors[0].name,
    workType: "Carpentry",
    assignedProject: projects[0].name,
    projectCode: "INT-2401",
    attendance: 96,
    billingThisMonth: 420000,
  },
  {
    name: contractors[1].name,
    workType: "Electrical",
    assignedProject: projects[2].name,
    projectCode: "INT-2403",
    attendance: 92,
    billingThisMonth: 260000,
  },
  {
    name: contractors[2].name,
    workType: "Painting",
    assignedProject: projects[3].name,
    projectCode: "INT-2404",
    attendance: 88,
    billingThisMonth: 185000,
  },
  {
    name: contractors[3].name,
    workType: "Glass",
    assignedProject: projects[2].name,
    projectCode: "INT-2403",
    attendance: 90,
    billingThisMonth: 210000,
  },
  {
    name: contractors[4].name,
    workType: "Ceiling",
    assignedProject: projects[0].name,
    projectCode: "INT-2401",
    attendance: 94,
    billingThisMonth: 320000,
  },
];

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function LabourContractorsPage() {
  const totalTeams = labourTeams.length;
  const monthlyBilling = labourTeams.reduce(
    (sum, team) => sum + team.billingThisMonth,
    0,
  );
  const avgAttendance =
    labourTeams.reduce((sum, team) => sum + team.attendance, 0) /
    labourTeams.length;

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Labour &amp; Contractors</h1>
          <p className="erp-page-subtitle">
            Track specialist teams, attendance, and on-site billing across interior projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Teams</CardTitle>
            <CardDescription>Contractor teams on live projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {totalTeams}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Attendance</CardTitle>
            <CardDescription>Last 30 days across teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-semibold">
              {Math.round(avgAttendance)}%
            </div>
            <Progress value={avgAttendance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Billing</CardTitle>
            <CardDescription>Contractor invoices (BDT)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {currencyFormatter.format(monthlyBilling)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Work Types</CardTitle>
            <CardDescription>Specialised interior trades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            <div>Carpentry · Electrical · Painting · Glass · Ceiling</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Labour Deployment</CardTitle>
            <CardDescription>
              Team-wise deployment across projects with attendance and billing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="teams">
              <TabsList>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="projects">By Project</TabsTrigger>
              </TabsList>

              <TabsContent value="teams" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Work Type</TableHead>
                      <TableHead>Assigned Project</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Billing (BDT)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labourTeams.map((team) => (
                      <TableRow key={team.name}>
                        <TableCell className="font-medium">
                          {team.name}
                        </TableCell>
                        <TableCell>{team.workType}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {team.assignedProject}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {team.projectCode}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {team.attendance}%
                            </span>
                            <Progress
                              value={team.attendance}
                              className="w-20"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {currencyFormatter.format(team.billingThisMonth)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="projects" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Teams</TableHead>
                      <TableHead>Work Types</TableHead>
                      <TableHead>Billing (BDT)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.slice(0, 4).map((project) => {
                      const teams = labourTeams.filter(
                        (t) => t.assignedProject === project.name,
                      );
                      if (!teams.length) return null;
                      const billing = teams.reduce(
                        (sum, t) => sum + t.billingThisMonth,
                        0,
                      );
                      const workTypes = Array.from(
                        new Set(teams.map((t) => t.workType)),
                      ).join(", ");
                      return (
                        <TableRow key={project.code}>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {project.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {project.code}
                            </div>
                          </TableCell>
                          <TableCell>{teams.length}</TableCell>
                          <TableCell>{workTypes}</TableCell>
                          <TableCell>
                            {currencyFormatter.format(billing)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interior Workflow Link</CardTitle>
              <CardDescription>
                Labour demand peaks along Project Execution and Installation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Project Execution</span>
                  <span className="text-muted-foreground">
                    Carpentry &amp; Electrical
                  </span>
                </div>
                <Progress value={70} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Installation</span>
                  <span className="text-muted-foreground">
                    Glass &amp; Ceiling
                  </span>
                </div>
                <Progress value={80} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Billing &amp; Handover</span>
                  <span className="text-muted-foreground">
                    Snag rectification
                  </span>
                </div>
                <Progress value={40} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Alerts</CardTitle>
              <CardDescription>
                Teams with attendance below 90% this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {labourTeams
                .filter((team) => team.attendance < 90)
                .map((team) => (
                  <div
                    key={team.name}
                    className="rounded-lg bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{team.name}</span>
                      <Badge variant="warning">
                        {team.attendance}% attendance
                      </Badge>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {team.workType} · {team.projectCode} ·{" "}
                      {team.assignedProject}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

