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
import Blog from './components/Blog'
import Career from './components/Career'
import Contact from './components/Contact'
import Footer from './components/Footer'

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
        <Blog />
        <Career />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
