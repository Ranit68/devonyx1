import { useCountUp, Reveal } from '../hooks'

const stats = [
  { value: 250, suffix: '+', label: 'Projects Delivered' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 120, suffix: '+', label: 'Startups & Businesses' },
  { value: 4, suffix: '×', label: 'Regions Served' },
]

export function CountUpStat({ value, suffix = '', label }) {
  const { ref, value: display } = useCountUp(value)
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-medium text-ink md:text-5xl">
        {display}
        <span className="text-gradient">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-ink-muted">{label}</p>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="relative border-y border-hairline bg-white/40 py-14 md:py-20">
      <div className="container-x grid grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 100}>
            <CountUpStat {...s} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
