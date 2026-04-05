// Server-side FAQ generator utility
// Generates contextual, keyword-rich FAQs for every public page type
// All FAQs use real data passed as parameters — no hardcoded placeholder text

export interface FAQ {
  question: string
  answer: string
}

// ─── Helper utilities ───────────────────────────────────────────────

function listItems(items: string[], maxItems = 6): string {
  if (!items || items.length === 0) return ''
  const limited = items.slice(0, maxItems)
  if (limited.length === 1) return limited[0]
  if (limited.length === 2) return `${limited[0]} and ${limited[1]}`
  const last = limited.pop()
  return `${limited.join(', ')}, and ${last}`
}

function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`)
}

// ─── a) Homepage FAQs ───────────────────────────────────────────────

export function generateHomepageFAQs(data: {
  cityCount: number
  categoryCount: number
  businessCount: number
  cityNames: string[]
}): FAQ[] {
  const { cityCount, categoryCount, businessCount, cityNames } = data
  const cityList = listItems(cityNames)
  const bizCountStr = businessCount > 0 ? `${businessCount.toLocaleString()}` : 'a growing number of'

  const faqs: FAQ[] = [
    {
      question: 'What is MyHustle.com?',
      answer: `MyHustle.com is Nigeria's trusted business directory that helps you discover, compare, and book local businesses. We currently feature ${bizCountStr} ${pluralize(businessCount, 'business', 'businesses')} across ${cityCount} ${pluralize(cityCount, 'city', 'cities')} in Nigeria, making it easy to find the services you need.`,
    },
    {
      question: 'How do I find a business on MyHustle?',
      answer: 'You can search by business name, category, or location using the search bar on the homepage. You can also browse by city, area, or category to discover businesses near you. Each listing includes contact details, reviews, and booking options.',
    },
    {
      question: 'How do I list my business on MyHustle?',
      answer: 'Listing your business on MyHustle is completely free. The easiest way is to send us a WhatsApp message with your business name and details — our team will set up your listing within 24 hours. You can also sign up and use our web form to create your listing yourself.',
    },
  ]

  if (cityNames.length > 0) {
    faqs.push({
      question: 'What cities does MyHustle cover in Nigeria?',
      answer: `MyHustle currently covers businesses in ${cityList}. We are actively expanding to more cities across Nigeria to help even more businesses get discovered by customers.`,
    })
  }

  faqs.push(
    {
      question: 'Can I book appointments through MyHustle?',
      answer: 'Yes! Many businesses on MyHustle accept online bookings directly through their listing page. You can select a date and time, provide your details, and confirm your appointment — all without leaving the site.',
    },
    {
      question: 'How does business verification work on MyHustle?',
      answer: 'MyHustle offers a multi-tier verification system. Verified businesses have been confirmed by our team to ensure their contact details and location are accurate. Look for the verification badge on business listings to identify trusted businesses.',
    },
    {
      question: 'Can I read reviews of businesses on MyHustle?',
      answer: 'Absolutely. Every business listing on MyHustle includes a reviews section where customers can share their experiences. You can read ratings and detailed reviews to help you choose the right business for your needs.',
    },
  )

  if (categoryCount > 0) {
    faqs.push({
      question: `What categories of businesses are listed on MyHustle?`,
      answer: `MyHustle currently features businesses across ${categoryCount} ${pluralize(categoryCount, 'category', 'categories')} — and growing. Our categories include restaurants, beauty salons, health clinics, fashion designers, auto mechanics, and many more. Can't find your category? Suggest one via WhatsApp and we'll add it within 24 hours. Whatever you need, you can find it on MyHustle.`,
    })
  }

  faqs.push(
    {
      question: 'How do I contact a business listed on MyHustle?',
      answer: 'Each business listing shows available contact methods including phone number, WhatsApp, email, and website. You can call directly, send a WhatsApp message, or use the booking form — whichever is most convenient for you.',
    },
    {
      question: 'Is MyHustle free to use for customers?',
      answer: 'Yes, MyHustle is completely free for customers. You can search for businesses, read reviews, compare options, and book appointments without any charges. Our goal is to make it easy for you to find the right business in Nigeria.',
    },
    {
      question: 'How can I leave a review for a business on MyHustle?',
      answer: 'Visit the business listing page and scroll down to the reviews section. You can rate the business from 1 to 5 stars and write about your experience. Your honest review helps other customers make informed decisions.',
    },
    {
      question: 'Does MyHustle work on mobile phones?',
      answer: 'Yes, MyHustle is fully optimized for mobile devices. You can browse businesses, read reviews, and book appointments from your smartphone or tablet with the same great experience as on a desktop computer.',
    },
  )

  return faqs
}

// ─── b) City FAQs ───────────────────────────────────────────────────

export function generateCityFAQs(data: {
  cityName: string
  areaCount: number
  businessCount: number
  areaNames: string[]
  topCategories: string[]
}): FAQ[] {
  const { cityName, areaCount, businessCount, areaNames, topCategories } = data
  const areaList = listItems(areaNames, 8)
  const catList = listItems(topCategories, 6)
  const bizCountStr = businessCount > 0 ? `${businessCount.toLocaleString()}` : 'a growing number of'

  const faqs: FAQ[] = [
    {
      question: `How do I find businesses in ${cityName} on MyHustle?`,
      answer: `You can browse all areas in ${cityName} on this page, or use the search bar to find specific businesses or services. MyHustle lists ${bizCountStr} ${pluralize(businessCount, 'business', 'businesses')} across ${areaCount} ${pluralize(areaCount, 'area')} in ${cityName}.`,
    },
  ]

  if (areaNames.length > 0) {
    faqs.push({
      question: `What areas in ${cityName} are covered on MyHustle?`,
      answer: `MyHustle covers ${areaCount} ${pluralize(areaCount, 'area')} in ${cityName}, including popular locations like ${areaList}. Each area page shows all listed businesses with reviews, contact details, and booking options.`,
    })
  }

  if (topCategories.length > 0) {
    faqs.push({
      question: `What types of businesses can I find in ${cityName}?`,
      answer: `You can find a wide range of businesses in ${cityName} on MyHustle, including ${catList}. Browse by category to find exactly what you need in your preferred area.`,
    })
  } else {
    faqs.push({
      question: `What types of businesses can I find in ${cityName}?`,
      answer: `MyHustle features businesses across many categories in ${cityName}, from restaurants and beauty salons to health clinics and professional services. Browse by area to discover what's available near you.`,
    })
  }

  faqs.push(
    {
      question: `Can I book appointments with businesses in ${cityName}?`,
      answer: `Yes, many businesses listed in ${cityName} on MyHustle accept online bookings. Visit any business listing page to check availability and book an appointment directly.`,
    },
    {
      question: `How do I list my business in ${cityName} on MyHustle?`,
      answer: `Listing your business in ${cityName} is free and easy. Send us a WhatsApp message with your business name, what you do, and your area in ${cityName}. Our team will create your professional listing within 24 hours.`,
    },
    {
      question: `Are businesses in ${cityName} verified on MyHustle?`,
      answer: `MyHustle offers verification for businesses in ${cityName}. Verified businesses display a badge on their listing, confirming their contact details and location have been checked by our team. This helps you choose trusted service providers.`,
    },
  )

  if (areaNames.length > 0) {
    faqs.push({
      question: `What are the most popular areas for businesses in ${cityName}?`,
      answer: `Some of the most active business areas in ${cityName} on MyHustle include ${areaList}. These areas have the highest concentration of listed businesses and customer activity.`,
    })
  }

  faqs.push(
    {
      question: `How do I search for a specific service in ${cityName}?`,
      answer: `Use the search bar at the top of the page and type what you're looking for, such as "hair salon" or "mechanic." You can also browse by category and then filter by your preferred area within ${cityName}.`,
    },
    {
      question: `Is it free to list my business in ${cityName}?`,
      answer: `Yes, listing your business in ${cityName} on MyHustle is 100% free. Your listing includes a professional business page with contact details, photos, reviews, and booking capabilities at no cost.`,
    },
    {
      question: `How can I find the best-rated businesses in ${cityName}?`,
      answer: `Browse any area or category page in ${cityName} to see businesses sorted by verification status and ratings. Customer reviews and star ratings help you identify the highest-quality service providers.`,
    },
    {
      question: `Can I contact businesses in ${cityName} through WhatsApp?`,
      answer: `Yes, many businesses in ${cityName} have WhatsApp contact enabled on their MyHustle listing. Look for the WhatsApp button on any business page to send a direct message.`,
    },
    {
      question: `How do I rank higher as a business in ${cityName}?`,
      answer: `To improve your visibility on MyHustle in ${cityName}, complete your business profile with photos and detailed descriptions, get verified, and encourage satisfied customers to leave reviews. Verified businesses with good reviews appear higher in listings.`,
    },
  )

  return faqs
}

// ─── c) Area FAQs ───────────────────────────────────────────────────

export function generateAreaFAQs(data: {
  areaName: string
  cityName: string
  businessCount: number
  categoryNames: string[]
  landmarkNames: string[]
}): FAQ[] {
  const { areaName, cityName, businessCount, categoryNames, landmarkNames } = data
  const catList = listItems(categoryNames, 6)
  const lmList = listItems(landmarkNames, 5)
  const bizCountStr = businessCount > 0 ? `${businessCount.toLocaleString()}` : 'a growing number of'

  const faqs: FAQ[] = [
    {
      question: `How many businesses are listed in ${areaName}, ${cityName}?`,
      answer: `There ${businessCount === 1 ? 'is' : 'are'} currently ${bizCountStr} ${pluralize(businessCount, 'business', 'businesses')} listed in ${areaName}, ${cityName} on MyHustle. New businesses are being added regularly as our directory grows.`,
    },
    {
      question: `What services can I find in ${areaName}, ${cityName}?`,
      answer: categoryNames.length > 0
        ? `In ${areaName}, ${cityName}, you can find businesses across categories including ${catList}. Browse by category to find the specific service you need.`
        : `${areaName}, ${cityName} features a variety of businesses and services on MyHustle. Browse the listings on this page to discover what's available in the area.`,
    },
    {
      question: `How do I find the best businesses in ${areaName}?`,
      answer: `Browse the business listings on this page to see all options in ${areaName}, ${cityName}. Look for verified businesses with the verification badge, and read customer reviews to find the highest-rated service providers.`,
    },
    {
      question: `Can I book an appointment with a business in ${areaName}?`,
      answer: `Yes, many businesses in ${areaName}, ${cityName} accept online bookings through MyHustle. Visit any business listing and use the booking form to select your preferred date and time.`,
    },
  ]

  if (categoryNames.length > 0) {
    faqs.push({
      question: `What are the most popular business categories in ${areaName}?`,
      answer: `The most popular business categories in ${areaName}, ${cityName} include ${catList}. Click on any category to see all businesses offering those services in the area.`,
    })
  }

  faqs.push(
    {
      question: `Are businesses in ${areaName} verified on MyHustle?`,
      answer: `Yes, MyHustle offers verification for businesses in ${areaName}, ${cityName}. Verified businesses have been confirmed by our team and display a verification badge on their listing, helping you choose trusted providers.`,
    },
    {
      question: `How do I list my business in ${areaName}, ${cityName}?`,
      answer: `Listing your business in ${areaName} is free. Send us a WhatsApp message with your business name and details, and our team will create your professional listing within 24 hours. You'll get a dedicated business page with reviews, booking, and contact features.`,
    },
  )

  if (landmarkNames.length > 0) {
    faqs.push({
      question: `What landmarks are near businesses in ${areaName}?`,
      answer: `Notable landmarks in and around ${areaName}, ${cityName} include ${lmList}. You can browse businesses near specific landmarks to find services in convenient locations.`,
    })
  }

  faqs.push(
    {
      question: `Can I read reviews of businesses in ${areaName}?`,
      answer: `Yes, every business listing in ${areaName}, ${cityName} includes a reviews section. Customers share their experiences with ratings and detailed feedback, helping you make informed decisions about which business to choose.`,
    },
    {
      question: `How do I compare businesses in ${areaName}?`,
      answer: `Browse the listings on this page to see all businesses in ${areaName}, ${cityName}. Compare their ratings, reviews, verification status, and services offered to find the best match for your needs.`,
    },
    {
      question: `Is it free to list my business in ${areaName}?`,
      answer: `Yes, listing on MyHustle is 100% free for businesses in ${areaName}, ${cityName}. Your listing includes a professional page with contact details, photos, customer reviews, and online booking — all at no cost.`,
    },
    {
      question: `How do I get directions to a business in ${areaName}?`,
      answer: `Each business listing in ${areaName}, ${cityName} shows the business address. You can use the address to get directions via Google Maps or any navigation app on your phone.`,
    },
  )

  if (businessCount === 0) {
    faqs.push({
      question: `Why are there no businesses listed in ${areaName} yet?`,
      answer: `We are actively building our directory in ${areaName}, ${cityName}. New businesses are being added regularly. If you know a great business in ${areaName}, encourage them to list on MyHustle — it's free!`,
    })
  }

  return faqs
}

// ─── d) Area + Category FAQs ────────────────────────────────────────

export function generateAreaCategoryFAQs(data: {
  areaName: string
  cityName: string
  categoryName: string
  businessCount: number
  businessNames: string[]
}): FAQ[] {
  const { areaName, cityName, categoryName, businessCount, businessNames } = data
  const bizList = listItems(businessNames, 5)
  const bizCountStr = businessCount > 0 ? `${businessCount.toLocaleString()}` : 'currently no'
  const catLower = categoryName.toLowerCase()

  const faqs: FAQ[] = [
    {
      question: `How many ${categoryName} businesses are in ${areaName}, ${cityName}?`,
      answer: `There ${businessCount === 1 ? 'is' : 'are'} ${bizCountStr} ${categoryName} ${pluralize(businessCount, 'business', 'businesses')} listed in ${areaName}, ${cityName} on MyHustle.${businessCount === 0 ? ' New businesses are being added regularly.' : ' Browse the listings on this page to find the right one for you.'}`,
    },
    {
      question: `How do I find the best ${catLower} in ${areaName}, ${cityName}?`,
      answer: `Browse the ${categoryName} listings on this page to compare options in ${areaName}, ${cityName}. Check verification badges, read customer reviews, and compare ratings to find the highest-quality ${catLower} service providers.`,
    },
    {
      question: `Can I book a ${catLower} appointment in ${areaName} online?`,
      answer: `Yes, many ${categoryName} businesses in ${areaName}, ${cityName} accept online bookings through MyHustle. Visit any business listing and use the booking form to schedule your appointment at a convenient time.`,
    },
    {
      question: `Are ${categoryName} businesses in ${areaName} verified?`,
      answer: `MyHustle offers verification for ${categoryName} businesses in ${areaName}, ${cityName}. Verified businesses display a badge confirming their details have been checked by our team, so you can book with confidence.`,
    },
    {
      question: `How do I compare ${catLower} services in ${areaName}?`,
      answer: `View all ${categoryName} listings in ${areaName}, ${cityName} on this page. Compare their customer reviews, ratings, verification status, and available services to choose the best option for your needs.`,
    },
  ]

  if (businessNames.length > 0) {
    faqs.push({
      question: `What ${categoryName} businesses are available in ${areaName}, ${cityName}?`,
      answer: `${categoryName} businesses in ${areaName}, ${cityName} include ${bizList}. Visit each listing to see their services, reviews, and contact details.`,
    })
  }

  faqs.push(
    {
      question: `How much do ${catLower} services cost in ${areaName}, ${cityName}?`,
      answer: `Prices for ${catLower} services in ${areaName}, ${cityName} vary by business and service type. Visit individual business listings on MyHustle to learn about their offerings, or contact them directly via phone or WhatsApp for pricing details.`,
    },
    {
      question: `Can I read reviews of ${catLower} businesses in ${areaName}?`,
      answer: `Yes, each ${categoryName} business listing in ${areaName}, ${cityName} includes customer reviews and ratings. Read what other customers experienced to help you choose the right service provider.`,
    },
    {
      question: `Can I contact ${catLower} businesses in ${areaName} via WhatsApp?`,
      answer: `Many ${categoryName} businesses in ${areaName}, ${cityName} have WhatsApp contact enabled on their MyHustle listing. Look for the WhatsApp button on any business page to send a direct message with your enquiry.`,
    },
    {
      question: `How do I list my ${catLower} business in ${areaName}?`,
      answer: `Listing your ${categoryName} business in ${areaName}, ${cityName} on MyHustle is free. Send us a WhatsApp message with your business details and we'll create your professional listing within 24 hours.`,
    },
  )

  if (businessCount > 1) {
    faqs.push({
      question: `Which is the highest-rated ${catLower} business in ${areaName}?`,
      answer: `Browse the ${categoryName} listings on this page sorted by verification and ratings to find the top-rated options in ${areaName}, ${cityName}. Customer reviews and star ratings help identify the best service providers.`,
    })
  }

  faqs.push({
    question: `Do ${catLower} businesses in ${areaName} offer home service?`,
    answer: `Some ${categoryName} businesses in ${areaName}, ${cityName} may offer home or mobile services. Check individual business listings for details about their service options, or contact them directly to ask about home visits.`,
  })

  return faqs
}

// ─── e) Category FAQs ───────────────────────────────────────────────

export function generateCategoryFAQs(data: {
  categoryName: string
  businessCount: number
  cityNames: string[]
  subcategoryNames: string[]
}): FAQ[] {
  const { categoryName, businessCount, cityNames, subcategoryNames } = data
  const cityList = listItems(cityNames)
  const subList = listItems(subcategoryNames, 6)
  const bizCountStr = businessCount > 0 ? `${businessCount.toLocaleString()}` : 'a growing number of'
  const catLower = categoryName.toLowerCase()

  const faqs: FAQ[] = [
    {
      question: `How many ${categoryName} businesses are on MyHustle?`,
      answer: `MyHustle currently lists ${bizCountStr} ${categoryName} ${pluralize(businessCount, 'business', 'businesses')} across Nigeria. New ${catLower} businesses are being added regularly as our directory grows.`,
    },
  ]

  if (cityNames.length > 0) {
    faqs.push({
      question: `What cities have ${categoryName} businesses on MyHustle?`,
      answer: `You can find ${categoryName} businesses in ${cityList} on MyHustle. Browse by city and area to find ${catLower} services near your location.`,
    })
  }

  faqs.push(
    {
      question: `How do I find the best ${catLower} near me on MyHustle?`,
      answer: `Browse the ${categoryName} listings on this page and filter by area to find businesses near you. Check verification badges and read customer reviews to identify the highest-rated ${catLower} service providers in your neighbourhood.`,
    },
    {
      question: `Can I book a ${catLower} appointment on MyHustle?`,
      answer: `Yes, many ${categoryName} businesses on MyHustle accept online bookings. Visit any business listing and use the booking form to schedule your appointment at a time that works for you.`,
    },
  )

  if (subcategoryNames.length > 0) {
    faqs.push({
      question: `What subcategories of ${categoryName} are available on MyHustle?`,
      answer: `${categoryName} on MyHustle includes subcategories such as ${subList}. Click on any subcategory to find specialized businesses offering those specific services.`,
    })
  }

  faqs.push(
    {
      question: `Are ${categoryName} businesses verified on MyHustle?`,
      answer: `MyHustle offers a multi-tier verification system for ${categoryName} businesses. Verified businesses display a badge confirming their contact details and location have been checked, helping you choose trusted service providers.`,
    },
    {
      question: `How do I compare ${catLower} businesses on MyHustle?`,
      answer: `Browse ${categoryName} listings and compare their customer reviews, star ratings, verification status, and service offerings. You can also filter by area to compare options in your preferred location.`,
    },
    {
      question: `Can I read reviews of ${catLower} businesses on MyHustle?`,
      answer: `Yes, every ${categoryName} business listing includes customer reviews and ratings. Read detailed feedback from other customers to help you make an informed decision about which business to choose.`,
    },
    {
      question: `How do I list my ${catLower} business on MyHustle?`,
      answer: `Listing your ${categoryName} business on MyHustle is completely free. Send us a WhatsApp message with your business name, services, and location, and our team will create your professional listing within 24 hours.`,
    },
    {
      question: `How do I search for ${catLower} in a specific area?`,
      answer: `Use the area filter links on this page to find ${categoryName} businesses in your preferred neighbourhood. You can also use the search bar and include your area name for more specific results.`,
    },
    {
      question: `What should I look for when choosing a ${catLower} business?`,
      answer: `When choosing a ${categoryName} business on MyHustle, look for the verification badge, read customer reviews, check their ratings, and review their service descriptions. Businesses with more reviews and higher ratings tend to provide better experiences.`,
    },
    {
      question: `Can I contact ${catLower} businesses via WhatsApp on MyHustle?`,
      answer: `Yes, many ${categoryName} businesses have WhatsApp contact enabled on their MyHustle listing. Look for the WhatsApp button on any business page to send a direct message with your enquiry or booking request.`,
    },
  )

  return faqs
}

// ─── f) Business FAQs ───────────────────────────────────────────────

function formatTime(time: string): string {
  if (!time) return ''
  const parts = time.split(':')
  if (parts.length < 2) return time
  let hour = parseInt(parts[0], 10)
  const min = parts[1]
  const ampm = hour >= 12 ? 'PM' : 'AM'
  if (hour === 0) hour = 12
  else if (hour > 12) hour -= 12
  return min === '00' ? `${hour} ${ampm}` : `${hour}:${min} ${ampm}`
}

function formatHoursNicely(hours: Array<{ day: string; open: string; close: string; closed: boolean }>): string {
  if (!hours || hours.length === 0) return 'Contact the business directly for their current opening hours.'

  const openDays = hours.filter(h => !h.closed)
  const closedDays = hours.filter(h => h.closed)

  if (openDays.length === 0) return 'The business appears to be currently closed. Contact them directly for updated hours.'

  // Group consecutive days with same hours
  const groups: Array<{ days: string[]; open: string; close: string }> = []
  for (const day of openDays) {
    const last = groups[groups.length - 1]
    if (last && last.open === day.open && last.close === day.close) {
      last.days.push(day.day)
    } else {
      groups.push({ days: [day.day], open: day.open, close: day.close })
    }
  }

  const parts = groups.map(g => {
    const dayStr = g.days.length === 1
      ? g.days[0]
      : g.days.length === 2
        ? `${g.days[0]} and ${g.days[1]}`
        : `${g.days[0]} to ${g.days[g.days.length - 1]}`
    return `${dayStr}: ${formatTime(g.open)} – ${formatTime(g.close)}`
  })

  if (closedDays.length > 0 && closedDays.length <= 2) {
    parts.push(`Closed on ${listItems(closedDays.map(d => d.day))}`)
  }

  return parts.join('. ') + '.'
}

export function generateBusinessFAQs(data: {
  businessName: string
  categoryName: string
  areaName: string
  cityName: string
  hasBooking: boolean
  hasWhatsApp: boolean
  hasPhone: boolean
  reviewCount: number
  avgRating: number
  isVerified: boolean
  verificationTier: number
  hours: Array<{ day: string; open: string; close: string; closed: boolean }>
}): FAQ[] {
  const {
    businessName, categoryName, areaName, cityName,
    hasBooking, hasWhatsApp, hasPhone,
    reviewCount, avgRating, isVerified, verificationTier, hours,
  } = data
  const catLower = categoryName ? categoryName.toLowerCase() : 'services'
  const location = [areaName, cityName].filter(Boolean).join(', ')

  // Build contact methods string
  const contactMethods: string[] = []
  if (hasPhone) contactMethods.push('phone call')
  if (hasWhatsApp) contactMethods.push('WhatsApp message')
  contactMethods.push('the booking form on their MyHustle page')
  const contactStr = listItems(contactMethods)

  const faqs: FAQ[] = [
    {
      question: `How do I book an appointment with ${businessName}?`,
      answer: hasBooking
        ? `You can book an appointment with ${businessName} directly through their MyHustle listing page. Use the booking form to select your preferred date and time, and the business will confirm your appointment.`
        : `You can contact ${businessName} to schedule an appointment via ${contactStr}.`,
    },
    {
      question: `What are the opening hours of ${businessName}?`,
      answer: hours.length > 0
        ? `${businessName} operates on the following schedule: ${formatHoursNicely(hours)}`
        : `For the most up-to-date opening hours of ${businessName}, please contact them directly via ${hasWhatsApp ? 'WhatsApp or ' : ''}phone.`,
    },
    {
      question: `Where is ${businessName} located?`,
      answer: location
        ? `${businessName} is located in ${location}. Visit their MyHustle listing for the full address and directions to their location.`
        : `Visit the ${businessName} listing on MyHustle for their full address and location details.`,
    },
  ]

  // Verification FAQ
  if (isVerified) {
    const tierLabels: Record<number, string> = {
      1: 'Basic Verified',
      2: 'Trusted Business',
      3: 'Premium Verified',
    }
    const tierLabel = tierLabels[verificationTier] || 'Verified'
    faqs.push({
      question: `Is ${businessName} a verified business?`,
      answer: `Yes, ${businessName} is a ${tierLabel} business on MyHustle. This means their contact details and business information have been confirmed by our verification team, giving you extra confidence when booking their services.`,
    })
  } else {
    faqs.push({
      question: `Is ${businessName} verified on MyHustle?`,
      answer: `${businessName} has not yet completed the MyHustle verification process. You can still contact them and read customer reviews to assess their services. Verification is optional and businesses can apply at any time.`,
    })
  }

  // Contact methods FAQ
  faqs.push({
    question: `How do I contact ${businessName}?`,
    answer: `You can reach ${businessName} via ${contactStr}. Visit their listing page for all available contact options.`,
  })

  // Reviews FAQ
  if (reviewCount > 0) {
    faqs.push({
      question: `What do customers say about ${businessName}?`,
      answer: `${businessName} has ${reviewCount} customer ${pluralize(reviewCount, 'review')} on MyHustle with an average rating of ${avgRating.toFixed(1)} out of 5 stars. Read the full reviews on their listing page to see what customers think about their ${catLower} services.`,
    })
  } else {
    faqs.push({
      question: `Does ${businessName} have any reviews?`,
      answer: `${businessName} doesn't have any reviews on MyHustle yet. If you've used their services, be the first to leave a review and help other customers make informed decisions.`,
    })
  }

  // Category-specific FAQ
  if (categoryName) {
    faqs.push({
      question: `What ${catLower} services does ${businessName} offer?`,
      answer: `${businessName} is listed under ${categoryName} on MyHustle${location ? `, serving customers in ${location}` : ''}. Visit their listing page for detailed information about their specific services and offerings.`,
    })
  }

  // Leave review FAQ
  faqs.push({
    question: `How do I leave a review for ${businessName}?`,
    answer: `Visit the ${businessName} listing page on MyHustle and scroll to the reviews section. You can rate the business from 1 to 5 stars and share your experience to help other customers.`,
  })

  // WhatsApp FAQ
  if (hasWhatsApp) {
    faqs.push({
      question: `Can I message ${businessName} on WhatsApp?`,
      answer: `Yes, ${businessName} is available on WhatsApp. Click the WhatsApp button on their MyHustle listing page to send them a direct message with your enquiry or booking request.`,
    })
  }

  // Weekend hours FAQ
  if (hours.length > 0) {
    const weekendDays = hours.filter(h => h.day === 'Saturday' || h.day === 'Sunday')
    if (weekendDays.length > 0) {
      const openWeekend = weekendDays.filter(h => !h.closed)
      const closedWeekend = weekendDays.filter(h => h.closed)
      if (openWeekend.length > 0) {
        const weekendHours = openWeekend.map(h => `${h.day}: ${formatTime(h.open)} – ${formatTime(h.close)}`).join(', ')
        faqs.push({
          question: `Is ${businessName} open on weekends?`,
          answer: `Yes, ${businessName} is open on weekends. Their weekend hours are: ${weekendHours}.${closedWeekend.length > 0 ? ` They are closed on ${closedWeekend[0].day}.` : ''}`,
        })
      } else {
        faqs.push({
          question: `Is ${businessName} open on weekends?`,
          answer: `${businessName} is closed on weekends (Saturday and Sunday). They are available during the week — check their full schedule on their MyHustle listing page.`,
        })
      }
    }
  }

  faqs.push({
    question: `How do I get directions to ${businessName}?`,
    answer: `Visit the ${businessName} listing on MyHustle to find their address${location ? ` in ${location}` : ''}. You can copy the address and use Google Maps or any navigation app to get directions.`,
  })

  return faqs
}

// ─── g) Landmark FAQs ───────────────────────────────────────────────

export function generateLandmarkFAQs(data: {
  landmarkName: string
  cityName: string
  areaName: string
  businessCount: number
  categoryNames: string[]
}): FAQ[] {
  const { landmarkName, cityName, areaName, businessCount, categoryNames } = data
  const catList = listItems(categoryNames, 6)
  const bizCountStr = businessCount > 0 ? `${businessCount.toLocaleString()}` : 'a growing number of'
  const location = [areaName, cityName].filter(Boolean).join(', ')

  const faqs: FAQ[] = [
    {
      question: `What businesses are near ${landmarkName}?`,
      answer: `There ${businessCount === 1 ? 'is' : 'are'} ${bizCountStr} ${pluralize(businessCount, 'business', 'businesses')} listed near ${landmarkName}${location ? ` in ${location}` : ''} on MyHustle. Browse the listings on this page to discover services in the area.`,
    },
    {
      question: `How many businesses are near ${landmarkName} on MyHustle?`,
      answer: `MyHustle currently lists ${bizCountStr} ${pluralize(businessCount, 'business', 'businesses')} near ${landmarkName}. New businesses are being added regularly as our directory grows in ${location || 'this area'}.`,
    },
  ]

  if (categoryNames.length > 0) {
    faqs.push({
      question: `What types of services can I find near ${landmarkName}?`,
      answer: `Near ${landmarkName}, you can find businesses in categories including ${catList}. Click on any category to filter businesses by the specific service you need.`,
    })
  } else {
    faqs.push({
      question: `What types of services can I find near ${landmarkName}?`,
      answer: `MyHustle lists various types of businesses near ${landmarkName}${location ? ` in ${location}` : ''}. Browse the listings on this page to see all available services and categories.`,
    })
  }

  faqs.push(
    {
      question: `Can I book an appointment with a business near ${landmarkName}?`,
      answer: `Yes, many businesses near ${landmarkName} accept online bookings through MyHustle. Visit any business listing and use the booking form to schedule your appointment.`,
    },
  )

  if (categoryNames.length > 0) {
    faqs.push({
      question: `How do I find ${categoryNames[0].toLowerCase()} near ${landmarkName}?`,
      answer: `Click on the "${categoryNames[0]}" category filter on this page to see all ${categoryNames[0].toLowerCase()} businesses near ${landmarkName}. You can also use the search bar to find specific services.`,
    })
  }

  faqs.push(
    {
      question: `Are businesses near ${landmarkName} verified on MyHustle?`,
      answer: `MyHustle offers verification for businesses near ${landmarkName}. Look for the verification badge on business listings to identify providers whose details have been confirmed by our team.`,
    },
    {
      question: `How do I list my business near ${landmarkName} on MyHustle?`,
      answer: `If your business is located near ${landmarkName}${location ? ` in ${location}` : ''}, you can list it on MyHustle for free. Send us a WhatsApp message with your business details and we'll create your listing within 24 hours.`,
    },
    {
      question: `What is the best way to find services near ${landmarkName}?`,
      answer: `Browse the business listings on this page to see all services near ${landmarkName}. You can filter by category, read customer reviews, and check verification badges to find the best service providers in the area.`,
    },
    {
      question: `Can I read reviews of businesses near ${landmarkName}?`,
      answer: `Yes, every business listing near ${landmarkName} on MyHustle includes customer reviews and ratings. Read what other customers experienced to help you choose the right business.`,
    },
    {
      question: `How far are the listed businesses from ${landmarkName}?`,
      answer: `Businesses listed near ${landmarkName} are located in the same area${areaName ? ` (${areaName})` : ''}. Visit individual business listings for their exact address and use a maps app to check the distance from ${landmarkName}.`,
    },
  )

  return faqs
}

// ─── h) Landmark + Category FAQs ────────────────────────────────────

export function generateLandmarkCategoryFAQs(data: {
  landmarkName: string
  categoryName: string
  cityName: string
  businessCount: number
  businessNames: string[]
}): FAQ[] {
  const { landmarkName, categoryName, cityName, businessCount, businessNames } = data
  const bizList = listItems(businessNames, 5)
  const bizCountStr = businessCount > 0 ? `${businessCount.toLocaleString()}` : 'currently no'
  const catLower = categoryName.toLowerCase()

  const faqs: FAQ[] = [
    {
      question: `How many ${categoryName} businesses are near ${landmarkName}?`,
      answer: `There ${businessCount === 1 ? 'is' : 'are'} ${bizCountStr} ${categoryName} ${pluralize(businessCount, 'business', 'businesses')} listed near ${landmarkName}${cityName ? ` in ${cityName}` : ''} on MyHustle.${businessCount === 0 ? ' New businesses are being added regularly.' : ''}`,
    },
    {
      question: `How do I find the best ${catLower} near ${landmarkName}?`,
      answer: `Browse the ${categoryName} listings on this page to compare options near ${landmarkName}. Check verification badges, read customer reviews, and compare ratings to find the highest-quality ${catLower} providers.`,
    },
    {
      question: `Can I book a ${catLower} appointment near ${landmarkName}?`,
      answer: `Yes, many ${categoryName} businesses near ${landmarkName} accept online bookings through MyHustle. Visit any business listing and use the booking form to schedule your appointment.`,
    },
    {
      question: `Are ${categoryName} businesses near ${landmarkName} verified?`,
      answer: `MyHustle offers verification for ${categoryName} businesses near ${landmarkName}. Look for the verification badge on listings to identify providers whose details have been confirmed by our team.`,
    },
    {
      question: `How do I compare ${catLower} options near ${landmarkName}?`,
      answer: `View all ${categoryName} listings near ${landmarkName} on this page. Compare customer reviews, star ratings, verification status, and service descriptions to choose the best option for your needs.`,
    },
  ]

  if (businessNames.length > 0) {
    faqs.push({
      question: `What ${categoryName} businesses are available near ${landmarkName}?`,
      answer: `${categoryName} businesses near ${landmarkName} include ${bizList}. Visit each listing to see their services, customer reviews, and contact details.`,
    })
  }

  faqs.push(
    {
      question: `Can I read reviews of ${catLower} businesses near ${landmarkName}?`,
      answer: `Yes, every ${categoryName} business listing near ${landmarkName} includes customer reviews and ratings. Read detailed feedback from other customers to make an informed choice.`,
    },
    {
      question: `How do I list my ${catLower} business near ${landmarkName}?`,
      answer: `If your ${categoryName} business is located near ${landmarkName}, you can list it on MyHustle for free. Send us a WhatsApp message with your business details and our team will set up your listing within 24 hours.`,
    },
    {
      question: `Can I contact ${catLower} businesses near ${landmarkName} via WhatsApp?`,
      answer: `Many ${categoryName} businesses near ${landmarkName} have WhatsApp contact enabled on their MyHustle listing. Look for the WhatsApp button on any business page to send a direct message.`,
    },
    {
      question: `How much do ${catLower} services cost near ${landmarkName}?`,
      answer: `Prices for ${catLower} services near ${landmarkName} vary by business and service type. Visit individual business listings on MyHustle for details, or contact them directly via phone or WhatsApp for pricing information.`,
    },
  )

  return faqs
}

// ─── i) List Your Business FAQs ─────────────────────────────────────

export function generateListYourBusinessFAQs(): FAQ[] {
  return [
    {
      question: 'Is it really free to list my business on MyHustle?',
      answer: 'Yes, 100% free. Your basic listing on MyHustle costs nothing and includes a professional business page with contact details, photos, customer reviews, and online booking. We also offer optional premium plans with extra features like priority placement and advanced analytics.',
    },
    {
      question: 'How do I list my business via WhatsApp?',
      answer: 'Simply tap the WhatsApp button on this page and send us a message with your business name. Our team will ask a few quick questions about your services and location, then create your professional listing within 24 hours. It takes less than 2 minutes of your time.',
    },
    {
      question: 'What are the verification tiers on MyHustle?',
      answer: 'MyHustle offers three verification tiers: Basic Verified (contact details confirmed), Trusted Business (identity and location verified), and Premium Verified (full business verification with enhanced visibility). Each tier adds more trust signals to your listing.',
    },
    {
      question: 'Can I edit my listing after it goes live?',
      answer: 'Absolutely. You get access to a dashboard where you can update your business details, photos, opening hours, services, and more at any time. Your changes appear on your listing immediately.',
    },
    {
      question: 'Can I list my business if I only use WhatsApp?',
      answer: 'Yes! Many Nigerian businesses operate primarily through WhatsApp, and MyHustle fully supports this. Your WhatsApp number will be displayed on your listing so customers can message you directly. You can even list your business entirely through WhatsApp without using a computer.',
    },
    {
      question: 'How long does it take to get listed on MyHustle?',
      answer: 'If you list via WhatsApp, most businesses are set up within 24 hours. If you use the web form and sign up yourself, your listing goes live as soon as you complete the setup — usually under 10 minutes.',
    },
    {
      question: 'What information do I need to provide?',
      answer: 'Just the basics to get started: your business name, what you do (category), your city and area, and a phone number. You can add photos, detailed descriptions, opening hours, and other details later to make your listing more attractive to customers.',
    },
    {
      question: 'What features does my business dashboard include?',
      answer: 'Your MyHustle dashboard lets you manage your listing details, view and respond to customer reviews, track page views and customer enquiries, manage bookings, and update your photos and business hours. Everything you need to manage your online presence.',
    },
    {
      question: 'Are there premium plans available?',
      answer: 'Yes, MyHustle offers optional premium plans for businesses that want extra visibility and features. Premium benefits include priority placement in search results, enhanced listing features, and detailed analytics. However, the basic listing with all core features is always free.',
    },
    {
      question: 'Do I need a website to list my business?',
      answer: 'Not at all. Your MyHustle listing works like a mini website for your business. Customers can find you through search, see your services and photos, read reviews, contact you via phone or WhatsApp, and book appointments — all without you needing a separate website.',
    },
    {
      question: "I'm not tech-savvy. Can I still list my business?",
      answer: "That's exactly why we built the WhatsApp listing option. If you can send a WhatsApp message, you can list your business on MyHustle. Our team handles all the technical setup for you. Just tell us about your business and we do the rest.",
    },
    {
      question: 'How do customers find my business on MyHustle?',
      answer: 'Customers find your business through multiple channels: searching by name or service type, browsing by city and area, filtering by category, or discovering you near landmarks. MyHustle is also optimized for Google search, so customers searching online can find your listing too.',
    },
  ]
}
