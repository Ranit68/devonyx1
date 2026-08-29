import { Search, PenTool, Code2, Rocket, TrendingUp, ArrowRight } from 'lucide-react'
import { Reveal } from '../hooks'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Discover',
    duration: 'Week 1',
    text: 'We dig into your product, market, and goals. You get a clear roadmap before any code is written or pixel is placed.',
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Design',
    duration: 'Weeks 1–2',
    text: 'Brand and UI come to life. You review real, clickable designs — not vague mockups — so there are no surprises later.',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Build',
    duration: 'Weeks 2–6',
    text: 'Our developers ship fast with weekly demos. You always know exactly where things stand and what ships next.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch',
    duration: 'Week 6+',
    text: 'We deploy, QA, and handle the rollout. Your product goes live clean, watched closely, and ready for the world.',
  },
  {
    number: '05',
    icon: TrendingUp,
    title: 'Grow',
    duration: 'Ongoing',
    text: 'Then we turn on the engines — marketing, SEO, and optimization that turn your launch into predictable growth.',
  },
]

export default function Process() {
  return (
    <section id="process" className="section bg-white/40">
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">How We Work</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
              From first call to <span className="serif-accent text-brand-dark">lasting growth</span>.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-ink-soft">
              A proven, transparent process. No guesswork, no black boxes — just a
              clear path from idea to impact.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 100}>
              <div className="group relative flex h-full flex-col p-6 lg:px-6">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-brand/40 to-transparent lg:block" aria-hidden="true" />
                )}

                <div className="relative">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${
                    i === 0 ? 'from-brand to-brand-dark' :
                    i === 1 ? 'from-[#7C6BFF] to-brand' :
                    i === 2 ? 'from-accent to-brand' :
                    i === 3 ? 'from-brand to-[#7C6BFF]' :
                    'from-accent to-[#7C6BFF]'
                  } shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface font-display text-sm font-medium text-brand-dark shadow-sm">
                    {step.number}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="font-display text-xl font-medium text-ink">{step.title}</h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-muted">{step.duration}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-14 text-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-gradient px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-ink/20 transition-all hover:shadow-xl hover:shadow-ink/30 hover:brightness-125"
            >
              Start the process — it's free
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
