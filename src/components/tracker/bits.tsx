import { TRACKS, TEAMS, MEMBERS, STATUSES, PRIORITIES } from "@/lib/model";
import type { TrackId, TeamId, MemberId, Status, Priority } from "@/lib/model";

export function MemberBadge({ member, withName = false }: { member: MemberId; withName?: boolean }) {
  const m = MEMBERS[member];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
      <span
        className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white ring-1 ring-white"
        style={{ backgroundColor: m.color }}
      >
        {m.code}
      </span>
      {withName ? <span>{m.name}</span> : null}
    </span>
  );
}

export function TrackChip({ trackId, showName = true }: { trackId: TrackId; showName?: boolean }) {
  const t = TRACKS[trackId];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: t.soft, color: t.text }}
    >
      <span className="h-2 w-2 rounded-[3px]" style={{ backgroundColor: t.accent }} />
      {showName ? (
        <>
          <span className="opacity-60">{t.short}</span>
          <span className="hidden sm:inline">· {t.name}</span>
        </>
      ) : (
        t.short
      )}
    </span>
  );
}

export function TeamBadge({ team }: { team: TeamId }) {
  const m = TEAMS[team];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span
        className="grid h-4 w-4 place-items-center rounded-full text-[8px] font-bold text-white"
        style={{ backgroundColor: m.color }}
      >
        {m.short}
      </span>
      {m.name}
    </span>
  );
}

export function StatusPill({ status }: { status: Status }) {
  const s = STATUSES[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: s.soft, color: s.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.name}
    </span>
  );
}

export function PriorityTag({ priority }: { priority: Priority }) {
  const p = PRIORITIES[priority];
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: p.soft, color: p.text }}
    >
      {p.name}
    </span>
  );
}

export function Donut({
  pct,
  size = 116,
  color = "#0f172a",
}: {
  pct: number;
  size?: number;
  color?: string;
}) {
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-bold text-slate-900">{pct}%</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">done</span>
      </div>
    </div>
  );
}

// A tidy segmented progress meter (done / in-progress / blocked / todo)
export function StatusMeter({
  counts,
  height = 8,
}: {
  counts: Record<Status, number>;
  height?: number;
}) {
  const total = counts.todo + counts.in_progress + counts.blocked + counts.done || 1;
  const seg = (n: number) => `${(n / total) * 100}%`;
  return (
    <div
      className="flex w-full overflow-hidden rounded-full bg-slate-100"
      style={{ height }}
      role="img"
      aria-label={`${counts.done} done, ${counts.in_progress} in progress, ${counts.blocked} blocked, ${counts.todo} to do`}
    >
      {(["done", "in_progress", "blocked", "todo"] as Status[]).map((k) =>
        counts[k] > 0 ? (
          <div key={k} style={{ width: seg(counts[k]), backgroundColor: STATUSES[k].color }} />
        ) : null,
      )}
    </div>
  );
}
