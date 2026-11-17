import { ChevronUpIcon } from "./icons";
import { IconButton } from "./IconButton";
import { ProgressRing } from "./ProgressRing";

interface CompactPillProps {
  done: number;
  total: number;
  percent: number;
  alwaysOnTop: boolean;
  onExpand: () => void;
}

export function CompactPill({
  done,
  total,
  percent,
  alwaysOnTop,
  onExpand,
}: CompactPillProps) {
  return (
    <div
      data-tauri-drag-region
      className="flex h-full w-full items-center gap-2.5 rounded-full border border-white/10 bg-zinc-950 pr-1.5 pl-2.5 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.95)]"
    >
      <ProgressRing percent={percent} />

      <div data-tauri-drag-region className="min-w-0 flex-1 leading-none">
        <p data-tauri-drag-region className="text-[13px] font-semibold text-zinc-100 tabular-nums">
          {done}
          <span className="text-zinc-500">/{total}</span>
          {alwaysOnTop && (
            <span className="ml-1.5 align-middle text-[9px] text-emerald-400/70">ON TOP</span>
          )}
        </p>
        <p data-tauri-drag-region className="mt-0.5 text-[10px] text-zinc-500 tabular-nums">
          {percent}% · SSC CGL
        </p>
      </div>

      <IconButton label="Expand widget" onClick={onExpand} className="h-7 w-7">
        <ChevronUpIcon className="h-3.5 w-3.5" />
      </IconButton>
    </div>
  );
}
