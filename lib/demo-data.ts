export type ProjectCode =
  | "INT-2401"
  | "INT-2402"
  | "INT-2403"
  | "INT-2404"
  | "INT-2405"
  | "INT-2406"
  | "INT-2407"
  | "INT-2408"
  | "INT-2409"
  | "INT-2410"
  | "INT-2411"
  | "INT-2412"
  | "INT-2413"
  | "INT-2414"
  | "INT-2415"
  | "INT-2416"
  | "INT-2417"
  | "INT-2418"
  | "INT-2419"
  | "INT-2420";

export const workflowStages = [
  "Lead",
  "Site Visit",
  "Design",
  "BOQ / Estimate",
  "Quotation",
  "Client Approval",
  "Project Execution",
  "Material Procurement",
  "Installation",
  "Billing",
  "Project Handover",
] as const;

export type WorkflowStage = (typeof workflowStages)[number];

export const clients = [
  "Rafiq Ahmed",
  "Tasnia Karim",
  "Nabil Group",
  "Bengal Workspace Ltd",
  "Lakeshore Café",
  "Urban Edge Properties",
  "Rahman Holdings",
] as const;

export const projectCodes: ProjectCode[] = [
  "INT-2401",
  "INT-2402",
  "INT-2403",
  "INT-2404",
  "INT-2405",
  "INT-2406",
  "INT-2407",
  "INT-2408",
  "INT-2409",
  "INT-2410",
  "INT-2411",
  "INT-2412",
  "INT-2413",
  "INT-2414",
  "INT-2415",
  "INT-2416",
  "INT-2417",
  "INT-2418",
  "INT-2419",
  "INT-2420",
];

export const projects = [
  {
    code: "INT-2401",
    name: "Banani Corporate Office Fit-out",
    client: "Nabil Group",
  },
  {
    code: "INT-2402",
    name: "Dhanmondi Apartment Interior",
    client: "Rafiq Ahmed",
  },
  {
    code: "INT-2403",
    name: "Gulshan Showroom Renovation",
    client: "Bengal Workspace Ltd",
  },
  {
    code: "INT-2404",
    name: "Uttara Restaurant Interior",
    client: "Lakeshore Café",
  },
  {
    code: "INT-2405",
    name: "Bashundhara Executive Office",
    client: "Rahman Holdings",
  },
  {
    code: "INT-2406",
    name: "Mirpur Studio Apartment Custom Interior",
    client: "Tasnia Karim",
  },
  {
    code: "INT-2407",
    name: "Chattogram Retail Display Project",
    client: "Urban Edge Properties",
  },
  {
    code: "INT-2408",
    name: "Gulshan Executive Floor Refurbishment",
    client: "Rahman Holdings",
  },
  {
    code: "INT-2409",
    name: "Uttara Duplex Luxury Interior",
    client: "Rafiq Ahmed",
  },
  {
    code: "INT-2410",
    name: "Bashundhara Board Room Upgrade",
    client: "Rahman Holdings",
  },
  {
    code: "INT-2411",
    name: "Banani Co-working Space Fit-out",
    client: "Urban Edge Properties",
  },
  {
    code: "INT-2412",
    name: "Dhanmondi Clinic Reception Interior",
    client: "Rahman Holdings",
  },
  {
    code: "INT-2413",
    name: "Gulshan Café Interior Refresh",
    client: "Lakeshore Café",
  },
  {
    code: "INT-2414",
    name: "Chattogram Sales Office Interior",
    client: "Nabil Group",
  },
  {
    code: "INT-2415",
    name: "Mirpur Retail Kiosk Design & Build",
    client: "Bengal Workspace Ltd",
  },
  {
    code: "INT-2416",
    name: "Banani High-rise Lobby Upgrade",
    client: "Urban Edge Properties",
  },
  {
    code: "INT-2417",
    name: "Bashundhara HR Floor Interior",
    client: "Rahman Holdings",
  },
  {
    code: "INT-2418",
    name: "Gulshan Law Chamber Fit-out",
    client: "Tasnia Karim",
  },
  {
    code: "INT-2419",
    name: "Uttara Boutique Store Interior",
    client: "Bengal Workspace Ltd",
  },
  {
    code: "INT-2420",
    name: "Banani Studio Apartment Interior",
    client: "Rafiq Ahmed",
  },
] as const;

export const vendors = [
  "Dhaka Board & Timber Supply",
  "Bengal Hardware & Fittings",
  "GlassLine BD",
  "Noor Paint House",
  "Elite Lighting & Electrical",
  "Urban Décor Accessories",
] as const;

export const warehouses = [
  "Main Warehouse",
  "Board Store",
  "Hardware Store",
  "Site Transit Stock",
  "Workshop Raw Material Yard",
] as const;

export const materials = [
  "MDF Board 18mm",
  "Plywood 12mm",
  "Premium Laminate Sheet",
  "Soft Close Hinge",
  "Drawer Channel Set",
  "Clear Glass Panel",
  "Emulsion Paint Off White",
  "LED Strip Light 5m",
  "Decorative Handle Set",
  "PVC Edge Band Roll",
  "MDF Board 12mm",
  "Plywood 18mm Marine Grade",
  "High Gloss Laminate Sheet",
  "Matte Finish Laminate Sheet",
  "PVC Ceiling Panel",
  "POP Cornice Profile",
  "Door Closer Heavy Duty",
  "Concealed Handle Profile",
  "Aluminium Skirting",
  "Acoustic Panel 12mm",
  "Soft Board Pin-up Panel",
  "Track Light Fitting",
  "Surface Downlight",
  "Recessed Panel Light",
  "Task Light for Workstation",
  "Glass Door Floor Spring",
  "Patch Fitting Set",
  "Shower Hinges Set",
  "Mirror with LED Backlight",
  "Vinyl Flooring Roll",
  "Engineered Wood Flooring",
  "Carpet Tile 500x500",
  "Wall Paper Luxury Texture",
  "Sheer Curtain Fabric",
  "Blackout Curtain Fabric",
  "Granite Countertop Slab",
  "Quartz Countertop Slab",
  "Stainless Steel Sink Single Bowl",
  "Modular Kitchen Channel",
  "Wardrobe Hanging Rod",
  "PVC Edge Band 0.8mm",
  "PVC Edge Band 1mm",
  "Gypsum Board 12mm",
  "Metal Framing Stud",
  "Metal Framing Track",
  "Wall Putty 40kg Bag",
  "Primer Sealer",
  "PU Polish Clear",
  "Metallic Paint Feature",
] as const;

export const employees = [
  { name: "Arif Hossain", role: "Project Manager", department: "Projects" },
  { name: "Tanvir Hasan", role: "Site Supervisor", department: "Projects" },
  {
    name: "Mehedi Islam",
    role: "Procurement Officer",
    department: "Procurement",
  },
  { name: "Nusrat Jahan", role: "CRM Executive", department: "CRM" },
  { name: "Sharif Uddin", role: "Accounts Manager", department: "Accounts" },
  { name: "Rakib Molla", role: "Workshop In-Charge", department: "Workshop" },
  { name: "Fahim Reza", role: "Design Coordinator", department: "Design" },
] as const;

export const contractors = [
  { name: "Bismillah Carpentry Team", workType: "Carpentry" },
  { name: "Prime Electrical Works", workType: "Electrical" },
  { name: "Royal Paint & Polish Team", workType: "Painting" },
  { name: "Metro Glass Installation", workType: "Glass" },
  { name: "Dhaka Ceiling Solutions", workType: "Ceiling" },
  { name: "City HVAC Services", workType: "HVAC" },
  { name: "Premium Flooring Crew", workType: "Flooring" },
  { name: "Elite Signage & Branding", workType: "Signage" },
  { name: "SecureFire Solutions", workType: "Fire Safety" },
  { name: "CleanFinish Housekeeping", workType: "Post-Handover Cleaning" },
] as const;

export const currency = "BDT";

// Leads & CRM demo data
export const leadPipelineStages = [
  "Lead",
  "Site Visit",
  "Requirement",
  "Design Proposal",
  "BOQ / Estimate",
  "Quotation",
  "Client Approval",
  "Closed Won",
  "Closed Lost",
] as const;

export type LeadPipelineStage = (typeof leadPipelineStages)[number];

export type LeadSource =
  | "Facebook"
  | "Website"
  | "WhatsApp"
  | "Referral"
  | "Other";

export interface DemoLead {
  id: string;
  leadName: string;
  phone: string;
  email: string;
  source: LeadSource;
  projectType: string;
  location: string;
  budget: number;
  assignedTo: string;
  followUpDate: string;
  status: LeadPipelineStage;
  notes: string;
  requirementFileName?: string;
}

export const demoLeads: DemoLead[] = [
  {
    id: "L-2401",
    leadName: clients[2],
    phone: "+8801711-234567",
    email: "contact@nabilgroup.com",
    source: "Referral",
    projectType: "Corporate Office Fit-out",
    location: "Banani, Dhaka",
    budget: 4200000,
    assignedTo: "Nusrat Jahan",
    followUpDate: "2026-03-14",
    status: "Design Proposal",
    notes: "Concept 3D shared, waiting for BOQ review.",
  },
  {
    id: "L-2402",
    leadName: clients[0],
    phone: "+8801812-987654",
    email: "rafiq.apt@example.com",
    source: "Website",
    projectType: "Apartment Interior",
    location: "Dhanmondi, Dhaka",
    budget: 1800000,
    assignedTo: "Nusrat Jahan",
    followUpDate: "2026-03-13",
    status: "Site Visit",
    notes: "Site visit scheduled for Saturday morning.",
  },
  {
    id: "L-2403",
    leadName: clients[4],
    phone: "+8801913-112233",
    email: "lakeshore.int@example.com",
    source: "Facebook",
    projectType: "Restaurant Interior",
    location: "Uttara, Dhaka",
    budget: 3200000,
    assignedTo: "Fahim Reza",
    followUpDate: "2026-03-16",
    status: "Quotation",
    notes: "Shared quotation; client reviewing internally.",
  },
];

