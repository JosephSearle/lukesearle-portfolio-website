import type { ReactNode } from 'react';

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-slate-300">
      {children}
    </span>
  );
}
