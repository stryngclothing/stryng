import { useCallback, useEffect, useState } from "react";
import type { Settings } from "../types";
import { readJson, writeJson } from "../lib/storage";

const SETTINGS_KEY = "settings.v1";

export const DEFAULT_SETTINGS: Settings = {
  alwaysOnTop: true,
  opacity: 100,
  compact: false,
};

export const MIN_OPACITY = 40;

function clampOpacity(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_SETTINGS.opacity;
  }
  const clamped = Math.min(100, Math.max(MIN_OPACITY, value));
  return Math.round(clamped / 5) * 5;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = readJson<Partial<Settings>>(SETTINGS_KEY, {});
    return {
      alwaysOnTop:
        typeof stored.alwaysOnTop === "boolean"
          ? stored.alwaysOnTop
          : DEFAULT_SETTINGS.alwaysOnTop,
      opacity: clampOpacity(stored.opacity),
      compact:
        typeof stored.compact === "boolean"
          ? stored.compact
          : DEFAULT_SETTINGS.compact,
    };
  });

  useEffect(() => {
    writeJson(SETTINGS_KEY, settings);
  }, [settings]);

  const setAlwaysOnTop = useCallback((value: boolean) => {
    setSettings((previous) => ({ ...previous, alwaysOnTop: value }));
  }, []);

  const setOpacity = useCallback((value: number) => {
    setSettings((previous) => ({ ...previous, opacity: clampOpacity(value) }));
  }, []);

  const setCompact = useCallback((value: boolean) => {
    setSettings((previous) => ({ ...previous, compact: value }));
  }, []);

  return { settings, setAlwaysOnTop, setOpacity, setCompact };
}
