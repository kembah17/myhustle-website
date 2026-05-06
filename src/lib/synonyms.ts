// Nigerian business synonym map for smart location/service search
// Includes Pidgin English, local slang, common misspellings, and related terms

export const NIGERIAN_SYNONYMS: Record<string, string[]> = {
  // Hair & Beauty
  'salon': ['hair', 'barber', 'braiding', 'weaving', 'dreadlocks', 'haircut', 'hairdresser', 'stylist', 'relaxer', 'perm', 'cornrow', 'wig', 'extension', 'locs'],
  'barber': ['haircut', 'clipper', 'shave', 'trim', 'fade', 'lineup', 'barbing', 'barbing salon'],
  'beauty': ['makeup', 'cosmetics', 'skincare', 'facial', 'glow', 'beauty parlour', 'beauty parlor', 'makeover', 'lashes', 'brows'],
  'spa': ['massage', 'relaxation', 'wellness', 'body treatment', 'steam', 'sauna', 'pedicure', 'manicure', 'nail'],
  'nails': ['manicure', 'pedicure', 'nail art', 'acrylic', 'gel nails', 'nail tech', 'nail technician'],

  // Food & Drink
  'food': ['restaurant', 'eatery', 'bukka', 'mama put', 'suya', 'amala', 'chop', 'canteen', 'kitchen', 'catering', 'cook'],
  'restaurant': ['eatery', 'food', 'dining', 'bukka', 'mama put', 'chop house', 'joint', 'spot'],
  'bukka': ['mama put', 'local food', 'amala', 'eba', 'pounded yam', 'buka', 'bukateria', 'canteen'],
  'suya': ['barbecue', 'bbq', 'grilled meat', 'kilishi', 'tsire', 'mallam'],
  'bakery': ['bread', 'cake', 'pastry', 'confectionery', 'small chops', 'chin chin', 'puff puff', 'meat pie'],
  'drinks': ['bar', 'lounge', 'beer', 'palm wine', 'zobo', 'kunu', 'chapman', 'cocktail', 'pub'],
  'shawarma': ['wrap', 'grill', 'fast food', 'snack', 'sharwama', 'shawama'],
  'chinese': ['chinese food', 'asian food', 'noodles', 'fried rice', 'spring roll'],
  'pizza': ['pizza place', 'dominos', 'pizzeria', 'italian'],
  'ice cream': ['gelato', 'frozen yogurt', 'cold stone', 'dessert'],

  // Auto & Transport
  'mechanic': ['auto repair', 'panel beater', 'car fix', 'vulcanizer', 'car mechanic', 'motor mechanic', 'garage', 'workshop'],
  'vulcanizer': ['tyre', 'tire', 'puncture', 'flat tire', 'wheel', 'tyre repair'],
  'panel beater': ['body work', 'car body', 'spray painting', 'accident repair', 'dent', 'panel beating'],
  'car wash': ['auto wash', 'car cleaning', 'detailing', 'car detail', 'wash'],
  'towing': ['tow truck', 'breakdown', 'roadside', 'car rescue', 'vehicle recovery'],
  'driving school': ['driving lesson', 'learn to drive', 'driver training'],
  'spare parts': ['car parts', 'auto parts', 'motor parts', 'accessories', 'ladipo'],

  // Fashion & Tailoring
  'tailor': ['fashion', 'sewing', 'ankara', 'aso ebi', 'bespoke', 'fashion designer', 'seamstress', 'dressmaker', 'agbada', 'kaftan'],
  'fashion': ['clothing', 'boutique', 'designer', 'style', 'outfit', 'ready to wear', 'rtw'],
  'ankara': ['african print', 'aso oke', 'adire', 'fabric', 'textile', 'lace', 'guinea brocade'],
  'shoes': ['footwear', 'cobbler', 'shoe maker', 'sneakers', 'sandals', 'slippers'],
  'jewelry': ['jewellery', 'gold', 'silver', 'beads', 'accessories', 'costume jewelry', 'ileke'],
  'thrift': ['okrika', 'bend down select', 'fairly used', 'second hand', 'tokunbo clothes', 'okirika'],

  // Technology
  'phone repair': ['screen repair', 'phone fix', 'mobile repair', 'cracked screen', 'phone doctor', 'gsm'],
  'computer': ['laptop', 'pc', 'desktop', 'computer repair', 'computer village', 'IT'],
  'internet': ['wifi', 'data', 'broadband', 'ISP', 'network', 'fibre', 'fiber'],
  'cctv': ['security camera', 'surveillance', 'camera installation', 'monitoring'],
  'solar': ['solar panel', 'solar installation', 'inverter', 'battery', 'power', 'alternative energy'],
  'printing': ['print', 'photocopy', 'lamination', 'binding', 'banner', 'flex', 'business card'],
  'web design': ['website', 'web developer', 'app developer', 'software', 'digital', 'tech'],

  // Health & Medical
  'hospital': ['clinic', 'medical', 'health', 'doctor', 'physician', 'healthcare'],
  'pharmacy': ['chemist', 'drug store', 'medicine', 'pharmaceutical', 'dispensary'],
  'dentist': ['dental', 'teeth', 'tooth', 'oral health', 'dental clinic'],
  'eye clinic': ['optician', 'optometrist', 'glasses', 'eye care', 'spectacles', 'lens'],
  'lab': ['laboratory', 'medical test', 'blood test', 'diagnostic', 'scan', 'x-ray'],
  'physiotherapy': ['physio', 'rehabilitation', 'therapy', 'exercise therapy'],
  'traditional medicine': ['herbal', 'herbs', 'native doctor', 'agbo', 'alternative medicine'],

  // Education & Training
  'school': ['education', 'learning', 'academy', 'institute', 'college', 'university'],
  'lesson': ['tutorial', 'tutor', 'coaching', 'extra lesson', 'home lesson', 'private tutor'],
  'creche': ['daycare', 'nursery', 'childcare', 'preschool', 'montessori'],
  'driving': ['driving school', 'driving lesson', 'learn to drive'],
  'computer training': ['IT training', 'coding', 'programming', 'digital skills', 'tech training'],

  // Home & Construction
  'plumber': ['plumbing', 'pipe', 'water', 'tap', 'toilet', 'drainage', 'borehole'],
  'electrician': ['electrical', 'wiring', 'power', 'socket', 'light', 'NEPA', 'PHCN'],
  'carpenter': ['woodwork', 'furniture', 'cabinet', 'wardrobe', 'door', 'wood'],
  'painter': ['painting', 'house painting', 'wall', 'POP', 'screeding', 'interior decor'],
  'tiler': ['tiling', 'tiles', 'floor', 'wall tiles', 'marble', 'granite'],
  'welder': ['welding', 'iron', 'steel', 'gate', 'burglar proof', 'metal work', 'fabrication'],
  'borehole': ['water drilling', 'well', 'water supply', 'borehole drilling'],
  'fumigation': ['pest control', 'termite', 'cockroach', 'rat', 'insect', 'bedbugs', 'fumigator'],
  'generator': ['gen', 'power generator', 'diesel generator', 'generator repair', 'gen mechanic'],
  'ac': ['air conditioning', 'air conditioner', 'AC repair', 'AC installation', 'cooling', 'HVAC'],
  'interior': ['interior design', 'decoration', 'decor', 'home decor', 'curtain', 'blinds', 'wallpaper'],
  'building': ['construction', 'contractor', 'mason', 'bricklayer', 'block', 'cement'],
  'aluminium': ['aluminum', 'window', 'sliding door', 'glass', 'glazing'],

  // Finance & Business
  'pos': ['point of sale', 'cash', 'withdrawal', 'transfer', 'agent banking', 'mobile money'],
  'accounting': ['accountant', 'bookkeeping', 'tax', 'audit', 'financial'],
  'insurance': ['HMO', 'health insurance', 'car insurance', 'life insurance'],
  'loan': ['microfinance', 'credit', 'lending', 'cooperative', 'thrift'],
  'forex': ['bureau de change', 'BDC', 'dollar', 'exchange rate', 'aboki fx'],

  // Events & Entertainment
  'dj': ['disc jockey', 'music', 'party', 'entertainment', 'sound'],
  'mc': ['master of ceremony', 'emcee', 'host', 'compere', 'event host'],
  'photographer': ['photography', 'photo', 'studio', 'camera', 'videographer', 'video'],
  'event planner': ['event planning', 'party planner', 'wedding planner', 'decoration', 'event decorator'],
  'catering': ['caterer', 'food service', 'party food', 'small chops', 'event food'],
  'venue': ['hall', 'event center', 'event centre', 'party hall', 'reception hall', 'banquet'],
  'band': ['live band', 'live music', 'musician', 'singer', 'performer'],
  'bouncy castle': ['kids party', 'children entertainment', 'fun castle', 'party rental'],

  // Logistics & Delivery
  'delivery': ['dispatch', 'courier', 'logistics', 'shipping', 'send', 'errand'],
  'dispatch': ['bike delivery', 'okada delivery', 'rider', 'dispatch rider', 'courier'],
  'moving': ['relocation', 'movers', 'packing', 'house moving', 'office moving', 'truck'],
  'clearing': ['clearing agent', 'customs', 'import', 'freight', 'shipping agent'],

  // Real Estate
  'agent': ['real estate', 'property', 'house', 'apartment', 'flat', 'rent', 'buy', 'land'],
  'hotel': ['guest house', 'lodge', 'short let', 'airbnb', 'accommodation', 'hostel', 'motel'],
  'short let': ['serviced apartment', 'airbnb', 'furnished apartment', 'temporary accommodation'],

  // Legal & Professional
  'lawyer': ['attorney', 'legal', 'barrister', 'solicitor', 'law firm', 'advocate'],
  'notary': ['notary public', 'affidavit', 'oath', 'commissioner of oath'],
  'surveyor': ['land surveyor', 'survey', 'land measurement', 'quantity surveyor'],

  // Cleaning & Laundry
  'laundry': ['dry cleaning', 'ironing', 'washing', 'dry cleaner', 'laundromat'],
  'cleaning': ['cleaner', 'house cleaning', 'office cleaning', 'janitorial', 'fumigation'],

  // Agriculture
  'farm': ['farming', 'agriculture', 'poultry', 'fish farm', 'piggery', 'crop'],
  'feed': ['animal feed', 'poultry feed', 'fish feed', 'livestock'],
  'fertilizer': ['manure', 'agrochemical', 'pesticide', 'herbicide'],

  // Religious & Community
  'church': ['worship', 'chapel', 'parish', 'ministry', 'fellowship', 'congregation'],
  'mosque': ['masjid', 'islamic', 'muslim', 'jumat'],

  // Pidgin & Slang terms
  'chop': ['food', 'eat', 'restaurant', 'eatery'],
  'buka': ['bukka', 'mama put', 'local food', 'canteen'],
  'okada': ['motorcycle', 'bike', 'dispatch', 'keke'],
  'keke': ['tricycle', 'napep', 'maruwa', 'transport'],
  'tokunbo': ['fairly used', 'second hand', 'used', 'imported used'],
  'oga': ['boss', 'owner', 'manager', 'proprietor'],
  'hustle': ['business', 'work', 'trade', 'service', 'skill'],
  'wahala': ['problem', 'issue', 'trouble', 'complaint'],
  'japa': ['travel', 'visa', 'immigration', 'relocation', 'abroad'],
  'asoebi': ['aso ebi', 'uniform', 'party cloth', 'owambe', 'celebration'],
  'owambe': ['party', 'celebration', 'ceremony', 'wedding', 'event'],
  'danfo': ['bus', 'transport', 'commute', 'public transport'],

  // Common misspellings
  'resturant': ['restaurant', 'eatery', 'food'],
  'saloon': ['salon', 'hair', 'barber'],
  'laywer': ['lawyer', 'legal', 'attorney'],
  'plumba': ['plumber', 'plumbing'],
  'electrition': ['electrician', 'electrical'],
  'macanic': ['mechanic', 'auto repair'],
  'fotografer': ['photographer', 'photography', 'photo'],
  'tailar': ['tailor', 'fashion', 'sewing'],

  // Services
  'gym': ['fitness', 'exercise', 'workout', 'training', 'bodybuilding', 'crossfit'],
  'swimming': ['pool', 'swimming pool', 'swim', 'aquatics'],
  'yoga': ['meditation', 'pilates', 'wellness', 'mindfulness'],
  'travel': ['travel agency', 'tour', 'visa', 'flight', 'ticket', 'holiday', 'vacation'],
  'visa': ['embassy', 'immigration', 'passport', 'travel document', 'consulate'],
  'car rental': ['car hire', 'vehicle rental', 'rent a car', 'charter'],
  'gas': ['cooking gas', 'LPG', 'gas refill', 'cylinder', 'gas plant'],
  'water': ['pure water', 'sachet water', 'bottled water', 'water factory', 'table water'],
  'waste': ['waste management', 'refuse', 'garbage', 'recycling', 'LAWMA'],
}

// Reverse lookup: given a search term, find all related terms
export function expandSearchTerms(term: string): string[] {
  const lower = term.toLowerCase().trim()
  const expanded = new Set<string>([lower])

  // Direct match: term is a key
  if (NIGERIAN_SYNONYMS[lower]) {
    for (const syn of NIGERIAN_SYNONYMS[lower]) {
      expanded.add(syn.toLowerCase())
    }
  }

  // Reverse match: term appears in a value array
  for (const [key, values] of Object.entries(NIGERIAN_SYNONYMS)) {
    if (values.some(v => v.toLowerCase() === lower || v.toLowerCase().includes(lower))) {
      expanded.add(key.toLowerCase())
      for (const v of values) {
        expanded.add(v.toLowerCase())
      }
    }
  }

  return Array.from(expanded)
}

// Multi-word query expansion: splits query into words, handles multi-word synonym keys,
// and expands each word individually through the synonym engine
export function expandMultiWordQuery(query: string): string[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(w => w.length > 1)
  if (words.length === 0) return []
  if (words.length === 1) return expandSearchTerms(words[0])

  const expanded = new Set<string>()

  // Check for multi-word synonym keys first (e.g., 'car wash', 'panel beater', 'ice cream')
  const usedIndices = new Set<number>()
  for (let i = 0; i < words.length - 1; i++) {
    const twoWord = `${words[i]} ${words[i + 1]}`
    if (NIGERIAN_SYNONYMS[twoWord]) {
      for (const syn of expandSearchTerms(twoWord)) {
        expanded.add(syn)
      }
      usedIndices.add(i)
      usedIndices.add(i + 1)
    }
  }

  // Expand remaining individual words
  for (let i = 0; i < words.length; i++) {
    if (!usedIndices.has(i)) {
      for (const syn of expandSearchTerms(words[i])) {
        expanded.add(syn)
      }
    }
  }

  return Array.from(expanded)
}
