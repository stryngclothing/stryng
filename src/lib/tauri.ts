import { LogicalSize, getCurrentWindow } from "@tauri-apps/api/window";

/**
 * True only inside the Tauri webview. Every call below becomes a no-op in a
 * plain browser (`npm run dev`), so the UI stays previewable and testable.
 */
export const isTauri =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

/** Window sizes in logical pixels; keep in sync with tauri.conf.json. */
export const DEFAULT_WINDOW_SIZE = { width: 380, height: 560 };
export const COMPACT_WINDOW_SIZE = { width: 214, height: 56 };

/** Never restore a window smaller than this when leaving pill mode. */
const MIN_RESTORE_SIZE = { width: 280, height: 340 };
const EXPANDED_SIZE_KEY = "window.expanded-size.v1";

interface WindowSize {
  width: number;
  height: number;
}

function rememberExpandedSize(size: WindowSize): void {
  try {
    localStorage.setItem(EXPANDED_SIZE_KEY, JSON.stringify(size));
  } catch {
    // Ignore: the default size is used next launch.
  }
}

function loadExpandedSize(): WindowSize {
  try {
    const raw = localStorage.getItem(EXPANDED_SIZE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<WindowSize>;
      if (
        typeof parsed.width === "number" &&
        typeof parsed.height === "number" &&
        Number.isFinite(parsed.width) &&
        Number.isFinite(parsed.height)
      ) {
        return {
          width: Math.max(MIN_RESTORE_SIZE.width, Math.round(parsed.width)),
          height: Math.max(MIN_RESTORE_SIZE.height, Math.round(parsed.height)),
        };
      }
    }
  } catch {
    // Fall through to the default size.
  }
  return DEFAULT_WINDOW_SIZE;
}

export async function applyAlwaysOnTop(value: boolean): Promise<void> {
  if (!isTauri) return;
  await getCurrentWindow().setAlwaysOnTop(value);
}

/**
 * Shrink the window into the floating pill, or restore the size it had
 * before collapsing.
 */
export async function applyWindowMode(compact: boolean): Promise<void> {
  if (!isTauri) return;
  const win = getCurrentWindow();

  if (compact) {
    const scale = await win.scaleFactor();
    const inner = (await win.innerSize()).toLogical(scale);
    const isActuallyExpanded =
      inner.width > COMPACT_WINDOW_SIZE.width + 24 &&
      inner.height > COMPACT_WINDOW_SIZE.height + 24;
    if (isActuallyExpanded) {
      rememberExpandedSize({ width: inner.width, height: inner.height });
    }
    await win.setSize(
      new LogicalSize(COMPACT_WINDOW_SIZE.width, COMPACT_WINDOW_SIZE.height),
    );
    return;
  }

  const size = loadExpandedSize();
  await win.setSize(new LogicalSize(size.width, size.height));
}

export async function minimizeWindow(): Promise<void> {
  if (!isTauri) return;
  await getCurrentWindow().minimize();
}

export async function closeWindow(): Promise<void> {
  if (!isTauri) return;
  await getCurrentWindow().close();
}
