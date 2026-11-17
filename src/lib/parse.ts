export interface ParsedTarget {
  subject: string | null;
  detail: string;
}

const SUBJECT_PATTERN = /^([A-Za-z0-9 &/+.-]{1,24}):\s+(.+)$/;

/**
 * "Maths: 50 Algebra Qs" -> { subject: "Maths", detail: "50 Algebra Qs" }
 * "Current Affairs"       -> { subject: null,    detail: "Current Affairs" }
 */
export function parseTarget(text: string): ParsedTarget {
  const match = text.match(SUBJECT_PATTERN);
  if (!match) return { subject: null, detail: text };

  const subject = match[1].trim();
  const detail = match[2].trim();
  if (!subject || !detail) return { subject: null, detail: text };

  return { subject, detail };
}

// Written as literals so Tailwind keeps the classes in the build.
const SUBJECT_TONES = [
  "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "border-sky-400/30 bg-sky-400/10 text-sky-300",
  "border-violet-400/30 bg-violet-400/10 text-violet-300",
  "border-amber-400/30 bg-amber-400/10 text-amber-300",
  "border-rose-400/30 bg-rose-400/10 text-rose-300",
  "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
];

/** Stable colour per subject, so Maths is always the same shade. */
export function subjectTone(subject: string): string {
  let hash = 0;
  for (let index = 0; index < subject.length; index += 1) {
    hash = (hash * 31 + subject.charCodeAt(index)) % 9973;
  }
  return SUBJECT_TONES[hash % SUBJECT_TONES.length];
}
