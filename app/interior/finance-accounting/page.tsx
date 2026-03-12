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
import { projects, clients, vendors } from "@/lib/demo-data";

type Invoice = {
  invoiceNo: string;
  projectCode: string;
  projectName: string;
  client: string;
  amount: number;
  paid: number;
};

type Payable = {
  refNo: string;
  vendor: string;
  amount: number;
  dueDate: string;
};

const invoices: Invoice[] = [
  {
    invoiceNo: "INV-2401",
    projectCode: "INT-2401",
    projectName: projects[0].name,
    client: clients[2],
    amount: 4200000,
    paid: 2800000,
  },
  {
    invoiceNo: "INV-2402",
    projectCode: "INT-2402",
    projectName: projects[1].name,
    client: clients[0],
    amount: 1850000,
    paid: 950000,
  },
  {
    invoiceNo: "INV-2403",
    projectCode: "INT-2403",
    projectName: projects[2].name,
    client: clients[3],
    amount: 3600000,
    paid: 3600000,
  },
];

const payables: Payable[] = [
  {
    refNo: "PV-2402",
    vendor: vendors[0],
    amount: 680000,
    dueDate: "2026-03-18",
  },
  {
    refNo: "PV-2403",
    vendor: vendors[1],
    amount: 320000,
    dueDate: "2026-03-20",
  },
  {
    refNo: "PV-2404",
    vendor: vendors[3],
    amount: 140000,
    dueDate: "2026-03-21",
  },
];

const expenseCategories = [
  { name: "Materials", value: 4200000 },
  { name: "Labour", value: 1850000 },
  { name: "Site Overheads", value: 620000 },
  { name: "Design & Coordination", value: 380000 },
];

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function FinanceAccountingPage() {
  const totalReceivable = invoices.reduce(
    (sum, inv) => sum + (inv.amount - inv.paid),
    0,
  );
  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + inv.amount,
    0,
  );
  const receiptRate =
    totalInvoiced === 0
      ? 0
      : Math.round(
          ((totalInvoiced - totalReceivable) / totalInvoiced) * 100,
        );
  const totalPayables = payables.reduce(
    (sum, p) => sum + p.amount,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Finance &amp; Accounting</h1>
          <p className="erp-page-subtitle">
            Track project invoices, receivables, vendor payables, and expense distribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Receivables</CardTitle>
            <CardDescription>Outstanding from clients (BDT)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {currencyFormatter.format(totalReceivable)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vendor Payables</CardTitle>
            <CardDescription>Due this month (BDT)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {currencyFormatter.format(totalPayables)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Collection Rate</CardTitle>
            <CardDescription>Invoiced vs realised receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-semibold">
              {receiptRate}%
            </div>
            <Progress value={receiptRate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Projects with active billing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {invoices.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Register</CardTitle>
            <CardDescription>
              Client billing aligned with interior project progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="invoices">
              <TabsList>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payables">Vendor Payables</TabsTrigger>
              </TabsList>

              <TabsContent value="invoices" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => {
                      const due = inv.amount - inv.paid;
                      const paidPct = Math.round(
                        (inv.paid / inv.amount) * 100,
                      );
                      return (
                        <TableRow key={inv.invoiceNo}>
                          <TableCell className="font-medium">
                            {inv.invoiceNo}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {inv.projectName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {inv.projectCode}
                            </div>
                          </TableCell>
                          <TableCell>{inv.client}</TableCell>
                          <TableCell>
                            {currencyFormatter.format(inv.amount)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>
                                {currencyFormatter.format(inv.paid)}
                              </span>
                              <Progress
                                value={paidPct}
                                className="w-16"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={due === 0 ? "success" : "warning"}
                            >
                              {currencyFormatter.format(due)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="payables" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ref No</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payables.map((p) => (
                      <TableRow key={p.refNo}>
                        <TableCell className="font-medium">
                          {p.refNo}
                        </TableCell>
                        <TableCell>{p.vendor}</TableCell>
                        <TableCell>
                          {currencyFormatter.format(p.amount)}
                        </TableCell>
                        <TableCell>{p.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>
                Cost allocation for interior projects this quarter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {expenseCategories.map((cat) => {
                const percentage = Math.round(
                  (cat.value /
                    expenseCategories.reduce(
                      (sum, c) => sum + c.value,
                      0,
                    )) *
                    100,
                );
                return (
                  <div key={cat.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span>{cat.name}</span>
                      <span className="text-muted-foreground">
                        {currencyFormatter.format(cat.value)} · {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Along Workflow</CardTitle>
              <CardDescription>
                Billing milestones for interior project lifecycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Quotation → Client Approval</span>
                  <span className="text-muted-foreground">
                    Advance 30-40%
                  </span>
                </div>
                <Progress value={35} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Project Execution → Installation</span>
                  <span className="text-muted-foreground">
                    Progressive billing
                  </span>
                </div>
                <Progress value={50} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Billing → Project Handover</span>
                  <span className="text-muted-foreground">
                    Retention &amp; final
                  </span>
                </div>
                <Progress value={15} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

