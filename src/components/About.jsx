import { Sparkles, Layers, MapPin } from 'lucide-react'
import { Reveal } from '../hooks'

const values = [
  {
    title: 'Founder-first',
    text: 'We work as an extension of your team, treating your goals and deadlines like our own — because your success is our best marketing.',
  },
  {
    title: 'Outcome-obsessed',
    text: 'No vanity deliverables. Every project is measured by what matters: more leads, more sales, a stronger brand, a faster launch.',
  },
  {
    title: 'Built for anywhere',
    text: 'From San Francisco to Dubai to Auckland — we ship on schedules that respect your time zone, across USD, AED, EUR, and NZD.',
  },
]

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="eyebrow">About Devonyx</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
                The partner serious <span className="serif-accent text-brand-dark">founders choose</span>.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                Devonyx started with a simple frustration: too many agencies promise
                one thing and deliver another. We built the kind of partner we wished
                we could hire — one that can take a product from a napkin sketch to a
                revenue-generating business, end to end.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Today, we're a tight-knit team of developers, marketers, and designers
                helping founders and businesses across{' '}
                <span className="font-semibold text-ink">the USA, UAE, Netherlands, and New Zealand</span>{' '}
                build, brand, and grow. That's the whole point of the name: from{' '}
                <span className="font-semibold text-brand-dark">Dev</span>elop, to{' '}
                <span className="font-semibold text-brand-dark">On</span>shot success, to growth.
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Since 2018', 'Remote-first', '4 regions', '120+ launches'].map((badge) => (
                  <span key={badge} className="rounded-full border border-hairline bg-surface px-4 py-2 text-sm text-ink-muted">
                    {badge}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="relative rounded-3xl border border-hairline bg-surface p-8">
              <Sparkles className="mb-6 h-8 w-8 text-brand" />
              <h3 className="font-display text-2xl font-medium text-ink">
                What our clients say about how we work
              </h3>
              <div className="mt-8 flex flex-col gap-6">
                {values.map((value) => (
                  <div key={value.title} className="flex gap-4">
                    <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gradient-subtle border border-brand/20">
                      <Layers className="h-4 w-4 text-brand-dark" />
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{value.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{value.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-2 border-t border-hairline pt-6 text-sm text-ink-muted">
                <MapPin className="h-4 w-4 text-brand" />
                Working across 4 time zones · North America, Middle East, Europe & Oceania
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
