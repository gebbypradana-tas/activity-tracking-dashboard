import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  TRACKS,
  TEAMS,
  TEAM_ORDER,
  STATUSES,
  STATUS_ORDER,
  countByStatus,
  trackProgress,
  isOverdue,
  formatDate,
} from "@/lib/model";
import type { Task, TrackId, Status } from "@/lib/model";
import { StatusMeter, StatusPill, Donut } from "./bits";
import { MemberTable } from "./MemberTable";
import { DailyBriefing } from "./DailyBriefing";
import { ListTodo, CircleCheck, Loader, TriangleAlert, CalendarClock } from "lucide-react";

function Kpi({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card className="card-hairline flex items-center gap-3 border-slate-200/80 p-4">
      <div
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {icon}
      </div>
      <div>
        <div className="font-display text-2xl font-bold leading-none text-slate-900">{value}</div>
        <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
}

export function Dashboard({
  tasks,
  onGoBoard,
  onEdit,
}: {
  tasks: Task[];
  onGoBoard: () => void;
  onEdit: (t: Task) => void;
}) {
  const counts = useMemo(() => countByStatus(tasks), [tasks]);
  const total = tasks.length;
  const overallPct = total ? Math.round((counts.done / total) * 100) : 0;

  const teamData = useMemo(
    () =>
      TEAM_ORDER.map((teamId) => {
        const list = tasks.filter((t) => t.team === teamId);
        return { teamId, total: list.length, counts: countByStatus(list) };
      }).filter((d) => d.total > 0),
    [tasks],
  );
  const maxTeamTotal = Math.max(1, ...teamData.map((d) => d.total));

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "done" && t.dueDate)
        .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
        .slice(0, 6),
    [tasks],
  );

  return (
    <div className="scroll-thin h-full overflow-y-auto px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Daily Briefing */}
        <DailyBriefing tasks={tasks} scope="team" onEdit={onEdit} />

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi icon={<ListTodo className="h-5 w-5" />} label="To do" value={counts.todo} accent="#64748b" />
          <Kpi icon={<Loader className="h-5 w-5" />} label="In progress" value={counts.in_progress} accent="#2563eb" />
          <Kpi icon={<TriangleAlert className="h-5 w-5" />} label="Blocked" value={counts.blocked} accent="#e11d48" />
          <Kpi icon={<CircleCheck className="h-5 w-5" />} label="Completed" value={counts.done} accent="#059669" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Overall completion */}
          <Card className="card-hairline flex flex-col items-center justify-center gap-3 border-slate-200/80 p-6">
            <Donut pct={overallPct} />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">Overall rollout progress</p>
              <p className="text-xs text-muted-foreground">
                {counts.done} of {total} activities complete
              </p>
            </div>
          </Card>

          {/* Track progress */}
          <Card className="card-hairline border-slate-200/80 p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-slate-800">Progress by category</h3>
              <button
                onClick={onGoBoard}
                className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
              >
                Open board →
              </button>
            </div>
            <div className="space-y-4">
              {(Object.keys(TRACKS) as TrackId[]).map((tid) => {
                const p = trackProgress(tasks, tid);
                const meta = TRACKS[tid];
                return (
                  <div key={tid}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: meta.accent }} />
                        <span className="truncate text-sm font-semibold text-slate-800">
                          {meta.short} · {meta.name}
                        </span>
                        <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                          {meta.subtitle}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-bold" style={{ color: meta.text }}>
                        {p.pct}%
                      </span>
                    </div>
                    <StatusMeter counts={p.counts} />
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {p.done}/{p.total} done · {p.counts.in_progress} in progress
                      {p.counts.blocked > 0 ? ` · ${p.counts.blocked} blocked` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Remaining tasks by member */}
        <MemberTable tasks={tasks} onEdit={onEdit} />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team workload */}
          <Card className="card-hairline border-slate-200/80 p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-slate-800">Workload by team</h3>
            <div className="space-y-3.5">
              {teamData.map((d) => (
                <div key={d.teamId}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <span
                        className="grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold text-white"
                        style={{ backgroundColor: TEAMS[d.teamId].color }}
                      >
                        {TEAMS[d.teamId].short}
                      </span>
                      {TEAMS[d.teamId].name}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{d.total}</span>
                  </div>
                  <div className="flex h-5 items-center">
                    <div
                      className="flex h-5 overflow-hidden rounded-md"
                      style={{ width: `${(d.total / maxTeamTotal) * 100}%`, minWidth: 8 }}
                    >
                      {STATUS_ORDER.map((s) =>
                        d.counts[s] > 0 ? (
                          <div
                            key={s}
                            className="h-full"
                            style={{
                              width: `${(d.counts[s] / d.total) * 100}%`,
                              backgroundColor: STATUSES[s].color,
                            }}
                            title={`${STATUSES[s].name}: ${d.counts[s]}`}
                          />
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t pt-3">
              {(STATUS_ORDER as Status[]).map((s) => (
                <span key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: STATUSES[s].color }} />
                  {STATUSES[s].name}
                </span>
              ))}
            </div>
          </Card>

          {/* Upcoming */}
          <Card className="card-hairline border-slate-200/80 p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-semibold text-slate-800">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              Upcoming & due
            </h3>
            {upcoming.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No dated activities yet. Add due dates to see them here.
              </p>
            ) : (
              <ul className="divide-y">
                {upcoming.map((t) => {
                  const overdue = isOverdue(t);
                  return (
                    <li key={t.id} className="flex items-center gap-3 py-2.5">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: TRACKS[t.trackId].accent }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-700">{t.title}</p>
                        <p className="text-[11px] text-muted-foreground">{TEAMS[t.team].name}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <StatusPill status={t.status} />
                        <span
                          className={`text-[11px] font-medium ${
                            overdue ? "text-rose-600" : "text-muted-foreground"
                          }`}
                        >
                          {overdue ? "Overdue · " : ""}
                          {formatDate(t.dueDate)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
