import Header from '../components/Header'
import Career from '../components/Career'
import Footer from '../components/Footer'

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Career />
      </main>
      <Footer />
    </div>
  )
}