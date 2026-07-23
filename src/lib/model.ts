// ---------------------------------------------------------------------------
// Data model + seed content for the Syspex TAS "Claude AI Rollout" tracker.
// Seeded directly from the internal Framework for Using Claude AI at Syspex.
// ---------------------------------------------------------------------------

export type TrackId = "track1" | "track2" | "track3";
export type Status = "todo" | "in_progress" | "blocked" | "done";
export type Priority = "low" | "medium" | "high";
export type TeamId =
  | "presales"
  | "drawing"
  | "software"
  | "management"
  | "unassigned";

export type MemberId =
  | "AM"
  | "AD"
  | "AF"
  | "TR"
  | "GP"
  | "MI"
  | "MW"
  | "SF"
  | "RR"
  | "RS"
  | "unassigned";

export interface Task {
  id: string;
  title: string;
  description?: string;
  trackId: TrackId;
  team: TeamId;
  member: MemberId;
  assignee?: string;
  status: Status;
  priority: Priority;
  dueDate?: string; // ISO yyyy-mm-dd
  milestoneId?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  timeframe: string;
  focus: string;
  trackId: TrackId;
  targetDate?: string;
}

export interface AppState {
  version: number;
  projectName: string;
  tasks: Task[];
  currentMember?: MemberId;
  savedAt?: string;
}

export const SCHEMA_VERSION = 1;

// --- Reference metadata -----------------------------------------------------

export const TRACKS: Record<
  TrackId,
  { name: string; short: string; subtitle: string; accent: string; soft: string; text: string; ring: string }
> = {
  track1: {
    name: "Internal Enablement",
    short: "Category 1",
    subtitle: "Pre-sales, proposals & technical Q&A",
    accent: "#4f46e5",
    soft: "#eef2ff",
    text: "#3730a3",
    ring: "#c7d2fe",
  },
  track2: {
    name: "Product Integration",
    short: "Category 2",
    subtitle: "Claude as a smart layer inside Syspex solutions",
    accent: "#d97706",
    soft: "#fff7ed",
    text: "#9a3412",
    ring: "#fed7aa",
  },
  track3: {
    name: "Personal Workflow",
    short: "Category 3",
    subtitle: "Faster learning & sharper communication",
    accent: "#0d9488",
    soft: "#f0fdfa",
    text: "#115e59",
    ring: "#99f6e4",
  },
};

export const TEAMS: Record<TeamId, { name: string; short: string; color: string }> = {
  presales: { name: "Pre-sales", short: "PS", color: "#2563eb" },
  drawing: { name: "Drawing Engineering", short: "DE", color: "#0891b2" },
  software: { name: "Software Team", short: "SW", color: "#7c3aed" },
  management: { name: "Management / Head of Tech", short: "MG", color: "#475569" },
  unassigned: { name: "Unassigned", short: "—", color: "#94a3b8" },
};

export const TEAM_ORDER: TeamId[] = [
  "presales",
  "drawing",
  "software",
  "management",
  "unassigned",
];

// Individual team members (by initials). `team` is a best-guess grouping used
// for seeding placeholder assignments — edit any task to reassign.
export const MEMBERS: Record<MemberId, { code: string; name: string; team: TeamId; color: string }> = {
  GP: { code: "GP", name: "GP (you)", team: "management", color: "#0f172a" },
  AM: { code: "AM", name: "AM", team: "presales", color: "#2563eb" },
  AD: { code: "AD", name: "AD", team: "presales", color: "#7c3aed" },
  AF: { code: "AF", name: "AF", team: "presales", color: "#c026d3" },
  TR: { code: "TR", name: "TR", team: "presales", color: "#0891b2" },
  MI: { code: "MI", name: "MI", team: "software", color: "#059669" },
  MW: { code: "MW", name: "MW", team: "software", color: "#d97706" },
  SF: { code: "SF", name: "SF", team: "software", color: "#dc2626" },
  RR: { code: "RR", name: "RR", team: "drawing", color: "#4f46e5" },
  RS: { code: "RS", name: "RS", team: "drawing", color: "#0d9488" },
  unassigned: { code: "—", name: "Unassigned", team: "unassigned", color: "#94a3b8" },
};

// Display order for members (unassigned last).
export const MEMBER_ORDER: MemberId[] = [
  "GP",
  "AM",
  "AD",
  "AF",
  "TR",
  "MI",
  "MW",
  "SF",
  "RR",
  "RS",
  "unassigned",
];

export const STATUSES: Record<
  Status,
  { name: string; color: string; soft: string; text: string }
> = {
  todo: { name: "To Do", color: "#64748b", soft: "#f1f5f9", text: "#475569" },
  in_progress: { name: "In Progress", color: "#2563eb", soft: "#eff6ff", text: "#1d4ed8" },
  blocked: { name: "Blocked", color: "#e11d48", soft: "#fff1f2", text: "#be123c" },
  done: { name: "Done", color: "#059669", soft: "#ecfdf5", text: "#047857" },
};

export const STATUS_ORDER: Status[] = ["todo", "in_progress", "blocked", "done"];

export const PRIORITIES: Record<Priority, { name: string; color: string; text: string; soft: string }> = {
  high: { name: "High", color: "#dc2626", text: "#b91c1c", soft: "#fef2f2" },
  medium: { name: "Medium", color: "#d97706", text: "#b45309", soft: "#fffbeb" },
  low: { name: "Low", color: "#64748b", text: "#475569", soft: "#f8fafc" },
};

// --- Roadmap ---------------------------------------------------------------

export const MILESTONES: Milestone[] = [
  {
    id: "m1",
    timeframe: "Week 1",
    focus: "Set up Category 3 — personal Project for learning & communication",
    trackId: "track3",
    targetDate: "2026-07-30",
  },
  {
    id: "m2",
    timeframe: "Week 2–3",
    focus: "Set up Category 1 — populate knowledge base with products + past proposals, get pre-sales team trying it",
    trackId: "track1",
    targetDate: "2026-08-13",
  },
  {
    id: "m3",
    timeframe: "Month 2",
    focus: "Internal discussion on Category 2 — pick one pilot use case, find a developer partner if needed",
    trackId: "track2",
    targetDate: "2026-09-23",
  },
  {
    id: "m4",
    timeframe: "Month 3",
    focus: "Category 2 pilot runs with one customer, evaluate results",
    trackId: "track2",
    targetDate: "2026-10-23",
  },
];

// --- Seed tasks (mapped from the framework) --------------------------------

type SeedTask = Omit<Task, "id" | "createdAt" | "status" | "member"> & { status?: Status };

const SEED: SeedTask[] = [
  // ---------------- Track 3 — Personal Workflow (Week 1) ----------------
  {
    title: 'Create "Fast Learning" Project',
    description:
      'A Project where you ask about new technology explained "as if I\'m not deeply technical" — e.g. cobot vs traditional palletizers, framed to help convince a customer.',
    trackId: "track3",
    team: "management",
    priority: "high",
    dueDate: "2026-07-30",
    milestoneId: "m1",
  },
  {
    title: 'Create "Internal Comms" Project',
    description:
      "Draft WhatsApp / email messages to Management, your team, or customers in your own voice.",
    trackId: "track3",
    team: "management",
    priority: "high",
    dueDate: "2026-07-30",
    milestoneId: "m1",
  },
  {
    title: "Turn on & use Claude memory",
    description: "Take advantage of memory so context doesn't need re-explaining every time.",
    trackId: "track3",
    team: "management",
    priority: "medium",
    dueDate: "2026-07-30",
    milestoneId: "m1",
  },
  {
    title: "Habit: prep critical questions before vendor meetings",
    description:
      "Before meeting a new tech vendor (AMR, humanoid robots, etc.), ask Claude for a list of critical questions so you don't get 'sold to' without understanding trade-offs.",
    trackId: "track3",
    team: "management",
    priority: "medium",
  },
  {
    title: "Habit: ELI5 summary + risks after a vendor brief",
    description:
      "After a technical brief, ask for an ELI5 summary plus risks/limitations so you can filter what's actually applicable for Indonesian customers.",
    trackId: "track3",
    team: "management",
    priority: "low",
  },
  {
    title: "Habit: stress-test your argument before sending a proposal",
    description:
      "Ask Claude 'the customer will likely ask X — is my answer strong enough?' before a quote or proposal goes out.",
    trackId: "track3",
    team: "management",
    priority: "medium",
  },

  // ---------------- Track 1 — Internal Enablement (Week 2–3) ----------------
  {
    title: "Create Claude Project: Pre-sales & Proposal",
    description: "One Project per function so outputs are grounded in Syspex context.",
    trackId: "track1",
    team: "presales",
    priority: "high",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Create Claude Project: Competitor Intelligence",
    description: "Dedicated Project for competitor positioning and battlecards.",
    trackId: "track1",
    team: "presales",
    priority: "medium",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Create Claude Project: Technical Knowledge Base",
    description: "Central Project for product specs and technical Q&A.",
    trackId: "track1",
    team: "drawing",
    priority: "medium",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Populate knowledge: product catalogs & spec sheets",
    description: "Strapping, wrapping, dock levelers, UWB, AMR, etc.",
    trackId: "track1",
    team: "drawing",
    priority: "high",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Populate knowledge: successful past proposals",
    description: "Used as templates for tone and structure.",
    trackId: "track1",
    team: "presales",
    priority: "high",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Populate knowledge: competitor data",
    description: "Fed in regularly by the market-intelligence lead.",
    trackId: "track1",
    team: "presales",
    priority: "medium",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Set up restricted-access Project for pricing guidelines",
    description: "Keep confidential pricing in a separate Project with restricted access.",
    trackId: "track1",
    team: "management",
    priority: "medium",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Set Project instructions & house style",
    description:
      "Informal-but-professional English/Indonesian tone, direct, avoiding 'generic AI-generated' language.",
    trackId: "track1",
    team: "management",
    priority: "medium",
    dueDate: "2026-08-13",
    milestoneId: "m2",
  },
  {
    title: "Roll out proposal & quotation drafting workflow",
    description:
      "Turn customer spec requirements into a technical draft + value-proposition narrative.",
    trackId: "track1",
    team: "presales",
    priority: "high",
    milestoneId: "m2",
  },
  {
    title: "Enable quick technical explainers for pre-sales",
    description:
      "e.g. UWB anti-collision vs AI-camera collision detection — which fits a tight warehouse.",
    trackId: "track1",
    team: "presales",
    priority: "medium",
  },
  {
    title: "Build competitor battlecards",
    description:
      "Syspex vs local players and aggressive Chinese brands on technical merit and value, not just price.",
    trackId: "track1",
    team: "presales",
    priority: "medium",
  },
  {
    title: "Set up RFP / tender response workflow",
    description: "Break tender documents into a checklist mapped to Syspex's product lineup.",
    trackId: "track1",
    team: "presales",
    priority: "medium",
  },
  {
    title: "Prepare objection-handling scripts",
    description:
      "Answers to tough questions (e.g. 'why is robotic more expensive than a manual conveyor?').",
    trackId: "track1",
    team: "presales",
    priority: "low",
  },
  {
    title: "Adopt meeting / WhatsApp follow-up drafting",
    description: "Customer follow-ups and Management updates in a natural, non-stiff tone.",
    trackId: "track1",
    team: "presales",
    priority: "low",
  },
  {
    title: "Define templates & response standards",
    description: "Governance: you set the templates and response standards for the team.",
    trackId: "track1",
    team: "management",
    priority: "medium",
  },
  {
    title: "Establish human-review rule before customer output",
    description:
      "Human review required before anything goes to a customer — especially numbers and technical commitments.",
    trackId: "track1",
    team: "management",
    priority: "high",
  },

  // ---------------- Track 2 — Product Integration (Month 2–3) ----------------
  {
    title: "Pick pilot use case: AI-camera incident report generator",
    description:
      "Turn event data (near-misses, speed violations) into a daily report for the customer's safety manager. Chosen first because that data is already the most structured.",
    trackId: "track2",
    team: "software",
    priority: "high",
    dueDate: "2026-09-23",
    milestoneId: "m3",
  },
  {
    title: "Find a developer partner (internal or outsourced)",
    description:
      "Needed to build the API integration; your role is to define requirements and value proposition.",
    trackId: "track2",
    team: "management",
    priority: "high",
    dueDate: "2026-09-23",
    milestoneId: "m3",
  },
  {
    title: "Scope integration architecture with the developer",
    description:
      "Sensor/IoT/PLC/camera → middleware/data layer → Claude API via MCP tools → chat widget / WhatsApp / voice. Claude is an added layer, not a SCADA replacement.",
    trackId: "track2",
    team: "software",
    priority: "medium",
    dueDate: "2026-09-23",
    milestoneId: "m3",
  },
  {
    title: "Validate pilot with one existing AI-camera / WPS customer",
    description: "Pick a customer already using AI camera / WPS to validate the pilot.",
    trackId: "track2",
    team: "presales",
    priority: "medium",
    dueDate: "2026-10-23",
    milestoneId: "m4",
  },
  {
    title: "Run the Category 2 pilot & evaluate results",
    description: "Only scale to other products once the pilot proves its value.",
    trackId: "track2",
    team: "software",
    priority: "high",
    dueDate: "2026-10-23",
    milestoneId: "m4",
  },
  {
    title: "Backlog: AMR/AGV conversational fleet assistant",
    description:
      "Operator asks 'why is AMR unit 3 stuck in zone B?' and gets a plain-language answer instead of raw logs.",
    trackId: "track2",
    team: "software",
    priority: "low",
  },
  {
    title: "Backlog: conveyor / sorting / DWS anomaly explainer",
    description:
      "If throughput drops, AI summarizes likely causes from sensor data instead of just firing an alarm.",
    trackId: "track2",
    team: "software",
    priority: "low",
  },
  {
    title: "Backlog: predictive-maintenance assistant for packaging lines",
    description:
      "Combine IoT data + manuals into a troubleshooting chatbot for the customer's field technicians.",
    trackId: "track2",
    team: "software",
    priority: "low",
  },
  {
    title: "Backlog: WPS safety compliance copilot",
    description:
      "'How many incidents this month, what's the trend, what's recommended' — answered directly.",
    trackId: "track2",
    team: "software",
    priority: "low",
  },
];

let counter = 0;
export function uid(prefix = "t"): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}

// Placeholder member pools per team, used to distribute seed tasks so the
// "by member" table is populated out of the box. Reassign freely in the app.
const MEMBER_POOLS: Record<TeamId, MemberId[]> = {
  presales: ["AM", "AD", "AF", "TR"],
  software: ["MI", "MW", "SF"],
  drawing: ["RR", "RS"],
  management: ["GP"],
  unassigned: ["unassigned"],
};

export function seedTasks(): Task[] {
  const now = new Date().toISOString();
  const cursor: Partial<Record<TeamId, number>> = {};
  const pick = (team: TeamId): MemberId => {
    const pool = MEMBER_POOLS[team] ?? ["unassigned"];
    const i = cursor[team] ?? 0;
    cursor[team] = i + 1;
    return pool[i % pool.length];
  };
  return SEED.map((s) => ({
    ...s,
    id: uid(),
    member: pick(s.team),
    status: s.status ?? "todo",
    createdAt: now,
  }));
}

export function initialState(): AppState {
  return {
    version: SCHEMA_VERSION,
    projectName: "Syspex TAS · Claude AI Rollout",
    tasks: seedTasks(),
    currentMember: "GP",
  };
}

// --- Derived helpers -------------------------------------------------------

export function trackProgress(tasks: Task[], trackId: TrackId) {
  const list = tasks.filter((t) => t.trackId === trackId);
  const done = list.filter((t) => t.status === "done").length;
  return {
    total: list.length,
    done,
    pct: list.length ? Math.round((done / list.length) * 100) : 0,
    counts: countByStatus(list),
  };
}

export function countByStatus(tasks: Task[]): Record<Status, number> {
  const base: Record<Status, number> = { todo: 0, in_progress: 0, blocked: 0, done: 0 };
  for (const t of tasks) base[t.status] += 1;
  return base;
}

export interface MemberStat {
  member: MemberId;
  total: number;
  counts: Record<Status, number>;
  remaining: number; // not done
  done: number;
  nextDue?: string;
}

// Per-member breakdown, optionally scoped to a single project (track).
export function memberStats(
  tasks: Task[],
  projectFilter: TrackId | "all" = "all",
): MemberStat[] {
  const scoped =
    projectFilter === "all" ? tasks : tasks.filter((t) => t.trackId === projectFilter);
  return MEMBER_ORDER.map((member) => {
    const mine = scoped.filter((t) => t.member === member);
    const counts = countByStatus(mine);
    const remaining = counts.todo + counts.in_progress + counts.blocked;
    const nextDue = mine
      .filter((t) => t.status !== "done" && t.dueDate)
      .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))[0]?.dueDate;
    return { member, total: mine.length, counts, remaining, done: counts.done, nextDue };
  });
}

export function milestoneProgress(tasks: Task[], milestoneId: string) {
  const list = tasks.filter((t) => t.milestoneId === milestoneId);
  const done = list.filter((t) => t.status === "done").length;
  const blocked = list.filter((t) => t.status === "blocked").length;
  const inProgress = list.filter((t) => t.status === "in_progress").length;
  const pct = list.length ? Math.round((done / list.length) * 100) : 0;
  let state: "not_started" | "in_progress" | "at_risk" | "done" = "not_started";
  if (pct === 100 && list.length) state = "done";
  else if (blocked > 0) state = "at_risk";
  else if (done > 0 || inProgress > 0) state = "in_progress";
  return { total: list.length, done, pct, state };
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
}

export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function validateState(data: unknown): AppState | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.tasks)) return null;
  const validTracks = new Set(["track1", "track2", "track3"]);
  const validStatus = new Set(["todo", "in_progress", "blocked", "done"]);
  const tasks: Task[] = [];
  for (const raw of obj.tasks as unknown[]) {
    if (!raw || typeof raw !== "object") continue;
    const t = raw as Record<string, unknown>;
    if (typeof t.title !== "string" || !validTracks.has(t.trackId as string)) continue;
    tasks.push({
      id: typeof t.id === "string" ? t.id : uid(),
      title: t.title,
      description: typeof t.description === "string" ? t.description : undefined,
      trackId: t.trackId as TrackId,
      team: (TEAMS as Record<string, unknown>)[t.team as string] ? (t.team as TeamId) : "unassigned",
      member: (MEMBERS as Record<string, unknown>)[t.member as string]
        ? (t.member as MemberId)
        : "unassigned",
      assignee: typeof t.assignee === "string" ? t.assignee : undefined,
      status: validStatus.has(t.status as string) ? (t.status as Status) : "todo",
      priority: ["low", "medium", "high"].includes(t.priority as string)
        ? (t.priority as Priority)
        : "medium",
      dueDate: typeof t.dueDate === "string" ? t.dueDate : undefined,
      milestoneId: typeof t.milestoneId === "string" ? t.milestoneId : undefined,
      createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date().toISOString(),
    });
  }
  return {
    version: typeof obj.version === "number" ? obj.version : SCHEMA_VERSION,
    projectName: typeof obj.projectName === "string" ? obj.projectName : "Syspex TAS · Claude AI Rollout",
    tasks,
    currentMember: (MEMBERS as Record<string, unknown>)[obj.currentMember as string]
      ? (obj.currentMember as MemberId)
      : "GP",
    savedAt: typeof obj.savedAt === "string" ? obj.savedAt : undefined,
  };
}
