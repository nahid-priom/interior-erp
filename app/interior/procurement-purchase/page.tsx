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
import { projects, vendors, materials } from "@/lib/demo-data";

type DeliveryStatus = "Pending" | "Partially Received" | "Delivered";

type PurchaseOrder = {
  poNo: string;
  vendor: string;
  projectCode: string;
  projectName: string;
  material: string;
  amount: number;
  status: DeliveryStatus;
  eta: string;
};

const basePurchaseOrders: PurchaseOrder[] = [
  {
    poNo: "PO-2401-01",
    vendor: vendors[0],
    projectCode: "INT-2401",
    projectName: projects[0].name,
    material: materials[0],
    amount: 920000,
    status: "Partially Received",
    eta: "2026-03-15",
  },
  {
    poNo: "PO-2401-02",
    vendor: vendors[1],
    projectCode: "INT-2401",
    projectName: projects[0].name,
    material: materials[3],
    amount: 260000,
    status: "Pending",
    eta: "2026-03-18",
  },
  {
    poNo: "PO-2402-01",
    vendor: vendors[3],
    projectCode: "INT-2402",
    projectName: projects[1].name,
    material: materials[6],
    amount: 180000,
    status: "Delivered",
    eta: "2026-03-10",
  },
  {
    poNo: "PO-2403-01",
    vendor: vendors[4],
    projectCode: "INT-2403",
    projectName: projects[2].name,
    material: materials[7],
    amount: 340000,
    status: "Delivered",
    eta: "2026-03-11",
  },
];

const generatedPurchaseOrders: PurchaseOrder[] = Array.from({
  length: 26,
}).map((_, index) => {
  const seq = index + 2;
  const projectIndex = (index + 1) % projects.length;
  const materialIndex = (index + 2) % materials.length;
  const vendorIndex = (index + 3) % vendors.length;

  const statusPool: DeliveryStatus[] = [
    "Pending",
    "Partially Received",
    "Delivered",
  ];
  const status = statusPool[seq % statusPool.length];

  const project = projects[projectIndex];

  return {
    poNo: `PO-${project.code}-${seq.toString().padStart(2, "0")}`,
    vendor: vendors[vendorIndex],
    projectCode: project.code,
    projectName: project.name,
    material: materials[materialIndex],
    amount: 120000 + seq * 45000,
    status,
    eta: `2026-03-${(10 + (seq % 20)).toString().padStart(2, "0")}`,
  };
});

const purchaseOrders: PurchaseOrder[] = [
  ...basePurchaseOrders,
  ...generatedPurchaseOrders,
];

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function ProcurementPurchasePage() {
  const totalPO = purchaseOrders.length;
  const delivered = purchaseOrders.filter(
    (po) => po.status === "Delivered",
  ).length;
  const pendingAmount = purchaseOrders
    .filter((po) => po.status !== "Delivered")
    .reduce((sum, po) => sum + po.amount, 0);

  const fulfilmentRate =
    totalPO === 0 ? 0 : Math.round((delivered / totalPO) * 100);

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Procurement &amp; Purchase</h1>
          <p className="erp-page-subtitle">
            Manage purchase requisitions, POs, vendor performance, and material delivery for projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Open POs</CardTitle>
            <CardDescription>Purchase orders across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {totalPO}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Fulfilment</CardTitle>
            <CardDescription>Delivered vs total POs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-baseline gap-2">
              <div className="text-2xl font-semibold">
                {fulfilmentRate}%
              </div>
              <Badge variant={fulfilmentRate >= 70 ? "success" : "warning"}>
                On-time Deliveries
              </Badge>
            </div>
            <Progress value={fulfilmentRate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Value</CardTitle>
            <CardDescription>Goods yet to be received (BDT)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {currencyFormatter.format(pendingAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Vendors</CardTitle>
            <CardDescription>Top interior procurement partners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            {vendors.slice(0, 3).map((vendor) => (
              <div key={vendor}>{vendor}</div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>
              Project-wise procurement status and delivery tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="po">
              <TabsList>
                <TabsTrigger value="po">PO Register</TabsTrigger>
                <TabsTrigger value="vendor">Vendor View</TabsTrigger>
              </TabsList>

              <TabsContent value="po" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Delivery Status</TableHead>
                      <TableHead>ETA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.poNo}>
                        <TableCell className="font-medium">
                          {po.poNo}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {po.projectName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {po.projectCode}
                          </div>
                        </TableCell>
                        <TableCell>{po.vendor}</TableCell>
                        <TableCell>{po.material}</TableCell>
                        <TableCell>
                          {currencyFormatter.format(po.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              po.status === "Delivered"
                                ? "success"
                                : po.status === "Partially Received"
                                ? "warning"
                                : "secondary"
                            }
                          >
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{po.eta}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="vendor" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>PO Count</TableHead>
                      <TableHead>Delivered</TableHead>
                      <TableHead>In Transit</TableHead>
                      <TableHead>Value (BDT)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.slice(0, 5).map((vendor) => {
                      const vendorPOs = purchaseOrders.filter(
                        (po) => po.vendor === vendor,
                      );
                      const deliveredCount = vendorPOs.filter(
                        (po) => po.status === "Delivered",
                      ).length;
                      const inTransit = vendorPOs.filter(
                        (po) => po.status !== "Delivered",
                      ).length;
                      const value = vendorPOs.reduce(
                        (sum, po) => sum + po.amount,
                        0,
                      );
                      return (
                        <TableRow key={vendor}>
                          <TableCell className="font-medium">
                            {vendor}
                          </TableCell>
                          <TableCell>{vendorPOs.length}</TableCell>
                          <TableCell>{deliveredCount}</TableCell>
                          <TableCell>{inTransit}</TableCell>
                          <TableCell>
                            {currencyFormatter.format(value)}
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
              <CardTitle>Material Procurement Workflow</CardTitle>
              <CardDescription>
                Link between BOQ approval and site delivery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>BOQ / Estimate → PO Raised</span>
                  <span className="text-muted-foreground">INT-2401</span>
                </div>
                <Progress value={80} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Material Procurement → Site Transit</span>
                  <span className="text-muted-foreground">INT-2403</span>
                </div>
                <Progress value={55} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Installation → Billing</span>
                  <span className="text-muted-foreground">INT-2402</span>
                </div>
                <Progress value={30} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Critical Deliveries</CardTitle>
              <CardDescription>
                Items impacting site execution this week.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {purchaseOrders
                .filter((po) => po.status !== "Delivered")
                .map((po) => (
                  <div
                    key={po.poNo}
                    className="rounded-lg bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {po.poNo} · {po.material}
                      </span>
                      <Badge variant="warning">ETA {po.eta}</Badge>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {po.projectCode} · {po.projectName}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Vendor: {po.vendor} ·{" "}
                      {currencyFormatter.format(po.amount)}
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

