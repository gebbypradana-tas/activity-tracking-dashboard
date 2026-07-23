import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TRACKS,
  TEAMS,
  TEAM_ORDER,
  MEMBERS,
  MEMBER_ORDER,
  STATUSES,
  STATUS_ORDER,
  PRIORITIES,
  uid,
} from "@/lib/model";
import type { Task, TrackId, TeamId, MemberId, Status, Priority } from "@/lib/model";

export interface TaskDraft extends Partial<Task> {}

export function TaskFormDialog({
  open,
  onOpenChange,
  initial,
  defaultTrack,
  defaultStatus,
  defaultMember,
  onSave,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Task | null;
  defaultTrack?: TrackId;
  defaultStatus?: Status;
  defaultMember?: MemberId;
  onSave: (task: Task) => void;
  onDelete?: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [trackId, setTrackId] = useState<TrackId>("track1");
  const [team, setTeam] = useState<TeamId>("unassigned");
  const [member, setMember] = useState<MemberId>("unassigned");
  const [status, setStatus] = useState<Status>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description ?? "");
      setTrackId(initial.trackId);
      setTeam(initial.team);
      setMember(initial.member ?? "unassigned");
      setStatus(initial.status);
      setPriority(initial.priority);
      setDueDate(initial.dueDate ?? "");
    } else {
      setTitle("");
      setDescription("");
      setTrackId(defaultTrack ?? "track1");
      setTeam(defaultMember && defaultMember !== "unassigned" ? MEMBERS[defaultMember].team : "unassigned");
      setMember(defaultMember ?? "unassigned");
      setStatus(defaultStatus ?? "todo");
      setPriority("medium");
      setDueDate("");
    }
  }, [open, initial, defaultTrack, defaultStatus, defaultMember]);

  const isEdit = Boolean(initial);
  const canSave = title.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const task: Task = {
      id: initial?.id ?? uid(),
      title: title.trim(),
      description: description.trim() || undefined,
      trackId,
      team,
      member,
      assignee: initial?.assignee,
      status,
      priority,
      dueDate: dueDate || undefined,
      milestoneId: initial?.milestoneId,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };
    onSave(task);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Edit activity" : "New activity"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this activity."
              : "Add an activity to the Syspex Claude AI rollout."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="t-title">Title</Label>
            <Input
              id="t-title"
              value={title}
              autoFocus
              placeholder="e.g. Build competitor battlecards"
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
              }}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="t-desc">Description</Label>
            <Textarea
              id="t-desc"
              value={description}
              rows={3}
              placeholder="What needs to happen and why…"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select value={trackId} onValueChange={(v) => setTrackId(v as TrackId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TRACKS) as TrackId[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {TRACKS[k].short} · {TRACKS[k].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Owner team</Label>
              <Select value={team} onValueChange={(v) => setTeam(v as TeamId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_ORDER.map((k) => (
                    <SelectItem key={k} value={k}>
                      {TEAMS[k].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Member</Label>
              <Select value={member} onValueChange={(v) => setMember(v as MemberId)}>
                <SelectTrigger>
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
            <div className="grid gap-1.5">
              <Label htmlFor="t-due">Due date</Label>
              <Input
                id="t-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((k) => (
                    <SelectItem key={k} value={k}>
                      {STATUSES[k].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["high", "medium", "low"] as Priority[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {PRIORITIES[k].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          {isEdit && onDelete ? (
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive sm:mr-auto"
              onClick={() => {
                onDelete(initial!.id);
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              {isEdit ? "Save changes" : "Add activity"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
