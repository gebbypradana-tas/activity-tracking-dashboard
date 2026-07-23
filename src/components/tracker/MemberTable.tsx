import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, RotateCcw, AlertTriangle } from "lucide-react";
import {
  TRACKS,
  MEMBERS,
  STATUSES,
  memberStats,
  isOverdue,
  formatDate,
} from "@/lib/model";
import type { Task, TrackId, MemberId } from "@/lib/model";
import { StatusPill } from "./bits";

function MemberCell({ member }: { member: MemberId }) {
  const m = MEMBERS[member];
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
        style={{ backgroundColor: m.color }}
      >
        {m.code}
      </span>
      <span className="text-sm font-semibold text-slate-800">{m.name}</span>
    </div>
  );
}

export function MemberTable({ tasks, onEdit }: { tasks: Task[]; onEdit: (t: Task) => void }) {
  const [member, setMember] = useState<MemberId | "all">("all");
  const [project, setProject] = useState<TrackId | "all">("all");

  const rows = useMemo(() => {
    let list = memberStats(tasks, project).filter((r) => r.total > 0);
    if (member !== "all") list = list.filter((r) => r.member === member);
    // Sort members alphabetically A–Z by code; keep "Unassigned" last.
    return list.sort((a, b) => {
      if (a.member === "unassigned") return 1;
      if (b.member === "unassigned") return -1;
      return MEMBERS[a.member].code.localeCompare(MEMBERS[b.member].code);
    });
  }, [tasks, project, member]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.todo += r.counts.todo;
        acc.in_progress += r.counts.in_progress;
        acc.blocked += r.counts.blocked;
        acc.done += r.counts.done;
        acc.remaining += r.remaining;
        return acc;
      },
      { todo: 0, in_progress: 0, blocked: 0, done: 0, remaining: 0 },
    );
  }, [rows]);

  // Remaining task list shown when a single member is selected
  const remainingList = useMemo(() => {
    if (member === "all") return [];
    return tasks
      .filter((t) => t.member === member && t.status !== "done")
      .filter((t) => project === "all" || t.trackId === project)
      .sort((a, b) => {
        const rank = (s: string) => (s === "blocked" ? 0 : s === "in_progress" ? 1 : 2);
        return rank(a.status) - rank(b.status);
      });
  }, [tasks, member, project]);

  const hasFilter = member !== "all" || project !== "all";

  return (
    <Card className="card-hairline border-slate-200/80 p-5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-800">
          <Users className="h-4 w-4 text-slate-400" />
          Remaining tasks by member
        </h3>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Select value={member} onValueChange={(v) => setMember(v as MemberId | "all")}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All members</SelectItem>
              {Object.keys(MEMBERS)
                .filter((k) => k !== "unassigned")
                .map((k) => (
                  <SelectItem key={k} value={k}>
                    {MEMBERS[k as MemberId].name}
                  </SelectItem>
                ))}
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={project} onValueChange={(v) => setProject(v as TrackId | "all")}>
            <SelectTrigger className="h-9 w-[190px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(Object.keys(TRACKS) as TrackId[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {TRACKS[k].short} · {TRACKS[k].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasFilter ? (
            <button
              onClick={() => {
                setMember("all");
                setProject("all");
              }}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </button>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[150px]">Member</TableHead>
              <TableHead className="text-center">Remaining</TableHead>
              <TableHead className="text-center">To Do</TableHead>
              <TableHead className="text-center">In Progress</TableHead>
              <TableHead className="text-center">Blocked</TableHead>
              <TableHead className="text-center">Done</TableHead>
              <TableHead className="text-right">Next due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No tasks match this filter.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => {
                const overdue =
                  r.nextDue &&
                  new Date(r.nextDue) < new Date(new Date().toDateString());
                return (
                  <TableRow
                    key={r.member}
                    className="cursor-pointer"
                    onClick={() => setMember(member === r.member ? "all" : r.member)}
                  >
                    <TableCell>
                      <MemberCell member={r.member} />
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-grid h-7 min-w-7 place-items-center rounded-full px-2 text-sm font-bold ${
                          r.remaining === 0
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-900 text-white"
                        }`}
                      >
                        {r.remaining}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-600">
                      {r.counts.todo || "—"}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium" style={{ color: r.counts.in_progress ? STATUSES.in_progress.text : undefined }}>
                      {r.counts.in_progress || "—"}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium" style={{ color: r.counts.blocked ? STATUSES.blocked.text : undefined }}>
                      {r.counts.blocked || "—"}
                    </TableCell>
                    <TableCell className="text-center text-sm text-emerald-600">
                      {r.counts.done || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {r.nextDue ? (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            overdue ? "text-rose-600" : "text-muted-foreground"
                          }`}
                        >
                          {overdue ? <AlertTriangle className="h-3 w-3" /> : null}
                          {formatDate(r.nextDue)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          {rows.length > 1 ? (
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total
                </TableCell>
                <TableCell className="text-center font-bold text-slate-900">{totals.remaining}</TableCell>
                <TableCell className="text-center text-slate-600">{totals.todo}</TableCell>
                <TableCell className="text-center text-slate-600">{totals.in_progress}</TableCell>
                <TableCell className="text-center text-slate-600">{totals.blocked}</TableCell>
                <TableCell className="text-center text-slate-600">{totals.done}</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        Tip: click a row to focus that member. "Remaining" counts everything not yet done (To Do +
        In Progress + Blocked).
      </p>

      {member !== "all" ? (
        <div className="mt-4 border-t pt-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {MEMBERS[member].name} · {remainingList.length} remaining
          </h4>
          {remainingList.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing outstanding — all done. 🎉</p>
          ) : (
            <ul className="space-y-1.5">
              {remainingList.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onEdit(t)}
                    className="flex w-full items-center gap-2.5 rounded-md border border-transparent px-2 py-1.5 text-left transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: TRACKS[t.trackId].accent }}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                      {t.title}
                    </span>
                    {isOverdue(t) ? (
                      <span className="shrink-0 text-[11px] font-semibold text-rose-600">
                        {formatDate(t.dueDate)}
                      </span>
                    ) : t.dueDate ? (
                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDate(t.dueDate)}
                      </span>
                    ) : null}
                    <StatusPill status={t.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </Card>
  );
}
