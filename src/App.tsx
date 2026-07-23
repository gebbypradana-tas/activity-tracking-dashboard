import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  KanbanSquare,
  Plus,
  Download,
  Upload,
  RotateCcw,
  MoreVertical,
  Boxes,
  Circle,
} from "lucide-react";
import {
  initialState,
  seedTasks,
  validateState,
  SCHEMA_VERSION,
  formatDate,
} from "@/lib/model";
import type { AppState, Task, Status, TrackId, MemberId } from "@/lib/model";
import { Dashboard } from "@/components/tracker/Dashboard";
import { PersonalDashboard } from "@/components/tracker/PersonalDashboard";
import { Board } from "@/components/tracker/Board";
import { Guide } from "@/components/tracker/Guide";
import { TaskFormDialog } from "@/components/tracker/TaskFormDialog";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Users,
  UserRound,
  BookOpen,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type View = "dashboard" | "board" | "guide";

const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { id: "board", label: "Board", icon: <KanbanSquare className="h-[18px] w-[18px]" /> },
  { id: "guide", label: "How to use", icon: <BookOpen className="h-[18px] w-[18px]" /> },
];

function SidebarContent({
  view,
  onSelect,
  collapsed,
  overallPct,
  dirty,
  lastSaved,
  onToggleCollapse,
}: {
  view: View;
  onSelect: (v: View) => void;
  collapsed: boolean;
  overallPct: number;
  dirty: boolean;
  lastSaved: string | null;
  onToggleCollapse?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      {/* Brand */}
      <div
        className={`flex items-center gap-2.5 border-b border-white/10 py-4 ${
          collapsed ? "justify-center px-2" : "px-4"
        }`}
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
          <Boxes className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <div className="font-display text-sm font-bold text-white">Syspex · TAS</div>
            <div className="text-[11px] text-slate-400">AI Rollout Tracker</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex flex-col gap-1 p-3 ${collapsed ? "px-2" : ""}`}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelect(n.id)}
            title={collapsed ? n.label : undefined}
            className={`flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition ${
              collapsed ? "justify-center px-0" : "px-3"
            } ${
              view === n.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {n.icon}
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className={`mt-auto p-3 ${collapsed ? "px-2" : ""}`}>
        {!collapsed ? (
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Overall</span>
              <span className="font-semibold text-white">{overallPct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Circle className="h-2 w-2" fill={dirty ? "#f59e0b" : "#10b981"} stroke="none" />
              {dirty ? "Unsaved changes" : lastSaved ? `Saved ${formatDate(lastSaved)}` : "All in sync"}
            </div>
          </div>
        ) : (
          <div
            className="grid place-items-center rounded-lg bg-white/5 py-2 text-[11px] font-bold text-white"
            title={`${overallPct}% overall${dirty ? " · unsaved changes" : ""}`}
          >
            {overallPct}%
            <Circle className="mt-1 h-2 w-2" fill={dirty ? "#f59e0b" : "#10b981"} stroke="none" />
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`mt-2 flex w-full items-center gap-2 rounded-lg py-2 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white ${
              collapsed ? "justify-center px-0" : "px-3"
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" /> Collapse
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<AppState>(() => initialState());
  const [view, setView] = useState<View>("dashboard");
  const [dashMode, setDashMode] = useState<"team" | "personal">("team");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [defaultTrack, setDefaultTrack] = useState<TrackId | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<Status | undefined>();
  const [defaultMember, setDefaultMember] = useState<MemberId | undefined>();

  const currentMember: MemberId = state.currentMember ?? "GP";

  const fileRef = useRef<HTMLInputElement>(null);

  const tasks = state.tasks;

  const mutate = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => updater(prev));
    setDirty(true);
  }, []);

  const upsertTask = useCallback(
    (task: Task) => {
      mutate((prev) => {
        const exists = prev.tasks.some((t) => t.id === task.id);
        return {
          ...prev,
          tasks: exists
            ? prev.tasks.map((t) => (t.id === task.id ? task : t))
            : [...prev.tasks, task],
        };
      });
      toast.success(editing ? "Activity updated" : "Activity added");
    },
    [mutate, editing],
  );

  const deleteTask = useCallback(
    (id: string) => {
      mutate((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
      toast("Activity deleted");
    },
    [mutate],
  );

  const changeStatus = useCallback(
    (id: string, status: Status) => {
      mutate((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
      }));
    },
    [mutate],
  );

  const openNew = useCallback((track?: TrackId, status?: Status, member?: MemberId) => {
    setEditing(null);
    setDefaultTrack(track);
    setDefaultStatus(status);
    setDefaultMember(member);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setDefaultTrack(undefined);
    setDefaultStatus(undefined);
    setDefaultMember(undefined);
    setDialogOpen(true);
  }, []);

  const setCurrentMember = useCallback((m: MemberId) => {
    setState((prev) => ({ ...prev, currentMember: m }));
    setDirty(true);
  }, []);

  // ---- JSON save / load ----
  const saveToFile = useCallback(() => {
    const savedAt = new Date().toISOString();
    const payload: AppState = { ...state, version: SCHEMA_VERSION, savedAt };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `syspex-tas-tracker-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDirty(false);
    setLastSaved(savedAt);
    toast.success("Saved to JSON file", { description: a.download });
  }, [state]);

  const onPickFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const valid = validateState(parsed);
        if (!valid) {
          toast.error("Couldn't read that file", {
            description: "It doesn't look like a tracker export.",
          });
          return;
        }
        setState(valid);
        setDirty(false);
        setLastSaved(valid.savedAt ?? null);
        toast.success("Loaded from file", {
          description: `${valid.tasks.length} activities restored`,
        });
      } catch {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }, []);

  const resetDefaults = useCallback(() => {
    setState((prev) => ({ ...prev, tasks: seedTasks() }));
    setDirty(true);
    toast("Reset to framework defaults");
  }, []);

  // Warn before closing with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const doneCount = useMemo(() => tasks.filter((t) => t.status === "done").length, [tasks]);
  const overallPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <div className="app-grid-bg flex h-screen w-full overflow-hidden text-slate-900">
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onPickFile}
      />

      {/* Desktop sidebar (collapsible) */}
      <aside
        className={`hidden shrink-0 border-r border-slate-200 transition-[width] duration-200 md:block ${
          collapsed ? "w-[68px]" : "w-[212px]"
        }`}
      >
        <SidebarContent
          view={view}
          onSelect={setView}
          collapsed={collapsed}
          overallPct={overallPct}
          dirty={dirty}
          lastSaved={lastSaved}
          onToggleCollapse={() => setCollapsed((v) => !v)}
        />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center gap-2 border-b border-slate-200 bg-white/80 px-3 py-3 backdrop-blur sm:gap-3 sm:px-6">
          {/* Mobile drawer trigger */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" title="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[248px] border-slate-800 bg-slate-900 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent
                view={view}
                onSelect={(v) => {
                  setView(v);
                  setMobileNavOpen(false);
                }}
                collapsed={false}
                overallPct={overallPct}
                dirty={dirty}
                lastSaved={lastSaved}
              />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold leading-tight text-slate-900 sm:text-lg">
              {NAV.find((n) => n.id === view)?.label}
            </h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {state.projectName}
            </p>
          </div>

          {view === "dashboard" && (
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 sm:ml-4">
              <button
                onClick={() => setDashMode("team")}
                title="Team dashboard"
                className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition sm:px-2.5 ${
                  dashMode === "team"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Team</span>
              </button>
              <button
                onClick={() => setDashMode("personal")}
                title="Personal dashboard"
                className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition sm:px-2.5 ${
                  dashMode === "personal"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserRound className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Personal</span>
              </button>
            </div>
          )}

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {dirty && (
              <span className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 md:inline-flex">
                <Circle className="h-2 w-2" fill="#f59e0b" stroke="none" /> Unsaved
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Load</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={saveToFile}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => openNew()}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Activity</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={saveToFile}>
                  <Download className="mr-2 h-4 w-4" /> Save to JSON file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Load from file
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-rose-600 focus:text-rose-600"
                  onClick={resetDefaults}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset to framework defaults
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Body */}
        <main className="min-h-0 flex-1">
          {view === "dashboard" && dashMode === "team" && (
            <Dashboard tasks={tasks} onGoBoard={() => setView("board")} onEdit={openEdit} />
          )}
          {view === "dashboard" && dashMode === "personal" && (
            <PersonalDashboard
              tasks={tasks}
              currentMember={currentMember}
              onChangeMember={setCurrentMember}
              onEdit={openEdit}
              onAdd={() => openNew(undefined, undefined, currentMember)}
            />
          )}
          {view === "board" && (
            <Board
              tasks={tasks}
              onEdit={openEdit}
              onStatusChange={changeStatus}
              onAdd={(status) => openNew(undefined, status)}
            />
          )}
          {view === "guide" && <Guide onGo={(v) => setView(v as View)} />}
        </main>
      </div>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        defaultTrack={defaultTrack}
        defaultStatus={defaultStatus}
        defaultMember={defaultMember}
        onSave={upsertTask}
        onDelete={deleteTask}
      />

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
