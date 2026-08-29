import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
        </Routes>
      </div>
    </BrowserRouter>
  )
}