// Content enrichment engine for business pages
// Generates unique descriptive content based on category, area, and city
// Designed to add substantial unique text to thin/scraped business listings

export interface EnrichedContent {
  aboutSection: string
  whatToExpect: string
  areaGuide: string
}

export interface BusinessContentParams {
  businessName: string
  categoryName: string
  parentCategorySlug: string
  areaName: string
  cityName: string
  hasPhone: boolean
  hasWebsite: boolean
  hasAddress: boolean
  hasHours: boolean
  reviewCount: number
  avgRating: number
}

// Simple deterministic hash for picking template variations
function hashStr(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hashStr(seed) % arr.length]
}

// ─── Category-specific about section templates ──────────────────────
// Each returns 2-3 paragraphs of unique content

interface CategoryTemplates {
  about: ((p: BusinessContentParams) => string)[]
  expectations: ((p: BusinessContentParams) => string[])[]
}

const CATEGORY_TEMPLATES: Record<string, CategoryTemplates> = {
  'food-and-dining': {
    about: [
      (p) => `${p.businessName} is a dining establishment located in ${p.areaName}, ${p.cityName}. As a ${p.categoryName.toLowerCase()} business serving the ${p.areaName} community, they are part of the vibrant food scene that ${p.cityName} is known for across Nigeria.\n\nThe ${p.areaName} area of ${p.cityName} has become a popular destination for food lovers, with a diverse range of eateries catering to different tastes and budgets. Whether you are looking for traditional Nigerian dishes like jollof rice, pounded yam, and pepper soup, or prefer continental and international cuisine, businesses like ${p.businessName} contribute to making ${p.areaName} a go-to spot for dining out.\n\nWhen choosing where to eat in ${p.areaName}, it helps to check reviews from other diners, compare menus, and confirm opening hours before visiting. MyHustle makes it easy to discover and book food businesses across ${p.cityName}.`,
      (p) => `Looking for quality food and dining options in ${p.areaName}, ${p.cityName}? ${p.businessName} operates as a ${p.categoryName.toLowerCase()} establishment in this bustling part of ${p.cityName}, serving customers who appreciate good food and reliable service.\n\n${p.cityName}'s food culture is one of the most diverse in Nigeria, and ${p.areaName} reflects this with restaurants, fast food joints, local bukas, and specialty eateries all within reach. From early morning breakfast spots to late-night suya stands, the area caters to every craving and schedule.\n\nBefore visiting any food establishment in ${p.areaName}, we recommend checking their listed hours, reading customer reviews on MyHustle, and calling ahead for large orders or reservations. This ensures you get the best possible dining experience.`,
      (p) => `${p.businessName} serves the ${p.areaName} community in ${p.cityName} as a ${p.categoryName.toLowerCase()} provider. The food and dining industry in ${p.cityName} continues to grow, with new establishments opening regularly to meet the demands of the city's expanding population.\n\nIn ${p.areaName}, you will find a mix of dining options ranging from affordable local meals to premium restaurant experiences. Nigerian favourites like amala, eba, ofada rice, and suya remain staples, while international cuisines including Chinese, Lebanese, and Italian have also found a strong following.\n\nMyHustle helps you compare food businesses in ${p.areaName} by providing contact details, customer reviews, and booking options all in one place. Whether you are planning a family dinner, ordering for an event, or just grabbing a quick meal, you can find the right option here.`,
    ],
    expectations: [
      (p) => [
        `Menu variety featuring Nigerian and continental dishes suited to ${p.areaName} diners`,
        `Dine-in, takeaway, and potentially delivery options depending on the establishment`,
        `Payment options typically including cash, bank transfer, and POS terminals`,
        `Varying wait times depending on peak hours — weekends and lunch hours tend to be busiest`,
        `Hygiene and food safety standards as expected for ${p.cityName} food establishments`,
      ],
      (p) => [
        `A range of meal options from quick bites to full sit-down dining experiences`,
        `Prices that reflect the ${p.areaName} market — from budget-friendly to premium`,
        `Friendly service with staff familiar with local tastes and preferences`,
        `Options for small chops, event catering, and bulk orders at many establishments`,
        `Convenient location within ${p.areaName} with parking availability varying by venue`,
        `Operating hours that may extend into late evening, especially on weekends`,
      ],
    ],
  },

  'fashion-and-beauty': {
    about: [
      (p) => `${p.businessName} is a ${p.categoryName.toLowerCase()} business operating in ${p.areaName}, ${p.cityName}. The fashion and beauty industry in ${p.cityName} is one of the most dynamic in West Africa, and ${p.areaName} is home to numerous talented professionals offering everything from hair styling and makeup to bespoke fashion design.\n\nWhether you need a fresh hairstyle, professional makeup for an event, custom-tailored outfits, or skincare treatments, ${p.areaName} has options to suit every style and budget. The area's beauty professionals stay current with both Nigerian and international trends, ensuring clients always have access to the latest looks.\n\nFinding the right beauty or fashion professional is important — it is a personal service that requires trust and skill. On MyHustle, you can read reviews from other customers, check portfolios, and book appointments directly to ensure you get the quality service you deserve.`,
      (p) => `Discover ${p.businessName}, a ${p.categoryName.toLowerCase()} provider in ${p.areaName}, ${p.cityName}. The beauty and fashion scene in ${p.areaName} is thriving, with skilled artisans and professionals catering to the diverse style preferences of ${p.cityName} residents.\n\nFrom traditional Nigerian styles like gele tying, ankara designs, and native wear to modern trends in hair colouring, nail art, and skincare, the professionals in ${p.areaName} offer a comprehensive range of services. Many establishments also provide bridal packages, event styling, and group bookings for special occasions.\n\nWhen selecting a fashion or beauty service provider in ${p.areaName}, consider factors like specialisation, pricing, hygiene standards, and customer reviews. MyHustle provides all this information in one place to help you make an informed choice.`,
    ],
    expectations: [
      (p) => [
        `Professional ${p.categoryName.toLowerCase()} services tailored to your personal style`,
        `Consultation before service to understand your preferences and desired outcome`,
        `Clean, hygienic environment with quality products and tools`,
        `Pricing that varies based on service complexity — always confirm rates beforehand`,
        `Appointment scheduling recommended, especially for weekends and event seasons`,
        `Portfolio or samples of previous work available on request`,
      ],
    ],
  },

  'healthcare-and-fitness': {
    about: [
      (p) => `${p.businessName} provides ${p.categoryName.toLowerCase()} services in ${p.areaName}, ${p.cityName}. Access to quality healthcare and fitness facilities is essential for every community, and ${p.areaName} is served by a range of medical practitioners, clinics, pharmacies, and fitness centres.\n\nThe healthcare landscape in ${p.cityName} includes everything from general practice clinics and specialist hospitals to dental offices, optical centres, and physiotherapy practices. For fitness enthusiasts, ${p.areaName} offers gyms, yoga studios, and personal training services to help residents maintain an active lifestyle.\n\nWhen choosing a healthcare or fitness provider, it is important to verify credentials, check operating hours, and read reviews from other patients or members. MyHustle helps you compare options in ${p.areaName} so you can make the best choice for your health and wellness needs.`,
      (p) => `Looking for ${p.categoryName.toLowerCase()} services in ${p.areaName}, ${p.cityName}? ${p.businessName} is one of the healthcare and fitness providers serving this community. ${p.cityName} has seen significant growth in health services, with more facilities opening to meet the needs of its growing population.\n\nIn ${p.areaName}, you can find general hospitals, specialist clinics, pharmacies, diagnostic centres, and wellness facilities. Many healthcare providers now offer appointment booking, telemedicine consultations, and health insurance partnerships to make access easier for patients.\n\nFitness facilities in the area range from fully equipped gyms to specialised studios offering aerobics, CrossFit, swimming, and martial arts. Whatever your health or fitness goal, ${p.areaName} has providers ready to help you achieve it.`,
    ],
    expectations: [
      (p) => [
        `Professional medical or fitness services from qualified practitioners`,
        `Clean, well-maintained facilities meeting ${p.cityName} health standards`,
        `Appointment booking available — walk-ins may experience longer wait times`,
        `Transparent pricing with options for health insurance where applicable`,
        `Confidential handling of medical records and personal health information`,
        `Follow-up care and referral services when needed`,
      ],
    ],
  },

  'auto-services-and-repair': {
    about: [
      (p) => `${p.businessName} offers ${p.categoryName.toLowerCase()} services in ${p.areaName}, ${p.cityName}. With the high volume of vehicles on ${p.cityName}'s roads, reliable auto service providers are essential for keeping cars, trucks, and motorcycles in safe working condition.\n\n${p.areaName} is home to experienced mechanics, auto electricians, panel beaters, and other automotive professionals who handle everything from routine maintenance to major repairs. Whether you need an oil change, brake service, engine diagnostics, or body work, you can find skilled technicians in this area.\n\nChoosing the right mechanic or auto service provider can save you time and money. We recommend checking reviews on MyHustle, asking about warranties on repairs, and getting estimates before authorising major work. This helps ensure you receive quality service at a fair price.`,
      (p) => `Need auto services in ${p.areaName}, ${p.cityName}? ${p.businessName} is a ${p.categoryName.toLowerCase()} provider serving vehicle owners in this area. ${p.cityName}'s busy roads mean regular vehicle maintenance is not just recommended — it is essential for safety and longevity.\n\nThe auto service industry in ${p.areaName} covers a wide range of specialisations including mechanical repairs, electrical diagnostics, air conditioning servicing, tyre fitting, wheel alignment, and auto detailing. Many workshops also handle specific vehicle brands, so it is worth checking if a provider has experience with your car make.\n\nBefore committing to any auto repair service, compare options on MyHustle, read what other vehicle owners have to say, and confirm pricing upfront. A trustworthy mechanic is worth their weight in gold in ${p.cityName}.`,
    ],
    expectations: [
      (p) => [
        `Diagnostic assessment before any repair work begins`,
        `Transparent pricing with estimates provided upfront for major repairs`,
        `Genuine or quality replacement parts — always ask about part sourcing`,
        `Turnaround times that vary based on repair complexity and parts availability`,
        `Warranty on repairs and parts where applicable`,
        `Safe storage of your vehicle while work is being completed`,
      ],
    ],
  },

  'education-and-training': {
    about: [
      (p) => `${p.businessName} is an ${p.categoryName.toLowerCase()} provider in ${p.areaName}, ${p.cityName}. Education remains one of the most valued investments in Nigeria, and ${p.areaName} offers a range of learning opportunities from formal schooling to professional development and vocational training.\n\nThe education sector in ${p.cityName} is diverse, encompassing nursery and primary schools, secondary institutions, tutorial centres, language schools, IT training academies, and professional certification programmes. ${p.areaName} benefits from this variety, giving students and professionals multiple options for advancing their knowledge and skills.\n\nWhen selecting an educational institution or training provider, consider factors like curriculum quality, instructor qualifications, class sizes, facilities, and alumni outcomes. MyHustle helps you compare education providers in ${p.areaName} with reviews and contact information to guide your decision.`,
    ],
    expectations: [
      (p) => [
        `Structured learning programmes with clear objectives and timelines`,
        `Qualified instructors with relevant experience and credentials`,
        `Learning materials and resources included or available for purchase`,
        `Flexible scheduling options including weekday, weekend, and evening classes`,
        `Assessment and certification upon completion where applicable`,
        `Safe, conducive learning environment in ${p.areaName}`,
      ],
    ],
  },

  'business-services': {
    about: [
      (p) => `${p.businessName} provides ${p.categoryName.toLowerCase()} in ${p.areaName}, ${p.cityName}. The business services sector is the backbone of ${p.cityName}'s commercial ecosystem, supporting entrepreneurs, SMEs, and corporations with essential professional services.\n\nIn ${p.areaName}, you can find accounting firms, business consultants, printing and branding companies, HR agencies, and a wide range of other professional service providers. These businesses help other companies operate efficiently, comply with regulations, and grow their operations.\n\nWhether you are starting a new business, need help with tax filing, require professional printing services, or are looking for office support, the business service providers in ${p.areaName} have the expertise to help. Compare options on MyHustle to find the right partner for your business needs.`,
    ],
    expectations: [
      (p) => [
        `Professional service delivery with clear scope and timelines`,
        `Experienced staff familiar with Nigerian business regulations and practices`,
        `Transparent pricing with detailed quotes provided before engagement`,
        `Confidential handling of sensitive business information`,
        `Regular communication and progress updates throughout the engagement`,
      ],
    ],
  },

  'computers-and-technology': {
    about: [
      (p) => `${p.businessName} operates in the ${p.categoryName.toLowerCase()} space in ${p.areaName}, ${p.cityName}. Technology has become integral to daily life and business in Nigeria, and ${p.areaName} is home to numerous tech professionals and businesses offering repair, sales, and IT services.\n\nFrom computer and phone repairs to software development, CCTV installation, networking, and web design, the technology sector in ${p.areaName} serves both individual consumers and businesses. As more Nigerian businesses go digital, the demand for reliable tech support and services continues to grow.\n\nWhen choosing a technology service provider, look for experience with your specific device or system, check customer reviews, and ask about warranties on repairs. MyHustle makes it easy to find and compare tech businesses in ${p.areaName}, ${p.cityName}.`,
    ],
    expectations: [
      (p) => [
        `Technical diagnosis before any repair or service work begins`,
        `Transparent pricing with no hidden charges for parts or labour`,
        `Warranty on repairs — typically 30 to 90 days depending on the service`,
        `Data backup and protection during device repairs`,
        `Turnaround times communicated upfront based on issue complexity`,
        `After-service support for any follow-up issues`,
      ],
    ],
  },

  'construction-and-trades': {
    about: [
      (p) => `${p.businessName} provides ${p.categoryName.toLowerCase()} services in ${p.areaName}, ${p.cityName}. The construction and trades industry is booming across ${p.cityName}, driven by residential development, commercial projects, and infrastructure improvements.\n\n${p.areaName} has a strong network of builders, plumbers, electricians, painters, tilers, welders, and other skilled tradespeople who deliver quality workmanship for projects of all sizes. Whether you are building a new home, renovating an office, or need emergency plumbing repairs, local professionals are available to help.\n\nHiring the right contractor is crucial for any construction project. Always verify credentials, ask for references, get written quotes, and agree on timelines before work begins. MyHustle helps you find trusted construction professionals in ${p.areaName} with reviews from previous clients.`,
    ],
    expectations: [
      (p) => [
        `Site assessment and detailed quotation before work commences`,
        `Quality materials sourced from reputable suppliers`,
        `Adherence to agreed timelines with regular progress updates`,
        `Clean worksite with proper safety measures in place`,
        `Warranty on workmanship for a specified period after completion`,
      ],
    ],
  },

  'entertainment-and-leisure': {
    about: [
      (p) => `${p.businessName} is an ${p.categoryName.toLowerCase()} venue in ${p.areaName}, ${p.cityName}. The entertainment scene in ${p.cityName} is vibrant and diverse, offering residents and visitors plenty of options for relaxation, fun, and socialising.\n\nIn ${p.areaName}, you can find cinemas, gaming centres, lounges, sports viewing centres, and various recreational facilities. The area caters to different age groups and interests, from family-friendly activities to nightlife and adult entertainment.\n\nPlanning a fun outing in ${p.areaName}? Check opening hours, entry fees, and customer reviews on MyHustle before visiting. Many entertainment venues offer special packages for groups, birthdays, and corporate events.`,
    ],
    expectations: [
      (p) => [
        `Entertainment options suited to various age groups and preferences`,
        `Entry fees and pricing clearly displayed or available on enquiry`,
        `Safe, well-maintained facilities with adequate security`,
        `Food and beverage options available at most venues`,
        `Special event packages and group discounts often available`,
      ],
    ],
  },

  'events-and-parties': {
    about: [
      (p) => `${p.businessName} offers ${p.categoryName.toLowerCase()} services in ${p.areaName}, ${p.cityName}. Nigerians are known for their love of celebrations, and ${p.cityName}'s event industry is one of the most active in the country, with professionals handling everything from intimate gatherings to large-scale celebrations.\n\nIn ${p.areaName}, you will find event planners, decorators, caterers, DJs, photographers, MC services, and venue providers who can bring any celebration to life. Whether it is a wedding, birthday, corporate event, or naming ceremony, the professionals in this area have the experience to deliver memorable occasions.\n\nPlanning an event requires coordination across multiple vendors. MyHustle helps you find and compare event service providers in ${p.areaName}, read reviews from previous clients, and book services directly — making your event planning process smoother and more efficient.`,
    ],
    expectations: [
      (p) => [
        `Detailed event consultation to understand your vision and budget`,
        `Customised packages tailored to your specific event type and size`,
        `Professional coordination between multiple vendors and services`,
        `Transparent pricing with itemised quotes and payment schedules`,
        `Backup plans for weather, power, and other contingencies`,
        `Post-event cleanup and vendor settlement handled professionally`,
      ],
    ],
  },

  'finance-and-insurance': {
    about: [
      (p) => `${p.businessName} provides ${p.categoryName.toLowerCase()} services in ${p.areaName}, ${p.cityName}. Financial services are critical to the economic growth of individuals and businesses in ${p.cityName}, and ${p.areaName} hosts a range of financial institutions and service providers.\n\nFrom banks and microfinance institutions to insurance companies, investment advisors, and POS operators, the financial services landscape in ${p.areaName} caters to diverse needs. Whether you need a business loan, personal insurance, investment guidance, or simple banking services, options are available locally.\n\nWhen choosing a financial service provider, verify their registration with relevant regulatory bodies like the CBN or NAICOM, compare interest rates and fees, and read customer reviews. MyHustle helps you find legitimate financial service providers in ${p.areaName} with transparent information.`,
    ],
    expectations: [
      (p) => [
        `Licensed and regulated financial services compliant with Nigerian law`,
        `Transparent fee structures with no hidden charges`,
        `Secure handling of personal and financial information`,
        `Professional advisory services tailored to your financial situation`,
        `Multiple channels for account access and customer support`,
      ],
    ],
  },

  'home-services': {
    about: [
      (p) => `${p.businessName} offers ${p.categoryName.toLowerCase()} in ${p.areaName}, ${p.cityName}. Maintaining a comfortable, clean, and functional home requires reliable service providers, and ${p.areaName} has professionals covering every aspect of home maintenance and improvement.\n\nFrom cleaning services and fumigation to laundry, interior decoration, appliance repair, and generator maintenance, home service providers in ${p.areaName} help residents keep their homes in top condition. Many offer both one-time services and regular maintenance packages.\n\nFinding a trustworthy home service provider is important since they work in your personal space. Check reviews on MyHustle, ask for references, and start with a small job to assess quality before committing to ongoing service arrangements.`,
    ],
    expectations: [
      (p) => [
        `Punctual arrival at your home at the agreed time`,
        `Professional conduct and respect for your property and privacy`,
        `Quality cleaning products, tools, and equipment provided`,
        `Transparent pricing based on service scope and property size`,
        `Satisfaction guarantee with follow-up service if needed`,
      ],
    ],
  },

  'legal-services': {
    about: [
      (p) => `${p.businessName} provides ${p.categoryName.toLowerCase()} in ${p.areaName}, ${p.cityName}. Legal services are essential for protecting rights, resolving disputes, and ensuring compliance with Nigerian law. ${p.areaName} is home to law firms and legal practitioners covering various areas of practice.\n\nWhether you need help with property transactions, business incorporation, family law matters, contract drafting, or court representation, legal professionals in ${p.areaName} offer the expertise required. Many firms also provide notary services, legal advisory, and regulatory compliance support.\n\nChoosing the right lawyer or law firm is a significant decision. Consider their area of specialisation, years of experience, track record, and client reviews. MyHustle helps you find and compare legal service providers in ${p.areaName}, ${p.cityName}.`,
    ],
    expectations: [
      (p) => [
        `Initial consultation to assess your legal needs and options`,
        `Clear explanation of legal processes, timelines, and likely outcomes`,
        `Transparent fee structure — hourly rates, flat fees, or contingency arrangements`,
        `Confidential handling of all case information and documents`,
        `Regular updates on case progress and any developments`,
      ],
    ],
  },

  'logistics-and-transport': {
    about: [
      (p) => `${p.businessName} operates in the ${p.categoryName.toLowerCase()} sector in ${p.areaName}, ${p.cityName}. Efficient logistics and transportation are vital to ${p.cityName}'s economy, connecting businesses with customers and enabling the movement of goods across the city and beyond.\n\nIn ${p.areaName}, you can find courier services, dispatch riders, moving companies, haulage providers, and freight forwarders. The growth of e-commerce in Nigeria has further increased demand for reliable delivery and logistics services in the area.\n\nWhen selecting a logistics provider, consider factors like delivery speed, coverage area, insurance for goods in transit, and tracking capabilities. MyHustle helps you compare logistics and transport companies in ${p.areaName} with real customer reviews and contact information.`,
    ],
    expectations: [
      (p) => [
        `Timely pickup and delivery within agreed timeframes`,
        `Safe handling of goods with appropriate packaging and care`,
        `Real-time tracking or status updates for shipments`,
        `Insurance coverage for valuable items during transit`,
        `Transparent pricing based on distance, weight, and urgency`,
      ],
    ],
  },

  'manufacturing-and-industry': {
    about: [
      (p) => `${p.businessName} is a ${p.categoryName.toLowerCase()} business in ${p.areaName}, ${p.cityName}. The manufacturing and industrial sector plays a crucial role in ${p.cityName}'s economy, producing goods and materials that serve both local and national markets.\n\nIn ${p.areaName}, you can find manufacturers, fabricators, industrial suppliers, and processing companies covering various product categories. From food processing and packaging to metal fabrication and chemical production, the industrial base in this area supports numerous downstream businesses.\n\nWhen sourcing from manufacturers or industrial suppliers, consider factors like production capacity, quality certifications, minimum order quantities, and delivery timelines. MyHustle helps you connect with manufacturing businesses in ${p.areaName} for your procurement needs.`,
    ],
    expectations: [
      (p) => [
        `Product samples or specifications available before bulk orders`,
        `Quality control measures ensuring consistent product standards`,
        `Flexible order quantities with pricing tiers for bulk purchases`,
        `Delivery logistics coordinated for your location`,
        `After-sales support and warranty on manufactured goods`,
      ],
    ],
  },

  'property-and-real-estate': {
    about: [
      (p) => `${p.businessName} operates in the ${p.categoryName.toLowerCase()} market in ${p.areaName}, ${p.cityName}. Real estate is one of the most active sectors in ${p.cityName}, with ${p.areaName} being a sought-after location for both residential and commercial properties.\n\nWhether you are looking to buy, rent, or sell property in ${p.areaName}, local real estate professionals can guide you through the process. Services available include property sales, rentals, property management, land surveying, facility management, and shortlet apartment bookings.\n\nThe ${p.areaName} property market offers options ranging from affordable apartments to luxury homes and commercial spaces. When dealing with property transactions, always verify ownership documents, work with registered agents, and conduct proper due diligence. MyHustle helps you find trusted real estate professionals in ${p.areaName}.`,
    ],
    expectations: [
      (p) => [
        `Property viewings arranged at convenient times`,
        `Transparent pricing with no hidden agency fees`,
        `Verification of property documents and ownership status`,
        `Professional guidance through the transaction process`,
        `Post-transaction support for property management needs`,
      ],
    ],
  },

  'religious-community': {
    about: [
      (p) => `${p.businessName} is a ${p.categoryName.toLowerCase()} organisation in ${p.areaName}, ${p.cityName}. Religious and community organisations play a vital role in Nigerian society, providing spiritual guidance, community support, and social services to residents.\n\nIn ${p.areaName}, you will find churches, mosques, and other places of worship alongside community organisations that serve the local population. These institutions often provide counselling, youth programmes, charity initiatives, and community development activities beyond their primary spiritual mission.\n\nWhether you are new to ${p.areaName} and looking for a place of worship, or seeking community support services, MyHustle helps you discover religious and community organisations in your neighbourhood with service times and contact information.`,
    ],
    expectations: [
      (p) => [
        `Regular worship services and spiritual programmes`,
        `Welcoming atmosphere for newcomers and visitors`,
        `Community programmes including youth groups and counselling`,
        `Charitable activities and community outreach initiatives`,
        `Contact information for pastoral care and support services`,
      ],
    ],
  },

  'shopping-and-retail': {
    about: [
      (p) => `${p.businessName} is a ${p.categoryName.toLowerCase()} business in ${p.areaName}, ${p.cityName}. Shopping and retail is a cornerstone of daily life in ${p.cityName}, and ${p.areaName} offers a diverse range of retail options from market stalls to modern shopping centres.\n\nIn ${p.areaName}, shoppers can find electronics, clothing, household items, building materials, phone accessories, cosmetics, and much more. The area caters to different budgets, with options ranging from affordable market prices to premium branded goods.\n\nSmart shopping in ${p.areaName} means comparing prices, checking product authenticity, and reading reviews from other buyers. MyHustle helps you discover retail businesses in ${p.areaName}, compare options, and make informed purchasing decisions.`,
    ],
    expectations: [
      (p) => [
        `Wide product selection within the store's specialty category`,
        `Competitive pricing with options for different budgets`,
        `Genuine products with receipts and warranty where applicable`,
        `Payment options including cash, transfer, and POS`,
        `Return or exchange policies — always confirm before purchase`,
        `Delivery services available at many retail establishments`,
      ],
    ],
  },

  'travel-and-hospitality': {
    about: [
      (p) => `${p.businessName} provides ${p.categoryName.toLowerCase()} services in ${p.areaName}, ${p.cityName}. The travel and hospitality industry in ${p.cityName} serves both business travellers and leisure tourists, with ${p.areaName} offering convenient access to hotels, travel agencies, and related services.\n\nWhether you need hotel accommodation, flight bookings, visa processing, car rentals, or tour packages, the travel professionals in ${p.areaName} can assist with your plans. The area's hospitality businesses range from budget-friendly guesthouses to premium hotels and serviced apartments.\n\nWhen booking travel and hospitality services, compare prices, check cancellation policies, and read reviews from previous guests or clients. MyHustle makes it easy to find and book travel services in ${p.areaName}, ${p.cityName}.`,
    ],
    expectations: [
      (p) => [
        `Professional travel consultation and itinerary planning`,
        `Transparent pricing with all fees and taxes clearly stated`,
        `Secure booking and payment processing`,
        `24/7 support for travel emergencies and changes`,
        `Clean, comfortable accommodation meeting advertised standards`,
      ],
    ],
  },

  'agriculture-and-farming': {
    about: [
      (p) => `${p.businessName} is an ${p.categoryName.toLowerCase()} business in ${p.areaName}, ${p.cityName}. Agriculture remains a vital sector of Nigeria's economy, and ${p.areaName} is connected to the agricultural supply chain through farms, agro-dealers, and agricultural service providers.\n\nWhether you are looking for farm produce, agricultural inputs, livestock, or farming equipment, businesses in ${p.areaName} serve both commercial farmers and individual buyers. The area's agricultural businesses contribute to food security and economic development in ${p.cityName} and beyond.\n\nMyHustle helps you connect with agricultural businesses in ${p.areaName}, compare products and services, and find reliable suppliers for your farming or food business needs.`,
    ],
    expectations: [
      (p) => [
        `Fresh, quality agricultural products and supplies`,
        `Competitive pricing with bulk purchase discounts available`,
        `Knowledgeable staff who can advise on products and farming practices`,
        `Delivery options for large orders within ${p.cityName}`,
        `Seasonal availability information for specific crops and products`,
      ],
    ],
  },

  'other': {
    about: [
      (p) => `${p.businessName} provides specialised services in ${p.areaName}, ${p.cityName}. The diverse business landscape of ${p.cityName} includes many unique and specialised service providers that serve important roles in the community.\n\nIn ${p.areaName}, you can find businesses offering niche services that may not fit neatly into traditional categories but are nonetheless valuable to residents and other businesses. These providers often bring unique expertise and personalised service to their customers.\n\nDiscover what ${p.businessName} has to offer by checking their contact details, reading customer reviews, and reaching out directly through MyHustle. Our platform makes it easy to find and connect with all types of businesses in ${p.areaName}.`,
    ],
    expectations: [
      (p) => [
        `Specialised services tailored to specific customer needs`,
        `Professional service delivery with attention to detail`,
        `Clear communication about services offered and pricing`,
        `Responsive customer service and follow-up support`,
      ],
    ],
  },
}

// ─── Area guide templates ───────────────────────────────────────────

const AREA_GUIDE_TEMPLATES = [
  (p: BusinessContentParams) =>
    `${p.areaName} is a well-known area in ${p.cityName}, Nigeria, home to a diverse mix of businesses, residences, and commercial establishments. The area is easily accessible and serves as a hub for various services including ${p.categoryName.toLowerCase()}. Whether you are a resident or visiting ${p.areaName}, you will find a range of businesses ready to serve your needs on MyHustle.`,
  (p: BusinessContentParams) =>
    `Located in ${p.cityName}, ${p.areaName} is a bustling neighbourhood that attracts both residents and visitors looking for quality services. The area has grown significantly in recent years, with new businesses opening to meet the demands of the local community. ${p.areaName} is particularly known for its accessibility and the variety of ${p.categoryName.toLowerCase()} options available.`,
  (p: BusinessContentParams) =>
    `${p.areaName} in ${p.cityName} is a vibrant community with a thriving local economy. The area offers convenient access to essential services, shopping, dining, and professional services. For those seeking ${p.categoryName.toLowerCase()} services in ${p.areaName}, MyHustle provides a comprehensive directory to help you find exactly what you need.`,
  (p: BusinessContentParams) =>
    `As one of ${p.cityName}'s active neighbourhoods, ${p.areaName} combines residential living with commercial activity. The area is served by numerous local businesses across different categories, making it a convenient location for residents who want quality services close to home. Explore ${p.categoryName.toLowerCase()} and other services in ${p.areaName} on MyHustle.`,
]

// ─── Main content generation function ───────────────────────────────

export function generateBusinessContent(params: BusinessContentParams): EnrichedContent {
  const templates = CATEGORY_TEMPLATES[params.parentCategorySlug] || CATEGORY_TEMPLATES['other']
  const seed = `${params.businessName}-${params.areaName}-${params.cityName}`

  // Pick about section template
  const aboutFn = pick(templates.about, seed)
  const aboutSection = aboutFn(params)

  // Pick expectations template
  const expectFn = pick(templates.expectations, seed + '-expect')
  const expectations = expectFn(params)

  // Build "What to Expect" as HTML list
  const whatToExpect = expectations.map(item => `<li>${item}</li>`).join('\n')

  // Pick area guide
  const areaGuideFn = pick(AREA_GUIDE_TEMPLATES, seed + '-area')
  const areaGuide = areaGuideFn(params)

  return {
    aboutSection,
    whatToExpect,
    areaGuide,
  }
}

// Check if a business has a "rich" user-provided description
// Scraped placeholders typically have no description or very short generic ones
export function hasRichDescription(description: string | null | undefined): boolean {
  if (!description) return false
  // Consider descriptions under 80 chars as thin/placeholder
  if (description.trim().length < 80) return false
  // Check for common placeholder patterns
  const placeholderPatterns = [
    /^(this is|we are|welcome to)\s/i,
    /^[A-Z][a-z]+ is (a|an|the) /,
  ]
  // If it matches a placeholder pattern AND is short, it's not rich
  if (description.trim().length < 150) {
    for (const pattern of placeholderPatterns) {
      if (pattern.test(description.trim())) return false
    }
  }
  // Descriptions over 200 chars are likely user-provided
  if (description.trim().length > 200) return true
  // Medium-length descriptions (80-200) are considered rich enough
  return true
}
