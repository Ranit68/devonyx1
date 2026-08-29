import Header from '../components/Header'
import Blog from '../components/Blog'
import Footer from '../components/Footer'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Blog />
      </main>
      <Footer />
    </div>
  )
}