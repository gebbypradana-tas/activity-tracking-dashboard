import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, GripVertical, CalendarDays, AlertTriangle } from "lucide-react";
import {
  TRACKS,
  TEAMS,
  TEAM_ORDER,
  MEMBERS,
  MEMBER_ORDER,
  STATUSES,
  STATUS_ORDER,
  isOverdue,
  formatDate,
} from "@/lib/model";
import type { Task, Status, TrackId, TeamId, MemberId } from "@/lib/model";
import { TeamBadge, PriorityTag, MemberBadge } from "./bits";

function TaskCard({
  task,
  onEdit,
  onDragStart,
  dragging,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDragStart: (id: string) => void;
  dragging: boolean;
}) {
  const track = TRACKS[task.trackId];
  const overdue = isOverdue(task);
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
        onDragStart(task.id);
      }}
      onClick={() => onEdit(task)}
      className={`group cursor-pointer rounded-lg border bg-card p-3 card-hairline transition ${
        dragging ? "opacity-40" : "hover:border-slate-300 hover:shadow-sm"
      }`}
      style={{ borderLeft: `3px solid ${track.accent}` }}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-400" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-slate-800">{task.title}</p>
          {task.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {task.description}
            </p>
          ) : null}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: track.soft, color: track.text }}
            >
              {track.short}
            </span>
            <PriorityTag priority={task.priority} />
            <TeamBadge team={task.team} />
            {task.dueDate ? (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                  overdue ? "text-rose-600" : "text-muted-foreground"
                }`}
              >
                {overdue ? <AlertTriangle className="h-3 w-3" /> : <CalendarDays className="h-3 w-3" />}
                {formatDate(task.dueDate)}
              </span>
            ) : null}
            {task.member && task.member !== "unassigned" ? (
              <MemberBadge member={task.member} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Board({
  tasks,
  onEdit,
  onStatusChange,
  onAdd,
}: {
  tasks: Task[];
  onEdit: (t: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
  onAdd: (status: Status) => void;
}) {
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<TrackId | "all">("all");
  const [team, setTeam] = useState<TeamId | "all">("all");
  const [member, setMember] = useState<MemberId | "all">("all");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (track !== "all" && t.trackId !== track) return false;
      if (team !== "all" && t.team !== team) return false;
      if (member !== "all" && t.member !== member) return false;
      if (q && !(`${t.title} ${t.description ?? ""}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [tasks, query, track, team, member]);

  const byStatus = (s: Status) => filtered.filter((t) => t.status === s);

  function handleDrop(status: Status) {
    if (dragId) onStatusChange(dragId, status);
    setDragId(null);
    setOverCol(null);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-white/70 px-4 py-3 backdrop-blur sm:px-6">
        <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activities…"
            className="h-9 pl-8"
          />
        </div>
        <Select value={track} onValueChange={(v) => setTrack(v as TrackId | "all")}>
          <SelectTrigger className="h-9 w-[150px]">
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
        <Select value={team} onValueChange={(v) => setTeam(v as TeamId | "all")}>
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All teams</SelectItem>
            {TEAM_ORDER.map((k) => (
              <SelectItem key={k} value={k}>
                {TEAMS[k].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={member} onValueChange={(v) => setMember(v as MemberId | "all")}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Member" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All members</SelectItem>
            {MEMBER_ORDER.map((k) => (
              <SelectItem key={k} value={k}>
                {MEMBERS[k].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} of {tasks.length} shown
        </div>
      </div>

      {/* Columns */}
      <div className="scroll-thin flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-[820px] gap-4 p-4 sm:p-6">
          {STATUS_ORDER.map((status) => {
            const list = byStatus(status);
            const meta = STATUSES[status];
            return (
              <div
                key={status}
                className={`flex h-full min-h-0 flex-1 flex-col rounded-xl border bg-slate-50/60 ${
                  overCol === status ? "drop-active" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (overCol !== status) setOverCol(status);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol(null);
                }}
                onDrop={() => handleDrop(status)}
              >
                <div className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    <span className="text-sm font-semibold text-slate-700">{meta.name}</span>
                    <span className="rounded-full bg-white px-1.5 text-xs font-semibold text-slate-500 shadow-sm">
                      {list.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-slate-700"
                    onClick={() => onAdd(status)}
                    title={`Add to ${meta.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="scroll-thin flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-2.5 pb-3">
                  {list.length === 0 ? (
                    <div className="mt-2 rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400">
                      Drop activities here
                    </div>
                  ) : (
                    list.map((t) => (
                      <TaskCard
                        key={t.id}
                        task={t}
                        onEdit={onEdit}
                        dragging={dragId === t.id}
                        onDragStart={setDragId}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
