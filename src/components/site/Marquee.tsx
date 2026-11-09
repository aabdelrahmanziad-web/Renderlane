import { capabilities } from "@/lib/site";

function Row({ reverse = false, outline = false }: { reverse?: boolean; outline?: boolean }) {
  const items = [...capabilities, ...capabilities];
  return (
    <div className="flex overflow-hidden">
      <div
        className="marquee-track flex shrink-0 items-center gap-10 pr-10"
        style={{ animationDirection: reverse ? "reverse" : "normal" } as React.CSSProperties}
      >
        {items.map((c, i) => (
          <span key={`${c}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
            <span
              className={`font-display text-5xl font-light uppercase tracking-tight md:text-7xl ${outline ? "text-outline" : "text-paper"}`}
            >
              {c}
            </span>
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-violet" aria-hidden="true" fill="currentColor">
              <path d="M12 2 20.7 7v10L12 22l-8.7-5V7Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="What we do" className="relative overflow-hidden py-12">
      <div className="-mx-[5%] w-[110%] -rotate-2 border-y border-line bg-ink-2 py-6">
        <Row />
        <div className="mt-4">
          <Row reverse outline />
        </div>
      </div>
    </section>
  );
}
