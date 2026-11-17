import { useState } from "react";
import type { FormEvent } from "react";
import { PlusIcon } from "./icons";

interface AddTargetFormProps {
  onAdd: (text: string) => void;
}

export function AddTargetForm({ onAdd }: AddTargetFormProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    onAdd(text);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-2.5 px-2.5">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={160}
        placeholder="Add a target — e.g. Maths: 50 Algebra Qs"
        aria-label="New daily target"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pr-10 pl-2.5 text-[13px] text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-emerald-400/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-emerald-400/10"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        aria-label="Add target"
        className="absolute top-1/2 right-4 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg bg-emerald-400/15 text-emerald-300 transition-colors hover:bg-emerald-400/25 disabled:bg-white/[0.04] disabled:text-zinc-600"
      >
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
