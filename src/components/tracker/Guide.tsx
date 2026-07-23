import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Workflow,
  ArrowRight,
  Layers,
  Users,
  UserRound,
  KanbanSquare,
  Table2,
  Route,
  Plus,
  Download,
  Upload,
  MousePointerClick,
  GripVertical,
  Filter,
} from "lucide-react";
import { TRACKS, STATUSES, STATUS_ORDER } from "@/lib/model";
import type { TrackId } from "@/lib/model";

/* ---------- diagram primitives ---------- */

function DiagramFrame({ children, caption }: { children: React.ReactNode; caption?: string }) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        <Workflow className="h-3 w-3" /> Diagram
      </div>
      <div className="scroll-thin overflow-x-auto pb-1">
        <div className="w-max">{children}</div>
      </div>
      {caption ? <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

function Box({
  title,
  sub,
  color = "#334155",
  soft = "#ffffff",
  textColor = "#1e293b",
  icon,
  wide,
}: {
  title: string;
  sub?: string;
  color?: string;
  soft?: string;
  textColor?: string;
  icon?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-center shadow-sm ${wide ? "min-w-[150px]" : "min-w-[96px]"}`}
      style={{ borderColor: `${color}44`, background: soft }}
    >
      <div className="flex items-center justify-center gap-1.5">
        {icon ? <span style={{ color }}>{icon}</span> : null}
        <span className="text-xs font-bold" style={{ color: textColor }}>
          {title}
        </span>
      </div>
      {sub ? <div className="mt-0.5 text-[10px] leading-tight text-slate-500">{sub}</div> : null}
    </div>
  );
}

const HArrow = ({ label }: { label?: string }) => (
  <div className="flex shrink-0 flex-col items-center px-1">
    <ArrowRight className="h-4 w-4 text-slate-300" />
    {label ? <span className="mt-0.5 text-[9px] font-medium text-slate-400">{label}</span> : null}
  </div>
);

/* ---------- section wrapper ---------- */

function Section({
  n,
  icon,
  title,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={`guide-${n}`} className="card-hairline scroll-mt-4 border-slate-200/80 p-5">
      <div className="mb-2 flex items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
          {n}
        </span>
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900">
          <span className="text-slate-400">{icon}</span>
          {title}
        </h3>
      </div>
      {children}
    </Card>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="ml-1 space-y-1.5">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
            {i + 1}
          </span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- guide ---------- */

export function Guide({ onGo }: { onGo?: (view: string) => void }) {
  const toc = [
    { n: 1, label: "The big picture" },
    { n: 2, label: "Categories" },
    { n: 3, label: "Team vs Personal" },
    { n: 4, label: "The Board" },
    { n: 5, label: "Tasks by member" },
    { n: 6, label: "Add & edit" },
    { n: 7, label: "Save & load" },
  ];

  return (
    <div className="scroll-thin h-full overflow-y-auto px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-5">
        {/* Hero */}
        <Card className="card-hairline overflow-hidden border-slate-200/80">
          <div className="bg-slate-900 px-6 py-6 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <BookOpen className="h-4 w-4" /> How to use this tracker
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold">Syspex TAS · AI Rollout Tracker</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-300">
              A shared checklist for rolling Claude AI across the TAS Division. Everyone works from the
              same activity list — you log your own work, and it rolls up into the team view. This page
              walks through every feature with a small diagram for each.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 px-6 py-4">
            {toc.map((t) => (
              <a
                key={t.n}
                href={`#guide-${t.n}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                {t.n}. {t.label}
              </a>
            ))}
          </div>
        </Card>

        {/* 1. Big picture */}
        <Section n={1} icon={<Route className="h-4 w-4" />} title="The big picture">
          <p className="text-sm leading-relaxed text-slate-600">
            The tracker has three areas in the left sidebar: <b>Dashboard</b> (your numbers),{" "}
            <b>Board</b> (move work along), and this <b>How to use</b> guide. The Dashboard opens with
            a <b>Daily Briefing</b> that flags what's overdue, due
            soon, or blocked. You can collapse the sidebar to a slim icon rail with the button at its
            base, and on a phone it opens as a slide-out drawer. A normal day looks like this:
          </p>
          <DiagramFrame caption="Your data never leaves your computer — it lives in a JSON file you Save and re-Load.">
            <div className="flex items-center">
              <Box title="Pick who you are" sub="Personal view" color="#0d9488" soft="#f0fdfa" textColor="#115e59" icon={<UserRound className="h-3.5 w-3.5" />} wide />
              <HArrow />
              <Box title="Add / update activities" sub="what you're doing" color="#4f46e5" soft="#eef2ff" textColor="#3730a3" icon={<Plus className="h-3.5 w-3.5" />} wide />
              <HArrow />
              <Box title="Monitor progress" sub="Dashboard & Board" color="#2563eb" soft="#eff6ff" textColor="#1d4ed8" icon={<KanbanSquare className="h-3.5 w-3.5" />} wide />
              <HArrow />
              <Box title="Save to file" sub="keep your data" color="#059669" soft="#ecfdf5" textColor="#047857" icon={<Download className="h-3.5 w-3.5" />} wide />
            </div>
          </DiagramFrame>
        </Section>

        {/* 2. Categories */}
        <Section n={2} icon={<Layers className="h-4 w-4" />} title="Categories">
          <p className="text-sm leading-relaxed text-slate-600">
            Every activity belongs to one of the framework's three <b>categories</b> (the "Category"
            filter throughout the app). This keeps pre-sales, product and personal work clearly
            separated.
          </p>
          <DiagramFrame caption="Filter any view by category to focus on just one workstream.">
            <div className="flex items-center gap-3">
              {(Object.keys(TRACKS) as TrackId[]).map((tid) => {
                const t = TRACKS[tid];
                return (
                  <div
                    key={tid}
                    className="rounded-lg border p-3"
                    style={{ background: t.soft, borderColor: t.ring, minWidth: 150 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: t.accent }} />
                      <span className="text-xs font-bold" style={{ color: t.text }}>
                        {t.short} · {t.name}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px]" style={{ color: t.text, opacity: 0.8 }}>
                      {t.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </DiagramFrame>
        </Section>

        {/* 3. Team vs Personal */}
        <Section n={3} icon={<Users className="h-4 w-4" />} title="Team vs Personal dashboard">
          <p className="text-sm leading-relaxed text-slate-600">
            The Dashboard has a <b>Team / Personal</b> toggle at the top. In <b>Personal</b>, pick your
            initials under "Viewing as" and you'll see only your work, plus an "Add my activity" button
            that tags new tasks to you. Everything you add appears in the <b>Team</b> view too — it's
            one shared list.
          </p>
          <Steps
            items={[
              "Open Dashboard, click Personal, choose your initials in 'Viewing as'.",
              "Use 'Add my activity' to log what you're working on — it's auto-assigned to you.",
              "Switch to Team to see how everyone's work adds up.",
            ]}
          />
          <DiagramFrame caption="Each member edits their own Personal view; the Team dashboard is the live sum of everyone.">
            <div className="flex items-center">
              <div className="flex flex-col gap-1.5">
                {["GP", "AM", "MI"].map((c, i) => (
                  <div
                    key={c}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm"
                  >
                    <span
                      className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: ["#0f172a", "#2563eb", "#059669"][i] }}
                    >
                      {c}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600">Personal view</span>
                  </div>
                ))}
              </div>
              <HArrow label="adds" />
              <Box title="Shared activity list" sub="one source of truth" color="#4f46e5" soft="#eef2ff" textColor="#3730a3" icon={<Layers className="h-3.5 w-3.5" />} wide />
              <HArrow label="rolls up" />
              <Box title="Team dashboard" sub="everyone's numbers" color="#0f172a" soft="#f8fafc" icon={<Users className="h-3.5 w-3.5" />} wide />
            </div>
          </DiagramFrame>
        </Section>

        {/* 4. Board */}
        <Section n={4} icon={<KanbanSquare className="h-4 w-4" />} title="The Board — move work along">
          <p className="text-sm leading-relaxed text-slate-600">
            The Board is a drag-and-drop kanban. Each card is an activity; <b>drag it between columns</b>{" "}
            to change its status. Filter by category, team, or member, and click any card to edit it.
          </p>
          <DiagramFrame caption="Drag a card rightwards as work progresses. 'Blocked' flags anything stuck and waiting.">
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                {STATUS_ORDER.filter((s) => s !== "blocked").map((s, i, arr) => (
                  <div key={s} className="flex items-center">
                    <div
                      className="rounded-lg border px-3 py-2 text-center"
                      style={{ borderColor: `${STATUSES[s].color}44`, background: STATUSES[s].soft, minWidth: 108 }}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: STATUSES[s].color }} />
                        <span className="text-xs font-bold" style={{ color: STATUSES[s].text }}>
                          {STATUSES[s].name}
                        </span>
                      </div>
                    </div>
                    {i < arr.length - 1 ? <HArrow label={i === 0 ? "drag" : ""} /> : null}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pl-2">
                <GripVertical className="h-4 w-4 text-slate-300" />
                <span className="text-[11px] text-slate-400">
                  Stuck? Drop the card into
                </span>
                <span
                  className="rounded-md border px-2 py-0.5 text-[11px] font-bold"
                  style={{ borderColor: `${STATUSES.blocked.color}44`, background: STATUSES.blocked.soft, color: STATUSES.blocked.text }}
                >
                  Blocked
                </span>
              </div>
            </div>
          </DiagramFrame>
        </Section>

        {/* 5. Member table */}
        <Section n={5} icon={<Table2 className="h-4 w-4" />} title="Remaining tasks by member">
          <p className="text-sm leading-relaxed text-slate-600">
            On the Team dashboard, this table lists everyone A–Z with how much they have left. Use the{" "}
            <b>Member</b> and <b>Project</b> filters to narrow it, or click a row to see that person's
            outstanding activities.
          </p>
          <DiagramFrame caption="'Remaining' = To Do + In Progress + Blocked (everything not yet done).">
            <div className="flex items-center">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
                  <Filter className="h-3 w-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-600">Member ▾</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
                  <Filter className="h-3 w-3 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-600">Project ▾</span>
                </div>
              </div>
              <HArrow label="narrows" />
              <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                {[
                  { c: "AM", n: 3, col: "#2563eb" },
                  { c: "GP", n: 11, col: "#0f172a" },
                  { c: "MI", n: 3, col: "#059669" },
                ].map((r) => (
                  <div key={r.c} className="flex items-center gap-2 px-1 py-1">
                    <span
                      className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: r.col }}
                    >
                      {r.c}
                    </span>
                    <span className="w-16 text-[11px] font-medium text-slate-600">remaining</span>
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-slate-900 px-1.5 text-[10px] font-bold text-white">
                      {r.n}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DiagramFrame>
        </Section>

        {/* 6. Add & edit */}
        <Section n={6} icon={<Plus className="h-4 w-4" />} title="Adding & editing activities">
          <p className="text-sm leading-relaxed text-slate-600">
            Click <b>+ Activity</b> in the top bar (or <b>Add my activity</b> in Personal) to open the
            form. Fill in a title and pick a category, member, status, priority, and due date. To edit
            later, just click the activity anywhere it appears.
          </p>
          <DiagramFrame caption="One activity, one record — it shows up on the Board, your Personal view, and the Team dashboard at once.">
            <div className="flex items-center">
              <Box title="+ Activity" color="#0f172a" soft="#0f172a" textColor="#ffffff" icon={<Plus className="h-3.5 w-3.5" />} />
              <HArrow />
              <Box
                title="Fill the form"
                sub="title · category · member · status · due"
                color="#4f46e5"
                soft="#eef2ff"
                textColor="#3730a3"
                wide
              />
              <HArrow label="appears in" />
              <div className="flex flex-col gap-1.5">
                <Box title="Board" color="#2563eb" soft="#eff6ff" textColor="#1d4ed8" icon={<KanbanSquare className="h-3 w-3" />} />
                <Box title="Personal" color="#0d9488" soft="#f0fdfa" textColor="#115e59" icon={<UserRound className="h-3 w-3" />} />
                <Box title="Team" color="#0f172a" soft="#f8fafc" icon={<Users className="h-3 w-3" />} />
              </div>
            </div>
          </DiagramFrame>
        </Section>

        {/* 7. Save & load */}
        <Section n={7} icon={<Download className="h-4 w-4" />} title="Saving & loading your data">
          <p className="text-sm leading-relaxed text-slate-600">
            This is a single file with no server, so your data is saved to a <b>JSON file</b> on your
            computer. Click <b>Save</b> to download it; click <b>Load</b> next time to restore
            everything. An amber <b>"Unsaved"</b> dot reminds you when you have changes to save.
          </p>
          <Steps
            items={[
              "Work in the tracker — add and move activities as needed.",
              "Click Save to download syspex-tas-tracker-<date>.json to your computer.",
              "Next session, open the file and click Load to pick that JSON back up.",
              "Share the JSON with a teammate to hand off or merge progress.",
            ]}
          />
          <DiagramFrame caption="Tip: keep the JSON in your 'TAS Dashboard' folder so the whole team loads the same file.">
            <div className="flex items-center">
              <Box title="Tracker" sub="in your browser" color="#0f172a" soft="#f8fafc" icon={<KanbanSquare className="h-3.5 w-3.5" />} wide />
              <div className="flex flex-col items-center px-2">
                <div className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600">
                  <Download className="h-3.5 w-3.5" /> Save
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300" />
                <ArrowRight className="h-4 w-4 rotate-180 text-slate-300" />
                <div className="flex items-center gap-1 text-[9px] font-semibold text-blue-600">
                  <Upload className="h-3.5 w-3.5" /> Load
                </div>
              </div>
              <Box title="JSON file" sub="on your computer" color="#059669" soft="#ecfdf5" textColor="#047857" icon={<Download className="h-3.5 w-3.5" />} wide />
            </div>
          </DiagramFrame>
        </Section>

        <div className="flex items-center justify-center gap-2 pb-2 pt-1 text-xs text-muted-foreground">
          <MousePointerClick className="h-3.5 w-3.5" />
          Ready? Jump into the
          <button
            onClick={() => onGo?.("dashboard")}
            className="font-semibold text-slate-700 underline underline-offset-2 hover:text-slate-900"
          >
            Dashboard
          </button>
          .
        </div>
      </div>
    </div>
  );
}
