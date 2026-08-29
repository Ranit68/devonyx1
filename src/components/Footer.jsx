import { ArrowRight, Twitter, Linkedin, Instagram, Github } from 'lucide-react'
import Logo from './Logo'

const socialLinks = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Github, label: 'GitHub' },
]

const serviceLinks = [
  { label: 'SaaS Development', href: '#services' },
  { label: 'Web & Mobile Apps', href: '#services' },
  { label: 'Performance Marketing', href: '#services' },
  { label: 'SEO', href: '#services' },
  { label: 'Brand Identity', href: '#services' },
  { label: 'Motion & Video', href: '#services' },
]

const companyLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Get a Quote', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-brand/20 bg-ink-gradient">
      <div
        className="absolute -top-40 right-0 h-[400px] w-[500px] rounded-full bg-brand/20 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-x relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="text-white [&_.serif-accent]:text-accent" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              A digital agency helping founders build, brand, and grow — trusted
              across the USA, UAE, Netherlands & New Zealand.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-accent hover:bg-accent/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Services</h4>
            <ul className="mt-5 flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h4>
            <ul className="mt-5 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Stay in the loop</h4>
            <p className="mt-5 text-sm text-white/70">
              Get growth tips, launch playbooks, and founder stories. No spam, ever.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-all hover:brightness-110"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-3 text-xs text-white/50">Join 3,000+ founders. Unsubscribe anytime.</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Devonyx. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
              <a key={link} href="#" className="text-xs text-white/50 transition-colors hover:text-white">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
