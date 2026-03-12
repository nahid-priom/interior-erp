"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Upload, Pencil, Trash2 } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  demoLeads,
  leadPipelineStages,
  type DemoLead,
  type LeadPipelineStage,
  type LeadSource,
  projects,
} from "@/lib/demo-data";

const pipelineStages = leadPipelineStages;
export type LeadStatus = LeadPipelineStage;
export type LeadRecord = DemoLead;

interface LeadFormState {
  leadName: string;
  phone: string;
  email: string;
  source: LeadSource;
  projectType: string;
  location: string;
  budget: string;
  assignedTo: string;
  followUpDate: string;
  status: LeadStatus;
  notes: string;
}

const emptyForm: LeadFormState = {
  leadName: "",
  phone: "",
  email: "",
  source: "Website",
  projectType: "",
  location: "",
  budget: "",
  assignedTo: "",
  followUpDate: "",
  status: "Lead",
  notes: "",
};

export function LeadsCrmModule() {
  const [leads, setLeads] = useState<LeadRecord[]>(() => [...demoLeads]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [activeTab, setActiveTab] = useState<"table" | "pipeline">("table");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadFormState>(emptyForm);
  const [requirementFileName, setRequirementFileName] = useState<string | undefined>();

  const isEditing = editingId !== null;

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        lead.leadName.toLowerCase().includes(search.toLowerCase()) ||
        lead.projectType.toLowerCase().includes(search.toLowerCase()) ||
        lead.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ? true : lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const totalLeads = leads.length;
  const siteVisits = leads.filter((l) => l.status === "Site Visit").length;
  const designProposals = leads.filter((l) =>
    ["Requirement", "Design Proposal"].includes(l.status),
  ).length;
  const wonDeals = leads.filter((l) => l.status === "Closed Won").length;
  const conversionRate =
    totalLeads === 0 ? 0 : Math.round((wonDeals / totalLeads) * 100);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setRequirementFileName(undefined);
  }

  function startEdit(record: LeadRecord) {
    setEditingId(record.id);
    setForm({
      leadName: record.leadName,
      phone: record.phone,
      email: record.email,
      source: record.source,
      projectType: record.projectType,
      location: record.location,
      budget: record.budget.toString(),
      assignedTo: record.assignedTo,
      followUpDate: record.followUpDate,
      status: record.status,
      notes: record.notes,
    });
    setRequirementFileName(record.requirementFileName);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const budgetValue = Number(form.budget || 0);

    if (isEditing) {
      setLeads((current) =>
        current.map((lead) =>
          lead.id === editingId
            ? {
                ...lead,
                ...form,
                budget: budgetValue,
                requirementFileName,
              }
            : lead,
        ),
      );
    } else {
      const nextId = `L-${(2400 + leads.length + 1).toString()}`;
      const newLead: LeadRecord = {
        id: nextId,
        ...form,
        budget: budgetValue,
        requirementFileName,
      };
      setLeads((current) => [newLead, ...current]);
    }

    setEditingId(null);
    setForm(emptyForm);
    setRequirementFileName(undefined);
  }

  function handleDelete(id: string) {
    setLeads((current) => current.filter((lead) => lead.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
      setRequirementFileName(undefined);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Leads &amp; CRM
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Capture interior leads, manage follow-ups, and move deals through the workflow from Lead to Client Approval.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
            <Search className="h-3.5 w-3.5 text-neutral-400" />
            <Input
              placeholder="Search by client, project, or location"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 border-none bg-transparent px-0 text-xs focus-visible:ring-0"
            />
          </div>
          <Button
            size="sm"
            className="rounded-full bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700"
            onClick={startCreate}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
            <CardDescription>Open opportunities this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Site Visits</CardTitle>
            <CardDescription>Leads with site visit planned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{siteVisits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Design &amp; Proposals</CardTitle>
            <CardDescription>Requirement / Design Proposal stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{designProposals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Closed Won vs total leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-baseline gap-2">
              <div className="text-2xl font-semibold">{conversionRate}%</div>
              <Badge variant={conversionRate >= 40 ? "success" : "warning"}>
                {conversionRate >= 40 ? "Healthy pipeline" : "Needs follow-up"}
              </Badge>
            </div>
            <Progress value={conversionRate} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.35fr)]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Lead Register &amp; Pipeline</CardTitle>
            <CardDescription>
              Move every enquiry from Lead → Site Visit → Requirement → Design Proposal → BOQ / Estimate → Quotation → Client Approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList>
                <TabsTrigger value="table">Lead Table</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="mt-3 border-0 p-0">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-neutral-500">Filter by status:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant={statusFilter === "All" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setStatusFilter("All")}
                    >
                      All
                    </Badge>
                    {pipelineStages.map((stage) => (
                      <Badge
                        key={stage}
                        variant={statusFilter === stage ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setStatusFilter(stage)}
                      >
                        {stage}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Project Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Follow-up</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {lead.leadName}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {lead.phone} · {lead.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">{lead.projectType}</div>
                          <div className="text-[11px] text-neutral-500">
                            Source: {lead.source}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{lead.status}</Badge>
                        </TableCell>
                        <TableCell>
                          ৳ {lead.budget.toLocaleString("en-BD")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar
                              initials={lead.assignedTo
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            />
                            <span className="text-xs">{lead.assignedTo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-neutral-700 dark:text-neutral-300">
                            {lead.followUpDate}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 rounded-full p-0"
                              onClick={() => startEdit(lead)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 rounded-full p-0 text-red-600"
                              onClick={() => handleDelete(lead.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredLeads.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-6 text-center text-xs text-neutral-500"
                        >
                          No leads match this search or filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="pipeline" className="mt-3 border-0 p-0">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {pipelineStages.map((stage) => {
                    const leadsInStage = leads.filter(
                      (lead) => lead.status === stage,
                    );
                    return (
                      <div
                        key={stage}
                        className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900/60"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-semibold text-neutral-700 dark:text-neutral-100">
                            {stage}
                          </span>
                          <Badge variant="outline">{leadsInStage.length}</Badge>
                        </div>
                        <Separator className="mb-2" />
                        <div className="space-y-2">
                          {leadsInStage.map((lead) => (
                            <div
                              key={lead.id}
                              className="rounded-md bg-white px-2 py-1.5 text-[11px] shadow-sm dark:bg-neutral-950"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">
                                  {lead.leadName}
                                </span>
                                <span className="text-[10px] text-neutral-500">
                                  {lead.followUpDate}
                                </span>
                              </div>
                              <div className="mt-0.5 text-[11px] text-neutral-500">
                                {lead.projectType} · ৳{" "}
                                {lead.budget.toLocaleString("en-BD")}
                              </div>
                            </div>
                          ))}
                          {leadsInStage.length === 0 && (
                            <p className="text-[11px] text-neutral-500">
                              No active leads in this stage.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Lead" : "Add Lead"}</CardTitle>
            <CardDescription>
              Quick capture form for new enquiries and updates from calls or visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Lead Name
                  </label>
                  <Input
                    required
                    value={form.leadName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, leadName: e.target.value }))
                    }
                    placeholder="Client or company name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Phone
                  </label>
                  <Input
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+8801..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Source
                  </label>
                  <select
                    value={form.source}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        source: e.target.value as LeadSource,
                      }))
                    }
                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Website">Website</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Project Type
                  </label>
                  <Input
                    value={form.projectType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, projectType: e.target.value }))
                    }
                    placeholder="Office, apartment, restaurant..."
                    list="project-type-suggestions"
                  />
                  <datalist id="project-type-suggestions">
                    {projects.slice(0, 5).map((project) => (
                      <option key={project.code} value={project.name} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Location
                  </label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="Area, city"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Budget (BDT)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={form.budget}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, budget: e.target.value }))
                    }
                    placeholder="Approximate value"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Assigned Sales Executive
                  </label>
                  <Input
                    value={form.assignedTo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, assignedTo: e.target.value }))
                    }
                    placeholder="Owner of this lead"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Next Follow-up Date
                  </label>
                  <Input
                    type="date"
                    value={form.followUpDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, followUpDate: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as LeadStatus,
                      }))
                    }
                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    {pipelineStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                  Requirement Notes
                </label>
                <Textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Summarise scope, preferences, and any special instructions."
                  className="min-h-[70px]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                  Requirement File (optional)
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex w-full items-center justify-between rounded-md border-dashed"
                  onClick={() => {
                    const input = document.getElementById(
                      "lead-requirement-file",
                    ) as HTMLInputElement | null;
                    input?.click();
                  }}
                >
                  <span className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-200">
                    <Upload className="h-3.5 w-3.5" />
                    {requirementFileName
                      ? requirementFileName
                      : "Upload client requirement, drawing, or brief"}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Simulated upload
                  </span>
                </Button>
                <input
                  id="lead-requirement-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setRequirementFileName(file.name);
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                      setRequirementFileName(undefined);
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  {isEditing ? "Update Lead" : "Save Lead"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

