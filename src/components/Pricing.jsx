import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { Reveal } from '../hooks'

const tiers = [
  {
    name: 'Starter',
    price: '2,500',
    currency: 'USD',
    period: '/project',
    description: 'Perfect for a focused, single-pillar project — a landing page, a brand refresh, or a campaign.',
    features: [
      '1 service pillar (Build / Grow / Brand)',
      'Fixed scope & timeline',
      'Dedicated project manager',
      '2 revision rounds',
      'Email support',
      '7-day delivery for most projects',
    ],
    cta: 'Get a Starter Quote',
    featured: false,
  },
  {
    name: 'Growth',
    price: '8,000',
    currency: 'USD',
    period: '/project',
    description: 'Our most popular. A full product launch, complete brand, or growth engine — two or more pillars.',
    features: [
      '2–3 service pillars combined',
      'Sprint-based delivery',
      'Weekly demo calls',
      'Unlimited revisions on scope',
      'Priority support',
      'Performance reporting',
      '30-day post-launch support',
    ],
    cta: 'Book a Growth Call',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    currency: '',
    period: '',
    description: 'For scaling teams and funded startups that need a long-term, embedded product & growth partner.',
    features: [
      'All 3 pillars, dedicated team',
      'Retainer or outcome-based model',
      'Dedicated product owner',
      'SLA & escalation path',
      'Multi-region rollout',
      'Custom AI & integrations',
    ],
    cta: 'Talk to Sales',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="section bg-white/40">
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow">Pricing</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Simple, transparent <span className="serif-accent text-brand-dark">packages</span>.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-ink-soft">
              Every project is scoped to you. Start with a package or get a
              custom quote — either way, no surprises. Prices shown in USD; we
              invoice in USD, AED, EUR & NZD.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 120}>
              <div
                className={`relative flex h-full flex-col rounded-3xl p-8 transition-all duration-300 ${
                  tier.featured
                    ? 'bg-ink-gradient shadow-2xl shadow-ink/25 lg:-translate-y-3'
                    : 'border border-hairline bg-surface hover:-translate-y-2 hover:shadow-xl hover:shadow-brand/10'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-ink shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className={`font-display text-lg font-medium ${tier.featured ? 'text-white' : 'text-ink'}`}>{tier.name}</h3>
                <div className="mt-4 flex items-end gap-1">
                  {tier.currency && <span className={`pb-2 text-xl ${tier.featured ? 'text-white/60' : 'text-ink-muted'}`}>{tier.currency}</span>}
                  <span className={`font-display text-5xl font-medium ${tier.featured ? 'text-white' : 'text-ink'}`}>{tier.price}</span>
                  {tier.period && <span className={`pb-2 text-sm ${tier.featured ? 'text-white/60' : 'text-ink-muted'}`}>{tier.period}</span>}
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${tier.featured ? 'text-white/80' : 'text-ink-soft'}`}>{tier.description}</p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-3 text-sm ${tier.featured ? 'text-white/85' : 'text-ink-soft'}`}>
                      <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${tier.featured ? 'bg-accent text-ink' : 'bg-brand text-white'}`}>
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                    tier.featured
                      ? 'bg-white text-ink hover:bg-accent hover:text-white'
                      : 'bg-ink-gradient text-white hover:brightness-125'
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-ink-muted">
            <Sparkles className="h-4 w-4 text-brand" />
            Not sure what you need? Book a free 30-minute strategy call — we'll point you in the right direction.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
