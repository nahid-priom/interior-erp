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
import { employees } from "@/lib/demo-data";

type Department =
  | "Design"
  | "Projects"
  | "Procurement"
  | "Accounts"
  | "HR"
  | "Workshop"
  | "CRM";

type EmployeeRecord = {
  name: string;
  role: string;
  department: Department;
  attendance: number;
  leaveDays: number;
  grossSalary: number;
};

const employeeRecords: EmployeeRecord[] = employees.map((e, index) => ({
  name: e.name,
  role: e.role,
  department: e.department as Department,
  attendance: 92 - index * 2,
  leaveDays: index,
  grossSalary: 55000 + index * 8000,
}));

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function HrPayrollPage() {
  const totalEmployees = employeeRecords.length;
  const totalPayroll = employeeRecords.reduce(
    (sum, e) => sum + e.grossSalary,
    0,
  );
  const avgAttendance =
    employeeRecords.reduce((sum, e) => sum + e.attendance, 0) /
    employeeRecords.length;

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">HR &amp; Payroll</h1>
          <p className="erp-page-subtitle">
            Monitor employees, attendance, leave, and payroll impact across departments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Core interior ERP team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {totalEmployees}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payroll</CardTitle>
            <CardDescription>Gross salary outflow (BDT)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {currencyFormatter.format(totalPayroll)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Attendance</CardTitle>
            <CardDescription>Last 30 days across staff</CardDescription>
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
            <CardTitle>Departments</CardTitle>
            <CardDescription>Key interior functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            <div>Design · Projects · Procurement · Accounts · HR · Workshop · CRM</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Employee Register</CardTitle>
            <CardDescription>
              Design, project, and support teams with attendance and payroll.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="employees">
              <TabsList>
                <TabsTrigger value="employees">Employees</TabsTrigger>
                <TabsTrigger value="departments">By Department</TabsTrigger>
              </TabsList>

              <TabsContent value="employees" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Leave</TableHead>
                      <TableHead>Gross Salary</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeRecords.map((emp) => (
                      <TableRow key={emp.name}>
                        <TableCell className="font-medium">
                          {emp.name}
                        </TableCell>
                        <TableCell>{emp.role}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {emp.attendance}%
                            </span>
                            <Progress
                              value={emp.attendance}
                              className="w-20"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              emp.leaveDays > 3 ? "warning" : "secondary"
                            }
                          >
                            {emp.leaveDays} days
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {currencyFormatter.format(emp.grossSalary)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="departments" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Headcount</TableHead>
                      <TableHead>Avg. Attendance</TableHead>
                      <TableHead>Payroll (BDT)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      "Design",
                      "Projects",
                      "Procurement",
                      "Accounts",
                      "HR",
                      "Workshop",
                      "CRM",
                    ].map((dept) => {
                      const team = employeeRecords.filter(
                        (e) => e.department === dept,
                      );
                      if (!team.length) return null;
                      const deptAttendance =
                        team.reduce((sum, e) => sum + e.attendance, 0) /
                        team.length;
                      const deptPayroll = team.reduce(
                        (sum, e) => sum + e.grossSalary,
                        0,
                      );
                      return (
                        <TableRow key={dept}>
                          <TableCell className="font-medium">
                            {dept}
                          </TableCell>
                          <TableCell>{team.length}</TableCell>
                          <TableCell>
                            {Math.round(deptAttendance)}%
                          </TableCell>
                          <TableCell>
                            {currencyFormatter.format(deptPayroll)}
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
              <CardTitle>Attendance Heatmap</CardTitle>
              <CardDescription>
                Higher load during Project Execution and Installation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Design Phase</span>
                  <span className="text-muted-foreground">
                    Designers &amp; CRM
                  </span>
                </div>
                <Progress value={60} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Project Execution</span>
                  <span className="text-muted-foreground">
                    Site &amp; Procurement
                  </span>
                </div>
                <Progress value={80} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Billing &amp; Handover</span>
                  <span className="text-muted-foreground">
                    Accounts &amp; Projects
                  </span>
                </div>
                <Progress value={50} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave Insights</CardTitle>
              <CardDescription>
                Staff with higher leave utilisation this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {employeeRecords
                .filter((e) => e.leaveDays >= 2)
                .map((e) => (
                  <div
                    key={e.name}
                    className="rounded-lg bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{e.name}</span>
                      <Badge variant="warning">
                        {e.leaveDays} days leave
                      </Badge>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {e.department} · {e.role}
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

