// Database entity types for MyHustle.com

export interface City {
  id: string
  slug: string
  name: string
  state: string
  country: string
  lat: number
  lon: number
}

export interface Area {
  id: string
  slug: string
  name: string
  city_id: string
  lat: number
  lon: number
  description: string | null
  city?: City
  landmarks?: Landmark[]
  businesses?: Business[]
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  parent_id: string | null
  icon: string | null
  seo_title_template: string | null
  seo_description_template: string | null
  parent?: Category | null
  children?: Category[]
  businesses?: Business[]
}

export interface Landmark {
  id: string
  slug: string
  name: string
  city_id: string
  area_id: string | null
  lat: number
  lon: number
  type: string
  radius_km: number
  aliases: string[]
  description: string | null
  city?: City
  area?: Area
}

export interface Business {
  id: string
  slug: string
  name: string
  description: string | null
  category_id: string
  city_id: string
  area_id: string | null
  address: string | null
  lat: number | null
  lon: number | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  website: string | null
  tier: string
  verified: boolean
  verification_tier: number
  verification_phone: string | null
  verification_date: string | null
  active: boolean
  user_id: string | null
  created_at: string
  updated_at: string
  category?: Category
  city?: City
  area?: Area
  reviews?: Review[]
  hours?: BusinessHour[]
  photos?: BusinessPhoto[]
}

export interface Review {
  id: string
  business_id: string
  user_id: string | null
  rating: number
  text: string | null
  reviewer_name: string | null
  photos: string[]
  booking_id: string | null
  is_verified_booking: boolean
  verified_booking: boolean // legacy compat
  status: 'published' | 'flagged' | 'hidden'
  helpful_count: number
  created_at: string
  business?: Business
  response?: ReviewResponse | null
}

export interface ReviewResponse {
  id: string
  review_id: string
  business_id: string
  response_text: string
  created_at: string
}

export interface ReviewFormData {
  rating: number
  text: string
  reviewer_name: string
  photos: File[]
  business_id: string
}

export interface Booking {
  id: string
  business_id: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  service: string | null
  date: string
  time: string | null
  status: string
  source: string
  notes: string | null
  created_at: string
}

export interface BusinessHour {
  id: string
  business_id: string
  day: number
  open_time: string | null
  close_time: string | null
  closed: boolean
}

export interface BusinessPhoto {
  id: string
  business_id: string
  url: string
  alt_text: string | null
  reviewer_name: string | null
  position: number
  is_cover: boolean
}


export type VerificationTier = 0 | 1 | 2 | 3

export interface VerificationRequest {
  id: string
  business_id: string
  requested_tier: number
  status: string
  submitted_at: string
  reviewed_at: string | null
  reviewer_notes: string | null
  phone_number: string | null
  otp_verified: boolean
  document_type: string | null
  document_url: string | null
  business_name_on_doc: string | null
  registration_number: string | null
  video_call_date: string | null
  video_call_screenshots: string[] | null
  video_call_notes: string | null
  verified_address: string | null
}

// Helper type for business with all relations loaded
export interface BusinessWithRelations extends Business {
  category: Category
  area: Area
  reviews: Review[]
  hours: BusinessHour[]
  photos: BusinessPhoto[]
}

// Helper for category with children
export interface CategoryWithChildren extends Category {
  children: Category[]
  business_count?: number
}

// Helper for area with counts
export interface AreaWithCount extends Area {
  business_count?: number
}

// Voice Receptionist types
export interface VoiceMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface VoiceChatRequest {
  businessId: string;
  message: string;
  conversationHistory: VoiceMessage[];
}

export interface VoiceChatResponse {
  response: string;
  error?: string;
}
