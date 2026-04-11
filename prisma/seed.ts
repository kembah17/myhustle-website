import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { randomUUID } from 'crypto'

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Helper to generate deterministic UUIDs from slugs (for referential integrity)
function makeId(): string {
  return randomUUID()
}

async function seed() {
  console.log('🌱 Seeding MyHustle Lagos data...')
  console.log(`Using Supabase URL: ${supabaseUrl}`)

  // ============================================================
  // 1. CITY
  // ============================================================
  const lagosId = makeId()
  console.log('\n📍 Creating city: Lagos...')
  const { error: cityErr } = await supabase.from('cities').upsert([{
    id: lagosId,
    slug: 'lagos',
    name: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    lat: 6.5244,
    lon: 3.3792
  }], { onConflict: 'slug' })
  if (cityErr) { console.error('City error:', cityErr); return }
  console.log('✅ Lagos created')

  // ============================================================
  // 2. AREAS (30 Lagos areas with real coordinates)
  // ============================================================
  const areasData = [
    // LGAs
    { slug: 'alimosho', name: 'Alimosho', lat: 6.6018, lon: 3.2906 },
    { slug: 'ajeromi-ifelodun', name: 'Ajeromi-Ifelodun', lat: 6.4483, lon: 3.3313 },
    { slug: 'kosofe', name: 'Kosofe', lat: 6.5833, lon: 3.3833 },
    { slug: 'mushin', name: 'Mushin', lat: 6.5333, lon: 3.3500 },
    { slug: 'oshodi-isolo', name: 'Oshodi-Isolo', lat: 6.5569, lon: 3.3414 },
    { slug: 'ojo', name: 'Ojo', lat: 6.4676, lon: 3.1814 },
    { slug: 'ikorodu', name: 'Ikorodu', lat: 6.6194, lon: 3.5105 },
    { slug: 'surulere', name: 'Surulere', lat: 6.5000, lon: 3.3500 },
    { slug: 'agege', name: 'Agege', lat: 6.6167, lon: 3.3167 },
    { slug: 'ifako-ijaiye', name: 'Ifako-Ijaiye', lat: 6.6667, lon: 3.3000 },
    { slug: 'somolu', name: 'Somolu', lat: 6.5333, lon: 3.3833 },
    { slug: 'amuwo-odofin', name: 'Amuwo-Odofin', lat: 6.4500, lon: 3.3167 },
    { slug: 'lagos-mainland', name: 'Lagos Mainland', lat: 6.4969, lon: 3.3903 },
    { slug: 'ikeja', name: 'Ikeja', lat: 6.6018, lon: 3.3515 },
    { slug: 'eti-osa', name: 'Eti-Osa', lat: 6.4281, lon: 3.4219 },
    { slug: 'badagry', name: 'Badagry', lat: 6.4167, lon: 2.8833 },
    { slug: 'apapa', name: 'Apapa', lat: 6.4500, lon: 3.3667 },
    { slug: 'lagos-island', name: 'Lagos Island', lat: 6.4541, lon: 3.3947 },
    { slug: 'epe', name: 'Epe', lat: 6.5833, lon: 3.9833 },
    { slug: 'ibeju-lekki', name: 'Ibeju-Lekki', lat: 6.4500, lon: 3.6000 },
    // Popular sub-areas
    { slug: 'victoria-island', name: 'Victoria Island', lat: 6.4281, lon: 3.4219 },
    { slug: 'lekki', name: 'Lekki', lat: 6.4698, lon: 3.5852 },
    { slug: 'ikoyi', name: 'Ikoyi', lat: 6.4500, lon: 3.4333 },
    { slug: 'ajah', name: 'Ajah', lat: 6.4667, lon: 3.5667 },
    { slug: 'yaba', name: 'Yaba', lat: 6.5100, lon: 3.3800 },
    { slug: 'gbagada', name: 'Gbagada', lat: 6.5500, lon: 3.3833 },
    { slug: 'maryland', name: 'Maryland', lat: 6.5667, lon: 3.3667 },
    { slug: 'ogba', name: 'Ogba', lat: 6.6333, lon: 3.3333 },
    { slug: 'festac', name: 'Festac', lat: 6.4667, lon: 3.2833 },
    { slug: 'magodo', name: 'Magodo', lat: 6.6167, lon: 3.3833 },
  ]

  const areas = areasData.map(a => ({ id: makeId(), city_id: lagosId, ...a }))
  console.log(`\n🏘️ Creating ${areas.length} areas...`)
  const { error: areaErr } = await supabase.from('areas').upsert(areas, { onConflict: 'slug' })
  if (areaErr) { console.error('Area error:', areaErr); return }
  console.log(`✅ ${areas.length} areas created`)

  // Build area lookup
  const areaMap: Record<string, string> = {}
  areas.forEach(a => { areaMap[a.slug] = a.id })

  // ============================================================
  // 3. CATEGORIES (5 verticals with subcategories)
  // ============================================================
  const parentCategories = [
    { slug: 'fashion-tailoring', name: 'Fashion & Tailoring', icon: '👗', description: 'Fashion designers, tailors, fabric stores and shoe makers in Lagos',
      seo_title_template: '{name} - Fashion & Tailoring in {area}, Lagos',
      seo_description_template: 'Book {name} for fashion and tailoring services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'hair-beauty', name: 'Hair & Beauty', icon: '💇', description: 'Hair salons, barber shops, makeup artists and nail studios in Lagos',
      seo_title_template: '{name} - Hair & Beauty in {area}, Lagos',
      seo_description_template: 'Book {name} for hair and beauty services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'events', name: 'Events', icon: '🎉', description: 'Event planners, DJs, MCs, decorators and caterers in Lagos',
      seo_title_template: '{name} - Events Services in {area}, Lagos',
      seo_description_template: 'Book {name} for event services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'photography', name: 'Photography', icon: '📸', description: 'Photographers, videographers and photo studios in Lagos',
      seo_title_template: '{name} - Photography in {area}, Lagos',
      seo_description_template: 'Book {name} for photography services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'food-dining', name: 'Food & Dining', icon: '🍽️', description: 'Restaurants, cafes, fast food and catering services in Lagos',
      seo_title_template: '{name} - Food & Dining in {area}, Lagos',
      seo_description_template: 'Visit {name} for food and dining in {area}, Lagos. Read reviews and see the menu.' },
    { slug: 'health-wellness', name: 'Health & Wellness', icon: '🏥', description: 'Pharmacies, gyms, spas, traditional medicine and opticians in Lagos',
      seo_title_template: '{name} - Health & Wellness in {area}, Lagos',
      seo_description_template: 'Book {name} for health and wellness services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'education-training', name: 'Education & Training', icon: '📚', description: 'Tutorial centres, driving schools, computer training and vocational institutes in Lagos',
      seo_title_template: '{name} - Education & Training in {area}, Lagos',
      seo_description_template: 'Book {name} for education and training services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'home-services', name: 'Home Services', icon: '🏠', description: 'Plumbers, electricians, painters, cleaners and AC repair in Lagos',
      seo_title_template: '{name} - Home Services in {area}, Lagos',
      seo_description_template: 'Book {name} for home services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'auto-services', name: 'Auto Services', icon: '🚗', description: 'Mechanics, car wash, auto electricians, panel beaters and tyre services in Lagos',
      seo_title_template: '{name} - Auto Services in {area}, Lagos',
      seo_description_template: 'Book {name} for auto services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'technology-it', name: 'Technology & IT', icon: '💻', description: 'Phone repair, computer repair, web design, CCTV installation and networking in Lagos',
      seo_title_template: '{name} - Technology & IT in {area}, Lagos',
      seo_description_template: 'Book {name} for technology and IT services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'real-estate', name: 'Real Estate', icon: '🏘️', description: 'Estate agents, property management, short-let apartments and land agents in Lagos',
      seo_title_template: '{name} - Real Estate in {area}, Lagos',
      seo_description_template: 'Find {name} for real estate services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'legal-finance', name: 'Legal & Finance', icon: '⚖️', description: 'Lawyers, accountants, tax consultants, insurance agents and microfinance in Lagos',
      seo_title_template: '{name} - Legal & Finance in {area}, Lagos',
      seo_description_template: 'Book {name} for legal and finance services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'logistics-transport', name: 'Logistics & Transport', icon: '🚚', description: 'Dispatch riders, moving services, haulage and courier services in Lagos',
      seo_title_template: '{name} - Logistics & Transport in {area}, Lagos',
      seo_description_template: 'Book {name} for logistics and transport services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'agriculture-farming', name: 'Agriculture & Farming', icon: '🌾', description: 'Farm produce, poultry, fish farming, agro-chemicals and farm equipment in Lagos',
      seo_title_template: '{name} - Agriculture & Farming in {area}, Lagos',
      seo_description_template: 'Find {name} for agriculture and farming products in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'printing-branding', name: 'Printing & Branding', icon: '🖨️', description: 'Printing press, signage, branding, gift items and embroidery in Lagos',
      seo_title_template: '{name} - Printing & Branding in {area}, Lagos',
      seo_description_template: 'Book {name} for printing and branding services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'laundry-dry-cleaning', name: 'Laundry & Dry Cleaning', icon: '👔', description: 'Laundry services, dry cleaners and ironing services in Lagos',
      seo_title_template: '{name} - Laundry & Dry Cleaning in {area}, Lagos',
      seo_description_template: 'Book {name} for laundry and dry cleaning services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'supermarkets-retail', name: 'Supermarkets & Retail', icon: '🛒', description: 'Supermarkets, mini marts, provision stores and wholesale in Lagos',
      seo_title_template: '{name} - Supermarkets & Retail in {area}, Lagos',
      seo_description_template: 'Visit {name} for supermarket and retail shopping in {area}, Lagos. Read reviews and see products.' },
    { slug: 'religious-spiritual', name: 'Religious & Spiritual', icon: '⛪', description: 'Churches, mosques, event halls and counselling services in Lagos',
      seo_title_template: '{name} - Religious & Spiritual in {area}, Lagos',
      seo_description_template: 'Find {name} for religious and spiritual services in {area}, Lagos. Read reviews and get directions.' },
    { slug: 'entertainment-leisure', name: 'Entertainment & Leisure', icon: '🎭', description: 'Lounges, clubs, game centres, cinemas and recreation in Lagos',
      seo_title_template: '{name} - Entertainment & Leisure in {area}, Lagos',
      seo_description_template: 'Visit {name} for entertainment and leisure in {area}, Lagos. Read reviews and get directions.' },
    { slug: 'childcare-parenting', name: 'Childcare & Parenting', icon: '👶', description: 'Crèches, daycare, children party services and baby stores in Lagos',
      seo_title_template: '{name} - Childcare & Parenting in {area}, Lagos',
      seo_description_template: 'Find {name} for childcare and parenting services in {area}, Lagos. Read reviews and get quotes.' },
    { slug: 'other', name: 'Other', icon: '📦', description: 'Other businesses and services in Lagos',
      seo_title_template: '{name} - Business in {area}, Lagos',
      seo_description_template: 'Find {name} in {area}, Lagos. Read reviews and get quotes.' },
  ]

  const parentCats = parentCategories.map(c => ({ id: makeId(), parent_id: null, ...c }))
  console.log(`\n📂 Creating ${parentCats.length} parent categories...`)
  const { error: catErr } = await supabase.from('categories').upsert(parentCats, { onConflict: 'slug' })
  if (catErr) { console.error('Category error:', catErr); return }
  console.log(`✅ ${parentCats.length} parent categories created`)

  const catMap: Record<string, string> = {}
  parentCats.forEach(c => { catMap[c.slug] = c.id })

  // Subcategories
  const subCategories = [
    // Fashion & Tailoring
    { slug: 'fashion-designers', name: 'Fashion Designers', icon: '✂️', parent_id: catMap['fashion-tailoring'], description: 'Custom fashion designers in Lagos' },
    { slug: 'tailors', name: 'Tailors', icon: '🧵', parent_id: catMap['fashion-tailoring'], description: 'Professional tailors in Lagos' },
    { slug: 'fabric-stores', name: 'Fabric Stores', icon: '🧶', parent_id: catMap['fashion-tailoring'], description: 'Fabric and textile stores in Lagos' },
    { slug: 'shoe-makers', name: 'Shoe Makers', icon: '👞', parent_id: catMap['fashion-tailoring'], description: 'Custom shoe makers in Lagos' },
    // Hair & Beauty
    { slug: 'hair-salons', name: 'Hair Salons', icon: '💇‍♀️', parent_id: catMap['hair-beauty'], description: 'Hair salons in Lagos' },
    { slug: 'barber-shops', name: 'Barber Shops', icon: '💈', parent_id: catMap['hair-beauty'], description: 'Barber shops in Lagos' },
    { slug: 'makeup-artists', name: 'Makeup Artists', icon: '💄', parent_id: catMap['hair-beauty'], description: 'Professional makeup artists in Lagos' },
    { slug: 'nail-studios', name: 'Nail Studios', icon: '💅', parent_id: catMap['hair-beauty'], description: 'Nail studios and technicians in Lagos' },
    // Events
    { slug: 'event-planners', name: 'Event Planners', icon: '📋', parent_id: catMap['events'], description: 'Event planners and coordinators in Lagos' },
    { slug: 'djs', name: 'DJs', icon: '🎧', parent_id: catMap['events'], description: 'DJs for hire in Lagos' },
    { slug: 'mcs', name: 'MCs', icon: '🎤', parent_id: catMap['events'], description: 'Masters of ceremony in Lagos' },
    { slug: 'decorators', name: 'Decorators', icon: '🎨', parent_id: catMap['events'], description: 'Event decorators in Lagos' },
    { slug: 'caterers', name: 'Caterers', icon: '🍲', parent_id: catMap['events'], description: 'Catering services in Lagos' },
    // Photography
    { slug: 'photographers', name: 'Photographers', icon: '📷', parent_id: catMap['photography'], description: 'Professional photographers in Lagos' },
    { slug: 'videographers', name: 'Videographers', icon: '🎥', parent_id: catMap['photography'], description: 'Professional videographers in Lagos' },
    { slug: 'photo-studios', name: 'Photo Studios', icon: '🖼️', parent_id: catMap['photography'], description: 'Photo studios in Lagos' },
    // Food & Dining
    { slug: 'restaurants', name: 'Restaurants', icon: '🍛', parent_id: catMap['food-dining'], description: 'Restaurants in Lagos' },
    { slug: 'cafes', name: 'Cafes', icon: '☕', parent_id: catMap['food-dining'], description: 'Cafes and coffee shops in Lagos' },
    { slug: 'fast-food', name: 'Fast Food', icon: '🍔', parent_id: catMap['food-dining'], description: 'Fast food restaurants in Lagos' },
    { slug: 'catering-services', name: 'Catering Services', icon: '🍽️', parent_id: catMap['food-dining'], description: 'Catering services in Lagos' },
    // Health & Wellness
    { slug: 'pharmacies', name: 'Pharmacies', icon: '💊', parent_id: catMap['health-wellness'], description: 'Pharmacies in Lagos' },
    { slug: 'gyms-fitness', name: 'Gyms & Fitness', icon: '🏋️', parent_id: catMap['health-wellness'], description: 'Gyms and fitness centres in Lagos' },
    { slug: 'spa-massage', name: 'Spa & Massage', icon: '💆', parent_id: catMap['health-wellness'], description: 'Spa and massage services in Lagos' },
    { slug: 'traditional-medicine', name: 'Traditional Medicine', icon: '🌿', parent_id: catMap['health-wellness'], description: 'Traditional medicine practitioners in Lagos' },
    { slug: 'opticians', name: 'Opticians', icon: '👓', parent_id: catMap['health-wellness'], description: 'Opticians and eye care in Lagos' },
    // Education & Training
    { slug: 'tutorial-centres', name: 'Tutorial Centres', icon: '📝', parent_id: catMap['education-training'], description: 'Tutorial and lesson centres in Lagos' },
    { slug: 'driving-schools', name: 'Driving Schools', icon: '🚗', parent_id: catMap['education-training'], description: 'Driving schools in Lagos' },
    { slug: 'computer-training', name: 'Computer Training', icon: '🖥️', parent_id: catMap['education-training'], description: 'Computer training centres in Lagos' },
    { slug: 'language-schools', name: 'Language Schools', icon: '🗣️', parent_id: catMap['education-training'], description: 'Language schools in Lagos' },
    { slug: 'vocational-training', name: 'Vocational Training', icon: '🔧', parent_id: catMap['education-training'], description: 'Vocational training centres in Lagos' },
    // Home Services
    { slug: 'plumbers', name: 'Plumbers', icon: '🔧', parent_id: catMap['home-services'], description: 'Plumbers in Lagos' },
    { slug: 'electricians', name: 'Electricians', icon: '⚡', parent_id: catMap['home-services'], description: 'Electricians in Lagos' },
    { slug: 'painters', name: 'Painters', icon: '🎨', parent_id: catMap['home-services'], description: 'House painters in Lagos' },
    { slug: 'cleaners', name: 'Cleaners', icon: '🧹', parent_id: catMap['home-services'], description: 'Cleaning services in Lagos' },
    { slug: 'ac-repair', name: 'AC Repair', icon: '❄️', parent_id: catMap['home-services'], description: 'Air conditioning repair in Lagos' },
    { slug: 'fumigation', name: 'Fumigation', icon: '🪲', parent_id: catMap['home-services'], description: 'Fumigation and pest control in Lagos' },
    // Auto Services
    { slug: 'mechanics', name: 'Mechanics', icon: '🔩', parent_id: catMap['auto-services'], description: 'Auto mechanics in Lagos' },
    { slug: 'car-wash', name: 'Car Wash', icon: '🚿', parent_id: catMap['auto-services'], description: 'Car wash services in Lagos' },
    { slug: 'auto-electricians', name: 'Auto Electricians', icon: '🔌', parent_id: catMap['auto-services'], description: 'Auto electricians in Lagos' },
    { slug: 'panel-beaters', name: 'Panel Beaters', icon: '🔨', parent_id: catMap['auto-services'], description: 'Panel beaters in Lagos' },
    { slug: 'tyre-services', name: 'Tyre Services', icon: '🛞', parent_id: catMap['auto-services'], description: 'Tyre services and vulcanizers in Lagos' },
    { slug: 'towing-services', name: 'Towing Services', icon: '🚛', parent_id: catMap['auto-services'], description: 'Towing services in Lagos' },
    // Technology & IT
    { slug: 'phone-repair', name: 'Phone Repair', icon: '📱', parent_id: catMap['technology-it'], description: 'Phone repair services in Lagos' },
    { slug: 'computer-repair', name: 'Computer Repair', icon: '💻', parent_id: catMap['technology-it'], description: 'Computer repair services in Lagos' },
    { slug: 'web-design', name: 'Web Design', icon: '🌐', parent_id: catMap['technology-it'], description: 'Web design and development in Lagos' },
    { slug: 'cctv-installation', name: 'CCTV Installation', icon: '📹', parent_id: catMap['technology-it'], description: 'CCTV installation services in Lagos' },
    { slug: 'networking', name: 'Networking', icon: '🔗', parent_id: catMap['technology-it'], description: 'Network installation and support in Lagos' },
    // Real Estate
    { slug: 'estate-agents', name: 'Estate Agents', icon: '🏠', parent_id: catMap['real-estate'], description: 'Estate agents in Lagos' },
    { slug: 'property-management', name: 'Property Management', icon: '🏢', parent_id: catMap['real-estate'], description: 'Property management companies in Lagos' },
    { slug: 'short-let-apartments', name: 'Short-Let Apartments', icon: '🛏️', parent_id: catMap['real-estate'], description: 'Short-let apartments in Lagos' },
    { slug: 'land-agents', name: 'Land Agents', icon: '📐', parent_id: catMap['real-estate'], description: 'Land agents and surveyors in Lagos' },
    // Legal & Finance
    { slug: 'lawyers', name: 'Lawyers', icon: '⚖️', parent_id: catMap['legal-finance'], description: 'Lawyers and law firms in Lagos' },
    { slug: 'accountants', name: 'Accountants', icon: '📊', parent_id: catMap['legal-finance'], description: 'Accountants in Lagos' },
    { slug: 'tax-consultants', name: 'Tax Consultants', icon: '🧾', parent_id: catMap['legal-finance'], description: 'Tax consultants in Lagos' },
    { slug: 'insurance-agents', name: 'Insurance Agents', icon: '🛡️', parent_id: catMap['legal-finance'], description: 'Insurance agents in Lagos' },
    { slug: 'microfinance', name: 'Microfinance', icon: '💰', parent_id: catMap['legal-finance'], description: 'Microfinance banks in Lagos' },
    // Logistics & Transport
    { slug: 'dispatch-riders', name: 'Dispatch Riders', icon: '🏍️', parent_id: catMap['logistics-transport'], description: 'Dispatch riders in Lagos' },
    { slug: 'moving-services', name: 'Moving Services', icon: '📦', parent_id: catMap['logistics-transport'], description: 'Moving and relocation services in Lagos' },
    { slug: 'haulage', name: 'Haulage', icon: '🚛', parent_id: catMap['logistics-transport'], description: 'Haulage and trucking services in Lagos' },
    { slug: 'courier-services', name: 'Courier Services', icon: '📬', parent_id: catMap['logistics-transport'], description: 'Courier and delivery services in Lagos' },
    // Agriculture & Farming
    { slug: 'farm-produce', name: 'Farm Produce', icon: '🥬', parent_id: catMap['agriculture-farming'], description: 'Farm produce suppliers in Lagos' },
    { slug: 'poultry', name: 'Poultry', icon: '🐔', parent_id: catMap['agriculture-farming'], description: 'Poultry farms in Lagos' },
    { slug: 'fish-farming', name: 'Fish Farming', icon: '🐟', parent_id: catMap['agriculture-farming'], description: 'Fish farms in Lagos' },
    { slug: 'agro-chemicals', name: 'Agro-chemicals', icon: '🧪', parent_id: catMap['agriculture-farming'], description: 'Agro-chemical suppliers in Lagos' },
    { slug: 'farm-equipment', name: 'Farm Equipment', icon: '🚜', parent_id: catMap['agriculture-farming'], description: 'Farm equipment suppliers in Lagos' },
    // Printing & Branding
    { slug: 'printing-press', name: 'Printing Press', icon: '🖨️', parent_id: catMap['printing-branding'], description: 'Printing press services in Lagos' },
    { slug: 'signage', name: 'Signage', icon: '🪧', parent_id: catMap['printing-branding'], description: 'Signage and sign makers in Lagos' },
    { slug: 'branding-services', name: 'Branding', icon: '🎯', parent_id: catMap['printing-branding'], description: 'Branding services in Lagos' },
    { slug: 'gift-items', name: 'Gift Items', icon: '🎁', parent_id: catMap['printing-branding'], description: 'Gift items and souvenirs in Lagos' },
    { slug: 'embroidery', name: 'Embroidery', icon: '🧵', parent_id: catMap['printing-branding'], description: 'Embroidery services in Lagos' },
    // Laundry & Dry Cleaning
    { slug: 'laundry-services', name: 'Laundry Services', icon: '🧺', parent_id: catMap['laundry-dry-cleaning'], description: 'Laundry services in Lagos' },
    { slug: 'dry-cleaners', name: 'Dry Cleaners', icon: '👔', parent_id: catMap['laundry-dry-cleaning'], description: 'Dry cleaning services in Lagos' },
    { slug: 'ironing-services', name: 'Ironing Services', icon: '♨️', parent_id: catMap['laundry-dry-cleaning'], description: 'Ironing services in Lagos' },
    // Supermarkets & Retail
    { slug: 'supermarkets', name: 'Supermarkets', icon: '🏪', parent_id: catMap['supermarkets-retail'], description: 'Supermarkets in Lagos' },
    { slug: 'mini-marts', name: 'Mini Marts', icon: '🛍️', parent_id: catMap['supermarkets-retail'], description: 'Mini marts in Lagos' },
    { slug: 'provision-stores', name: 'Provision Stores', icon: '🧴', parent_id: catMap['supermarkets-retail'], description: 'Provision stores in Lagos' },
    { slug: 'wholesale', name: 'Wholesale', icon: '📦', parent_id: catMap['supermarkets-retail'], description: 'Wholesale stores in Lagos' },
    // Religious & Spiritual
    { slug: 'churches', name: 'Churches', icon: '⛪', parent_id: catMap['religious-spiritual'], description: 'Churches in Lagos' },
    { slug: 'mosques', name: 'Mosques', icon: '🕌', parent_id: catMap['religious-spiritual'], description: 'Mosques in Lagos' },
    { slug: 'event-halls', name: 'Event Halls', icon: '🏛️', parent_id: catMap['religious-spiritual'], description: 'Event halls and venues in Lagos' },
    { slug: 'counselling', name: 'Counselling', icon: '🤝', parent_id: catMap['religious-spiritual'], description: 'Counselling services in Lagos' },
    // Entertainment & Leisure
    { slug: 'lounges', name: 'Lounges', icon: '🍸', parent_id: catMap['entertainment-leisure'], description: 'Lounges in Lagos' },
    { slug: 'clubs', name: 'Clubs', icon: '🎶', parent_id: catMap['entertainment-leisure'], description: 'Night clubs in Lagos' },
    { slug: 'game-centres', name: 'Game Centres', icon: '🎮', parent_id: catMap['entertainment-leisure'], description: 'Game centres in Lagos' },
    { slug: 'cinemas', name: 'Cinemas', icon: '🎬', parent_id: catMap['entertainment-leisure'], description: 'Cinemas in Lagos' },
    { slug: 'recreation', name: 'Recreation', icon: '🎡', parent_id: catMap['entertainment-leisure'], description: 'Recreation centres in Lagos' },
    // Childcare & Parenting
    { slug: 'creches', name: 'Crèches', icon: '🍼', parent_id: catMap['childcare-parenting'], description: 'Crèches in Lagos' },
    { slug: 'daycare', name: 'Daycare', icon: '👶', parent_id: catMap['childcare-parenting'], description: 'Daycare centres in Lagos' },
    { slug: 'childrens-party', name: "Children's Party", icon: '🎈', parent_id: catMap['childcare-parenting'], description: 'Children party services in Lagos' },
    { slug: 'baby-stores', name: 'Baby Stores', icon: '🧸', parent_id: catMap['childcare-parenting'], description: 'Baby stores in Lagos' },
  ]

  const subCats = subCategories.map(c => ({ id: makeId(), seo_title_template: null, seo_description_template: null, ...c }))
  console.log(`\n📁 Creating ${subCats.length} subcategories...`)
  const { error: subCatErr } = await supabase.from('categories').upsert(subCats, { onConflict: 'slug' })
  if (subCatErr) { console.error('Subcategory error:', subCatErr); return }
  console.log(`✅ ${subCats.length} subcategories created`)

  subCats.forEach(c => { catMap[c.slug] = c.id })

  // ============================================================
  // 4. LANDMARKS (18 key Lagos landmarks)
  // ============================================================
  const landmarksData = [
    // Shopping
    { slug: 'palms-shopping-mall-lekki', name: 'Palms Shopping Mall', area_id: areaMap['lekki'], lat: 6.4312, lon: 3.4275, type: 'mall', radius_km: 3, aliases: ['The Palms Lekki', 'Palms Mall'], description: 'Major shopping mall in Lekki Phase 1' },
    { slug: 'ikeja-city-mall', name: 'Ikeja City Mall', area_id: areaMap['ikeja'], lat: 6.6018, lon: 3.3420, type: 'mall', radius_km: 3, aliases: ['ICM', 'Ikeja Mall'], description: 'Largest mall in Ikeja' },
    { slug: 'the-palms-vi', name: 'The Palms Victoria Island', area_id: areaMap['victoria-island'], lat: 6.4281, lon: 3.4219, type: 'mall', radius_km: 2, aliases: ['Palms VI', 'The Palms Shopping Centre'], description: 'Premium shopping centre on Victoria Island' },
    { slug: 'circle-mall-lekki', name: 'Circle Mall', area_id: areaMap['lekki'], lat: 6.4440, lon: 3.5310, type: 'mall', radius_km: 3, aliases: ['Circle Mall Lekki'], description: 'Shopping mall along Lekki-Epe Expressway' },
    // Markets
    { slug: 'balogun-market', name: 'Balogun Market', area_id: areaMap['lagos-island'], lat: 6.4500, lon: 3.3900, type: 'market', radius_km: 2, aliases: ['Balogun', 'Lagos Island Market'], description: 'Largest textile and general market in Lagos' },
    { slug: 'computer-village-ikeja', name: 'Computer Village', area_id: areaMap['ikeja'], lat: 6.5950, lon: 3.3450, type: 'market', radius_km: 2, aliases: ['Computer Village', 'CV Ikeja'], description: 'Largest technology market in West Africa' },
    { slug: 'alaba-international-market', name: 'Alaba International Market', area_id: areaMap['ojo'], lat: 6.4650, lon: 3.1900, type: 'market', radius_km: 3, aliases: ['Alaba Market', 'Alaba'], description: 'Major electronics market in Lagos' },
    // Hotels
    { slug: 'eko-hotel-vi', name: 'Eko Hotel & Suites', area_id: areaMap['victoria-island'], lat: 6.4253, lon: 3.4197, type: 'hotel', radius_km: 2, aliases: ['Eko Hotel', 'Eko Hotels'], description: 'Premier luxury hotel on Victoria Island' },
    { slug: 'federal-palace-hotel', name: 'Federal Palace Hotel', area_id: areaMap['victoria-island'], lat: 6.4280, lon: 3.4150, type: 'hotel', radius_km: 2, aliases: ['Federal Palace', 'FPH'], description: 'Historic luxury hotel on Victoria Island' },
    { slug: 'radisson-blu-ikeja', name: 'Radisson Blu Ikeja', area_id: areaMap['ikeja'], lat: 6.5950, lon: 3.3400, type: 'hotel', radius_km: 2, aliases: ['Radisson Ikeja', 'Radisson Blu Lagos'], description: 'International hotel near Ikeja GRA' },
    // Universities
    { slug: 'unilag-akoka', name: 'University of Lagos', area_id: areaMap['yaba'], lat: 6.5158, lon: 3.3890, type: 'university', radius_km: 3, aliases: ['UNILAG', 'Unilag Akoka'], description: 'Premier university in Lagos, Akoka campus' },
    { slug: 'lasu-ojo', name: 'Lagos State University', area_id: areaMap['ojo'], lat: 6.4667, lon: 3.2000, type: 'university', radius_km: 3, aliases: ['LASU', 'Lagos State Uni'], description: 'State university in Ojo' },
    { slug: 'yabatech', name: 'Yaba College of Technology', area_id: areaMap['yaba'], lat: 6.5180, lon: 3.3750, type: 'university', radius_km: 2, aliases: ['Yabatech', 'YCT', 'Yaba Tech'], description: 'Premier polytechnic in Lagos' },
    // Hospitals
    { slug: 'luth-idi-araba', name: 'Lagos University Teaching Hospital', area_id: areaMap['surulere'], lat: 6.5100, lon: 3.3550, type: 'hospital', radius_km: 3, aliases: ['LUTH', 'Idi-Araba Hospital'], description: 'Major teaching hospital in Idi-Araba' },
    { slug: 'lagos-island-general-hospital', name: 'Lagos Island General Hospital', area_id: areaMap['lagos-island'], lat: 6.4550, lon: 3.3950, type: 'hospital', radius_km: 2, aliases: ['General Hospital Lagos Island', 'LIGH'], description: 'General hospital on Lagos Island' },
    // Transport
    { slug: 'murtala-muhammed-airport', name: 'Murtala Muhammed International Airport', area_id: areaMap['ikeja'], lat: 6.5774, lon: 3.3212, type: 'transport', radius_km: 5, aliases: ['Lagos Airport', 'MMA', 'MMIA', 'Ikeja Airport'], description: 'Main international airport serving Lagos' },
    { slug: 'jibowu-bus-terminal', name: 'Jibowu Bus Terminal', area_id: areaMap['yaba'], lat: 6.5200, lon: 3.3750, type: 'transport', radius_km: 2, aliases: ['Jibowu Terminal', 'Jibowu BRT'], description: 'Major bus terminal in Yaba' },
    // Business
    { slug: 'broad-street-lagos', name: 'Broad Street', area_id: areaMap['lagos-island'], lat: 6.4510, lon: 3.3920, type: 'business', radius_km: 2, aliases: ['Broad Street', 'Marina Area'], description: 'Historic business district on Lagos Island' },
  ]

  const landmarks = landmarksData.map(l => ({ id: makeId(), city_id: lagosId, ...l }))
  console.log(`\n🏛️ Creating ${landmarks.length} landmarks...`)
  const { error: landmarkErr } = await supabase.from('landmarks').upsert(landmarks, { onConflict: 'slug' })
  if (landmarkErr) { console.error('Landmark error:', landmarkErr); return }
  console.log(`✅ ${landmarks.length} landmarks created`)

  // ============================================================
  // 5. SAMPLE BUSINESSES (10 sample businesses across categories)
  // ============================================================
  const now = new Date().toISOString()
  const businessesData = [
    { slug: 'adire-lounge-lekki', name: 'Adire Lounge', description: 'Premium adire and ankara fashion house specializing in modern African designs', category_id: catMap['fashion-designers'], area_id: areaMap['lekki'], address: '12 Admiralty Way, Lekki Phase 1', lat: 6.4400, lon: 3.4750, phone: '+234 801 234 5678', whatsapp: '+234 801 234 5678', tier: 'pro', verified: true },
    { slug: 'kings-cut-barbers-ikeja', name: "King's Cut Barbers", description: 'Premium barbershop offering classic and modern cuts for men', category_id: catMap['barber-shops'], area_id: areaMap['ikeja'], address: '45 Allen Avenue, Ikeja', lat: 6.5950, lon: 3.3500, phone: '+234 802 345 6789', whatsapp: '+234 802 345 6789', tier: 'starter', verified: true },
    { slug: 'glam-studio-vi', name: 'Glam Studio', description: 'Full-service beauty salon and makeup studio on Victoria Island', category_id: catMap['makeup-artists'], area_id: areaMap['victoria-island'], address: '8 Adeola Odeku Street, VI', lat: 6.4300, lon: 3.4200, phone: '+234 803 456 7890', whatsapp: '+234 803 456 7890', tier: 'premium', verified: true },
    { slug: 'naija-events-hub-surulere', name: 'Naija Events Hub', description: 'Full-service event planning company for weddings, birthdays and corporate events', category_id: catMap['event-planners'], area_id: areaMap['surulere'], address: '22 Adeniran Ogunsanya Street, Surulere', lat: 6.5000, lon: 3.3550, phone: '+234 804 567 8901', whatsapp: '+234 804 567 8901', tier: 'pro', verified: true },
    { slug: 'lens-masters-photography-yaba', name: 'Lens Masters Photography', description: 'Professional photography studio for portraits, events and commercial shoots', category_id: catMap['photographers'], area_id: areaMap['yaba'], address: '15 Herbert Macaulay Way, Yaba', lat: 6.5100, lon: 3.3800, phone: '+234 805 678 9012', whatsapp: '+234 805 678 9012', tier: 'starter', verified: true },
    { slug: 'mama-nkechi-kitchen-festac', name: "Mama Nkechi's Kitchen", description: 'Authentic Nigerian cuisine restaurant serving local delicacies', category_id: catMap['restaurants'], area_id: areaMap['festac'], address: '3 2nd Avenue, Festac Town', lat: 6.4667, lon: 3.2850, phone: '+234 806 789 0123', whatsapp: '+234 806 789 0123', tier: 'free', verified: false },
    { slug: 'dj-spinall-entertainment', name: 'DJ Spinall Entertainment', description: 'Professional DJ services for weddings, parties and corporate events', category_id: catMap['djs'], area_id: areaMap['lekki'], address: 'Lekki Phase 1', lat: 6.4500, lon: 3.4800, phone: '+234 807 890 1234', whatsapp: '+234 807 890 1234', tier: 'pro', verified: true },
    { slug: 'stitch-perfect-tailoring-maryland', name: 'Stitch Perfect Tailoring', description: 'Expert tailoring for native and English wear, specializing in agbada and suits', category_id: catMap['tailors'], area_id: areaMap['maryland'], address: '10 Mobolaji Bank Anthony Way, Maryland', lat: 6.5650, lon: 3.3700, phone: '+234 808 901 2345', whatsapp: '+234 808 901 2345', tier: 'starter', verified: true },
    { slug: 'brew-haven-cafe-ikoyi', name: 'Brew Haven Cafe', description: 'Artisan coffee shop and brunch spot in the heart of Ikoyi', category_id: catMap['cafes'], area_id: areaMap['ikoyi'], address: '5 Bourdillon Road, Ikoyi', lat: 6.4500, lon: 3.4350, phone: '+234 809 012 3456', whatsapp: '+234 809 012 3456', tier: 'pro', verified: true },
    { slug: 'nails-by-temi-ajah', name: 'Nails by Temi', description: 'Luxury nail studio offering manicures, pedicures and nail art', category_id: catMap['nail-studios'], area_id: areaMap['ajah'], address: 'Abraham Adesanya, Ajah', lat: 6.4700, lon: 3.5700, phone: '+234 810 123 4567', whatsapp: '+234 810 123 4567', tier: 'free', verified: false },
  ]

  const businesses = businessesData.map(b => ({
    id: makeId(),
    city_id: lagosId,
    email: null,
    website: null,
    user_id: null,
    active: true,
    created_at: now,
    updated_at: now,
    ...b
  }))
  console.log(`\n🏪 Creating ${businesses.length} sample businesses...`)
  const { error: bizErr } = await supabase.from('businesses').upsert(businesses, { onConflict: 'slug' })
  if (bizErr) { console.error('Business error:', bizErr); return }
  console.log(`✅ ${businesses.length} businesses created`)

  // ============================================================
  // 6. BUSINESS HOURS (for verified businesses)
  // ============================================================
  const hoursData: Array<{ id: string; business_id: string; day: number; open_time: string | null; close_time: string | null; closed: boolean }> = []
  businesses.filter(b => b.verified).forEach(biz => {
    for (let day = 0; day <= 6; day++) {
      hoursData.push({
        id: makeId(),
        business_id: biz.id,
        day,
        open_time: day === 0 ? null : '09:00',
        close_time: day === 0 ? null : '18:00',
        closed: day === 0,
      })
    }
  })
  console.log(`\n🕐 Creating ${hoursData.length} business hours...`)
  const { error: hoursErr } = await supabase.from('business_hours').upsert(hoursData)
  if (hoursErr) { console.error('Hours error:', hoursErr); return }
  console.log(`✅ ${hoursData.length} business hours created`)

  // ============================================================
  // 7. SAMPLE REVIEWS
  // ============================================================
  const reviewsData = [
    { business_id: businesses[0].id, rating: 5, text: 'Amazing adire designs! The quality is top-notch and delivery was prompt.' },
    { business_id: businesses[0].id, rating: 4, text: 'Beautiful work, but took a bit longer than expected.' },
    { business_id: businesses[1].id, rating: 5, text: 'Best barber in Ikeja! Clean cuts every time.' },
    { business_id: businesses[2].id, rating: 5, text: 'My go-to makeup artist for events. Always flawless!' },
    { business_id: businesses[3].id, rating: 4, text: 'Great event planning service. They handled everything perfectly.' },
    { business_id: businesses[4].id, rating: 5, text: 'Incredible photography! The photos came out stunning.' },
    { business_id: businesses[5].id, rating: 4, text: 'Delicious jollof rice and pounded yam. Very authentic.' },
    { business_id: businesses[8].id, rating: 5, text: 'Best coffee in Ikoyi! Love the ambiance too.' },
  ]

  const reviews = reviewsData.map(r => ({
    id: makeId(),
    user_id: null,
    verified_booking: false,
    created_at: now,
    ...r
  }))
  console.log(`\n⭐ Creating ${reviews.length} reviews...`)
  const { error: reviewErr } = await supabase.from('reviews').upsert(reviews)
  if (reviewErr) { console.error('Review error:', reviewErr); return }
  console.log(`✅ ${reviews.length} reviews created`)

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n' + '='.repeat(50))
  console.log('🎉 Seeding complete!')
  console.log(`  📍 1 city (Lagos)`)
  console.log(`  🏘️ ${areas.length} areas`)
  console.log(`  📂 ${parentCats.length + subCats.length} categories (${parentCats.length} parent + ${subCats.length} sub)`)
  console.log(`  🏛️ ${landmarks.length} landmarks`)
  console.log(`  🏪 ${businesses.length} businesses`)
  console.log(`  🕐 ${hoursData.length} business hours`)
  console.log(`  ⭐ ${reviews.length} reviews`)
  console.log('='.repeat(50))
}

seed().catch(console.error)
