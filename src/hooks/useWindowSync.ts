import { useEffect, useRef } from "react";
import type { Settings } from "../types";
import { applyAlwaysOnTop, applyWindowMode, isTauri } from "../lib/tauri";

/**
 * Mirrors React state onto the real Tauri window:
 * always-on-top on every change, and the compact/expanded size on toggles.
 * All of it is inert in a plain browser.
 */
export function useWindowSync(settings: Settings): void {
  const compactApplied = useRef(false);

  useEffect(() => {
    if (!isTauri) return;
    applyAlwaysOnTop(settings.alwaysOnTop).catch((error: unknown) => {
      console.error("Could not change always-on-top:", error);
    });
  }, [settings.alwaysOnTop]);

  useEffect(() => {
    if (!isTauri) return;

    // On first mount only shrink if the widget was left in pill mode;
    // otherwise keep whatever size the OS restored.
    if (!compactApplied.current) {
      compactApplied.current = true;
      if (!settings.compact) return;
    }

    applyWindowMode(settings.compact).catch((error: unknown) => {
      console.error("Could not resize widget window:", error);
    });
  }, [settings.compact]);
}
