const brands = [
  'luxeglow',
  'heysayan',
  'amankushwaha',
  'akas-setu',
  'vox-rag',
]

export default function LogoMarquee() {
  return (
    <section className="py-10">
      <div className="container-x">
        <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-ink-muted">
          Powering products & brands you've heard of
        </p>
        <div className="relative mt-8 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <div className="flex w-max animate-marquee gap-12">
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="flex items-center gap-2 font-display text-xl font-medium text-ink-muted/70 transition-colors hover:text-ink"
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-brand to-accent" />
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
