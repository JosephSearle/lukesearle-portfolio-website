export function ImageSlot({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`absolute inset-0 flex items-center justify-center p-4 text-center text-[13px] text-slate-500 ${className}`}
    >
      {label}
    </div>
  );
}
