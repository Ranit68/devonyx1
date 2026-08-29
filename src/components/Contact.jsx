import { useState } from 'react'
import { Mail, Clock3, MapPin, CheckCircle2, Send } from 'lucide-react'
import { Reveal } from '../hooks'

const budgetOptions = [
  '$5k – $10k',
  '$10k – $25k',
  '$25k – $50k',
  '$50k+',
  'Not sure yet',
]

const services = ['Build (Development)', 'Grow (Marketing)', 'Brand (Design)', 'Full Stack (All 3)']

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const contactChannels = [
    { icon: Mail, label: 'Email', value: 'query@devonix.in', hint: 'Replies within 24h' },
    { icon: Clock3, label: 'Office Hours', value: '24x7', hint: 'Always available' },
    { icon: MapPin, label: 'Serving', value: 'USA · UAE · NL · NZ · India', hint: '5 regions' },
  ]

  const inputClass =
    'w-full rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint shadow-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15'

  return (
    <section id="contact" className="relative section overflow-hidden">
      <div className="absolute -bottom-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/10 blur-[140px]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow justify-center">Contact & Book a Call</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
              Let's talk about <span className="serif-accent text-brand-dark">your project</span>.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 text-lg text-ink-soft">
              Book a free consultation or send us a message. Tell us where you're
              based and what you need — we'll get back within 24 hours or less.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              <h3 className="font-display text-xl font-medium text-ink">Reach us directly</h3>
              {contactChannels.map((channel) => (
                <div key={channel.label} className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-5 transition-colors hover:border-brand/30">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gradient-subtle border border-brand/20">
                    <channel.icon className="h-5 w-5 text-brand-dark" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">{channel.label}</p>
                    <p className="truncate font-medium text-ink">{channel.value}</p>
                    <p className="text-xs text-ink-muted">{channel.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-3xl border border-hairline bg-surface p-8 shadow-xl shadow-black/[0.04] md:p-10">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-medium text-ink">Request received!</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                    Thanks for reaching out. A Devonyx specialist will contact you
                    within 24 hours at the email you provided.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm font-semibold text-brand-dark hover:text-brand"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="font-display text-xl font-medium text-ink">Get your free quote</h3>
                  <p className="mt-1 text-sm text-ink-muted">Takes less than a minute. No obligation.</p>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-ink-soft">Name *</label>
                      <input id="contact-name" name="name" required type="text" placeholder="Jane Cooper" autoComplete="name" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-ink-soft">Email *</label>
                      <input id="contact-email" name="email" required type="email" placeholder="jane@company.com" autoComplete="email" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="contact-company" className="mb-1.5 block text-sm font-medium text-ink-soft">Company</label>
                      <input id="contact-company" name="company" type="text" placeholder="Acme Inc." autoComplete="organization" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="contact-country" className="mb-1.5 block text-sm font-medium text-ink-soft">Country *</label>
                      <input id="contact-country" name="country" required type="text" placeholder="USA / UAE / NL / NZ / India…" autoComplete="country-name" className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="contact-service" className="mb-1.5 block text-sm font-medium text-ink-soft">Service Needed *</label>
                      <select id="contact-service" name="service" required defaultValue="" className={inputClass}>
                        <option value="" disabled>Select a service…</option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-white">{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="contact-budget" className="mb-1.5 block text-sm font-medium text-ink-soft">Budget Range</label>
                      <select id="contact-budget" name="budget" defaultValue="" className={inputClass}>
                        <option value="" disabled>Select a budget…</option>
                        {budgetOptions.map((b) => (
                          <option key={b} value={b} className="bg-white">{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-ink-soft">Project Details *</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={4}
                        placeholder="Tell us a bit about your project, timeline, and goals…"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-gradient px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-ink/20 transition-all hover:shadow-xl hover:shadow-ink/30 hover:brightness-125"
                  >
                    <Send className="h-5 w-5" />
                    Request My Free Quote
                  </button>
                  <p className="mt-3 text-center text-xs text-ink-muted">
                    By submitting, you agree to our privacy policy. We'll never share your information.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
