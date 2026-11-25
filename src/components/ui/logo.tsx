/** The OffOnSale mark (a switch, on) and wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <span dir="ltr" className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <svg viewBox="0 0 64 64" className="size-8" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0f9f74" />
            <stop offset="1" stopColor="#1f6fe0" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill="url(#logo-g)" />
        <rect x="12" y="22" width="40" height="20" rx="10" fill="#fff" fillOpacity=".25" />
        <circle cx="42" cy="32" r="8" fill="#fff" />
      </svg>
      <span className="text-[1.2rem] font-extrabold tracking-[-0.04em]">
        <span className="text-ink-3">Off</span>
        <span className="text-brand">On</span>
        <span>Sale</span>
      </span>
    </span>
  );
}
