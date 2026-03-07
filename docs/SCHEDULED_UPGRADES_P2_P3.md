# MyHustle.com — Scheduled Future Upgrades
# Priorities 2 & 3 with Activation Triggers
# Created: 2026-03-07
# Status: PLANNED — Do NOT implement until triggers are met

---

## How This Works

Each upgrade has a **specific, measurable trigger condition**. When the condition is met,
the upgrade moves from PLANNED → READY TO BUILD. This prevents premature optimization
and ensures every feature serves real, validated user needs.

**Review cadence:** Check triggers weekly during Phase 0 beta, bi-weekly after launch.

---

## PRIORITY 2: Engagement & Personality
*Theme: Make listings feel alive and human, like Facebook pages*

### 2A. Social Proof Widgets
**What:** Real-time activity feed showing "Adire Lounge just got a new booking" / "5 people viewed Bella's Salon today" / "New review for DJ Spinall Events"
**Where:** Homepage sidebar, city pages, individual listing pages
**Why:** Facebook pages feel alive because of visible activity. MyHustle listings feel static.

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Total bookings across platform | ≥ 50 bookings/week |
| **Secondary** | Active businesses with ≥1 booking | ≥ 20 businesses |
| **Validation** | User feedback requesting "more activity" | ≥ 3 mentions |

**Implementation estimate:** 1-2 days
**Dependencies:** Analytics tracking must be active, sufficient booking volume to avoid showing stale data
**Risk if built too early:** Empty activity feeds ("Last booking: 3 weeks ago") damage credibility worse than no widget

---

### 2B. Business Stories / Updates Feed
**What:** Allow business owners to post updates, promotions, new arrivals, and behind-the-scenes content directly on their listing page (like Facebook posts on a business page)
**Where:** New "Updates" tab on business detail pages, dashboard posting interface
**Why:** Facebook pages thrive on fresh content. Static listings get stale.

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Active business owners logging into dashboard | ≥ 30 businesses/week |
| **Secondary** | Average dashboard session duration | ≥ 3 minutes |
| **Validation** | Business owners asking "how do I post updates?" | ≥ 5 requests |

**Implementation estimate:** 2-3 days
**Dependencies:** New `business_updates` table, image upload to Supabase Storage, moderation workflow
**Risk if built too early:** Empty update feeds on every listing; business owners not engaged enough to post

---

### 2C. Nigerian Personality Injection
**What:** Add culturally resonant micro-copy, seasonal greetings, and local flavor throughout the platform
**Examples:**
- Search empty state: "No wahala! Try a different search" → "This area dey come up! Suggest a business"
- Seasonal: Eid, Christmas, Independence Day themed banners
- Category headers: "Fashion & Tailoring — Where Style Meets Skill 🧵"
- Area descriptions: "Lekki — Where Lagos Hustlers Build Their Dreams"

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Total registered businesses | ≥ 100 listings |
| **Secondary** | Monthly unique visitors | ≥ 1,000 |
| **Validation** | Brand voice established through beta feedback | Positive sentiment on tone |

**Implementation estimate:** 1 day (copy changes only, no new features)
**Dependencies:** Validated brand voice from Phase 0 beta feedback
**Risk if built too early:** Tone may not resonate; better to test with real users first

---

### 2D. Review Incentive System
**What:** Prompt customers to leave reviews after bookings, with gentle nudges and optional incentives
**Mechanics:**
- Auto-send WhatsApp message 24hrs after booking: "How was your experience at [Business]? Leave a quick review!"
- "Verified Booking" badge on reviews from actual bookings
- Monthly "Top Reviewer" recognition
- Business owners can respond to reviews (already built in Priority 1)

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Completed bookings with no review | ≥ 70% of bookings have no review |
| **Secondary** | Total reviews across platform | < 50 total reviews |
| **Validation** | Businesses requesting "more reviews" | ≥ 5 requests |

**Implementation estimate:** 2 days
**Dependencies:** WhatsApp Business API or manual message templates, booking completion tracking
**Risk if built too early:** Annoying users who haven't had enough bookings; fake review risk without volume

---

## PRIORITY 3: Growth & Retention
*Theme: Give businesses reasons to stay active and bring others*

### 3A. Business Analytics Sharing
**What:** Allow business owners to see and share their listing performance — views, calls, WhatsApp clicks, bookings, search appearances
**Where:** Enhanced dashboard analytics (basic version already built), shareable "stats card" image
**Why:** Facebook shows page owners their reach. This creates ownership and pride.

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Businesses with ≥10 profile views/week | ≥ 15 businesses |
| **Secondary** | Dashboard login frequency | ≥ 40% of businesses log in monthly |
| **Validation** | Business owners asking about their stats | ≥ 5 inquiries |

**Implementation estimate:** 2 days (shareable card generation + enhanced dashboard)
**Dependencies:** Analytics tracking collecting sufficient data, enough traffic to show meaningful numbers
**Risk if built too early:** Showing "0 views, 0 calls" demoralizes business owners

---

### 3B. Community Features ("The Market Square")
**What:** Discussion forum / Q&A section where business owners and customers interact
**Sections:**
- Business Tips & Advice
- Looking For (customers post what they need)
- Promotions & Deals
- Area-specific discussions
**Why:** Facebook Groups drive retention. A community keeps users coming back.

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Total registered users (business + consumer) | ≥ 500 users |
| **Secondary** | Monthly active users | ≥ 200 |
| **Tertiary** | WhatsApp group activity (if created) | ≥ 50 messages/week |
| **Validation** | Users requesting community features | ≥ 10 requests |

**Implementation estimate:** 5-7 days (significant feature)
**Dependencies:** User authentication for consumers (not just business owners), moderation system, content policies
**Risk if built too early:** Ghost town forum is worse than no forum; need critical mass first

---

### 3C. Content Marketing Engine
**What:** Auto-generated and curated content to drive SEO traffic and engagement
**Content types:**
- "Best [Category] in [Area]" listicles (auto-generated from top-rated businesses)
- "Business Spotlight" interviews with top-performing listings
- "Area Guide" content for each neighborhood
- Seasonal guides ("Best Event Vendors for December Parties")
**Why:** Facebook has the News Feed. MyHustle needs content that brings people back.

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Organic search traffic | ≥ 500 visits/month from Google |
| **Secondary** | Businesses per category | ≥ 5 businesses in ≥ 10 categories |
| **Validation** | Search Console showing content gap opportunities | Identified ≥ 20 target keywords |

**Implementation estimate:** 3-4 days (template system + first batch)
**Dependencies:** Sufficient business data for meaningful listicles, Google Search Console access
**Risk if built too early:** "Best Fashion in Lekki" with only 2 listings looks thin

---

### 3D. Referral Program
**What:** Business owners earn rewards for referring other businesses to list on MyHustle
**Mechanics:**
- Unique referral link per business owner
- Reward: 1 month free Starter tier for every 3 successful referrals
- Leaderboard: "Top Referrers This Month"
- WhatsApp-shareable referral cards
**Why:** Facebook grew through network effects. MyHustle needs business owners recruiting other businesses.

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Organic business signups (without referral) | ≥ 10/week |
| **Secondary** | Business owner satisfaction score | ≥ 7/10 average |
| **Validation** | Business owners voluntarily recommending platform | ≥ 5 organic referrals observed |

**Implementation estimate:** 3 days
**Dependencies:** Paid tier system active, referral tracking infrastructure, reward fulfillment process
**Risk if built too early:** Incentivizing referrals before product-market fit wastes resources and creates low-quality listings

---

## Trigger Monitoring Checklist

Review weekly during beta, bi-weekly post-launch:

| Upgrade | Key Trigger | Current Value | Target | Status |
|---------|-------------|---------------|--------|--------|
| 2A Social Proof | Bookings/week | 0 | 50 | ⏳ WAITING |
| 2B Business Stories | Active dashboard users/week | 0 | 30 | ⏳ WAITING |
| 2C Nigerian Personality | Total listings | 16 (seed) | 100 | ⏳ WAITING |
| 2D Review Incentives | Bookings without reviews | N/A | 70%+ | ⏳ WAITING |
| 3A Analytics Sharing | Businesses with 10+ views/week | 0 | 15 | ⏳ WAITING |
| 3B Community Forum | Total registered users | 0 | 500 | ⏳ WAITING |
| 3C Content Marketing | Organic search visits/month | 0 | 500 | ⏳ WAITING |
| 3D Referral Program | Organic signups/week | 0 | 10 | ⏳ WAITING |
| 4A Area Maps | Businesses per area (top 5 areas) | ~2 | 8 in 5+ areas | ⏳ WAITING |
| 4B City Overview Map | Populated areas per city | ~10 | 10 with 5+ biz | ⏳ WAITING |
| 4C Business Detail Map | Businesses with coordinates | 0% | 70% geocoded | ⏳ WAITING |
| 4D Near Me Search | Total active businesses | 16 | 500 | ⏳ WAITING |

---

## Implementation Order (When Triggers Fire)

Expected activation sequence based on typical growth patterns:

1. **2C Nigerian Personality** — Likely first (100 listings achievable in weeks)
2. **2D Review Incentives** — Second (once bookings start flowing)
3. **2A Social Proof** — Third (needs booking volume)
4. **3A Analytics Sharing** — Fourth (needs traffic data)
5. **2B Business Stories** — Fifth (needs engaged business owners)
6. **3C Content Marketing** — Sixth (needs SEO traction)
7. **3D Referral Program** — Seventh (needs proven value)
8. **3B Community Forum** — Eighth (needs critical mass)
9. **4A Area Maps** — Ninth (needs geographic density, ~200 listings)
10. **4B City Overview Map** — Tenth (builds on 4A, needs 150+ per city)
11. **4C Business Detail Map** — Eleventh (needs verified coordinates)
12. **4D Near Me Search** — Last (needs 500+ listings with strong spread)

---

## Notes

- Multiple triggers can fire simultaneously — prioritize by implementation speed and impact
- Each upgrade should be QA'd on mobile before deployment (70%+ of Nigerian web traffic is mobile)
- All new features must maintain the "Street-Smart Friend" brand voice
- Database migrations should be created alongside each feature
- Commit to GitHub and verify Vercel deployment after each upgrade

---

## PRIORITY 4: Interactive Maps
*Theme: Visual discovery layer — show businesses on a map for location-based browsing*

### Why Maps Are Deferred

Maps are a **UX enhancement, not an SEO asset**. Google cannot index JavaScript-rendered map content,
and map libraries add significant bundle size (~40-80KB) that harms Core Web Vitals scores.
With only 16 seed businesses across 3 cities, maps would show mostly empty space — damaging
credibility worse than having no map at all.

**Maps become valuable when:** There's enough geographic density that a user can zoom into
an area and see multiple pins clustered together, making visual discovery faster than scrolling a list.

### 4A. Area-Level Business Maps
**What:** Interactive map on each area page showing all businesses in that area as pins. Clicking a pin shows business name, category, rating, and a link to the full listing.
**Where:** Area pages (e.g., /lagos/lekki), lazy-loaded below the business listings and FAQ sections
**Tech:** Leaflet.js + OpenStreetMap tiles (100% free, no API key required)
**Why:** Helps customers visualize which businesses are nearby and plan visits

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Businesses per area (in any single area) | ≥ 8 businesses in at least 5 areas |
| **Secondary** | Businesses with valid lat/lng coordinates | ≥ 80% of active businesses geocoded |
| **Tertiary** | User requests for map feature | ≥ 5 requests via WhatsApp or feedback |
| **Validation** | Total active businesses across platform | ≥ 200 listings |

**Implementation estimate:** 2-3 days
**Dependencies:**
- Businesses must have accurate latitude/longitude in database (schema already supports this)
- Geocoding workflow needed for businesses that sign up without coordinates
- Leaflet + react-leaflet npm packages (~45KB gzipped)
**Performance safeguards:**
- Lazy-load map component below the fold using `next/dynamic` with `ssr: false`
- Only render map when user scrolls to it (Intersection Observer)
- Keep map below FAQ section to preserve SEO content priority
**Risk if built too early:** 2-3 pins on a map of an entire area looks empty and unprofessional

---

### 4B. City-Level Overview Map
**What:** Interactive map on each city page showing all areas with business clusters. Areas appear as colored circles sized by business count. Clicking an area circle navigates to the area page.
**Where:** City pages (e.g., /lagos), lazy-loaded below area listings
**Tech:** Leaflet.js with custom cluster markers
**Why:** Gives a bird's-eye view of where businesses are concentrated across the city

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Areas with ≥5 businesses (in any single city) | ≥ 10 populated areas |
| **Secondary** | Total businesses in that city | ≥ 150 listings |
| **Validation** | 4A (Area Maps) already deployed and performing | Positive user feedback on area maps |

**Implementation estimate:** 1-2 days (builds on 4A infrastructure)
**Dependencies:** 4A must be deployed first; area center coordinates needed
**Risk if built too early:** Sparse clusters across a city map highlight coverage gaps

---

### 4C. Business Detail Map
**What:** Small map on each business detail page showing the exact business location with a pin, plus nearby businesses as secondary pins
**Where:** Business detail pages, in the sidebar or below contact info
**Tech:** Leaflet.js, single-pin focus with nearby business discovery
**Why:** Helps customers find the business and discover others nearby

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Businesses with verified addresses and coordinates | ≥ 70% of active businesses |
| **Secondary** | "Get directions" FAQ clicks or WhatsApp direction requests | ≥ 20/week |
| **Validation** | 4A (Area Maps) user engagement | Map interactions ≥ 15% of area page visitors |

**Implementation estimate:** 1 day (reuses 4A map component)
**Dependencies:** 4A deployed; accurate geocoding critical for individual business pins
**Risk if built too early:** Wrong pin locations erode trust; unverified coordinates are worse than no map

---

### 4D. "Near Me" Geolocation Search
**What:** Browser geolocation button that finds and displays businesses closest to the user's current location on a map, sorted by distance
**Where:** Homepage search bar, search results page, mobile navigation
**Tech:** Browser Geolocation API + Leaflet.js + PostGIS distance queries
**Why:** The most natural way mobile users discover local businesses

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Mobile traffic percentage | ≥ 60% of visitors on mobile |
| **Secondary** | Total active businesses | ≥ 500 listings |
| **Tertiary** | Geographic spread | ≥ 3 cities with ≥ 100 businesses each |
| **Validation** | "near me" search queries in analytics | ≥ 30 searches/week containing location terms |

**Implementation estimate:** 3-4 days (requires backend distance calculations)
**Dependencies:** All previous map features deployed; PostGIS extension or Supabase geo queries; sufficient business density for meaningful results
**Risk if built too early:** "3 businesses within 50km" is a terrible user experience

---

### Maps Implementation Order

Expected activation sequence based on growth milestones:

1. **4A Area Maps** — First (when 5+ areas have 8+ businesses each, ~200 total listings)
2. **4B City Overview** — Second (when 10+ areas populated per city, ~150/city)
3. **4C Business Detail Map** — Third (when 70%+ businesses have verified coordinates)
4. **4D Near Me Search** — Last (when 500+ listings with strong geographic spread)

### Maps Technical Notes

- **Library choice:** Leaflet.js + OpenStreetMap = zero cost, no API keys, no usage limits
- **Bundle impact:** ~45KB gzipped for react-leaflet; mitigated by lazy loading
- **Geocoding:** Use free Nominatim API for address-to-coordinate conversion during business onboarding
- **Database:** lat/lng columns already exist in businesses, cities, areas, and landmarks tables
- **Mobile:** Touch-friendly zoom/pan; consider static map image fallback for very slow connections
- **SEO protection:** Maps must ALWAYS render below text content; use `loading="lazy"` patterns
