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
import { warehouses, materials } from "@/lib/demo-data";

type InventoryCategory =
  | "Boards"
  | "Hardware"
  | "Glass"
  | "Paint"
  | "Lighting"
  | "Accessories";

type StockItem = {
  item: string;
  category: InventoryCategory;
  warehouse: string;
  stockQty: number;
  reservedQty: number;
  reorderLevel: number;
  stockValue: number;
};

const baseStockItems: StockItem[] = [
  {
    item: materials[0],
    category: "Boards",
    warehouse: warehouses[1],
    stockQty: 420,
    reservedQty: 280,
    reorderLevel: 200,
    stockValue: 525000,
  },
  {
    item: materials[1],
    category: "Boards",
    warehouse: warehouses[1],
    stockQty: 260,
    reservedQty: 120,
    reorderLevel: 150,
    stockValue: 310000,
  },
  {
    item: materials[3],
    category: "Hardware",
    warehouse: warehouses[2],
    stockQty: 560,
    reservedQty: 340,
    reorderLevel: 300,
    stockValue: 145000,
  },
  {
    item: materials[5],
    category: "Glass",
    warehouse: warehouses[3],
    stockQty: 68,
    reservedQty: 24,
    reorderLevel: 30,
    stockValue: 220000,
  },
  {
    item: materials[6],
    category: "Paint",
    warehouse: warehouses[0],
    stockQty: 120,
    reservedQty: 40,
    reorderLevel: 60,
    stockValue: 96000,
  },
  {
    item: materials[7],
    category: "Lighting",
    warehouse: warehouses[0],
    stockQty: 85,
    reservedQty: 36,
    reorderLevel: 40,
    stockValue: 198000,
  },
];

const generatedStockItems: StockItem[] = Array.from({ length: 44 }).map(
  (_, index) => {
    const code = index + 1;
    const categoryPool: InventoryCategory[] = [
      "Boards",
      "Hardware",
      "Glass",
      "Paint",
      "Lighting",
      "Accessories",
    ];
    const category = categoryPool[code % categoryPool.length];
    const warehouse =
      warehouses[(code + 1) % warehouses.length] ?? warehouses[0];
    const stockQty = 40 + (code * 7) % 260;
    const reservedQty = Math.round(stockQty * (0.3 + (code % 4) * 0.1));
    const reorderLevel = Math.round(stockQty * 0.4);
    const stockValue = 45000 + code * 8500;

    return {
      item: `Demo SKU ${code.toString().padStart(2, "0")} – ${
        materials[(code + 5) % materials.length]
      }`,
      category,
      warehouse,
      stockQty,
      reservedQty,
      reorderLevel,
      stockValue,
    };
  },
);

const stockItems: StockItem[] = [...baseStockItems, ...generatedStockItems];

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export default function InventoryWarehousePage() {
  const totalStockValue = stockItems.reduce(
    (sum, item) => sum + item.stockValue,
    0,
  );

  const nearReorder = stockItems.filter(
    (item) => item.stockQty <= item.reorderLevel,
  ).length;

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Inventory &amp; Warehouse</h1>
          <p className="erp-page-subtitle">
            Monitor stock levels, reserved quantities, and material availability across warehouses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Stock Value</CardTitle>
            <CardDescription>Total interior material on hand (BDT)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {currencyFormatter.format(totalStockValue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>SKUs Tracked</CardTitle>
            <CardDescription>Boards, hardware, glass, paint, lighting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {stockItems.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Near Reorder</CardTitle>
            <CardDescription>Items at or below reorder level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {nearReorder}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Warehouses</CardTitle>
            <CardDescription>Distribution across storage locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-xs">
            {warehouses.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Register</CardTitle>
            <CardDescription>
              Item-level view with reserved quantities and reorder intelligence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="categories">By Category</TabsTrigger>
              </TabsList>
              <TabsContent value="items" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Qty</TableHead>
                      <TableHead>Reserved</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Stock Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockItems.map((item) => {
                      const utilisation =
                        item.stockQty === 0
                          ? 0
                          : Math.round(
                              (item.reservedQty / item.stockQty) * 100,
                            );
                      const isBelowReorder =
                        item.stockQty <= item.reorderLevel;
                      return (
                        <TableRow key={item.item}>
                          <TableCell className="font-medium">
                            {item.item}
                          </TableCell>
                          <TableCell>{item.warehouse}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.stockQty}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{item.reservedQty}</span>
                              <Progress
                                value={utilisation}
                                className="w-16"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={isBelowReorder ? "danger" : "secondary"}
                            >
                              {item.reorderLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {currencyFormatter.format(item.stockValue)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="categories" className="mt-3 border-0 p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Stock</TableHead>
                      <TableHead>Reserved</TableHead>
                      <TableHead>Stock Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["Boards", "Hardware", "Glass", "Paint", "Lighting", "Accessories"].map(
                      (cat) => {
                        const items = stockItems.filter(
                          (i) => i.category === cat,
                        );
                        if (items.length === 0) return null;
                        const totalStock = items.reduce(
                          (sum, i) => sum + i.stockQty,
                          0,
                        );
                        const reserved = items.reduce(
                          (sum, i) => sum + i.reservedQty,
                          0,
                        );
                        const value = items.reduce(
                          (sum, i) => sum + i.stockValue,
                          0,
                        );
                        return (
                          <TableRow key={cat}>
                            <TableCell className="font-medium">
                              {cat}
                            </TableCell>
                            <TableCell>{items.length}</TableCell>
                            <TableCell>{totalStock}</TableCell>
                            <TableCell>{reserved}</TableCell>
                            <TableCell>
                              {currencyFormatter.format(value)}
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Utilisation</CardTitle>
              <CardDescription>
                Occupancy hints for key storage locations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {warehouses.map((w, index) => {
                const utilisation = 45 + index * 10;
                return (
                  <div key={w}>
                    <div className="mb-1 flex items-center justify-between">
                      <span>{w}</span>
                      <span className="text-muted-foreground">
                        {utilisation}%
                      </span>
                    </div>
                    <Progress value={utilisation} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reorder Watchlist</CardTitle>
              <CardDescription>
                Items to trigger procurement before execution delays.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {stockItems
                .filter((item) => item.stockQty <= item.reorderLevel)
                .map((item) => (
                  <div
                    key={item.item}
                    className="rounded-lg bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.item}</span>
                      <Badge variant="danger">Reorder</Badge>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {item.warehouse} · Stock {item.stockQty} · Level{" "}
                      {item.reorderLevel}
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

