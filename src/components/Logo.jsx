import { Link, useLocation } from 'react-router-dom'

export default function Logo({ className = '' }) {
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <Link
      to={onHome ? '/#' : '/'}
      onClick={() => {
        if (onHome) document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' })
      }}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="relative flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 64 64" className="h-9 w-9">
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#2B4BFF" />
              <stop offset="1" stopColor="#7C6BFF" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#logoGradient)" />
          <path
            d="M20 20 L44 44 M44 20 L20 44"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            className="transition-transform duration-500 group-hover:rotate-90 origin-center"
            style={{ transformBox: 'fill-box' }}
          />
        </svg>
      </span>
      <span className="font-display text-xl font-medium tracking-tight">
        Dev<span className="serif-accent text-brand-dark">onyx</span>
      </span>
    </Link>
  )
}