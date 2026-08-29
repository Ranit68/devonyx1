import { ArrowRight, ShieldCheck, Globe2 } from 'lucide-react'
import { Reveal } from '../hooks'

const clientRegions = ['USA', 'UAE', 'Netherlands', 'New Zealand']

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28">
      <div
        className="absolute -top-40 right-0 h-[520px] w-[720px] rounded-full bg-brand/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute top-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[110px]"
        aria-hidden="true"
      />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">
                Trusted by founders in {clientRegions.join(' · ')}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-balance font-display text-5xl font-medium leading-[1.04] tracking-tight text-ink md:text-7xl">
                From idea to{' '}
                <span className="relative whitespace-nowrap">
                  <span className="serif-accent text-brand-dark">impact</span>
                  <span
                    className="absolute -bottom-1 left-0 h-[6px] w-full bg-accent/80"
                    aria-hidden="true"
                  />
                </span>
                .
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
                We build your product, brand it to be unmissable, and grow it into
                a revenue engine. Serious founders partner with Devonyx — you
                build, we handle the rest.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-gradient px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-ink/20 transition-all hover:shadow-xl hover:shadow-ink/30 hover:brightness-125"
                >
                  Book a Free Consultation
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:border-brand hover:text-brand-dark"
                >
                  See Our Work
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-11 flex flex-wrap items-center gap-6 border-t border-hairline pt-7">
                <div className="flex -space-x-3">
                  {[
                    { bg: '#2B4BFF', name: 'JD' },
                    { bg: '#4C0FB5', name: 'AK' },
                    { bg: '#B45309', name: 'SR' },
                    { bg: '#1E37C9', name: 'LM' },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-paper text-xs font-bold text-white"
                      style={{ backgroundColor: p.bg }}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    Rated 4.9/5 by 120+ startup clients worldwide
                  </p>
                </div>
                <div className="hidden items-center gap-2 text-sm text-ink-muted md:flex">
                  <Globe2 className="h-4 w-4 text-brand" />
                  Serving 4 time zones
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative hidden lg:block">
            <HeroPanel />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function HeroPanel() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-4 rounded-3xl bg-brand/10 blur-2xl animate-pulse-glow"
        aria-hidden="true"
      />
      <div className="relative rounded-2xl border border-hairline bg-surface p-6 shadow-xl shadow-black/[0.05]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent/80" />
            <span className="h-3 w-3 rounded-full bg-ink/20" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Live · Revenue +212%
          </span>
        </div>

        <div className="mb-5 rounded-2xl border border-hairline bg-paper p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Growth Dashboard</p>
            <p className="font-mono text-xs text-ink-muted">Last 90 days</p>
          </div>
          <BarChart />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-hairline bg-paper/60 p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
              Leads Generated
            </p>
            <p className="mt-1 font-display text-2xl font-medium text-ink">3,214</p>
            <p className="text-xs font-semibold text-emerald-600">↑ 184% vs last qtr</p>
          </div>
          <div className="rounded-2xl border border-hairline bg-paper/60 p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
              Conversion Rate
            </p>
            <p className="mt-1 font-display text-2xl font-medium text-ink">6.8%</p>
            <p className="text-xs font-semibold text-emerald-600">↑ 2.1 points</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-hairline bg-paper/60 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Brand refresh live</p>
            <p className="text-xs text-ink-muted">New identity · 3 regions</p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-8 animate-float rounded-2xl border border-hairline bg-surface px-5 py-4 shadow-xl shadow-black/[0.08]">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
          SaaS Product Launched
        </p>
        <p className="font-display text-xl font-medium text-ink">in 6 weeks</p>
      </div>

      <div className="absolute -top-6 -right-6 animate-float-slow rounded-2xl border border-hairline bg-surface px-5 py-4 shadow-xl shadow-black/[0.08]">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
          Monthly Revenue
        </p>
        <p className="font-display text-xl font-medium text-gradient">+$48K</p>
      </div>
    </div>
  )
}

function BarChart() {
  const heights = [30, 45, 38, 60, 52, 70, 64, 82, 74, 90, 85, 100]
  return (
    <div className="flex h-28 items-end gap-2">
      {heights.map((h, i) => (
        <div key={i} className="group relative flex-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-brand to-[#7C6BFF] opacity-80 transition-all group-hover:opacity-100"
            style={{ height: `${h}%` }}
          />
        </div>
      ))}
    </div>
  )
}
