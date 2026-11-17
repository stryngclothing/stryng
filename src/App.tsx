import { useCallback, useEffect, useState } from "react";
import { AddTargetForm } from "./components/AddTargetForm";
import { CompactPill } from "./components/CompactPill";
import { Header } from "./components/Header";
import { OpacityPanel } from "./components/OpacityPanel";
import { ProgressSummary } from "./components/ProgressSummary";
import { TargetList } from "./components/TargetList";
import { RotateIcon } from "./components/icons";
import { useSettings } from "./hooks/useSettings";
import { useTasks } from "./hooks/useTasks";
import { useWindowSync } from "./hooks/useWindowSync";
import { formatToday } from "./lib/storage";
import { closeWindow, minimizeWindow } from "./lib/tauri";

export default function App() {
  const {
    tasks,
    addTask,
    toggleTask,
    updateTask,
    removeTask,
    resetDay,
    doneCount,
    total,
    percent,
  } = useTasks();
  const { settings, setAlwaysOnTop, setOpacity, setCompact } = useSettings();
  const [opacityOpen, setOpacityOpen] = useState(false);

  useWindowSync(settings);

  useEffect(() => {
    if (!opacityOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpacityOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [opacityOpen]);

  const handleMinimize = useCallback(() => {
    minimizeWindow().catch((error: unknown) =>
      console.error("Could not minimize the widget:", error),
    );
  }, []);

  const handleClose = useCallback(() => {
    closeWindow().catch((error: unknown) =>
      console.error("Could not close the widget:", error),
    );
  }, []);

  const footerLabel =
    total === 0
      ? "No targets added"
      : doneCount === total
        ? "All targets completed"
        : `${total - doneCount} of ${total} left`;

  return (
    <div className="app-root" style={{ opacity: settings.opacity / 100 }}>
      {settings.compact ? (
        <CompactPill
          done={doneCount}
          total={total}
          percent={percent}
          alwaysOnTop={settings.alwaysOnTop}
          onExpand={() => setCompact(false)}
        />
      ) : (
        <main className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.95)]">
          <div className="relative">
            <Header
              dateLabel={formatToday()}
              alwaysOnTop={settings.alwaysOnTop}
              opacityOpen={opacityOpen}
              onTogglePin={() => setAlwaysOnTop(!settings.alwaysOnTop)}
              onToggleOpacity={() => setOpacityOpen((open) => !open)}
              onCollapse={() => {
                setOpacityOpen(false);
                setCompact(true);
              }}
              onMinimize={handleMinimize}
              onClose={handleClose}
            />
            {opacityOpen && (
              <OpacityPanel
                value={settings.opacity}
                onChange={setOpacity}
                onClose={() => setOpacityOpen(false)}
              />
            )}
          </div>

          <div data-tauri-drag-region className="flex min-h-0 flex-1 flex-col">
            <ProgressSummary done={doneCount} total={total} percent={percent} />

            <AddTargetForm onAdd={addTask} />

            <div className="scroll-slim mt-2 min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
              <TargetList
                tasks={tasks}
                onToggle={toggleTask}
                onUpdate={updateTask}
                onRemove={removeTask}
              />
            </div>

            <footer
              data-tauri-drag-region
              className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-2.5 py-2"
            >
              <p data-tauri-drag-region className="truncate text-[10px] text-zinc-600">
                {footerLabel}
              </p>
              <button
                type="button"
                onClick={resetDay}
                disabled={doneCount === 0}
                title="Uncheck every target for a fresh study day"
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-medium text-zinc-300 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-200 disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04] disabled:hover:text-zinc-300"
              >
                <RotateIcon className="h-3 w-3" />
                New day
              </button>
            </footer>
          </div>
        </main>
      )}
    </div>
  );
}
