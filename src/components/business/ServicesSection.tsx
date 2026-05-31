interface ServicesSectionProps {
  services: string[]
  businessName: string
  categoryName: string
}

export default function ServicesSection({
  services,
  businessName,
  categoryName,
}: ServicesSectionProps) {
  if (!services || services.length === 0) return null

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold mb-2">Services Offered</h2>
      <p className="text-hustle-muted text-sm mb-4">
        Typical services offered by {categoryName} businesses
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((service) => (
          <div
            key={service}
            className="flex items-center gap-2 bg-hustle-light rounded-lg px-4 py-3"
          >
            <svg
              className="w-5 h-5 text-hustle-blue flex-shrink-0"
              width="20"
              height="20"
              style={{ width: '20px', height: '20px', maxWidth: '20px', maxHeight: '20px', flexShrink: 0 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-hustle-dark text-sm font-medium">{service}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
