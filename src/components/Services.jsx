import {
  Code2, TrendingUp, Palette, Rocket, Smartphone, Boxes, Megaphone,
  Target, MousePointerClick, Search, Filter, PenTool, Layers, Image,
  Newspaper, Clapperboard, ArrowUpRight,
} from 'lucide-react'
import { Reveal } from '../hooks'

const pillars = [
  {
    id: 'build',
    number: '01',
    icon: Code2,
    title: 'Build',
    tagline: 'Development',
    gradient: 'from-brand to-brand-dark',
    glow: 'hover:shadow-brand/15',
    description:
      'Turn your idea into a shipped, scalable product. We design, develop, and deploy software that performs — from first MVP to full platform.',
    services: [
      { icon: Rocket, name: 'SaaS Product Development' },
      { icon: Boxes, name: 'Custom Software Development' },
      { icon: Code2, name: 'Web App Development' },
      { icon: Smartphone, name: 'Mobile App Development' },
      { icon: Rocket, name: 'MVP Development for Startups' },
    ],
  },
  {
    id: 'grow',
    number: '02',
    icon: TrendingUp,
    title: 'Grow',
    tagline: 'Marketing',
    gradient: 'from-[#7C6BFF] to-brand',
    glow: 'hover:shadow-[#7C6BFF]/20',
    description:
      'Turn attention into revenue. Our performance-driven marketing funnels your ad spend into predictable, scalable sales and leads.',
    services: [
      { icon: Target, name: 'Lead Generation' },
      { icon: MousePointerClick, name: 'Conversion Optimization' },
      { icon: Megaphone, name: 'Performance Marketing (Google & Meta Ads)' },
      { icon: Search, name: 'SEO' },
      { icon: Filter, name: 'Marketing Funnels & Automation' },
    ],
  },
  {
    id: 'brand',
    number: '03',
    icon: Palette,
    title: 'Brand',
    tagline: 'Design',
    gradient: 'from-accent to-brand',
    glow: 'hover:shadow-accent/25',
    description:
      'Make your product impossible to ignore. We craft identities and creatives that build trust, recognition, and desire at every touchpoint.',
    services: [
      { icon: PenTool, name: 'Logo Design' },
      { icon: Layers, name: 'Brand Identity & Guidelines' },
      { icon: Image, name: 'Banners & Social Creatives' },
      { icon: Newspaper, name: 'Posters & Print Design' },
      { icon: Clapperboard, name: 'Video Production & Motion' },
    ],
  },
]

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" aria-hidden="true" />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">Our Services</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Three pillars. <span className="serif-accent text-brand-dark">Every stage</span> of your growth.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-ink-soft">
              Whether you need a product built, an audience converted, or a brand
              people remember — we cover the full journey from idea to impact.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.id} delay={i * 120}>
              <div className={`group relative flex h-full flex-col rounded-3xl border border-hairline bg-surface p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${pillar.glow}`}>
                <div className="mb-6 flex items-start justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.gradient} shadow-lg`}>
                    <pillar.icon className="h-7 w-7 text-white" />
                  </div>
                  <span
                    aria-hidden="true"
                    className="select-none font-display text-5xl font-medium text-ink/[0.06] transition-colors group-hover:text-ink/[0.12]"
                  >
                    {pillar.number}
                  </span>
                </div>

                <div className="mb-1 flex items-baseline gap-2">
                  <h3 className="font-display text-2xl font-medium text-ink">{pillar.title}</h3>
                  <span className="font-mono text-sm text-ink-muted">/ {pillar.tagline}</span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{pillar.description}</p>

                <ul className="mt-6 flex flex-col gap-2.5">
                  {pillar.services.map((service) => (
                    <li key={service.name} className="flex items-center gap-3 text-sm text-ink-soft">
                      <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${pillar.gradient}`}>
                        <service.icon className="h-3.5 w-3.5 text-white" />
                      </span>
                      {service.name}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-brand-dark"
                >
                  Start with {pillar.title}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
