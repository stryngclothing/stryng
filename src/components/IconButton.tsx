import type { ReactNode } from "react";

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
  active?: boolean;
  tone?: "default" | "danger";
  className?: string;
}

export function IconButton({
  label,
  onClick,
  children,
  active = false,
  tone = "default",
  className = "",
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active || undefined}
      className={[
        "grid h-6 w-6 shrink-0 place-items-center rounded-md outline-none transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-emerald-400/40",
        active
          ? "bg-emerald-400/10 text-emerald-300"
          : tone === "danger"
            ? "text-zinc-500 hover:bg-rose-500/10 hover:text-rose-300"
            : "text-zinc-500 hover:bg-white/[0.07] hover:text-zinc-200",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
