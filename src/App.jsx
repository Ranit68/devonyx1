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
import WhatsAppWidget from './components/WhatsAppWidget'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
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
      <WhatsAppWidget />
    </div>
  )
}
