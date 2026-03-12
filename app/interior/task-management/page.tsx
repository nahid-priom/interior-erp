"use client";

import { useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  tasksDemo,
  type TaskRecord,
  type TaskStatus,
  type TaskPriority,
} from "@/data/tasks-demo";
import { Plus, Filter, Paperclip, Pencil, Trash2 } from "lucide-react";

type ViewMode = "table" | "timeline";

type TaskFormState = {
  title: string;
  project: string;
  client: string;
  assignedTo: string;
  department: TaskRecord["department"];
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  notes: string;
};

const emptyForm: TaskFormState = {
  title: "",
  project: "",
  client: "",
  assignedTo: "",
  department: "Project Management",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
  notes: "",
};

const statusColors: Record<TaskStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Review: "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
};

const priorityColors: Record<TaskPriority, string> = {
  Low: "bg-neutral-100 text-neutral-700",
  Medium: "bg-sky-100 text-sky-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",
};

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>(tasksDemo);
  const [view, setView] = useState<ViewMode>("table");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<
    TaskRecord["department"] | "All"
  >("All");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskFormState>(emptyForm);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  const isEditing = editingId !== null;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "All" ? true : task.status === statusFilter;
      const matchesDepartment =
        departmentFilter === "All"
          ? true
          : task.department === departmentFilter;
      const matchesSearch =
        !search ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.project.toLowerCase().includes(search.toLowerCase()) ||
        task.client.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesDepartment && matchesSearch;
    });
  }, [tasks, statusFilter, departmentFilter, search]);

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(
    (t) => t.status === "Pending" || t.status === "In Progress" || t.status === "Review",
  ).length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && t.dueDate < "2026-03-12" && t.status !== "Completed",
  ).length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setAttachmentNames([]);
  }

  function startEdit(task: TaskRecord) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      project: task.project,
      client: task.client,
      assignedTo: task.assignedTo,
      department: task.department,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      notes: task.notes ?? "",
    });
    setAttachmentNames(task.attachments ?? []);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title || !form.project || !form.client || !form.assignedTo) {
      return;
    }

    if (isEditing) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId
            ? {
                ...task,
                ...form,
                attachments: attachmentNames,
              }
            : task,
        ),
      );
    } else {
      const nextId = `T-${(2400 + tasks.length + 1).toString()}`;
      const newTask: TaskRecord = {
        id: nextId,
        ...form,
        workflowStage: form.status === "Pending" ? "Lead" : "Execution",
        attachments: attachmentNames,
      };
      setTasks((current) => [newTask, ...current]);
    }

    setEditingId(null);
    setForm(emptyForm);
    setAttachmentNames([]);
  }

  function handleDelete(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
      setAttachmentNames([]);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Task Management
          </h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Central operational board connecting CRM, design, BOQ, procurement, site execution, and handover.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
            <Filter className="h-3.5 w-3.5 text-neutral-400" />
            <Input
              placeholder="Search by task, project, or client"
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
            Create Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Pending, In Progress, and Review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{activeTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Delivered across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-baseline gap-2">
              <div className="text-2xl font-semibold">{completedTasks}</div>
              <Badge
                className={cn(
                  "text-xs",
                  completionRate >= 60
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700",
                )}
              >
                {completionRate}% completion
              </Badge>
            </div>
            <Progress value={completionRate} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
            <CardDescription>Tasks past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-red-600">
              {overdueTasks}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workload</CardTitle>
            <CardDescription>Total tasks in this demo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)]">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Task Board</CardTitle>
                <CardDescription>
                  Consolidated view of lead follow-ups, design, BOQ, procurement, site work, and handover tasks.
                </CardDescription>
              </div>
              <Tabs
                defaultValue="table"
                className="hidden text-xs sm:block"
              >
                <TabsList>
                  <TabsTrigger value="table">Task Table</TabsTrigger>
                  <TabsTrigger value="timeline">Workflow Timeline</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table">
              <TabsList className="mb-3 sm:hidden">
                <TabsTrigger value="table">Task Table</TabsTrigger>
                <TabsTrigger value="timeline">Workflow Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="mt-3 border-0 p-0">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-neutral-500">Filter by:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(["All", "Pending", "In Progress", "Review", "Completed"] as const).map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            setStatusFilter(
                              status === "All" ? "All" : (status as TaskStatus),
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
                      ),
                    )}
                  </div>
                </div>

                <ScrollArea className="max-h-[480px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Project / Client</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {task.title}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {task.id} · {task.workflowStage}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">{task.project}</div>
                            <div className="text-[11px] text-neutral-500">
                              {task.client}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">{task.department}</div>
                            <div className="text-[11px] text-neutral-500">
                              {task.assignedTo}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                                statusColors[task.status],
                              )}
                            >
                              {task.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium",
                                priorityColors[task.priority],
                              )}
                            >
                              {task.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-neutral-800 dark:text-neutral-200">
                              {task.dueDate || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 rounded-full p-0"
                                onClick={() => startEdit(task)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 rounded-full p-0 text-red-600"
                                onClick={() => handleDelete(task.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredTasks.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="py-6 text-center text-xs text-neutral-500"
                          >
                            No tasks match this filter or search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="timeline" className="mt-3 border-0 p-0">
                <div className="space-y-3 text-xs">
                  {[
                    "Lead",
                    "Site Visit",
                    "Design",
                    "BOQ Estimate",
                    "Quotation",
                    "Client Approval",
                    "Execution",
                    "Procurement",
                    "Installation",
                    "Billing",
                    "Handover",
                  ].map((stage) => {
                    const stageTasks = tasks.filter(
                      (task) => task.workflowStage === stage,
                    );
                    if (stageTasks.length === 0) return null;
                    const completedInStage = stageTasks.filter(
                      (task) => task.status === "Completed",
                    ).length;
                    const percentage = Math.round(
                      (completedInStage / stageTasks.length) * 100,
                    );
                    return (
                      <div
                        key={stage}
                        className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-50">
                            {stage}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {completedInStage} of {stageTasks.length} completed
                          </span>
                        </div>
                        <Progress value={percentage} />
                        <div className="mt-2 grid gap-1.5 md:grid-cols-2">
                          {stageTasks.slice(0, 4).map((task) => (
                            <div
                              key={task.id}
                              className="rounded-md bg-white px-2 py-1.5 text-[11px] shadow-sm dark:bg-neutral-950"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="line-clamp-1 font-medium">
                                  {task.title}
                                </span>
                                <span
                                  className={cn(
                                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium",
                                    statusColors[task.status],
                                  )}
                                >
                                  {task.status}
                                </span>
                              </div>
                              <div className="mt-0.5 text-[10px] text-neutral-500">
                                {task.project} · {task.dueDate || "No due date"}
                              </div>
                            </div>
                          ))}
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
            <CardTitle>{isEditing ? "Edit Task" : "Create Task"}</CardTitle>
            <CardDescription>
              Capture operational tasks across CRM, design, BOQ, procurement, execution, and handover.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                  Task Title
                </label>
                <Input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Follow up with client, prepare BOQ, schedule site visit..."
                />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Project
                  </label>
                  <Input
                    required
                    value={form.project}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, project: e.target.value }))
                    }
                    placeholder="Project name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Client
                  </label>
                  <Input
                    required
                    value={form.client}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, client: e.target.value }))
                    }
                    placeholder="Client name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Assigned To
                  </label>
                  <Input
                    required
                    value={form.assignedTo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, assignedTo: e.target.value }))
                    }
                    placeholder="Owner of this task"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        department: e.target
                          .value as TaskRecord["department"],
                      }))
                    }
                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="CRM / Leads">CRM / Leads</option>
                    <option value="Design">Design</option>
                    <option value="BOQ & Estimation">BOQ &amp; Estimation</option>
                    <option value="Project Management">Project Management</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Site Execution">Site Execution</option>
                    <option value="Installation">Installation</option>
                    <option value="Finance">Finance</option>
                    <option value="Handover">Handover</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        priority: e.target.value as TaskPriority,
                      }))
                    }
                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
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
                        status: e.target.value as TaskStatus,
                      }))
                    }
                    className="h-9 w-full rounded-md border border-neutral-200 bg-white px-2 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dueDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                  Notes
                </label>
                <Textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Add site instructions, design considerations, or coordination notes."
                  className="min-h-[70px]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
                  Attachments
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex w-full items-center justify-between rounded-md border-dashed"
                  onClick={() => {
                    const input = document.getElementById(
                      "task-attachments-input",
                    ) as HTMLInputElement | null;
                    input?.click();
                  }}
                >
                  <span className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-200">
                    <Paperclip className="h-3.5 w-3.5" />
                    {attachmentNames.length > 0
                      ? `${attachmentNames.length} attachment(s) selected`
                      : "Upload design files, BOQ documents, or site images"}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Simulated upload
                  </span>
                </Button>
                <input
                  id="task-attachments-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (!files.length) return;
                    setAttachmentNames(files.map((file) => file.name));
                  }}
                />
                {attachmentNames.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-[11px] text-neutral-600 dark:text-neutral-300">
                    {attachmentNames.map((name) => (
                      <li key={name} className="flex items-center gap-1.5">
                        <Paperclip className="h-3 w-3" />
                        <span className="truncate">{name}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
                      setAttachmentNames([]);
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
                  {isEditing ? "Update Task" : "Save Task"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

