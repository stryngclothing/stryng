interface ProgressSummaryProps {
  done: number;
  total: number;
  percent: number;
}

export function ProgressSummary({ done, total, percent }: ProgressSummaryProps) {
  const remaining = total - done;

  return (
    <section data-tauri-drag-region className="px-2.5 pt-3">
      <div data-tauri-drag-region className="flex items-baseline justify-between gap-2">
        <h1
          data-tauri-drag-region
          className="text-[10px] font-semibold tracking-[0.16em] text-zinc-500 uppercase"
        >
          Today&rsquo;s targets
        </h1>
        <p
          data-tauri-drag-region
          className="text-[11px] font-medium text-zinc-400 tabular-nums"
        >
          <span className="text-zinc-200">{done}</span>/{total} completed ·{" "}
          <span className="text-emerald-300">{percent}%</span>
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Daily target progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p data-tauri-drag-region className="mt-1.5 text-[10px] text-zinc-600">
        {total === 0
          ? "Nothing planned yet — add today's first target."
          : remaining === 0
            ? "Every target done. That's a good day."
            : `${remaining} target${remaining === 1 ? "" : "s"} left today`}
      </p>
    </section>
  );
}
