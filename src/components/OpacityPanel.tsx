import { MIN_OPACITY } from "../hooks/useSettings";

interface OpacityPanelProps {
  value: number;
  onChange: (value: number) => void;
  onClose: () => void;
}

const PRESETS = [100, 85, 70, 55];

export function OpacityPanel({ value, onChange, onClose }: OpacityPanelProps) {
  return (
    <>
      {/* Click-away layer so the panel closes like a real popover. */}
      <button
        type="button"
        aria-label="Close opacity controls"
        tabIndex={-1}
        onClick={onClose}
        className="fixed inset-0 z-10 cursor-default"
      />
      <div className="absolute inset-x-2 top-[calc(100%-4px)] z-20 rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-zinc-400">Window opacity</p>
          <span className="text-[11px] font-semibold text-zinc-200 tabular-nums">
            {value}%
          </span>
        </div>

        <input
          type="range"
          min={MIN_OPACITY}
          max={100}
          step={5}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Window opacity"
          className="range mt-2.5 w-full"
        />

        <div className="mt-2.5 flex gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={[
                "flex-1 rounded-md border py-1 text-[10px] font-medium transition-colors",
                value === preset
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200",
              ].join(" ")}
            >
              {preset}%
            </button>
          ))}
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
          Lower opacity to read a PDF underneath, and raise it to tick targets off.
        </p>
      </div>
    </>
  );
}
