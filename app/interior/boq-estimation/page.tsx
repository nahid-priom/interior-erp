"use client";

import { useMemo, useState } from "react";
import { Plus, MoreHorizontal, Search } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { projects, materials } from "@/lib/demo-data";

type BoqWorkflowStatus =
  | "Draft Estimate"
  | "Under Review"
  | "Quotation Generated"
  | "Sent to Client"
  | "Revision Requested"
  | "Approved"
  | "Rejected";

type BoqLineCategory =
  | "Board"
  | "Hardware"
  | "Glass"
  | "Paint"
  | "Lighting"
  | "Fittings"
  | "Furniture"
  | "Labour"
  | "Accessories"
  | "Transport"
  | "Misc";

type BoqUnit =
  | "pcs"
  | "sheet"
  | "sqft"
  | "sft"
  | "set"
  | "lot"
  | "day"
  | "job"
  | "meter"
  | "roll";

type BoqLineItem = {
  id: string;
  itemName: string;
  category: BoqLineCategory;
  description?: string;
  unit: BoqUnit;
  quantity: number;
  rate: number;
};

type LabourSummary = {
  carpenter: number;
  electrician: number;
  painter: number;
  installer: number;
  supervisor: number;
  other: number;
};

type BoqTotals = {
  materialCost: number;
  labourCost: number;
  otherCost: number;
  subtotal: number;
  discount: number;
  transport: number;
  overhead: number;
  contingency: number;
  finalEstimatedCost: number;
  marginPercent: number;
  quotedAmount: number;
  expectedProfit: number;
};

type BoqRecord = {
  id: string;
  boqNo: string;
  quotationRef?: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  location: string;
  estimateDate: string;
  validUntil: string;
  version: string;
  preparedBy: string;
  status: BoqWorkflowStatus;
  clientApprovalStatus: string;
  internalReviewStatus: string;
  marginPercent: number;
  discountAmount: number;
  transportCost: number;
  overheadCost: number;
  contingencyCost: number;
  notes?: string;
  labour: LabourSummary;
  lineItems: BoqLineItem[];
  totals: BoqTotals;
  lastUpdated: string;
};

type BoqFormState = {
  boqNo: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  location: string;
  estimateDate: string;
  validUntil: string;
  version: string;
  preparedBy: string;
  marginPercent: string;
  discountAmount: string;
  transportCost: string;
  overheadCost: string;
  contingencyCost: string;
  notes: string;
  status: BoqWorkflowStatus;
  quotationRef: string;
  clientApprovalStatus: string;
  internalReviewStatus: string;
  labour: LabourSummary;
  lineItems: BoqLineItem[];
};

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

const marginBadges: Record<BoqWorkflowStatus, "default" | "secondary" | "success" | "warning" | "danger"> = {
  "Draft Estimate": "secondary",
  "Under Review": "warning",
  "Quotation Generated": "default",
  "Sent to Client": "default",
  "Revision Requested": "warning",
  Approved: "success",
  Rejected: "danger",
};

const boqCategories: BoqLineCategory[] = [
  "Board",
  "Hardware",
  "Glass",
  "Paint",
  "Lighting",
  "Fittings",
  "Furniture",
  "Labour",
  "Accessories",
  "Transport",
  "Misc",
];

const boqUnits: BoqUnit[] = [
  "pcs",
  "sheet",
  "sqft",
  "sft",
  "set",
  "lot",
  "day",
  "job",
  "meter",
  "roll",
];

function createDemoBoqRecords(): BoqRecord[] {
  const base: Omit<BoqRecord, "id" | "totals" | "lastUpdated">[] = [
    {
      boqNo: "BOQ-2401-01",
      quotationRef: "QTN-2401",
      projectCode: projects[0].code,
      projectName: projects[0].name,
      clientName: projects[0].client,
      location: "Banani, Dhaka",
      estimateDate: "2026-03-05",
      validUntil: "2026-03-20",
      version: "01",
      preparedBy: "Arif Hossain",
      status: "Sent to Client",
      clientApprovalStatus: "Pending client feedback",
      internalReviewStatus: "Reviewed by Accounts",
      marginPercent: 18,
      discountAmount: 50000,
      transportCost: 80000,
      overheadCost: 125000,
      contingencyCost: 60000,
      notes: "Corporate fit-out with custom workstations and glass partitions.",
      labour: {
        carpenter: 420000,
        electrician: 180000,
        painter: 120000,
        installer: 95000,
        supervisor: 85000,
        other: 60000,
      },
      lineItems: [
        { id: "L1", itemName: materials[0], category: "Board", description: "Workstation partitions and low height storage", unit: "sheet", quantity: 180, rate: 1250 },
        { id: "L2", itemName: materials[2], category: "Board", description: "High gloss laminate for director cabin", unit: "sheet", quantity: 85, rate: 1650 },
        { id: "L3", itemName: materials[3], category: "Hardware", description: "Soft close hinges for cabinets", unit: "pcs", quantity: 220, rate: 320 },
        { id: "L4", itemName: materials[7], category: "Lighting", description: "LED strip lights for workstations", unit: "roll", quantity: 40, rate: 1450 },
        { id: "L5", itemName: materials[18], category: "Accessories", description: "Aluminium skirting for corridors", unit: "meter", quantity: 260, rate: 380 },
      ],
    },
    {
      boqNo: "BOQ-2402-02",
      quotationRef: "QTN-2402",
      projectCode: projects[1].code,
      projectName: projects[1].name,
      clientName: projects[1].client,
      location: "Dhanmondi, Dhaka",
      estimateDate: "2026-03-02",
      validUntil: "2026-03-18",
      version: "02",
      preparedBy: "Fahim Reza",
      status: "Draft Estimate",
      clientApprovalStatus: "Not yet shared",
      internalReviewStatus: "Pending design head review",
      marginPercent: 20,
      discountAmount: 25000,
      transportCost: 45000,
      overheadCost: 70000,
      contingencyCost: 30000,
      notes: "Premium apartment interior with feature wall and modular kitchen.",
      labour: {
        carpenter: 260000,
        electrician: 110000,
        painter: 90000,
        installer: 65000,
        supervisor: 45000,
        other: 30000,
      },
      lineItems: [
        { id: "L6", itemName: materials[1], category: "Board", description: "Wardrobe carcass and loft storage", unit: "sheet", quantity: 95, rate: 1150 },
        { id: "L7", itemName: materials[4], category: "Hardware", description: "Drawer channels for wardrobe", unit: "set", quantity: 40, rate: 780 },
        { id: "L8", itemName: materials[29], category: "Misc", description: "Vinyl flooring for living and dining", unit: "sqft", quantity: 420, rate: 220 },
        { id: "L9", itemName: materials[33], category: "Accessories", description: "Sheer curtain fabric", unit: "meter", quantity: 60, rate: 550 },
      ],
    },
  ];

  while (base.length < 16) {
    const index = base.length;
    const project = projects[(index + 2) % projects.length];
    base.push({
      boqNo: `BOQ-24${(index + 3).toString().padStart(2, "0")}-01`,
      quotationRef: `QTN-24${(index + 3).toString().padStart(2, "0")}`,
      projectCode: project.code,
      projectName: project.name,
      clientName: project.client,
      location: project.name.includes("Gulshan") ? "Gulshan, Dhaka" : "Dhaka, Bangladesh",
      estimateDate: "2026-03-01",
      validUntil: "2026-03-25",
      version: "01",
      preparedBy: index % 2 === 0 ? "Mehedi Islam" : "Tanvir Hasan",
      status:
        index % 5 === 0
          ? "Approved"
          : index % 5 === 1
          ? "Sent to Client"
          : index % 5 === 2
          ? "Quotation Generated"
          : index % 5 === 3
          ? "Revision Requested"
          : "Draft Estimate",
      clientApprovalStatus:
        index % 5 === 0
          ? "Approved by client"
          : index % 5 === 3
          ? "Revision requested on material scope"
          : "Pending client decision",
      internalReviewStatus:
        index % 3 === 0 ? "Reviewed" : "Pending accounts check",
      marginPercent: 15 + ((index * 3) % 10),
      discountAmount: 20000 + index * 5000,
      transportCost: 30000 + index * 4000,
      overheadCost: 60000 + index * 7000,
      contingencyCost: 25000 + index * 3000,
      notes: "Demo BOQ generated for reporting and dashboard purposes.",
      labour: {
        carpenter: 160000 + index * 15000,
        electrician: 80000 + index * 8000,
        painter: 60000 + index * 6000,
        installer: 50000 + index * 5000,
        supervisor: 40000 + index * 4000,
        other: 30000 + index * 3000,
      },
      lineItems: [
        {
          id: `DX-${index}-1`,
          itemName: materials[(5 + index) % materials.length],
          category: "Board",
          description: "Core furniture and partitions for project.",
          unit: "sheet",
          quantity: 80 + index * 4,
          rate: 1150 + index * 20,
        },
        {
          id: `DX-${index}-2`,
          itemName: materials[(10 + index) % materials.length],
          category: "Hardware",
          description: "Hinges, channels and fittings.",
          unit: "set",
          quantity: 60 + index * 3,
          rate: 650 + index * 15,
        },
        {
          id: `DX-${index}-3`,
          itemName: materials[(15 + index) % materials.length],
          category: "Paint",
          description: "Wall and ceiling paint including primer.",
          unit: "roll",
          quantity: 30 + index * 2,
          rate: 750 + index * 10,
        },
      ],
    });
  }

  return base.map((record, idx) => {
    const materialCost = record.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0,
    );
    const labourCost =
      record.labour.carpenter +
      record.labour.electrician +
      record.labour.painter +
      record.labour.installer +
      record.labour.supervisor +
      record.labour.other;
    const otherCost =
      record.transportCost + record.overheadCost + record.contingencyCost;
    const subtotal = materialCost + labourCost + otherCost;
    const finalEstimatedCost = subtotal - record.discountAmount;
    const marginPercent = record.marginPercent;
    const quotedAmount =
      finalEstimatedCost + (finalEstimatedCost * marginPercent) / 100;
    const expectedProfit = quotedAmount - finalEstimatedCost;

    return {
      ...record,
      id: record.boqNo,
      totals: {
        materialCost,
        labourCost,
        otherCost,
        subtotal,
        discount: record.discountAmount,
        transport: record.transportCost,
        overhead: record.overheadCost,
        contingency: record.contingencyCost,
        finalEstimatedCost,
        marginPercent,
        quotedAmount,
        expectedProfit,
      },
      lastUpdated: `2026-03-${(10 + idx).toString().padStart(2, "0")}`,
    };
  });
}

const emptyLabour: LabourSummary = {
  carpenter: 0,
  electrician: 0,
  painter: 0,
  installer: 0,
  supervisor: 0,
  other: 0,
};

const emptyForm: BoqFormState = {
  boqNo: "",
  projectCode: "",
  projectName: "",
  clientName: "",
  location: "",
  estimateDate: "",
  validUntil: "",
  version: "01",
  preparedBy: "",
  marginPercent: "",
  discountAmount: "0",
  transportCost: "0",
  overheadCost: "0",
  contingencyCost: "0",
  notes: "",
  status: "Draft Estimate",
  quotationRef: "",
  clientApprovalStatus: "",
  internalReviewStatus: "",
  labour: { ...emptyLabour },
  lineItems: [],
};

function calculateTotalsFromForm(form: BoqFormState): BoqTotals {
  const materialCost = form.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const labourCost =
    form.labour.carpenter +
    form.labour.electrician +
    form.labour.painter +
    form.labour.installer +
    form.labour.supervisor +
    form.labour.other;
  const transport = Number(form.transportCost || 0);
  const overhead = Number(form.overheadCost || 0);
  const contingency = Number(form.contingencyCost || 0);
  const discount = Number(form.discountAmount || 0);
  const otherCost = transport + overhead + contingency;
  const subtotal = materialCost + labourCost + otherCost;
  const finalEstimatedCost = subtotal - discount;
  const marginPercent = Number(form.marginPercent || 0);
  const quotedAmount =
    finalEstimatedCost + (finalEstimatedCost * marginPercent) / 100;
  const expectedProfit = quotedAmount - finalEstimatedCost;

  return {
    materialCost,
    labourCost,
    otherCost,
    subtotal,
    discount,
    transport,
    overhead,
    contingency,
    finalEstimatedCost,
    marginPercent,
    quotedAmount,
    expectedProfit,
  };
}

export default function BoqEstimationPage() {
  const [records, setRecords] = useState<BoqRecord[]>(() =>
    createDemoBoqRecords(),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BoqWorkflowStatus | "All">(
    "All",
  );
  const [projectFilter, setProjectFilter] = useState<string | "All">("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BoqFormState>(emptyForm);

  const isEditing = editingId !== null;

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesStatus =
        statusFilter === "All" ? true : record.status === statusFilter;
      const matchesProject =
        projectFilter === "All" ? true : record.projectCode === projectFilter;
      const matchesSearch =
        !search ||
        record.projectName.toLowerCase().includes(search.toLowerCase()) ||
        record.clientName.toLowerCase().includes(search.toLowerCase()) ||
        record.boqNo.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesProject && matchesSearch;
    });
  }, [records, search, statusFilter, projectFilter]);

  const kpis = useMemo(() => {
    const draft = records.filter((r) => r.status === "Draft Estimate").length;
    const sent = records.filter(
      (r) => r.status === "Sent to Client" || r.status === "Quotation Generated",
    ).length;
    const approved = records.filter((r) => r.status === "Approved").length;
    const totalEstimatedValue = records.reduce(
      (sum, r) => sum + r.totals.finalEstimatedCost,
      0,
    );
    const avgMargin =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce((sum, r) => sum + r.totals.marginPercent, 0) /
              records.length,
          );
    return { draft, sent, approved, totalEstimatedValue, avgMargin };
  }, [records]);

  const workflowCounts = useMemo(() => {
    const draft = records.filter((r) => r.status === "Draft Estimate").length;
    const underReview = records.filter(
      (r) => r.status === "Under Review",
    ).length;
    const sent = records.filter(
      (r) =>
        r.status === "Sent to Client" || r.status === "Quotation Generated",
    ).length;
    const approved = records.filter((r) => r.status === "Approved").length;
    const revision = records.filter(
      (r) => r.status === "Revision Requested",
    ).length;
    return { draft, underReview, sent, approved, revision };
  }, [records]);

  const selectedRecord =
    records.find((r) => r.id === selectedId) ?? records[0] ?? null;

  const currentTotals = useMemo(
    () => calculateTotalsFromForm(form),
    [form],
  );

  function openCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      estimateDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    });
    setDialogOpen(true);
  }

  function openEdit(record: BoqRecord) {
    setEditingId(record.id);
    setForm({
      boqNo: record.boqNo,
      projectCode: record.projectCode,
      projectName: record.projectName,
      clientName: record.clientName,
      location: record.location,
      estimateDate: record.estimateDate,
      validUntil: record.validUntil,
      version: record.version,
      preparedBy: record.preparedBy,
      marginPercent: record.marginPercent.toString(),
      discountAmount: record.discountAmount.toString(),
      transportCost: record.transportCost.toString(),
      overheadCost: record.overheadCost.toString(),
      contingencyCost: record.contingencyCost.toString(),
      notes: record.notes ?? "",
      status: record.status,
      quotationRef: record.quotationRef ?? "",
      clientApprovalStatus: record.clientApprovalStatus,
      internalReviewStatus: record.internalReviewStatus,
      labour: { ...record.labour },
      lineItems: record.lineItems.map((i) => ({ ...i })),
    });
    setDialogOpen(true);
  }

  function addLineItem() {
    const firstMaterial = materials[0] ?? "Custom Item";
    const newItem: BoqLineItem = {
      id: `NEW-${Date.now()}`,
      itemName: firstMaterial,
      category: "Board",
      description: "",
      unit: "sheet",
      quantity: 1,
      rate: 0,
    };
    setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, newItem] }));
  }

  function updateLineItem(id: string, patch: Partial<BoqLineItem>) {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  function removeLineItem(id: string) {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
  }

  function handleSave() {
    if (!form.projectName || !form.clientName || !form.estimateDate) {
      return;
    }
    if (!form.lineItems.length) {
      return;
    }
    if (!form.marginPercent || Number(form.marginPercent) <= 0) {
      return;
    }

    const totals = calculateTotalsFromForm(form);

    const projectMatch = projects.find((p) => p.name === form.projectName);
    const projectCode = form.projectCode || projectMatch?.code || "INT-24XX";

    const baseBoqNo = form.boqNo ||
      (projectMatch ? `${projectMatch.code.replace("INT-", "BOQ-")}-01` :
        `BOQ-24${(records.length + 1).toString().padStart(2, "0")}-01`);

    const now = new Date().toISOString().slice(0, 10);

    const record: BoqRecord = {
      id: isEditing ? editingId! : baseBoqNo,
      boqNo: baseBoqNo,
      quotationRef: form.quotationRef || undefined,
      projectCode,
      projectName: form.projectName,
      clientName: form.clientName,
      location: form.location,
      estimateDate: form.estimateDate,
      validUntil: form.validUntil,
      version: form.version || "01",
      preparedBy: form.preparedBy,
      status: form.status,
      clientApprovalStatus:
        form.clientApprovalStatus ||
        (form.status === "Approved"
          ? "Client approved"
          : "Pending client decision"),
      internalReviewStatus: form.internalReviewStatus || "",
      marginPercent: Number(form.marginPercent || 0),
      discountAmount: Number(form.discountAmount || 0),
      transportCost: Number(form.transportCost || 0),
      overheadCost: Number(form.overheadCost || 0),
      contingencyCost: Number(form.contingencyCost || 0),
      notes: form.notes || undefined,
      labour: { ...form.labour },
      lineItems: form.lineItems.map((i) => ({ ...i })),
      totals,
      lastUpdated: now,
    };

    setRecords((current) => {
      if (isEditing) {
        return current.map((r) => (r.id === editingId ? record : r));
      }
      return [record, ...current];
    });

    setSelectedId(record.id);
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDuplicate(record: BoqRecord) {
    const copy: BoqRecord = {
      ...record,
      id: `${record.id}-COPY-${Date.now()}`,
      boqNo: `${record.boqNo}-R1`,
      version: (Number(record.version || "1") + 1).toString().padStart(2, "0"),
      status: "Draft Estimate",
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    setRecords((current) => [copy, ...current]);
  }

  function handleStatusChange(record: BoqRecord, status: BoqWorkflowStatus) {
    setRecords((current) =>
      current.map((r) =>
        r.id === record.id
          ? {
              ...r,
              status,
              lastUpdated: new Date().toISOString().slice(0, 10),
            }
          : r,
      ),
    );
  }

  function handleDelete(record: BoqRecord) {
    setRecords((current) => current.filter((r) => r.id !== record.id));
    if (selectedId === record.id) {
      setSelectedId(null);
    }
  }

  const costBreakdown = useMemo(() => {
    const material = filteredRecords.reduce(
      (sum, r) => sum + r.totals.materialCost,
      0,
    );
    const labour = filteredRecords.reduce(
      (sum, r) => sum + r.totals.labourCost,
      0,
    );
    const other = filteredRecords.reduce(
      (sum, r) => sum + r.totals.otherCost,
      0,
    );
    const total = material + labour + other;
    return { material, labour, other, total };
  }, [filteredRecords]);

  return (
    <div className="space-y-6">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">BOQ &amp; Estimation</h1>
          <p className="erp-page-subtitle">
            Prepare project cost sheets, quotations, and profit summaries for interior jobs.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800">
            <Search className="h-3.5 w-3.5 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project, client, or BOQ no"
              className="h-7 border-none bg-transparent p-0 text-xs focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500">Status:</span>
            <div className="flex flex-wrap gap-1.5">
              {["All",
                "Draft Estimate",
                "Under Review",
                "Quotation Generated",
                "Sent to Client",
                "Revision Requested",
                "Approved",
                "Rejected",
              ].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      status === "All" ? "All" : (status as BoqWorkflowStatus),
                    )
                  }
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px]",
                    statusFilter === status
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900",
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) =>
                setProjectFilter(
                  e.target.value === "All" ? "All" : e.target.value,
                )
              }
              className="h-8 rounded-full border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
            >
              <option value="All">All projects</option>
              {projects.map((project) => (
                <option key={project.code} value={project.code}>
                  {project.code} · {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          size="sm"
          className="rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700"
          onClick={openCreate}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create New Estimate
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-5">
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Draft Estimates</CardTitle>
            <CardDescription>Cost sheets in preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpis.draft}</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Sent Quotations</CardTitle>
            <CardDescription>Shared with clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpis.sent}</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Approved Quotations</CardTitle>
            <CardDescription>Client approved estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpis.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Margin %</CardTitle>
            <CardDescription>Across all estimates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpis.avgMargin}%</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Total Estimated Value</CardTitle>
            <CardDescription>Final estimated cost (BDT)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {currencyFormatter.format(kpis.totalEstimatedValue)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
        <Card className="h-full rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>BOQ Register</CardTitle>
            <CardDescription>
              Manage detailed BOQ estimates, quotations, and approval status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6 py-4">BOQ No</TableHead>
                    <TableHead className="px-6 py-4">Project</TableHead>
                    <TableHead className="px-6 py-4">Client</TableHead>
                    <TableHead className="px-6 py-4">Material Cost</TableHead>
                    <TableHead className="px-6 py-4">Labour Cost</TableHead>
                    <TableHead className="px-6 py-4">Estimated Cost</TableHead>
                    <TableHead className="px-6 py-4">Margin %</TableHead>
                    <TableHead className="px-6 py-4">Quoted Amount</TableHead>
                    <TableHead className="px-6 py-4">Version</TableHead>
                    <TableHead className="px-6 py-4">Status</TableHead>
                    <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-neutral-50/80 dark:hover:bg-neutral-900"
                      onClick={() => setSelectedId(record.id)}
                    >
                      <TableCell className="px-6 py-4 text-sm font-medium">
                        {record.boqNo}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="text-sm font-medium">
                          {record.projectName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.projectCode}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="text-sm">{record.clientName}</div>
                        <div className="text-xs text-muted-foreground">
                          {record.location}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {currencyFormatter.format(
                          record.totals.materialCost,
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {currencyFormatter.format(record.totals.labourCost)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {currencyFormatter.format(
                          record.totals.finalEstimatedCost,
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {record.totals.marginPercent}%
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {currencyFormatter.format(record.totals.quotedAmount)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {record.version}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant={marginBadges[record.status]}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setSelectedId(record.id)}
                            >
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(record)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicate(record)}
                            >
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(record, "Draft Estimate")}>
                                  Draft Estimate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(record, "Under Review")}>
                                  Under Review
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(record, "Quotation Generated")}>
                                  Quotation Generated
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(record, "Sent to Client")}>
                                  Sent to Client
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(record, "Revision Requested")}>
                                  Revision Requested
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(record, "Approved")}>
                                  Approved
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(record, "Rejected")}>
                                  Rejected
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(record)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRecords.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="px-6 py-8 text-center text-xs text-neutral-500"
                      >
                        No estimates match this search or filter. Create a new estimate to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estimate Workflow</CardTitle>
              <CardDescription>
                Estimate → Quotation → Client Approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Draft / In Preparation</span>
                  <span className="text-muted-foreground">
                    {workflowCounts.draft} estimates
                  </span>
                </div>
                <Progress value={records.length ? (workflowCounts.draft / records.length) * 100 : 0} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Under Review</span>
                  <span className="text-muted-foreground">
                    {workflowCounts.underReview} estimates
                  </span>
                </div>
                <Progress value={records.length ? (workflowCounts.underReview / records.length) * 100 : 0} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Sent to Client</span>
                  <span className="text-muted-foreground">
                    {workflowCounts.sent} estimates
                  </span>
                </div>
                <Progress value={records.length ? (workflowCounts.sent / records.length) * 100 : 0} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Approved</span>
                  <span className="text-muted-foreground">
                    {workflowCounts.approved} estimates
                  </span>
                </div>
                <Progress value={records.length ? (workflowCounts.approved / records.length) * 100 : 0} />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span>Revision Requested</span>
                  <span className="text-muted-foreground">
                    {workflowCounts.revision} estimates
                  </span>
                </div>
                <Progress value={records.length ? (workflowCounts.revision / records.length) * 100 : 0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>
                Material, labour, and other cost mix.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span>Material Cost</span>
                <span className="font-medium">
                  {currencyFormatter.format(costBreakdown.material)}
                </span>
              </div>
              <Progress
                value={
                  costBreakdown.total
                    ? (costBreakdown.material / costBreakdown.total) * 100
                    : 0
                }
              />
              <div className="flex items-center justify-between">
                <span>Labour Cost</span>
                <span className="font-medium">
                  {currencyFormatter.format(costBreakdown.labour)}
                </span>
              </div>
              <Progress
                value={
                  costBreakdown.total
                    ? (costBreakdown.labour / costBreakdown.total) * 100
                    : 0
                }
              />
              <div className="flex items-center justify-between">
                <span>Other Cost</span>
                <span className="font-medium">
                  {currencyFormatter.format(costBreakdown.other)}
                </span>
              </div>
              <Progress
                value={
                  costBreakdown.total
                    ? (costBreakdown.other / costBreakdown.total) * 100
                    : 0
                }
              />
              <div className="mt-2 flex items-center justify-between border-t pt-2 text-xs">
                <span>Total</span>
                <span className="font-semibold">
                  {currencyFormatter.format(costBreakdown.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {selectedRecord && (
            <Card>
              <CardHeader>
                <CardTitle>Estimate Preview</CardTitle>
                <CardDescription>
                  Quick snapshot of the selected estimate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedRecord.projectName}</span>
                  <Badge variant={marginBadges[selectedRecord.status]}>
                    {selectedRecord.status}
                  </Badge>
                </div>
                <div className="text-[11px] text-neutral-500">
                  {selectedRecord.clientName} · {selectedRecord.location}
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <div className="text-neutral-500">BOQ / Version</div>
                    <div className="font-medium">
                      {selectedRecord.boqNo} · v{selectedRecord.version}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Estimate Date</div>
                    <div className="font-medium">
                      {selectedRecord.estimateDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Material Cost</div>
                    <div className="font-medium">
                      {currencyFormatter.format(
                        selectedRecord.totals.materialCost,
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Labour Cost</div>
                    <div className="font-medium">
                      {currencyFormatter.format(
                        selectedRecord.totals.labourCost,
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Margin %</div>
                    <div className="font-medium">
                      {selectedRecord.totals.marginPercent}%
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Quoted Amount</div>
                    <div className="font-medium">
                      {currencyFormatter.format(
                        selectedRecord.totals.quotedAmount,
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Item Count</div>
                    <div className="font-medium">
                      {selectedRecord.lineItems.length} items
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Approval Status</div>
                    <div className="font-medium">
                      {selectedRecord.clientApprovalStatus}
                    </div>
                  </div>
                </div>
                {selectedRecord.notes && (
                  <div className="mt-2 rounded-md bg-neutral-50 p-2 text-[11px] text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                    {selectedRecord.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Estimate" : "Create New Estimate"}</DialogTitle>
            <DialogDescription>
              Capture full project costing including materials, labour, and quotation information.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid max-h-[560px] grid-cols-1 gap-5 overflow-y-auto pb-2 text-xs md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
            <div className="space-y-4">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        BOQ / Estimate No
                      </label>
                      <Input
                        value={form.boqNo}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, boqNo: e.target.value }))
                        }
                        placeholder="BOQ-2401-01"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Project
                      </label>
                      <input
                        list="boq-project-list"
                        className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                        value={form.projectName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            projectName: e.target.value,
                          }))
                        }
                        placeholder="Select or type project"
                      />
                      <datalist id="boq-project-list">
                        {projects.map((p) => (
                          <option key={p.code} value={p.name} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Client
                      </label>
                      <Input
                        value={form.clientName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            clientName: e.target.value,
                          }))
                        }
                        placeholder="Client name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Location
                      </label>
                      <Input
                        value={form.location}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Area, city"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Estimate Date
                      </label>
                      <Input
                        type="date"
                        value={form.estimateDate}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            estimateDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Valid Until
                      </label>
                      <Input
                        type="date"
                        value={form.validUntil}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            validUntil: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Version
                      </label>
                      <Input
                        value={form.version}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            version: e.target.value,
                          }))
                        }
                        placeholder="01"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Prepared By
                      </label>
                      <Input
                        value={form.preparedBy}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            preparedBy: e.target.value,
                          }))
                        }
                        placeholder="Name of estimator"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Costing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Profit Margin %
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.marginPercent}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            marginPercent: e.target.value,
                          }))
                        }
                        placeholder="18"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Discount Amount
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.discountAmount}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            discountAmount: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Transport Cost
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.transportCost}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            transportCost: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Overhead Cost
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.overheadCost}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            overheadCost: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium">
                        Contingency Cost
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.contingencyCost}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            contingencyCost: e.target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium">
                      Notes
                    </label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Any important assumptions or scope notes for this estimate."
                      className="min-h-[70px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">BOQ Line Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-600">
                      Add detailed BOQ items with quantity and rate.
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-full px-3 text-[11px]"
                      type="button"
                      onClick={addLineItem}
                    >
                      + Add Item Row
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.lineItems.map((item) => {
                      const amount = item.quantity * item.rate;
                      return (
                        <div
                          key={item.id}
                          className="grid grid-cols-1 gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-[11px] dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,0.6fr)_minmax(0,0.6fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_40px]"
                        >
                          <div>
                            <div className="mb-1 text-[10px] text-neutral-500">
                              Item Name
                            </div>
                            <Input
                              value={item.itemName}
                              onChange={(e) =>
                                updateLineItem(item.id, {
                                  itemName: e.target.value,
                                })
                              }
                              placeholder="Item name"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[10px] text-neutral-500">
                              Category
                            </div>
                            <select
                              value={item.category}
                              onChange={(e) =>
                                updateLineItem(item.id, {
                                  category: e.target
                                    .value as BoqLineCategory,
                                })
                              }
                              className="h-8 w-full rounded-md border border-neutral-200 bg-white px-2 text-[11px] dark:border-neutral-700 dark:bg-neutral-950"
                            >
                              {boqCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <div className="mb-1 text-[10px] text-neutral-500">
                              Description
                            </div>
                            <Input
                              value={item.description || ""}
                              onChange={(e) =>
                                updateLineItem(item.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Short description"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[10px] text-neutral-500">
                              Unit
                            </div>
                            <select
                              value={item.unit}
                              onChange={(e) =>
                                updateLineItem(item.id, {
                                  unit: e.target.value as BoqUnit,
                                })
                              }
                              className="h-8 w-full rounded-md border border-neutral-200 bg-white px-1.5 text-[11px] dark:border-neutral-700 dark:bg-neutral-950"
                            >
                              {boqUnits.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <div className="mb-1 text-[10px] text-neutral-500">
                              Qty
                            </div>
                            <Input
                              type="number"
                              min={0}
                              value={item.quantity}
                              onChange={(e) =>
                                updateLineItem(item.id, {
                                  quantity: Number(e.target.value || 0),
                                })
                              }
                              className="h-8"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[10px] text-neutral-500">
                              Rate
                            </div>
                            <Input
                              type="number"
                              min={0}
                              value={item.rate}
                              onChange={(e) =>
                                updateLineItem(item.id, {
                                  rate: Number(e.target.value || 0),
                                })
                              }
                              className="h-8"
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[10px] text-neutral-500">
                              Amount
                            </div>
                            <div className="h-8 rounded-md bg-white px-2 text-right text-[11px] leading-8 dark:bg-neutral-950">
                              {currencyFormatter.format(amount)}
                            </div>
                          </div>
                          <div className="flex items-start justify-end pt-5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full text-red-500"
                              onClick={() => removeLineItem(item.id)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    {form.lineItems.length === 0 && (
                      <div className="rounded-md border border-dashed border-neutral-200 p-3 text-[11px] text-neutral-500 dark:border-neutral-700">
                        No items added yet. Use "Add Item Row" to start building this BOQ.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Labour Cost Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {([
                    ["Carpenter Cost", "carpenter"],
                    ["Electrician Cost", "electrician"],
                    ["Painter Cost", "painter"],
                    ["Installer Cost", "installer"],
                    ["Supervisor Cost", "supervisor"],
                    ["Other Labour Cost", "other"],
                  ] as const).map(([label, key]) => (
                    <div key={key}>
                      <label className="mb-1 block text-[11px] font-medium">
                        {label}
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={form.labour[key]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            labour: {
                              ...prev.labour,
                              [key]: Number(e.target.value || 0),
                            },
                          }))
                        }
                        placeholder="0"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Quotation / Approval Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <label className="mb-1 block text-[11px] font-medium">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          status: e.target.value as BoqWorkflowStatus,
                        }))
                      }
                      className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                    >
                      <option value="Draft Estimate">Draft Estimate</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Quotation Generated">
                        Quotation Generated
                      </option>
                      <option value="Sent to Client">Sent to Client</option>
                      <option value="Revision Requested">Revision Requested</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="mb-1 block text-[11px] font-medium">
                      Quotation Reference
                    </label>
                    <Input
                      value={form.quotationRef}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          quotationRef: e.target.value,
                        }))
                      }
                      placeholder="QTN-2401"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-1 block text-[11px] font-medium">
                      Client Approval Status
                    </label>
                    <Textarea
                      value={form.clientApprovalStatus}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          clientApprovalStatus: e.target.value,
                        }))
                      }
                      placeholder="e.g. Pending approval, client reviewing with management."
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-1 block text-[11px] font-medium">
                      Internal Review Status
                    </label>
                    <Textarea
                      value={form.internalReviewStatus}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          internalReviewStatus: e.target.value,
                        }))
                      }
                      placeholder="e.g. Reviewed by accounts, pending director sign-off."
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">Live Cost Summary</CardTitle>
                  <CardDescription>
                    Calculated automatically from BOQ items and labour.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Material Cost</span>
                    <span className="font-medium">
                      {currencyFormatter.format(currentTotals.materialCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Labour Cost</span>
                    <span className="font-medium">
                      {currencyFormatter.format(currentTotals.labourCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Other Cost (T+O+C)</span>
                    <span className="font-medium">
                      {currencyFormatter.format(currentTotals.otherCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {currencyFormatter.format(currentTotals.subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Discount</span>
                    <span className="font-medium">
                      -{currencyFormatter.format(currentTotals.discount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Final Estimated Cost</span>
                    <span className="font-semibold">
                      {currencyFormatter.format(
                        currentTotals.finalEstimatedCost,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span>Profit Margin %</span>
                    <span className="font-semibold">
                      {currentTotals.marginPercent}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quoted Amount</span>
                    <span className="font-semibold">
                      {currencyFormatter.format(currentTotals.quotedAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Expected Profit</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {currencyFormatter.format(currentTotals.expectedProfit)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700"
                  onClick={handleSave}
                >
                  {isEditing ? "Save Changes" : "Save Estimate"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
