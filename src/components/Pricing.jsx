import { useState } from 'react'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { Reveal } from '../hooks'

const tabs = [
  {
    id: 'development',
    label: 'Development',
    tiers: [
      {
        name: 'Starter',
        price: '399',
        priceNote: '/ project',
        description: 'A focused starter build — a landing page, a simple web app, or an MVP slice.',
        features: [
          'Single-page website or MVP',
          'Responsive design',
          'React / modern stack',
          '1 revision round',
          'Basic SEO setup',
          '5-day delivery',
        ],
        cta: 'Get a Build',
        featured: false,
      },
      {
        name: 'Growth',
        price: '899',
        priceNote: '/ project',
        description: 'A full product build — multi-page app, custom features, and clean architecture.',
        features: [
          'Full web app / SaaS build',
          'Custom features & integrations',
          'Database + backend',
          '2 revision rounds',
          'Deploy & hosting setup',
          '15-day delivery',
        ],
        cta: 'Start a Growth Build',
        featured: true,
      },
      {
        name: 'Custom',
        price: 'Custom',
        priceNote: '',
        description: 'Scaling teams and complex platforms need a dedicated build partner.',
        features: [
          'Complex / enterprise platform',
          'Dedicated development team',
          'Sprint-based delivery',
          'SLA & support',
          'Custom AI & integrations',
          'Ongoing maintenance',
        ],
        cta: 'Talk About Custom',
        featured: false,
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    tiers: [
      {
        name: 'Starter',
        price: '199',
        priceNote: '/ project',
        description: 'Kick off growth with a focused campaign, funnel, or SEO foundation.',
        features: [
          '1 ad campaign / funnel',
          'Google & Meta ads setup',
          'Keyword research & SEO',
          'Conversion tracking',
          'Monthly report',
        ],
        cta: 'Get a Campaign',
        featured: false,
      },
      {
        name: 'Growth',
        price: '299',
        priceNote: '/ project',
        description: 'A full performance-marketing engine across channels with optimization.',
        features: [
          'Multi-channel campaigns',
          'Landing pages & funnels',
          'A/B testing & CRO',
          'Automation & lead routing',
          'Weekly optimization',
          'Performance dashboard',
        ],
        cta: 'Scale My Growth',
        featured: true,
      },
      {
        name: 'Custom',
        price: 'Custom',
        priceNote: '',
        description: 'For scaling teams needing an embedded, ongoing growth partner.',
        features: [
          'Always-on paid media',
          'Dedicated marketing team',
          'Full-funnel strategy',
          'SLA & reporting',
          'Multi-region campaigns',
          'Retainer model',
        ],
        cta: 'Talk About Custom',
        featured: false,
      },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    tiers: [
      {
        name: 'Starter',
        price: '99',
        priceNote: '/ project',
        description: 'A sharp logo, brand refresh, or a short video edit to get you looking pro.',
        features: [
          'Logo design',
          'Social media creatives',
          'Basic video editing',
          '2 revision rounds',
          'Vector + web formats',
        ],
        cta: 'Start a Design',
        featured: false,
      },
      {
        name: 'Growth',
        price: '189',
        priceNote: '/ project',
        description: 'A complete visual identity or a fuller video & motion package.',
        features: [
          'Full brand identity & guidelines',
          'Banner & social set',
          'Motion graphics',
          'Video editing & posts',
          '3 revision rounds',
          'Brand kit delivered',
        ],
        cta: 'Level Up My Brand',
        featured: true,
      },
      {
        name: 'Custom',
        price: 'Custom',
        priceNote: '',
        description: 'A design studio on demand for ongoing brand, motion, and video needs.',
        features: [
          'Unlimited design requests',
          'Video production & editing',
          'Motion & 3D',
          'Priority turnaround',
          'Dedicated designer',
          'Retainer model',
        ],
        cta: 'Talk About Custom',
        featured: false,
      },
    ],
  },
]

export default function Pricing() {
  const [active, setActive] = useState('development')
  const tiers = tabs.find((t) => t.id === active).tiers

  return (
    <section id="pricing" className="section bg-white/40">
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">Pricing</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Simple, transparent <span className="serif-accent text-brand-dark">packages</span>.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-ink-soft">
              Pick a pillar below — Development, Marketing, or Design. Every
              package is negotiable and scoped to you. Prices in USD.
            </p>
          </Reveal>
        </div>

        <Reveal delay={250}>
          <div className="mx-auto mt-10 flex w-fit flex-wrap justify-center gap-2 rounded-full border border-hairline bg-surface p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                  active === tab.id
                    ? 'bg-ink-gradient text-white shadow'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={`${active}-${tier.name}`} delay={i * 120}>
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
                  {tier.price === 'Custom' ? (
                    <span className={`font-display text-5xl font-medium ${tier.featured ? 'text-white' : 'text-ink'}`}>{tier.price}</span>
                  ) : (
                    <>
                      <span className={`pb-2 font-mono text-xl ${tier.featured ? 'text-white/60' : 'text-ink-muted'}`}>US$</span>
                      <span className={`font-display text-5xl font-medium ${tier.featured ? 'text-white' : 'text-ink'}`}>{tier.price}</span>
                      <span className={`pb-2 text-sm ${tier.featured ? 'text-white/60' : 'text-ink-muted'}`}>{tier.priceNote}</span>
                    </>
                  )}
                </div>
                <p className={`mt-2 text-xs font-semibold ${tier.featured ? 'text-accent' : 'text-brand-dark'}`}>
                  {tier.price === 'Custom' ? 'Scope-based pricing' : 'Negotiable pricing'}
                </p>
                <p className={`mt-3 text-sm leading-relaxed ${tier.featured ? 'text-white/80' : 'text-ink-soft'}`}>{tier.description}</p>

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
            Not sure what you need? Book a free 30-minute strategy call — pricing is always negotiable.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
