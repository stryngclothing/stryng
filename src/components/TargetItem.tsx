import { useRef, useState } from "react";
import type { Task } from "../types";
import { parseTarget, subjectTone } from "../lib/parse";
import { CheckIcon, PencilIcon, TrashIcon } from "./icons";
import { IconButton } from "./IconButton";

interface TargetItemProps {
  task: Task;
  onToggle: () => void;
  onUpdate: (text: string) => void;
  onRemove: () => void;
}

export function TargetItem({ task, onToggle, onUpdate, onRemove }: TargetItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const cancelled = useRef(false);

  const { subject, detail } = parseTarget(task.text);

  function startEditing() {
    cancelled.current = false;
    setDraft(task.text);
    setEditing(true);
  }

  function commit() {
    if (cancelled.current) {
      cancelled.current = false;
      setEditing(false);
      return;
    }
    const next = draft.trim();
    if (next && next !== task.text) onUpdate(next);
    setEditing(false);
  }

  return (
    <li
      data-done={task.done}
      className="group flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-2.5 py-2 transition-colors hover:border-white/[0.12] hover:bg-white/[0.05]"
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.done ? `Mark "${task.text}" as not done` : `Mark "${task.text}" as done`}
        data-checked={task.done}
        onClick={onToggle}
        className="checkbox mt-0.5"
      >
        <CheckIcon className="checkbox-mark h-3 w-3" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            maxLength={160}
            aria-label="Edit target"
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commit();
              } else if (event.key === "Escape") {
                event.preventDefault();
                cancelled.current = true;
                setEditing(false);
              }
            }}
            className="w-full rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[13px] text-zinc-100 outline-none ring-1 ring-emerald-400/30 ring-inset"
          />
        ) : (
          <p
            onDoubleClick={startEditing}
            title="Double-click to edit"
            className={[
              "text-[13px] leading-snug break-words transition-colors duration-200",
              task.done ? "text-zinc-500" : "text-zinc-300",
            ].join(" ")}
          >
            {subject && (
              <span
                className={`mr-1.5 inline-block rounded border px-1 py-px align-middle text-[10px] font-medium ${subjectTone(subject)}`}
              >
                {subject}
              </span>
            )}
            <span className="strike">{detail}</span>
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <IconButton label="Edit target" onClick={startEditing} className="h-5 w-5">
          <PencilIcon className="h-3 w-3" />
        </IconButton>
        <IconButton
          label="Delete target"
          tone="danger"
          onClick={onRemove}
          className="h-5 w-5"
        >
          <TrashIcon className="h-3 w-3" />
        </IconButton>
      </div>
    </li>
  );
}
