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
  verified_booking: boolean
  created_at: string
  business?: Business
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
  position: number
  is_cover: boolean
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
