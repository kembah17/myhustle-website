// Schema.org type mappings for parent categories
// Maps parent category slugs to specific schema.org types, price ranges, and service keywords

export interface CategorySchemaMapping {
  type: string
  priceRange: string
  services: string[]
}

export const CATEGORY_SCHEMA_MAP: Record<string, CategorySchemaMapping> = {
  'agriculture-and-farming': {
    type: 'LocalBusiness',
    priceRange: '₦₦',
    services: ['Farm produce', 'Agricultural supplies', 'Livestock', 'Crop farming', 'Agro-processing'],
  },
  'auto-services-and-repair': {
    type: 'AutoRepair',
    priceRange: '₦₦',
    services: ['Vehicle repair', 'Auto maintenance', 'Car servicing', 'Panel beating', 'Auto electrician'],
  },
  'business-services': {
    type: 'ProfessionalService',
    priceRange: '₦₦₦',
    services: ['Consulting', 'Accounting', 'Business registration', 'Printing services', 'Office supplies'],
  },
  'computers-and-technology': {
    type: 'Store',
    priceRange: '₦₦',
    services: ['Computer repair', 'Phone repair', 'IT support', 'Software development', 'CCTV installation'],
  },
  'construction-and-trades': {
    type: 'HomeAndConstructionBusiness',
    priceRange: '₦₦₦',
    services: ['Building construction', 'Plumbing', 'Electrical work', 'Painting', 'Tiling'],
  },
  'education-and-training': {
    type: 'EducationalOrganization',
    priceRange: '₦₦',
    services: ['Tutoring', 'Professional training', 'School enrollment', 'Skill acquisition', 'Exam preparation'],
  },
  'entertainment-and-leisure': {
    type: 'EntertainmentBusiness',
    priceRange: '₦₦',
    services: ['Recreation', 'Gaming', 'Cinema', 'Nightlife', 'Amusement'],
  },
  'events-and-parties': {
    type: 'EventVenue',
    priceRange: '₦₦₦',
    services: ['Event planning', 'Venue hire', 'Catering', 'Decoration', 'DJ and entertainment'],
  },
  'fashion-and-beauty': {
    type: 'BeautySalon',
    priceRange: '₦₦',
    services: ['Hair styling', 'Makeup', 'Fashion design', 'Tailoring', 'Beauty treatments'],
  },
  'finance-and-insurance': {
    type: 'FinancialService',
    priceRange: '₦₦₦',
    services: ['Banking', 'Insurance', 'Microfinance', 'Investment advisory', 'Tax services'],
  },
  'food-and-dining': {
    type: 'Restaurant',
    priceRange: '₦₦',
    services: ['Dining', 'Takeaway', 'Catering', 'Food delivery', 'Local cuisine'],
  },
  'healthcare-and-fitness': {
    type: 'MedicalBusiness',
    priceRange: '₦₦₦',
    services: ['Medical consultation', 'Dental care', 'Pharmacy', 'Fitness training', 'Physiotherapy'],
  },
  'home-services': {
    type: 'HomeAndConstructionBusiness',
    priceRange: '₦₦',
    services: ['Cleaning', 'Fumigation', 'Laundry', 'Interior decoration', 'Appliance repair'],
  },
  'legal-services': {
    type: 'LegalService',
    priceRange: '₦₦₦',
    services: ['Legal consultation', 'Court representation', 'Contract drafting', 'Property law', 'Corporate law'],
  },
  'logistics-and-transport': {
    type: 'LocalBusiness',
    priceRange: '₦₦',
    services: ['Courier delivery', 'Haulage', 'Moving services', 'Dispatch riders', 'Freight forwarding'],
  },
  'manufacturing-and-industry': {
    type: 'LocalBusiness',
    priceRange: '₦₦₦',
    services: ['Manufacturing', 'Industrial supplies', 'Fabrication', 'Packaging', 'Processing'],
  },
  'other': {
    type: 'LocalBusiness',
    priceRange: '₦₦',
    services: ['General services', 'Miscellaneous', 'Specialty services'],
  },
  'property-and-real-estate': {
    type: 'RealEstateAgent',
    priceRange: '₦₦₦₦',
    services: ['Property sales', 'Rentals', 'Property management', 'Land surveying', 'Facility management'],
  },
  'religious-community': {
    type: 'CivicStructure',
    priceRange: '₦',
    services: ['Worship services', 'Community programs', 'Counselling', 'Youth programs', 'Charity'],
  },
  'shopping-and-retail': {
    type: 'Store',
    priceRange: '₦₦',
    services: ['Retail shopping', 'Wholesale', 'Online shopping', 'Electronics', 'Household items'],
  },
  'travel-and-hospitality': {
    type: 'TravelAgency',
    priceRange: '₦₦₦',
    services: ['Hotel booking', 'Travel packages', 'Visa processing', 'Car rental', 'Tour guides'],
  },
}

// Get schema mapping for a category, with fallback to LocalBusiness
export function getSchemaMapping(parentCategorySlug: string | null | undefined): CategorySchemaMapping {
  if (!parentCategorySlug) {
    return { type: 'LocalBusiness', priceRange: '₦₦', services: ['Local services'] }
  }
  return CATEGORY_SCHEMA_MAP[parentCategorySlug] || { type: 'LocalBusiness', priceRange: '₦₦', services: ['Local services'] }
}

// Service keyword variations for meta descriptions (3-4 per category)
export const CATEGORY_META_SERVICES: Record<string, string[][]> = {
  'agriculture-and-farming': [
    ['farm produce', 'agricultural supplies', 'livestock services'],
    ['crop farming', 'agro-processing', 'farm equipment'],
    ['poultry farming', 'fish farming', 'agricultural consulting'],
  ],
  'auto-services-and-repair': [
    ['car repair', 'auto maintenance', 'vehicle servicing'],
    ['panel beating', 'auto electrician', 'tyre services'],
    ['engine repair', 'car diagnostics', 'brake servicing'],
    ['car painting', 'AC repair', 'transmission repair'],
  ],
  'business-services': [
    ['consulting', 'accounting', 'business registration'],
    ['printing', 'office supplies', 'secretarial services'],
    ['HR consulting', 'tax filing', 'business advisory'],
  ],
  'computers-and-technology': [
    ['computer repair', 'phone repair', 'IT support'],
    ['software development', 'CCTV installation', 'networking'],
    ['data recovery', 'web design', 'gadget sales'],
    ['laptop repair', 'printer repair', 'tech consulting'],
  ],
  'construction-and-trades': [
    ['building construction', 'plumbing', 'electrical work'],
    ['painting', 'tiling', 'roofing services'],
    ['welding', 'carpentry', 'POP ceiling'],
    ['borehole drilling', 'aluminium work', 'renovation'],
  ],
  'education-and-training': [
    ['tutoring', 'professional training', 'skill acquisition'],
    ['exam preparation', 'school enrollment', 'online courses'],
    ['vocational training', 'language classes', 'music lessons'],
  ],
  'entertainment-and-leisure': [
    ['recreation', 'gaming centres', 'cinema'],
    ['nightlife', 'amusement parks', 'sports viewing'],
    ['karaoke', 'bowling', 'live entertainment'],
  ],
  'events-and-parties': [
    ['event planning', 'venue hire', 'catering services'],
    ['decoration', 'DJ services', 'photography'],
    ['wedding planning', 'party supplies', 'MC services'],
    ['sound and lighting', 'event coordination', 'tent rental'],
  ],
  'fashion-and-beauty': [
    ['hair styling', 'makeup artistry', 'fashion design'],
    ['tailoring', 'beauty treatments', 'nail art'],
    ['braiding', 'skincare', 'spa treatments'],
    ['wig making', 'barbing', 'lash extensions'],
  ],
  'finance-and-insurance': [
    ['banking services', 'insurance', 'microfinance'],
    ['investment advisory', 'tax services', 'POS services'],
    ['pension management', 'forex', 'financial planning'],
  ],
  'food-and-dining': [
    ['dining', 'takeaway', 'catering services'],
    ['food delivery', 'local cuisine', 'continental dishes'],
    ['fast food', 'suya spots', 'bakery and pastries'],
    ['pepper soup joints', 'amala spots', 'Chinese restaurants'],
  ],
  'healthcare-and-fitness': [
    ['medical consultation', 'dental care', 'pharmacy'],
    ['fitness training', 'physiotherapy', 'eye care'],
    ['laboratory tests', 'maternity care', 'mental health'],
    ['gym membership', 'yoga classes', 'dietitian services'],
  ],
  'home-services': [
    ['cleaning services', 'fumigation', 'laundry'],
    ['interior decoration', 'appliance repair', 'gardening'],
    ['pest control', 'AC servicing', 'generator repair'],
  ],
  'legal-services': [
    ['legal consultation', 'court representation', 'contract drafting'],
    ['property law', 'corporate law', 'family law'],
    ['immigration law', 'dispute resolution', 'notary services'],
  ],
  'logistics-and-transport': [
    ['courier delivery', 'haulage', 'moving services'],
    ['dispatch riders', 'freight forwarding', 'warehousing'],
    ['car hire', 'bus charter', 'logistics consulting'],
  ],
  'manufacturing-and-industry': [
    ['manufacturing', 'industrial supplies', 'fabrication'],
    ['packaging', 'processing', 'quality control'],
    ['raw materials', 'machinery', 'industrial equipment'],
  ],
  'other': [
    ['general services', 'specialty services', 'local businesses'],
  ],
  'property-and-real-estate': [
    ['property sales', 'rentals', 'property management'],
    ['land surveying', 'facility management', 'property valuation'],
    ['shortlet apartments', 'commercial property', 'estate development'],
  ],
  'religious-community': [
    ['worship services', 'community programs', 'counselling'],
    ['youth programs', 'charity', 'fellowship'],
    ['prayer meetings', 'Bible study', 'community outreach'],
  ],
  'shopping-and-retail': [
    ['retail shopping', 'wholesale', 'online shopping'],
    ['electronics', 'household items', 'fashion accessories'],
    ['supermarket', 'building materials', 'phone accessories'],
    ['furniture', 'fabrics', 'cosmetics'],
  ],
  'travel-and-hospitality': [
    ['hotel booking', 'travel packages', 'visa processing'],
    ['car rental', 'tour guides', 'flight booking'],
    ['resort stays', 'travel insurance', 'airport transfers'],
  ],
}

// Get service keywords for meta description, rotating based on a hash of the business name
export function getMetaServices(parentCategorySlug: string | null | undefined, businessName: string): string {
  if (!parentCategorySlug) return 'local services'
  const variations = CATEGORY_META_SERVICES[parentCategorySlug]
  if (!variations || variations.length === 0) return 'local services'

  // Simple hash of business name to pick a variation deterministically
  let hash = 0
  for (let i = 0; i < businessName.length; i++) {
    hash = ((hash << 5) - hash) + businessName.charCodeAt(i)
    hash |= 0 // Convert to 32bit integer
  }
  const index = Math.abs(hash) % variations.length
  return variations[index].join(', ')
}
