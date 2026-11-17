export interface Task {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

export interface Settings {
  /** Keep the widget above every other window. */
  alwaysOnTop: boolean;
  /** Whole-widget opacity, 40–100 (%). */
  opacity: number;
  /** Collapse into the tiny floating pill. */
  compact: boolean;
}
