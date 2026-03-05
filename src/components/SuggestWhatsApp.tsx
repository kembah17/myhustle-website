import Link from 'next/link'
import { WhatsAppIcon } from '@/components/WhatsAppCTA'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349000000000'

type SuggestType = 'category' | 'area' | 'landmark' | 'general'

interface SuggestWhatsAppProps {
  type: SuggestType
  context?: string
  className?: string
}

const CONFIG: Record<SuggestType, { emoji: string; heading: string; message: string }> = {
  category: {
    emoji: '📂',
    heading: "Can't find your category?",
    message: "Hi! I searched for a category on MyHustle but couldn't find it. I'd like to suggest: ",
  },
  area: {
    emoji: '📍',
    heading: "Can't find your area?",
    message: "Hi! My area isn't listed on MyHustle yet. I'd like to suggest adding: ",
  },
  landmark: {
    emoji: '🏛️',
    heading: "Can't find your landmark?",
    message: "Hi! I'd like to suggest a landmark for MyHustle: ",
  },
  general: {
    emoji: '💡',
    heading: "Can't find what you're looking for?",
    message: 'Hi! I have a suggestion for MyHustle: ',
  },
}

export default function SuggestWhatsApp({ type, context, className = '' }: SuggestWhatsAppProps) {
  const { emoji, heading, message } = CONFIG[type]

  // Append city context for area suggestions
  const fullMessage =
    type === 'area' && context ? `${message}(in ${context}) ` : message

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMessage)}`

  return (
    <div
      className={`rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center ${className}`}
    >
      <span className="text-3xl block mb-3">{emoji}</span>
      <h3 className="font-heading text-lg font-bold text-hustle-dark mb-1">
        {heading}
      </h3>
      <p className="text-sm text-hustle-muted mb-4">
        Tell us what&apos;s missing — we&apos;ll add it within 24 hours
      </p>
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-5 py-2.5 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg text-sm"
      >
        <WhatsAppIcon className="w-5 h-5" />
        Suggest via WhatsApp
      </Link>
    </div>
  )
}
