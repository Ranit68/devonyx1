import { useState } from 'react'
import { ArrowUpRight, Briefcase, Clock3, MapPin, Mail, Send } from 'lucide-react'
import { Reveal } from '../hooks'

const roles = [
  {
    title: 'Senior Full-Stack Developer',
    type: 'Full-time · Remote',
    location: 'India · Remote',
    team: 'Development',
    blurb:
      'Ship high-quality web apps and SaaS products across React, Node, and modern cloud stacks — collaborating directly with founders.',
  },
  {
    title: 'Performance Marketing Specialist',
    type: 'Full-time · Remote',
    location: 'Remote',
    team: 'Marketing',
    blurb:
      'Plan and run Google & Meta campaigns that turn ad spend into predictable revenue, with clear, data-backed reporting.',
  },
  {
    title: 'Brand & UI Designer',
    type: 'Part-time · Remote',
    location: 'Remote',
    team: 'Design',
    blurb:
      'Craft identities, interfaces, and motion that make early-stage brands look world-class and impossible to ignore.',
  },
]

export default function Career() {
  const [selected, setSelected] = useState(roles[0].title)

  const buildMailto = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const subject = encodeURIComponent(`Application: ${form.role.value}`)
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nRole: ${form.role.value}\nLinkedIn / Portfolio: ${data.get('link') || '—'}\n\nMessage:\n${data.get('message')}`
    )
    window.location.href = `mailto:query@devonix.in?subject=${subject}&body=${body}`
  }

  return (
    <section id="career" className="section">
      <div className="container-x relative">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">Careers</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Come build, brand & <span className="serif-accent text-brand-dark">grow</span> with us.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-ink-soft">
              We're a small, remote-first team working across 5 regions. If you love
              shipping real products with founders, we'd love to hear from you.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-4">
            {roles.map((role) => (
              <button
                key={role.title}
                onClick={() => setSelected(role.title)}
                className={`group text-left rounded-2xl border p-6 transition-all ${
                  selected === role.title
                    ? 'border-brand bg-surface shadow-lg shadow-brand/10'
                    : 'border-hairline bg-surface hover:border-brand/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-brand-dark">
                        {role.team}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-medium text-ink">{role.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                      <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{role.type}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{role.location}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-brand" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{role.blurb}</p>
              </button>
            ))}
          </div>

          <Reveal delay={150}>
            <form
              onSubmit={buildMailto}
              className="rounded-3xl border border-hairline bg-surface p-7 shadow-xl shadow-black/[0.04] md:p-8"
            >
              <h3 className="font-display text-xl font-medium text-ink">Apply for a role</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Your application opens in your email app, addressed to query@devonix.in.
              </p>

              <div className="mt-6 grid gap-5">
                <div>
                  <label htmlFor="career-role" className="mb-1.5 block text-sm font-medium text-ink-soft">Position *</label>
                  <select id="career-role" name="role" required defaultValue={selected} className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15">
                    {roles.map((r) => (
                      <option key={r.title} value={r.title} className="bg-white">{r.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="career-name" className="mb-1.5 block text-sm font-medium text-ink-soft">Full Name *</label>
                  <input id="career-name" name="name" required type="text" placeholder="Jane Cooper" autoComplete="name" className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15" />
                </div>
                <div>
                  <label htmlFor="career-email" className="mb-1.5 block text-sm font-medium text-ink-soft">Email *</label>
                  <input id="career-email" name="email" required type="email" placeholder="jane@company.com" autoComplete="email" className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15" />
                </div>
                <div>
                  <label htmlFor="career-link" className="mb-1.5 block text-sm font-medium text-ink-soft">LinkedIn / Portfolio</label>
                  <input id="career-link" name="link" type="text" placeholder="linkedin.com/in/jane" className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15" />
                </div>
                <div>
                  <label htmlFor="career-message" className="mb-1.5 block text-sm font-medium text-ink-soft">Message *</label>
                  <textarea id="career-message" name="message" required rows={3} placeholder="Why are you a great fit?" className="w-full rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15" />
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/35 hover:brightness-110"
              >
                <Send className="h-5 w-5" />
                Submit Application
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
                <Mail className="h-3.5 w-3.5" />
                Applications go to query@devonix.in
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
