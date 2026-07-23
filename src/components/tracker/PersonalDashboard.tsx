import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  ListTodo,
  Loader,
  TriangleAlert,
  CircleCheck,
  CalendarClock,
  UserRound,
} from "lucide-react";
import {
  TRACKS,
  MEMBERS,
  MEMBER_ORDER,
  countByStatus,
  isOverdue,
  formatDate,
} from "@/lib/model";
import type { Task, TrackId, MemberId } from "@/lib/model";
import { Donut, StatusMeter, StatusPill, PriorityTag } from "./bits";
import { DailyBriefing } from "./DailyBriefing";

function MiniKpi({
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
    <Card className="card-hairline flex items-center gap-3 border-slate-200/80 p-3.5">
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {icon}
      </div>
      <div>
        <div className="font-display text-xl font-bold leading-none text-slate-900">{value}</div>
        <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
}

export function PersonalDashboard({
  tasks,
  currentMember,
  onChangeMember,
  onEdit,
  onAdd,
}: {
  tasks: Task[];
  currentMember: MemberId;
  onChangeMember: (m: MemberId) => void;
  onEdit: (t: Task) => void;
  onAdd: () => void;
}) {
  const me = MEMBERS[currentMember];
  const mine = useMemo(() => tasks.filter((t) => t.member === currentMember), [tasks, currentMember]);
  const counts = useMemo(() => countByStatus(mine), [mine]);
  const total = mine.length;
  const pct = total ? Math.round((counts.done / total) * 100) : 0;

  const outstanding = useMemo(
    () =>
      mine
        .filter((t) => t.status !== "done")
        .sort((a, b) => {
          const rank = (s: string) => (s === "blocked" ? 0 : s === "in_progress" ? 1 : 2);
          if (rank(a.status) !== rank(b.status)) return rank(a.status) - rank(b.status);
          if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return 0;
        }),
    [mine],
  );
  const completed = useMemo(() => mine.filter((t) => t.status === "done"), [mine]);

  const tracksWithMine = (Object.keys(TRACKS) as TrackId[]).filter(
    (tid) => mine.some((t) => t.trackId === tid),
  );

  return (
    <div className="scroll-thin h-full overflow-y-auto px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Identity bar */}
        <Card className="card-hairline flex flex-wrap items-center gap-3 border-slate-200/80 p-4">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: me.color }}
          >
            {me.code}
          </span>
          <div className="mr-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Viewing as
              </span>
              <Select value={currentMember} onValueChange={(v) => onChangeMember(v as MemberId)}>
                <SelectTrigger className="h-7 w-[190px] border-slate-200 text-sm font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_ORDER.map((k) => (
                    <SelectItem key={k} value={k}>
                      {MEMBERS[k].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your activities here roll straight into the Team dashboard.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={onAdd}>
            <Plus className="h-4 w-4" /> Add my activity
          </Button>
        </Card>

        {currentMember === "unassigned" ? (
          <Card className="card-hairline border-dashed border-slate-300 p-8 text-center">
            <UserRound className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pick who you are above</p>
            <p className="text-xs text-muted-foreground">
              Select your initials to see your personal activities.
            </p>
          </Card>
        ) : (
          <>
            {/* Daily Briefing (scoped to me) */}
            <DailyBriefing tasks={mine} scope="personal" onEdit={onEdit} />

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MiniKpi icon={<ListTodo className="h-4 w-4" />} label="To do" value={counts.todo} accent="#64748b" />
              <MiniKpi icon={<Loader className="h-4 w-4" />} label="In progress" value={counts.in_progress} accent="#2563eb" />
              <MiniKpi icon={<TriangleAlert className="h-4 w-4" />} label="Blocked" value={counts.blocked} accent="#e11d48" />
              <MiniKpi icon={<CircleCheck className="h-4 w-4" />} label="Completed" value={counts.done} accent="#059669" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Personal completion */}
              <Card className="card-hairline flex flex-col items-center justify-center gap-3 border-slate-200/80 p-6">
                <Donut pct={pct} color={me.color} />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">My progress</p>
                  <p className="text-xs text-muted-foreground">
                    {counts.done} of {total} activities complete
                  </p>
                </div>
              </Card>

              {/* My progress by track */}
              <Card className="card-hairline border-slate-200/80 p-5 lg:col-span-2">
                <h3 className="mb-4 font-display text-sm font-semibold text-slate-800">My work by category</h3>
                {tracksWithMine.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No activities assigned to you yet. Use “Add my activity”.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {tracksWithMine.map((tid) => {
                      const list = mine.filter((t) => t.trackId === tid);
                      const c = countByStatus(list);
                      const p = list.length
                        ? Math.round((c.done / list.length) * 100)
                        : 0;
                      const meta = TRACKS[tid];
                      return (
                        <div key={tid}>
                          <div className="mb-1.5 flex items-baseline justify-between gap-3">
                            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-800">
                              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: meta.accent }} />
                              <span className="truncate">{meta.short} · {meta.name}</span>
                            </span>
                            <span className="shrink-0 text-sm font-bold" style={{ color: meta.text }}>
                              {p}%
                            </span>
                          </div>
                          <StatusMeter counts={c} />
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {c.done}/{list.length} done · {c.in_progress} in progress
                            {c.blocked > 0 ? ` · ${c.blocked} blocked` : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>

            {/* My outstanding tasks */}
            <Card className="card-hairline border-slate-200/80 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-800">
                  <CalendarClock className="h-4 w-4 text-slate-400" />
                  My outstanding activities
                </h3>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
                  {outstanding.length}
                </span>
              </div>
              {outstanding.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nothing outstanding — you're all caught up. 🎉
                </p>
              ) : (
                <ul className="divide-y">
                  {outstanding.map((t) => {
                    const overdue = isOverdue(t);
                    return (
                      <li key={t.id}>
                        <button
                          onClick={() => onEdit(t)}
                          className="flex w-full items-center gap-3 py-2.5 text-left transition hover:bg-slate-50"
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: TRACKS[t.trackId].accent }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-700">{t.title}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {TRACKS[t.trackId].short} · {TRACKS[t.trackId].name}
                            </p>
                          </div>
                          <span className="hidden shrink-0 sm:block">
                            <PriorityTag priority={t.priority} />
                          </span>
                          {t.dueDate ? (
                            <span
                              className={`hidden shrink-0 text-[11px] font-medium sm:block ${
                                overdue ? "text-rose-600" : "text-muted-foreground"
                              }`}
                            >
                              {overdue ? "Overdue · " : ""}
                              {formatDate(t.dueDate)}
                            </span>
                          ) : null}
                          <StatusPill status={t.status} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {completed.length > 0 ? (
                <details className="mt-3 border-t pt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-800">
                    Completed ({completed.length})
                  </summary>
                  <ul className="mt-2 space-y-1">
                    {completed.map((t) => (
                      <li key={t.id}>
                        <button
                          onClick={() => onEdit(t)}
                          className="flex w-full items-center gap-2.5 rounded-md px-1 py-1 text-left hover:bg-slate-50"
                        >
                          <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span className="min-w-0 flex-1 truncate text-sm text-slate-400 line-through">
                            {t.title}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
