export const dashboardSummary = {
  staffCount: 25,
  projects: 20,
  leads: 42,
  activeTasks: 86,
  staffChange: "+3 new hires this quarter",
  projectsChange: "+5 live interior projects",
  leadsChange: "Healthy inbound pipeline",
  tasksChange: "Tasks distributed across all departments",
};

export const staffApplicationsDonut = {
  total: 100,
  segments: [
    { label: "Completed", value: 62, color: "bg-green-500" },
    { label: "In Progress", value: 24, color: "bg-indigo-500" },
    { label: "Pending / Review", value: 14, color: "bg-amber-500" },
  ],
};

export const annualPayrollChart = {
  months: ["Sep", "Oct", "Nov", "Dec"],
  series: [
    {
      name: "Net salary (BDT lakh)",
      color: "bg-indigo-500",
      values: [480, 520, 510, 560],
    },
    {
      name: "Tax (BDT lakh)",
      color: "bg-purple-500",
      values: [120, 140, 135, 150],
    },
    {
      name: "Loan (BDT lakh)",
      color: "bg-orange-400",
      values: [60, 80, 70, 75],
    },
  ],
};

export const incomeChart = {
  totalIncome: 11800000,
  growthLabel: "↑ 21% vs last month",
  points: [40, 52, 60, 78],
};

export type PaymentVoucherStatus = "Approved" | "Pending";

export interface PaymentVoucher {
  sn: number;
  subject: string;
  date: string;
  status: PaymentVoucherStatus;
}

export interface BudgetHistoryItem {
  sn: number;
  budgetNo: string;
  budgetAmount: number;
  actualAmount: number;
  date: string;
}

export const voucherList: PaymentVoucher[] = [
  {
    sn: 1,
    subject: "Request for FARS for October 2025",
    date: "25/10/2025",
    status: "Pending",
  },
  {
    sn: 2,
    subject: "Request for project proposal fee",
    date: "19/10/2025",
    status: "Approved",
  },
  {
    sn: 3,
    subject: "Request for FARS for October 2022",
    date: "10/10/2025",
    status: "Approved",
  },
  {
    sn: 4,
    subject: "Request for project proposal fee",
    date: "03/10/2025",
    status: "Pending",
  },
];

export const budgetHistory: BudgetHistoryItem[] = [
  {
    sn: 1,
    budgetNo: "00211235",
    budgetAmount: 14000000,
    actualAmount: 13800000,
    date: "25/10/2025",
  },
  {
    sn: 2,
    budgetNo: "00211236",
    budgetAmount: 38000000,
    actualAmount: 35000000,
    date: "22/10/2025",
  },
  {
    sn: 3,
    budgetNo: "00214465",
    budgetAmount: 20000000,
    actualAmount: 14000000,
    date: "20/10/2025",
  },
  {
    sn: 4,
    budgetNo: "00214466",
    budgetAmount: 58000000,
    actualAmount: 48000000,
    date: "18/10/2025",
  },
];

