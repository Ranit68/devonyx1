import { Quote } from 'lucide-react'
import { Reveal } from '../hooks'

const testimonials = [
  {
    quote:
      'Devonyx took our fintech idea from a sketch to a live SaaS platform in six weeks. They felt like co-founders, not a vendor. The quality is genuinely world-class.',
    name: 'Omar H.',
    title: 'Founder, Fintech Startup',
    region: 'UAE',
    flag: '🇦🇪',
    avatarColor: '#2B4BFF',
    initials: 'OH',
  },
  {
    quote:
      'Within one quarter, they rebuilt our funnel and doubled revenue. Every dollar of ad spend is now accountable. I wish we had hired them a year earlier.',
    name: 'Sarah K.',
    title: 'CEO, B2B Services Co.',
    region: 'USA',
    flag: '🇺🇸',
    avatarColor: '#4C0FB5',
    initials: 'SK',
  },
  {
    quote:
      'The brand identity they created made us look ten times bigger than we are. Investors and customers both notice immediately. Worth every cent.',
    name: 'Lucas van der B.',
    title: 'Co-founder, D2C Startup',
    region: 'Netherlands',
    flag: '🇳🇱',
    avatarColor: '#B45309',
    initials: 'LV',
  },
  {
    quote:
      'Professional, fast, and genuinely invested in our growth. Their timezone-friendly process meant zero friction — they just got on with it and delivered.',
    name: 'Mia T.',
    title: 'Managing Director, Retail Brand',
    region: 'New Zealand',
    flag: '🇳🇿',
    avatarColor: '#1E37C9',
    initials: 'MT',
  },
]

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container-x relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">Testimonials</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Founders across <span className="serif-accent text-brand-dark">5 regions</span> trust us.
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="flex h-full flex-col rounded-3xl border border-hairline bg-surface p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-brand/10">
                <div className="mb-5 flex items-center justify-between">
                  <Quote className="h-7 w-7 text-brand" />
                  <span className="flex items-center gap-1.5 rounded-full border border-hairline bg-paper px-3 py-1 text-xs font-medium text-ink-muted">
                    <span aria-hidden="true">{t.flag}</span>
                    {t.region}
                  </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-ink-soft">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-hairline pt-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: t.avatarColor }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-muted">{t.title}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
