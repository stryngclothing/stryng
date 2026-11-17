import type { Task } from "../types";
import { TargetItem } from "./TargetItem";

interface TargetListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}

export function TargetList({ tasks, onToggle, onUpdate, onRemove }: TargetListProps) {
  if (tasks.length === 0) {
    return (
      <div
        data-tauri-drag-region
        className="flex h-full flex-col items-center justify-center gap-1 px-5 pb-4 text-center"
      >
        <p className="text-[13px] font-medium text-zinc-400">No targets yet</p>
        <p className="text-[11px] leading-relaxed text-zinc-600">
          Add the first one above, like
          <br />
          <span className="text-zinc-500">&ldquo;Maths: 50 Algebra Qs&rdquo;</span>
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5 px-2.5 pb-2.5">
      {tasks.map((task) => (
        <TargetItem
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onUpdate={(text) => onUpdate(task.id, text)}
          onRemove={() => onRemove(task.id)}
        />
      ))}
    </ul>
  );
}
