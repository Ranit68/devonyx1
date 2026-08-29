import { ArrowUpRight, TrendingUp, Rocket, Palette } from 'lucide-react'
import { Reveal } from '../hooks'

const projects = [
  {
    pillar: 'Build',
    icon: Rocket,
    gradient: 'from-brand to-brand-dark',
    metric: '6 weeks',
    metricLabel: 'to MVP launch',
    title: 'Fintech SaaS Platform',
    region: 'UAE',
    description:
      'A full SaaS platform for invoice financing — built from scratch, deployed, and live for early users within six weeks.',
    tags: ['SaaS', 'Web App', 'Custom Dev'],
    barColor: 'from-brand to-brand-dark',
    line: '#2B4BFF',
    bars: [38, 52, 46, 66, 72, 88, 100],
    kpis: [
      { label: 'Weeks to launch', value: '6' },
      { label: 'Users onboard', value: '1.2k' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    pillar: 'Grow',
    icon: TrendingUp,
    gradient: 'from-[#7C6BFF] to-brand',
    metric: '+212%',
    metricLabel: 'qualified leads',
    title: 'B2B Lead Engine',
    region: 'USA',
    description:
      'Rebuilt the acquisition funnel with Google & Meta ads, automation, and conversion optimization — doubling revenue in a quarter.',
    tags: ['Performance Marketing', 'SEO', 'Automation'],
    barColor: 'from-[#7C6BFF] to-brand',
    line: '#7C6BFF',
    bars: [30, 42, 52, 58, 66, 82, 95],
    kpis: [
      { label: 'Leads / mo', value: '3.2k' },
      { label: 'CAC down', value: '-38%' },
      { label: 'ROAS', value: '4.6x' },
    ],
  },
  {
    pillar: 'Brand',
    icon: Palette,
    gradient: 'from-accent to-brand',
    metric: '3x',
    metricLabel: 'brand recall',
    title: 'Consumer Brand Identity',
    region: 'Netherlands',
    description:
      'Full identity for a D2C startup — logo, guidelines, social system, and motion assets that made the brand instantly recognizable.',
    tags: ['Identity', 'Guidelines', 'Motion'],
    barColor: 'from-accent to-brand',
    line: '#E8A33D',
    bars: [44, 58, 66, 74, 80, 92, 100],
    kpis: [
      { label: 'Brand recall', value: '3x' },
      { label: 'Recognition', value: '+64%' },
      { label: 'Assets', value: '120+' },
    ],
  },
]

export default function Work() {
  return (
    <section id="work" className="section">
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">Our Work</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
                Results that <span className="serif-accent text-brand-dark">speak in numbers</span>.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 text-lg text-ink-soft">
                Real projects, real outcomes. A look at what Devonyx delivers for
                founders across the USA, UAE, Netherlands, New Zealand & India.
              </p>
            </Reveal>
          </div>
          <Reveal delay={250}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark"
            >
              Want results like these? Book a call
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 120}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-hairline bg-surface transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/10">
                <div className="p-6 pb-0">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${project.gradient} px-3 py-1 text-xs font-semibold text-white`}>
                      <project.icon className="h-3.5 w-3.5" />
                      {project.pillar}
                    </div>
                    <span className="flex items-center gap-1 rounded-full border border-hairline bg-paper px-3 py-1 text-xs font-medium text-ink-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {project.region}
                    </span>
                  </div>

                  <div className="mb-4 rounded-2xl border border-hairline bg-paper p-4">
                    <div className="mb-3 flex items-end justify-between">
                      <p className={`font-display text-3xl font-medium bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                        {project.metric}
                      </p>
                      <p className="font-mono text-xs text-ink-muted">{project.metricLabel}</p>
                    </div>
                    <ProjectChart bars={project.bars} color={project.line} />
                  </div>

                  <div className="mb-5 grid grid-cols-3 gap-2">
                    {project.kpis.map((kpi) => (
                      <div key={kpi.label} className="rounded-xl border border-hairline bg-surface px-2 py-2.5 text-center">
                        <p className="font-display text-base font-medium text-ink">{kpi.value}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted">{kpi.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col p-6 pt-0">
                  <h3 className="font-display text-xl font-medium text-ink">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-hairline bg-paper px-3 py-1 text-xs text-ink-muted">
                        {tag}
                      </span>
                    ))}
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

function ProjectChart({ bars, color }) {
  const W = 240
  const H = 70
  const pad = 4
  const max = 100
  const step = (W - pad * 2) / (bars.length - 1)
  const pts = bars.map((b, i) => [pad + i * step, H - pad - (b / max) * (H - pad * 2)])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`

  return (
    <div className="relative h-20">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0.28" />
            <stop offset="1" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#fill-${color.replace('#', '')})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="relative flex h-20 items-end gap-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t bg-black/[0.05]"
            style={{ height: `${b}%` }}
          />
        ))}
      </div>
    </div>
  )
}
