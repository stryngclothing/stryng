import { CheckIcon, ChevronDownIcon, CloseIcon, DropletIcon, MinusIcon, PinIcon, PinOffIcon } from "./icons";
import { IconButton } from "./IconButton";

interface HeaderProps {
  dateLabel: string;
  alwaysOnTop: boolean;
  opacityOpen: boolean;
  onTogglePin: () => void;
  onToggleOpacity: () => void;
  onCollapse: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export function Header({
  dateLabel,
  alwaysOnTop,
  opacityOpen,
  onTogglePin,
  onToggleOpacity,
  onCollapse,
  onMinimize,
  onClose,
}: HeaderProps) {
  return (
    // `data-tauri-drag-region` makes this strip drag the frameless window.
    <header
      data-tauri-drag-region
      className="flex items-center gap-1 border-b border-white/[0.06] px-2.5 py-2"
    >
      <div data-tauri-drag-region className="flex min-w-0 flex-1 items-center gap-2">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/25 ring-inset">
          <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.6} />
        </span>
        <div data-tauri-drag-region className="min-w-0 leading-tight">
          <p className="truncate text-[11px] font-semibold tracking-[0.16em] text-zinc-300 uppercase">
            SSC CGL
          </p>
          <p className="truncate text-[10px] text-zinc-500">{dateLabel}</p>
        </div>
      </div>

      <IconButton
        label={alwaysOnTop ? "Unpin from top" : "Keep on top"}
        active={alwaysOnTop}
        onClick={onTogglePin}
      >
        {alwaysOnTop ? (
          <PinIcon className="h-3.5 w-3.5" />
        ) : (
          <PinOffIcon className="h-3.5 w-3.5" />
        )}
      </IconButton>

      <IconButton label="Window opacity" active={opacityOpen} onClick={onToggleOpacity}>
        <DropletIcon className="h-3.5 w-3.5" />
      </IconButton>

      <IconButton label="Collapse to pill" onClick={onCollapse}>
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </IconButton>

      <IconButton label="Minimize" onClick={onMinimize}>
        <MinusIcon className="h-3.5 w-3.5" />
      </IconButton>

      <IconButton label="Close widget" tone="danger" onClick={onClose}>
        <CloseIcon className="h-3.5 w-3.5" />
      </IconButton>
    </header>
  );
}
