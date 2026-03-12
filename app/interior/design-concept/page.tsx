"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Upload,
  X,
  FileText,
  Box,
  Eye,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { projects, clients } from "@/lib/demo-data";

type DesignWorkflowStatus =
  | "Draft"
  | "Uploaded"
  | "Under Review"
  | "Revision Requested"
  | "Sent to Client"
  | "Approved"
  | "Rejected";

type DesignType =
  | "2D Layout"
  | "3D View"
  | "Working Drawing"
  | "AutoCAD Drawing"
  | "SketchUp Model"
  | "Material Mood Board";

type UploadedFileRecord = {
  id: string;
  name: string;
  type: string;
  size?: number;
};

type DesignRecord = {
  id: string;
  projectCode: string;
  projectName: string;
  client: string;
  designTitle: string;
  designType: DesignType;
  assignedDesigner: string;
  submissionDate: string;
  revisionNumber: string;
  approvalStatus: DesignWorkflowStatus;
  lastUpdated: string;
  notes?: string;
  files2D: UploadedFileRecord[];
  files3D: UploadedFileRecord[];
};

type RevisionEntry = {
  id: string;
  designId: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
};

const DESIGNERS = [
  "Fahim Reza",
  "Nusrat Jahan",
  "Arif Hossain",
  "Tanvir Hasan",
  "Afsana Kabir",
  "Nazmul Hasan",
];

const DESIGN_TYPES: DesignType[] = [
  "2D Layout",
  "3D View",
  "Working Drawing",
  "AutoCAD Drawing",
  "SketchUp Model",
  "Material Mood Board",
];

const DESIGN_STATUSES: DesignWorkflowStatus[] = [
  "Draft",
  "Uploaded",
  "Under Review",
  "Revision Requested",
  "Sent to Client",
  "Approved",
  "Rejected",
];

const ACCEPT_2D = ".pdf,.jpg,.jpeg,.png,.dwg";
const ACCEPT_3D = ".skp,.zip,.jpg,.jpeg,.png";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const INITIAL_DESIGNS: DesignRecord[] = [
  {
    id: "DES-2401-01",
    projectCode: "INT-2401",
    projectName: "Banani Corporate Office Fit-out",
    client: "Nabil Group",
    designTitle: "Reception Layout Rev-01",
    designType: "2D Layout",
    assignedDesigner: "Fahim Reza",
    submissionDate: "2026-03-05",
    revisionNumber: "Rev 01",
    approvalStatus: "Under Review",
    lastUpdated: "2026-03-10",
    notes: "Client requested more hot-desking seats near window.",
    files2D: [
      { id: "f1", name: "reception-layout-rev01.pdf", type: "application/pdf", size: 245000 },
    ],
    files3D: [],
  },
  {
    id: "DES-2401-02",
    projectCode: "INT-2401",
    projectName: "Banani Corporate Office Fit-out",
    client: "Nabil Group",
    designTitle: "Executive Cabin 3D Perspective",
    designType: "3D View",
    assignedDesigner: "Afsana Kabir",
    submissionDate: "2026-03-03",
    revisionNumber: "Rev 02",
    approvalStatus: "Approved",
    lastUpdated: "2026-03-08",
    files2D: [],
    files3D: [
      { id: "f2", name: "executive-cabin-view.jpg", type: "image/jpeg", size: 1200000 },
      { id: "f3", name: "cabin-model.skp", type: "model/skp", size: 3400000 },
    ],
  },
  {
    id: "DES-2402-01",
    projectCode: "INT-2402",
    projectName: "Dhanmondi Apartment Interior",
    client: "Rafiq Ahmed",
    designTitle: "Modular Kitchen Working Drawing",
    designType: "Working Drawing",
    assignedDesigner: "Nazmul Hasan",
    submissionDate: "2026-03-11",
    revisionNumber: "Rev 01",
    approvalStatus: "Draft",
    lastUpdated: "2026-03-11",
    notes: "Internal review pending.",
    files2D: [
      { id: "f4", name: "kitchen-working-drawing.dwg", type: "application/acad", size: 890000 },
      { id: "f5", name: "kitchen-elevation.pdf", type: "application/pdf", size: 156000 },
    ],
    files3D: [],
  },
  {
    id: "DES-2402-02",
    projectCode: "INT-2402",
    projectName: "Dhanmondi Apartment Interior",
    client: "Rafiq Ahmed",
    designTitle: "Living Room 3D View",
    designType: "3D View",
    assignedDesigner: "Fahim Reza",
    submissionDate: "2026-03-10",
    revisionNumber: "Rev 01",
    approvalStatus: "Sent to Client",
    lastUpdated: "2026-03-10",
    files2D: [],
    files3D: [
      { id: "f6", name: "apartment-living-3d.zip", type: "application/zip", size: 5200000 },
      { id: "f7", name: "living-render.png", type: "image/png", size: 2100000 },
    ],
  },
  {
    id: "DES-2403-01",
    projectCode: "INT-2403",
    projectName: "Gulshan Showroom Renovation",
    client: "Bengal Workspace Ltd",
    designTitle: "Showroom Display Wall Concept",
    designType: "3D View",
    assignedDesigner: "Tanvir Hasan",
    submissionDate: "2026-03-04",
    revisionNumber: "Rev 02",
    approvalStatus: "Revision Requested",
    lastUpdated: "2026-03-09",
    notes: "Client wants warmer lighting on display wall.",
    files2D: [
      { id: "f8", name: "showroom-wall-detail.pdf", type: "application/pdf", size: 320000 },
    ],
    files3D: [
      { id: "f9", name: "showroom-model.skp", type: "model/skp", size: 4100000 },
    ],
  },
  {
    id: "DES-2403-02",
    projectCode: "INT-2403",
    projectName: "Gulshan Showroom Renovation",
    client: "Bengal Workspace Ltd",
    designTitle: "Ceiling Lighting Layout",
    designType: "2D Layout",
    assignedDesigner: "Nazmul Hasan",
    submissionDate: "2026-03-06",
    revisionNumber: "Rev 01",
    approvalStatus: "Approved",
    lastUpdated: "2026-03-08",
    files2D: [
      { id: "f10", name: "ceiling-lighting-plan.pdf", type: "application/pdf", size: 180000 },
    ],
    files3D: [],
  },
  {
    id: "DES-2404-01",
    projectCode: "INT-2404",
    projectName: "Uttara Restaurant Interior",
    client: "Lakeshore Café",
    designTitle: "Restaurant Lobby 3D Render",
    designType: "3D View",
    assignedDesigner: "Fahim Reza",
    submissionDate: "2026-03-02",
    revisionNumber: "Rev 03",
    approvalStatus: "Under Review",
    lastUpdated: "2026-03-07",
    files2D: [],
    files3D: [
      { id: "f11", name: "restaurant-lobby-render.png", type: "image/png", size: 2800000 },
    ],
  },
  {
    id: "DES-2404-02",
    projectCode: "INT-2404",
    projectName: "Uttara Restaurant Interior",
    client: "Lakeshore Café",
    designTitle: "Dining Zone Layout",
    designType: "2D Layout",
    assignedDesigner: "Nusrat Jahan",
    submissionDate: "2026-03-08",
    revisionNumber: "Rev 01",
    approvalStatus: "Uploaded",
    lastUpdated: "2026-03-09",
    files2D: [
      { id: "f12", name: "dining-layout-rev01.pdf", type: "application/pdf", size: 195000 },
    ],
    files3D: [],
  },
  {
    id: "DES-2405-01",
    projectCode: "INT-2405",
    projectName: "Bashundhara Executive Office",
    client: "Rahman Holdings",
    designTitle: "Manager Room Furniture Layout",
    designType: "2D Layout",
    assignedDesigner: "Arif Hossain",
    submissionDate: "2026-03-01",
    revisionNumber: "Rev 02",
    approvalStatus: "Approved",
    lastUpdated: "2026-03-06",
    files2D: [
      { id: "f13", name: "manager-room-layout.pdf", type: "application/pdf", size: 220000 },
      { id: "f14", name: "furniture-schedule.dwg", type: "application/acad", size: 450000 },
    ],
    files3D: [],
  },
  {
    id: "DES-2406-01",
    projectCode: "INT-2406",
    projectName: "Mirpur Studio Apartment Custom Interior",
    client: "Tasnia Karim",
    designTitle: "Studio Compact Layout",
    designType: "2D Layout",
    assignedDesigner: "Tanvir Hasan",
    submissionDate: "2026-03-05",
    revisionNumber: "Rev 01",
    approvalStatus: "Draft",
    lastUpdated: "2026-03-05",
    files2D: [],
    files3D: [],
  },
  {
    id: "DES-2407-01",
    projectCode: "INT-2407",
    projectName: "Chattogram Retail Display Project",
    client: "Urban Edge Properties",
    designTitle: "Display Zone AutoCAD Set",
    designType: "AutoCAD Drawing",
    assignedDesigner: "Nazmul Hasan",
    submissionDate: "2026-03-02",
    revisionNumber: "Rev 02",
    approvalStatus: "Approved",
    lastUpdated: "2026-03-05",
    files2D: [
      { id: "f15", name: "display-zone-plan.dwg", type: "application/acad", size: 670000 },
      { id: "f16", name: "display-details.pdf", type: "application/pdf", size: 310000 },
    ],
    files3D: [
      { id: "f17", name: "display-render.jpg", type: "image/jpeg", size: 1900000 },
    ],
  },
  {
    id: "DES-2408-01",
    projectCode: "INT-2408",
    projectName: "Gulshan Executive Floor Refurbishment",
    client: "Rahman Holdings",
    designTitle: "Lobby Material Mood Board",
    designType: "Material Mood Board",
    assignedDesigner: "Afsana Kabir",
    submissionDate: "2026-03-07",
    revisionNumber: "Rev 01",
    approvalStatus: "Sent to Client",
    lastUpdated: "2026-03-08",
    files2D: [
      { id: "f18", name: "mood-board-specs.pdf", type: "application/pdf", size: 420000 },
    ],
    files3D: [
      { id: "f19", name: "lobby-visual.jpg", type: "image/jpeg", size: 1500000 },
    ],
  },
  {
    id: "DES-2409-01",
    projectCode: "INT-2409",
    projectName: "Uttara Duplex Luxury Interior",
    client: "Rafiq Ahmed",
    designTitle: "Staircase Feature Wall Concept",
    designType: "SketchUp Model",
    assignedDesigner: "Fahim Reza",
    submissionDate: "2026-03-04",
    revisionNumber: "Rev 01",
    approvalStatus: "Under Review",
    lastUpdated: "2026-03-06",
    files2D: [],
    files3D: [
      { id: "f20", name: "staircase-model.skp", type: "model/skp", size: 3800000 },
      { id: "f21", name: "feature-wall-render.png", type: "image/png", size: 2200000 },
    ],
  },
  {
    id: "DES-2410-01",
    projectCode: "INT-2410",
    projectName: "Bashundhara Board Room Upgrade",
    client: "Rahman Holdings",
    designTitle: "Board Room Working Drawing Set",
    designType: "Working Drawing",
    assignedDesigner: "Nazmul Hasan",
    submissionDate: "2026-03-01",
    revisionNumber: "Rev 02",
    approvalStatus: "Approved",
    lastUpdated: "2026-03-05",
    files2D: [
      { id: "f22", name: "boardroom-plan.dwg", type: "application/acad", size: 720000 },
      { id: "f23", name: "boardroom-sections.pdf", type: "application/pdf", size: 410000 },
    ],
    files3D: [],
  },
  {
    id: "DES-2411-01",
    projectCode: "INT-2411",
    projectName: "Banani Co-working Space Fit-out",
    client: "Urban Edge Properties",
    designTitle: "Hot Desk Layout 2D",
    designType: "2D Layout",
    assignedDesigner: "Nusrat Jahan",
    submissionDate: "2026-03-03",
    revisionNumber: "Rev 01",
    approvalStatus: "Uploaded",
    lastUpdated: "2026-03-04",
    files2D: [
      { id: "f24", name: "hot-desk-layout.pdf", type: "application/pdf", size: 178000 },
    ],
    files3D: [],
  },
  {
    id: "DES-2412-01",
    projectCode: "INT-2412",
    projectName: "Dhanmondi Clinic Reception Interior",
    client: "Rahman Holdings",
    designTitle: "Reception 3D View",
    designType: "3D View",
    assignedDesigner: "Afsana Kabir",
    submissionDate: "2026-03-05",
    revisionNumber: "Rev 01",
    approvalStatus: "Revision Requested",
    lastUpdated: "2026-03-06",
    notes: "Client requested softer colours for waiting area.",
    files2D: [],
    files3D: [
      { id: "f25", name: "reception-3d-view.jpg", type: "image/jpeg", size: 2400000 },
    ],
  },
];

const INITIAL_REVISIONS: RevisionEntry[] = [
  { id: "rev1", designId: "DES-2401-01", title: "Rev 01 created by Fahim Reza", description: "Initial reception layout shared for review.", createdBy: "Fahim Reza", createdAt: "2026-03-05 10:15" },
  { id: "rev2", designId: "DES-2401-01", title: "2D layout uploaded", description: "reception-layout-rev01.pdf added.", createdBy: "Fahim Reza", createdAt: "2026-03-06 14:20" },
  { id: "rev3", designId: "DES-2401-02", title: "3D view uploaded", description: "Executive cabin perspective and model files added.", createdBy: "Afsana Kabir", createdAt: "2026-03-03 16:40" },
  { id: "rev4", designId: "DES-2401-02", title: "Sent to client for approval", description: "Design package sent to Nabil Group.", createdBy: "Afsana Kabir", createdAt: "2026-03-05 11:00" },
  { id: "rev5", designId: "DES-2401-02", title: "Approved for BOQ", description: "Client approved. Released to estimation.", createdBy: "Client Portal", createdAt: "2026-03-08 14:05" },
  { id: "rev6", designId: "DES-2403-01", title: "Client requested revision", description: "Warmer lighting on display wall requested.", createdBy: "Client Portal", createdAt: "2026-03-09 09:30" },
  { id: "rev7", designId: "DES-2405-01", title: "Rev 02 submitted", description: "Updated furniture layout per client feedback.", createdBy: "Arif Hossain", createdAt: "2026-03-04 15:20" },
  { id: "rev8", designId: "DES-2405-01", title: "Approved for BOQ", description: "Manager room design approved.", createdBy: "Client Portal", createdAt: "2026-03-06 10:45" },
];

type FormState = {
  designTitle: string;
  projectCode: string;
  client: string;
  designType: DesignType | "";
  assignedDesigner: string;
  submissionDate: string;
  revisionNumber: string;
  approvalStatus: DesignWorkflowStatus | "";
  notes: string;
  files2D: UploadedFileRecord[];
  files3D: UploadedFileRecord[];
};

const emptyForm: FormState = {
  designTitle: "",
  projectCode: "",
  client: "",
  designType: "",
  assignedDesigner: "",
  submissionDate: "",
  revisionNumber: "Rev 01",
  approvalStatus: "Draft",
  notes: "",
  files2D: [],
  files3D: [],
};

export default function DesignConceptPage() {
  const [designs, setDesigns] = useState<DesignRecord[]>(INITIAL_DESIGNS);
  const [revisions, setRevisions] = useState<RevisionEntry[]>(INITIAL_REVISIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingDesign, setEditingDesign] = useState<DesignRecord | null>(null);
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [viewingDesign, setViewingDesign] = useState<DesignRecord | null>(null);
  const file2DRef = useRef<HTMLInputElement>(null);
  const file3DRef = useRef<HTMLInputElement>(null);

  const filteredDesigns = useMemo(
    () =>
      designs.filter((d) => {
        const matchSearch =
          !search ||
          d.designTitle.toLowerCase().includes(search.toLowerCase()) ||
          d.projectName.toLowerCase().includes(search.toLowerCase()) ||
          d.client.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || d.approvalStatus === statusFilter;
        const matchType = typeFilter === "all" || d.designType === typeFilter;
        return matchSearch && matchStatus && matchType;
      }),
    [designs, search, statusFilter, typeFilter],
  );

  const kpiActive = designs.length;
  const kpiPendingApproval = designs.filter(
    (d) => d.approvalStatus === "Sent to Client" || d.approvalStatus === "Under Review",
  ).length;
  const kpiApproved = designs.filter((d) => d.approvalStatus === "Approved").length;
  const kpiRevisionRequests = designs.filter(
    (d) => d.approvalStatus === "Revision Requested",
  ).length;

  const workflowCounts = useMemo(
    () =>
      DESIGN_STATUSES.reduce(
        (acc, status) => {
          acc[status] = designs.filter((d) => d.approvalStatus === status).length;
          return acc;
        },
        {} as Record<DesignWorkflowStatus, number>,
      ),
    [designs],
  );

  const portalWaiting = designs.filter((d) => d.approvalStatus === "Sent to Client").length;
  const portalApproved = designs.filter((d) => d.approvalStatus === "Approved").length;
  const portalRevisionRequested = designs.filter(
    (d) => d.approvalStatus === "Revision Requested",
  ).length;

  const addRevision = useCallback(
    (designId: string, title: string, description: string, createdBy: string) => {
      const createdAt = new Date().toISOString().slice(0, 16).replace("T", " ");
      setRevisions((prev) => [
        { id: `rev-${Date.now()}`, designId, title, description, createdBy, createdAt },
        ...prev,
      ]);
    },
    [],
  );

  const openCreate = useCallback(() => {
    setFormMode("create");
    setEditingDesign(null);
    setFormState(emptyForm);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((design: DesignRecord) => {
    setFormMode("edit");
    setEditingDesign(design);
    setFormState({
      designTitle: design.designTitle,
      projectCode: design.projectCode,
      client: design.client,
      designType: design.designType,
      assignedDesigner: design.assignedDesigner,
      submissionDate: design.submissionDate,
      revisionNumber: design.revisionNumber,
      approvalStatus: design.approvalStatus,
      notes: design.notes ?? "",
      files2D: [...design.files2D],
      files3D: [...design.files3D],
    });
    setSheetOpen(true);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, kind: "2D" | "3D") => {
      const files = e.target.files;
      if (!files?.length) return;
      const list: UploadedFileRecord[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        list.push({
          id: generateId(),
          name: f.name,
          type: f.type,
          size: f.size,
        });
      }
      if (kind === "2D") {
        setFormState((prev) => ({
          ...prev,
          files2D: [...prev.files2D, ...list],
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          files3D: [...prev.files3D, ...list],
        }));
      }
      e.target.value = "";
    },
    [],
  );

  const removeFile = useCallback(
    (kind: "2D" | "3D", id: string) => {
      if (kind === "2D") {
        setFormState((prev) => ({
          ...prev,
          files2D: prev.files2D.filter((f) => f.id !== id),
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          files3D: prev.files3D.filter((f) => f.id !== id),
        }));
      }
    },
    [],
  );

  const validateForm = useCallback((): boolean => {
    return !!(
      formState.designTitle.trim() &&
      formState.projectCode &&
      formState.client &&
      formState.designType &&
      formState.assignedDesigner
    );
  }, [formState]);

  const saveDesign = useCallback(() => {
    if (!validateForm()) return;
    const project = projects.find((p) => p.code === formState.projectCode) ?? projects[0];
    const now = new Date().toISOString().slice(0, 10);

    if (formMode === "create") {
      const nextNum = designs.filter((d) => d.projectCode === formState.projectCode).length + 1;
      const newId = `DES-${formState.projectCode.replace("INT-", "")}-${String(nextNum).padStart(2, "0")}`;
      const newDesign: DesignRecord = {
        id: newId,
        projectCode: formState.projectCode,
        projectName: project.name,
        client: formState.client,
        designTitle: formState.designTitle.trim(),
        designType: formState.designType as DesignType,
        assignedDesigner: formState.assignedDesigner,
        submissionDate: formState.submissionDate || now,
        revisionNumber: formState.revisionNumber || "Rev 01",
        approvalStatus: (formState.approvalStatus as DesignWorkflowStatus) || "Draft",
        lastUpdated: now,
        notes: formState.notes.trim() || undefined,
        files2D: [...formState.files2D],
        files3D: [...formState.files3D],
      };
      setDesigns((prev) => [newDesign, ...prev]);
      addRevision(
        newId,
        `${formState.revisionNumber || "Rev 01"} created by ${formState.assignedDesigner}`,
        "New design record created.",
        formState.assignedDesigner,
      );
      if (formState.files2D.length)
        addRevision(newId, "2D files uploaded", formState.files2D.map((f) => f.name).join(", "), formState.assignedDesigner);
      if (formState.files3D.length)
        addRevision(newId, "3D files uploaded", formState.files3D.map((f) => f.name).join(", "), formState.assignedDesigner);
    } else if (editingDesign) {
      const updated: DesignRecord = {
        ...editingDesign,
        projectCode: formState.projectCode,
        projectName: project.name,
        client: formState.client,
        designTitle: formState.designTitle.trim(),
        designType: formState.designType as DesignType,
        assignedDesigner: formState.assignedDesigner,
        submissionDate: formState.submissionDate || editingDesign.submissionDate,
        revisionNumber: formState.revisionNumber || editingDesign.revisionNumber,
        approvalStatus: (formState.approvalStatus as DesignWorkflowStatus) ?? editingDesign.approvalStatus,
        lastUpdated: now,
        notes: formState.notes.trim() || undefined,
        files2D: [...formState.files2D],
        files3D: [...formState.files3D],
      };
      setDesigns((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      addRevision(
        updated.id,
        "Design updated",
        `Fields and files updated by ${formState.assignedDesigner}.`,
        formState.assignedDesigner,
      );
    }
    setSheetOpen(false);
    setFormState(emptyForm);
    setEditingDesign(null);
  }, [formMode, editingDesign, formState, designs, validateForm, addRevision]);

  const updateStatus = useCallback((design: DesignRecord, status: DesignWorkflowStatus) => {
    const now = new Date().toISOString().slice(0, 10);
    setDesigns((prev) =>
      prev.map((d) =>
        d.id === design.id ? { ...d, approvalStatus: status, lastUpdated: now } : d,
      ),
    );
    addRevision(
      design.id,
      `Status changed to ${status}`,
      `Approval status updated.`,
      "System",
    );
  }, [addRevision]);

  const duplicateDesign = useCallback((design: DesignRecord) => {
    const now = new Date().toISOString().slice(0, 10);
    const copy: DesignRecord = {
      ...design,
      id: `${design.id}-COPY`,
      designTitle: `${design.designTitle} (Copy)`,
      approvalStatus: "Draft",
      lastUpdated: now,
      files2D: design.files2D.map((f) => ({ ...f, id: generateId() })),
      files3D: design.files3D.map((f) => ({ ...f, id: generateId() })),
    };
    setDesigns((prev) => [copy, ...prev]);
    addRevision(copy.id, "Design duplicated", `Created from ${design.id}.`, "User");
  }, [addRevision]);

  const deleteDesign = useCallback((design: DesignRecord) => {
    if (typeof window !== "undefined" && !window.confirm(`Delete design "${design.designTitle}"?`)) return;
    setDesigns((prev) => prev.filter((d) => d.id !== design.id));
    setDetailDialogOpen(false);
    setViewingDesign(null);
  }, []);

  const addRevisionFromRow = useCallback((design: DesignRecord) => {
    const rev = prompt("Revision note:");
    if (!rev?.trim()) return;
    addRevision(design.id, "Revision note added", rev.trim(), design.assignedDesigner);
  }, [addRevision]);

  const openView = useCallback((design: DesignRecord) => {
    setViewingDesign(design);
    setDetailDialogOpen(true);
  }, []);

  const revisionsForDesign = useMemo(
    () => (designId: string) => revisions.filter((r) => r.designId === designId),
    [revisions],
  );

  return (
    <div className="space-y-6 px-4 pb-8 md:px-8 lg:px-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="erp-page-title">Design &amp; Concept</h1>
          <p className="erp-page-subtitle">
            Manage design submissions, revisions, approvals, and file versions across projects.
          </p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Create New Design
        </Button>
      </div>

      {/* Top action area */}
      <div className="flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm dark:bg-neutral-900 md:flex-row md:items-center">
        <Input
          placeholder="Search by title, project, client, or design ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {DESIGN_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Design type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {DESIGN_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Active Design Jobs</CardTitle>
            <CardDescription>Total design records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiActive}</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Pending Approval</CardTitle>
            <CardDescription>Under review or sent to client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiPendingApproval}</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Approved Designs</CardTitle>
            <CardDescription>Ready for BOQ &amp; execution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiApproved}</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Revision Requests</CardTitle>
            <CardDescription>Client requested changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{kpiRevisionRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Design table */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle>Design Register</CardTitle>
            <CardDescription>
              All design records with 2D/3D file counts and approval status.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Design ID</TableHead>
                    <TableHead>Design Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Designer</TableHead>
                    <TableHead>Revision</TableHead>
                    <TableHead className="text-center">2D</TableHead>
                    <TableHead className="text-center">3D</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDesigns.map((design) => (
                    <TableRow
                      key={design.id}
                      className="hover:bg-muted/40 cursor-pointer"
                      onClick={() => openView(design)}
                    >
                      <TableCell className="font-medium">{design.id}</TableCell>
                      <TableCell>{design.designTitle}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{design.projectName}</div>
                        <div className="text-xs text-muted-foreground">{design.projectCode}</div>
                      </TableCell>
                      <TableCell>{design.client}</TableCell>
                      <TableCell>{design.designType}</TableCell>
                      <TableCell>{design.assignedDesigner}</TableCell>
                      <TableCell>{design.revisionNumber}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{design.files2D.length}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{design.files3D.length}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            design.approvalStatus === "Approved"
                              ? "success"
                              : design.approvalStatus === "Rejected" ||
                                design.approvalStatus === "Revision Requested"
                              ? "danger"
                              : design.approvalStatus === "Sent to Client"
                              ? "outline"
                              : "warning"
                          }
                        >
                          {design.approvalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {design.lastUpdated}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openView(design)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEdit(design)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => addRevisionFromRow(design)}>
                              Add Revision
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                openEdit(design);
                                setTimeout(() => file2DRef.current?.click(), 300);
                              }}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload 2D File
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                openEdit(design);
                                setTimeout(() => file3DRef.current?.click(), 300);
                              }}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload 3D File
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {DESIGN_STATUSES.map((s) => (
                              <DropdownMenuItem
                                key={s}
                                onClick={() => updateStatus(design, s)}
                              >
                                Change Status → {s}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => duplicateDesign(design)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteDesign(design)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            {filteredDesigns.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                <p>No designs match the current filters.</p>
                <Button variant="outline" size="sm" onClick={openCreate}>
                  Create New Design
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: workflow + revision timeline */}
        <div className="space-y-4">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Designs by status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DESIGN_STATUSES.map((status) => {
                const count = workflowCounts[status] ?? 0;
                const pct = kpiActive === 0 ? 0 : Math.round((count / kpiActive) * 100);
                return (
                  <div key={status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span>{status}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
              <div className="mt-4 rounded-lg border bg-slate-50 p-3 dark:bg-slate-900/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Client Portal
                </div>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Waiting for client review</span>
                    <Badge variant="outline">{portalWaiting}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Revision requested</span>
                    <Badge variant="danger">{portalRevisionRequested}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved by client</span>
                    <Badge variant="success">{portalApproved}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle>Revision History</CardTitle>
              <CardDescription>Recent activity across designs</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px]">
                <div className="space-y-3 pr-2">
                  {revisions.slice(0, 12).map((rev) => (
                    <div
                      key={rev.id}
                      className="flex gap-2 rounded-lg border bg-slate-50 p-3 text-xs dark:bg-slate-900/50"
                    >
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <div className="font-medium">{rev.title}</div>
                        <div className="mt-0.5 text-muted-foreground">{rev.description}</div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {rev.createdBy} · {rev.createdAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex max-w-xl flex-col overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {formMode === "create" ? "Create New Design" : "Edit Design"}
            </SheetTitle>
            <SheetDescription>
              {formMode === "create"
                ? "Add a new design record. Attach 2D and 3D files below."
                : "Update design details and file attachments."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-6 py-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Design Title *</Label>
                <Input
                  value={formState.designTitle}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, designTitle: e.target.value }))
                  }
                  placeholder="e.g. Reception Layout Rev-01"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Project *</Label>
                  <Select
                    value={formState.projectCode}
                    onValueChange={(v) => {
                      const p = projects.find((x) => x.code === v);
                      setFormState((prev) => ({
                        ...prev,
                        projectCode: v,
                        client: p?.client ?? prev.client,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.code} value={p.code}>
                          {p.code} · {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Client *</Label>
                  <Select
                    value={formState.client}
                    onValueChange={(v) =>
                      setFormState((prev) => ({ ...prev, client: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Design Type *</Label>
                  <Select
                    value={formState.designType}
                    onValueChange={(v) =>
                      setFormState((prev) => ({
                        ...prev,
                        designType: v as DesignType,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assigned Designer *</Label>
                  <Select
                    value={formState.assignedDesigner}
                    onValueChange={(v) =>
                      setFormState((prev) => ({ ...prev, assignedDesigner: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select designer" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGNERS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Submission Date</Label>
                  <Input
                    type="date"
                    value={formState.submissionDate}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, submissionDate: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Revision</Label>
                  <Input
                    value={formState.revisionNumber}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, revisionNumber: e.target.value }))
                    }
                    placeholder="Rev 01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Approval Status</Label>
                  <Select
                    value={formState.approvalStatus}
                    onValueChange={(v) =>
                      setFormState((prev) => ({
                        ...prev,
                        approvalStatus: v as DesignWorkflowStatus,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes / Description</Label>
                <Textarea
                  value={formState.notes}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows={3}
                  placeholder="Internal notes or client feedback..."
                />
              </div>
            </div>

            {/* 2D Files */}
            <div className="space-y-3 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base">2D Files</Label>
                </div>
                <input
                  ref={file2DRef}
                  type="file"
                  accept={ACCEPT_2D}
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "2D")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => file2DRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add 2D files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG, DWG
              </p>
              <div className="flex flex-wrap gap-2">
                {formState.files2D.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm dark:bg-neutral-900"
                  >
                    <Badge variant="outline" className="text-[10px]">
                      {f.type.split("/").pop()?.toUpperCase() ?? "FILE"}
                    </Badge>
                    <span className="max-w-[160px] truncate" title={f.name}>
                      {f.name}
                    </span>
                    {f.size != null && (
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(f.size)}
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeFile("2D", f.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {formState.files2D.length === 0 && (
                  <span className="text-sm text-muted-foreground">No 2D files added</span>
                )}
              </div>
            </div>

            {/* 3D Files */}
            <div className="space-y-3 rounded-xl border bg-slate-50 p-4 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base">3D Files</Label>
                </div>
                <input
                  ref={file3DRef}
                  type="file"
                  accept={ACCEPT_3D}
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "3D")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => file3DRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add 3D files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                SKP, ZIP, JPG, PNG
              </p>
              <div className="flex flex-wrap gap-2">
                {formState.files3D.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm dark:bg-neutral-900"
                  >
                    <Badge variant="outline" className="text-[10px]">
                      {f.type.split("/").pop()?.toUpperCase() ?? "FILE"}
                    </Badge>
                    <span className="max-w-[160px] truncate" title={f.name}>
                      {f.name}
                    </span>
                    {f.size != null && (
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(f.size)}
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeFile("3D", f.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {formState.files3D.length === 0 && (
                  <span className="text-sm text-muted-foreground">No 3D files added</span>
                )}
              </div>
            </div>
          </div>

          <SheetFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveDesign} disabled={!validateForm()}>
              {formMode === "create" ? "Save Design" : "Save Changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View detail dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              {viewingDesign?.id} · {viewingDesign?.designTitle}
              {viewingDesign && (
                <Badge
                  variant={
                    viewingDesign.approvalStatus === "Approved"
                      ? "success"
                      : viewingDesign.approvalStatus === "Revision Requested" ||
                        viewingDesign.approvalStatus === "Rejected"
                      ? "danger"
                      : "warning"
                  }
                >
                  {viewingDesign.approvalStatus}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Project: {viewingDesign?.projectName} · {viewingDesign?.client}
            </DialogDescription>
          </DialogHeader>
          {viewingDesign && (
            <div className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Design type</span>
                  <span>{viewingDesign.designType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Designer</span>
                  <span>{viewingDesign.assignedDesigner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revision</span>
                  <span>{viewingDesign.revisionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated</span>
                  <span>{viewingDesign.lastUpdated}</span>
                </div>
              </div>
              {viewingDesign.notes && (
                <div className="rounded-lg border bg-slate-50 p-3 text-sm dark:bg-slate-900/50">
                  <div className="text-xs font-medium text-muted-foreground">Notes</div>
                  <p className="mt-1">{viewingDesign.notes}</p>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">
                    2D Files ({viewingDesign.files2D.length})
                  </div>
                  <ul className="space-y-1 rounded-lg border bg-slate-50 p-2 text-xs dark:bg-slate-900/50">
                    {viewingDesign.files2D.length === 0 ? (
                      <li className="text-muted-foreground">None</li>
                    ) : (
                      viewingDesign.files2D.map((f) => (
                        <li key={f.id} className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          {f.name}
                          {f.size != null && (
                            <span className="text-muted-foreground">
                              {formatFileSize(f.size)}
                            </span>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">
                    3D Files ({viewingDesign.files3D.length})
                  </div>
                  <ul className="space-y-1 rounded-lg border bg-slate-50 p-2 text-xs dark:bg-slate-900/50">
                    {viewingDesign.files3D.length === 0 ? (
                      <li className="text-muted-foreground">None</li>
                    ) : (
                      viewingDesign.files3D.map((f) => (
                        <li key={f.id} className="flex items-center gap-2">
                          <Box className="h-3.5 w-3.5 shrink-0" />
                          {f.name}
                          {f.size != null && (
                            <span className="text-muted-foreground">
                              {formatFileSize(f.size)}
                            </span>
                          )}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  Revision history
                </div>
                <ScrollArea className="h-[140px] rounded-lg border bg-slate-50 p-2 dark:bg-slate-900/50">
                  <div className="space-y-2 text-xs">
                    {revisionsForDesign(viewingDesign.id).length === 0 ? (
                      <p className="text-muted-foreground">No revision entries yet.</p>
                    ) : (
                      revisionsForDesign(viewingDesign.id).map((rev) => (
                        <div key={rev.id}>
                          <div className="font-medium">{rev.title}</div>
                          <div className="text-muted-foreground">{rev.description}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {rev.createdBy} · {rev.createdAt}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(viewingDesign)}>
                  Edit
                </Button>
                <Button size="sm" onClick={() => setDetailDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
