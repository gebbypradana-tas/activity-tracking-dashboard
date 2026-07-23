import { useMemo, useState } from "react";
import {
  Sunrise,
  AlertTriangle,
  Clock,
  Ban,
  ChevronDown,
  CircleCheck,
  CalendarDays,
} from "lucide-react";
import { TRACKS, isOverdue, formatDate } from "@/lib/model";
import type { Task } from "@/lib/model";
import { StatusPill } from "./bits";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function DailyBriefing({
  tasks,
  scope,
  onEdit,
}: {
  tasks: Task[];
  scope: "team" | "personal";
  onEdit: (t: Task) => void;
}) {
  const [open, setOpen] = useState(true);

  const { overdue, dueSoon, blocked, inProgress, outstanding, top } = useMemo(() => {
    const today = startOfToday();
    const weekAhead = new Date(today);
    weekAhead.setDate(today.getDate() + 7);

    const out = tasks.filter((t) => t.status !== "done");
    const byDue = (a: Task, b: Task) => (a.dueDate! < b.dueDate! ? -1 : 1);
    const overdue = out.filter((t) => isOverdue(t)).sort(byDue);
    const dueSoon = out
      .filter((t) => t.dueDate && !isOverdue(t) && new Date(t.dueDate) <= weekAhead)
      .sort(byDue);
    const blocked = out.filter((t) => t.status === "blocked");
    const inProgress = out.filter((t) => t.status === "in_progress");

    const seen = new Set<string>();
    const top: Task[] = [];
    for (const group of [overdue, blocked, dueSoon]) {
      for (const t of group) {
        if (!seen.has(t.id)) {
          seen.add(t.id);
          top.push(t);
        }
      }
    }
    return { overdue, dueSoon, blocked, inProgress, outstanding: out, top: top.slice(0, 5) };
  }, [tasks]);

  const who = scope === "personal" ? "You have" : "The team has";
  const clear = outstanding.length === 0;

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white card-hairline">
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ backgroundColor: clear ? "#059669" : "#d97706" }} />
        <div className="min-w-0 flex-1 p-4 sm:p-5">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <span
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{
                  backgroundColor: clear ? "#ecfdf5" : "#fffbeb",
                  color: clear ? "#059669" : "#d97706",
                }}
              >
                <Sunrise className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold text-slate-900">Daily Briefing</h3>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CalendarDays className="h-3 w-3" /> {dateLabel}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-expanded={open}
            >
              {open ? "Hide" : "Show"}
              <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Summary line */}
          <p className="mt-3 text-sm text-slate-700">
            {greeting()}. {who}{" "}
            <b className="font-bold text-slate-900">{outstanding.length}</b> outstanding{" "}
            {outstanding.length === 1 ? "activity" : "activities"}
            {clear ? " — nothing on your plate right now. 🎉" : "."}
          </p>

          {open && !clear ? (
            <>
              {/* Stat chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Overdue" n={overdue.length} tone="rose" />
                <Chip icon={<CalendarDays className="h-3.5 w-3.5" />} label="Due this week" n={dueSoon.length} tone="amber" />
                <Chip icon={<Ban className="h-3.5 w-3.5" />} label="Blocked" n={blocked.length} tone="rose" />
                <Chip icon={<Clock className="h-3.5 w-3.5" />} label="In progress" n={inProgress.length} tone="blue" />
              </div>

              {/* Urgent list */}
              {top.length > 0 ? (
                <div className="mt-3.5">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Needs attention first
                  </p>
                  <ul className="divide-y">
                    {top.map((t) => {
                      const od = isOverdue(t);
                      return (
                        <li key={t.id}>
                          <button
                            onClick={() => onEdit(t)}
                            className="flex w-full items-center gap-2.5 py-2 text-left transition hover:bg-slate-50"
                          >
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: TRACKS[t.trackId].accent }}
                            />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                              {t.title}
                            </span>
                            {t.dueDate ? (
                              <span
                                className={`hidden shrink-0 text-[11px] font-medium sm:inline ${
                                  od ? "text-rose-600" : "text-muted-foreground"
                                }`}
                              >
                                {od ? "Overdue · " : "Due "}
                                {formatDate(t.dueDate)}
                              </span>
                            ) : null}
                            <StatusPill status={t.status} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-emerald-600">
                  <CircleCheck className="h-4 w-4" /> Nothing overdue or blocked — you're in good shape.
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Chip({
  icon,
  label,
  n,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  n: number;
  tone: "rose" | "amber" | "blue";
}) {
  const tones: Record<string, { bg: string; fg: string }> = {
    rose: { bg: n > 0 ? "#fff1f2" : "#f8fafc", fg: n > 0 ? "#be123c" : "#94a3b8" },
    amber: { bg: n > 0 ? "#fffbeb" : "#f8fafc", fg: n > 0 ? "#b45309" : "#94a3b8" },
    blue: { bg: n > 0 ? "#eff6ff" : "#f8fafc", fg: n > 0 ? "#1d4ed8" : "#94a3b8" },
  };
  const c = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {icon}
      <span className="tabular-nums">{n}</span>
      <span className="font-medium opacity-80">{label}</span>
    </span>
  );
}
