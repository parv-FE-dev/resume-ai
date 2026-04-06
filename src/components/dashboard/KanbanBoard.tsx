"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Calendar, ChevronRight, Trash2 } from "lucide-react";
import { useApplicationStore } from "@/store/useApplicationStore";
import {
  STATUS_CONFIG,
  STATUS_ORDER,
  type ApplicationStatus,
  type Application,
} from "@/types/application";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  app: Application;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

function KanbanCard({ app, onStatusChange, onSelect, onRemove }: KanbanCardProps) {
  const currentIdx = STATUS_ORDER.indexOf(app.status);
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-lg border border-zinc-800 bg-zinc-900/80 p-3 hover:border-zinc-700 transition-colors cursor-pointer"
      onClick={() => onSelect(app.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">
            {app.job.title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {app.job.company}
            </span>
            {app.job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {app.job.location.split(",")[0]}
              </span>
            )}
          </div>
        </div>
        {app.job.matchScore > 0 && (
          <span
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold",
              app.job.matchScore >= 80
                ? "bg-emerald-500/10 text-emerald-400"
                : app.job.matchScore >= 60
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
            )}
          >
            {app.job.matchScore}
          </span>
        )}
      </div>

      {/* Date + actions */}
      <div className="mt-2 flex items-center justify-between">
        {app.appliedDate && (
          <span className="flex items-center gap-1 text-[10px] text-zinc-600">
            <Calendar className="h-3 w-3" />
            Applied {new Date(app.appliedDate).toLocaleDateString()}
          </span>
        )}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {nextStatus && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(app.id, nextStatus);
              }}
              className={cn(
                "flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                STATUS_CONFIG[nextStatus].bgColor,
                STATUS_CONFIG[nextStatus].color
              )}
              title={`Move to ${STATUS_CONFIG[nextStatus].label}`}
            >
              <ChevronRight className="h-3 w-3" />
              {STATUS_CONFIG[nextStatus].label}
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(app.id);
            }}
            className="rounded p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Remove"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Follow-up reminder */}
      {app.followUpDate && app.status === "applied" && (
        <div className="mt-2">
          {new Date(app.followUpDate) <= new Date() ? (
            <span className="text-[10px] text-amber-400 font-medium">
              ⏰ Follow up overdue!
            </span>
          ) : (
            <span className="text-[10px] text-zinc-600">
              Follow up:{" "}
              {new Date(app.followUpDate).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

interface KanbanBoardProps {
  onSelectApplication: (id: string) => void;
}

export function KanbanBoard({ onSelectApplication }: KanbanBoardProps) {
  const { applications, updateStatus, removeApplication } =
    useApplicationStore();

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {STATUS_ORDER.map((status) => {
        const config = STATUS_CONFIG[status];
        const apps = applications.filter((a) => a.status === status);

        return (
          <div
            key={status}
            className="flex w-64 shrink-0 flex-col rounded-xl border border-zinc-800/50 bg-zinc-950/50"
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-800/50">
              <div className="flex items-center gap-2">
                <span>{config.emoji}</span>
                <span className={cn("text-xs font-semibold", config.color)}>
                  {config.label}
                </span>
              </div>
              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                {apps.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-2 p-2 min-h-[120px]">
              <AnimatePresence>
                {apps.map((app) => (
                  <KanbanCard
                    key={app.id}
                    app={app}
                    onStatusChange={updateStatus}
                    onSelect={onSelectApplication}
                    onRemove={removeApplication}
                  />
                ))}
              </AnimatePresence>
              {apps.length === 0 && (
                <div className="flex h-20 items-center justify-center">
                  <p className="text-xs text-zinc-700">No applications</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
