import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import LogoMarquee from './components/LogoMarquee'
import Services from './components/Services'
import Work from './components/Work'
import About from './components/About'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BlogPage from './pages/BlogPage'
import CareerPage from './pages/CareerPage'
import { GoogleReviewLanding, QRRedirectPage, QRSuccessPage, SetupPage } from './pages/GoogleReviewQR'
const QRLocalTestPage = import.meta.env.DEV ? lazy(() => import('./pages/QRLocalTest')) : null
const QRBatchAdminPage = lazy(() => import('./pages/QRBatchAdmin'))

function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <Stats />
        <Services />
        <Work />
        <Process />
        <About />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper text-ink">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/careers" element={<CareerPage />} />
          <Route path="/admin" element={<Navigate to="/admin/qr-batches" replace />} />
          <Route path="/google-review-qr" element={<GoogleReviewLanding />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/qr-success" element={<QRSuccessPage />} />
          <Route path="/r/:slug" element={<QRRedirectPage />} />
          <Route path="/admin/qr-batches" element={<Suspense fallback={<p>Loading QR tools…</p>}><QRBatchAdminPage /></Suspense>} />
          {import.meta.env.DEV && <Route path="/qr-local-test" element={<Suspense fallback={<p>Loading local test…</p>}><QRLocalTestPage /></Suspense>} />}
        </Routes>
      </div>
    </BrowserRouter>
  )
}
