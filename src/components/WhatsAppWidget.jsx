import { MessageCircle } from 'lucide-react'

export default function WhatsAppWidget() {
  return (
    <a
      href="#contact"
      aria-label="Chat with us"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-110"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" aria-hidden="true" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  )
}
