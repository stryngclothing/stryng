import { useCallback, useEffect, useMemo, useState } from "react";
import type { Task } from "../types";
import { readJson, todayKey, writeJson } from "../lib/storage";

const TASKS_KEY = "day.v1";
const MAX_LENGTH = 160;

interface StoredDay {
  date: string;
  tasks: Task[];
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Task>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.text === "string" &&
    typeof candidate.done === "boolean"
  );
}

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ").slice(0, MAX_LENGTH);
}

/**
 * Loads the saved day. If the saved day is not today, the targets roll over
 * unchecked — a widget opened at 7am should never show yesterday's ticks.
 */
function loadDay(): StoredDay {
  const today = todayKey();
  const stored = readJson<StoredDay | null>(TASKS_KEY, null);

  if (!stored || !Array.isArray(stored.tasks)) {
    return { date: today, tasks: [] };
  }

  const tasks = stored.tasks.filter(isTask).map((task) => ({
    ...task,
    text: normalizeText(task.text),
    createdAt: typeof task.createdAt === "number" ? task.createdAt : Date.now(),
  }));

  if (stored.date === today) {
    return { date: today, tasks };
  }

  return { date: today, tasks: tasks.map((task) => ({ ...task, done: false })) };
}

export function useTasks() {
  const [day, setDay] = useState<StoredDay>(loadDay);

  useEffect(() => {
    writeJson(TASKS_KEY, day);
  }, [day]);

  const addTask = useCallback((text: string) => {
    const value = normalizeText(text);
    if (!value) return;
    setDay((previous) => ({
      date: todayKey(),
      tasks: [
        ...previous.tasks,
        { id: createId(), text: value, done: false, createdAt: Date.now() },
      ],
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setDay((previous) => ({
      date: previous.date,
      tasks: previous.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    }));
  }, []);

  const updateTask = useCallback((id: string, text: string) => {
    const value = normalizeText(text);
    if (!value) return;
    setDay((previous) => ({
      date: previous.date,
      tasks: previous.tasks.map((task) =>
        task.id === id ? { ...task, text: value } : task,
      ),
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setDay((previous) => ({
      date: previous.date,
      tasks: previous.tasks.filter((task) => task.id !== id),
    }));
  }, []);

  /** Fresh day: keep the targets, clear every tick. */
  const resetDay = useCallback(() => {
    setDay((previous) => ({
      date: todayKey(),
      tasks: previous.tasks.map((task) => ({ ...task, done: false })),
    }));
  }, []);

  const { doneCount, total, percent } = useMemo(() => {
    const total = day.tasks.length;
    const doneCount = day.tasks.filter((task) => task.done).length;
    return {
      doneCount,
      total,
      percent: total === 0 ? 0 : Math.round((doneCount / total) * 100),
    };
  }, [day.tasks]);

  return {
    tasks: day.tasks,
    addTask,
    toggleTask,
    updateTask,
    removeTask,
    resetDay,
    doneCount,
    total,
    percent,
  };
}
