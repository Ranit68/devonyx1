import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, CalendarCheck } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Blog', href: '/blog', external: true },
  { label: 'Careers', href: '/careers', external: true },
  { label: 'Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  const goTo = (href) => {
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
        }, 120)
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const linkClass =
    'rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-hairline bg-paper/85 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between py-3 md:h-20">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.external ? (
              <Link
                key={link.href}
                to={link.href}
                className={linkClass}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => goTo(link.href)}
                className={linkClass}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {location.pathname !== '/' ? (
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/35 hover:brightness-110"
            >
              <CalendarCheck className="h-4 w-4" />
              Book a Free Consultation
            </Link>
          ) : (
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:shadow-xl hover:shadow-brand/35 hover:brightness-110"
            >
              <CalendarCheck className="h-4 w-4" />
              Book a Free Consultation
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-paper/95 backdrop-blur-xl lg:hidden">
          <div className="container-x flex flex-col gap-1 py-6">
            {navLinks.map((link) =>
              link.external ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setOpen(false)
                    goTo(link.href)
                  }}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
                >
                  {link.label}
                </a>
              )
            )}
            <Link
              to="/#contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-base font-semibold text-white shadow-lg shadow-brand/25"
            >
              <CalendarCheck className="h-5 w-5" />
              Book a Free Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}