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
8. **3B Community Forum** — Last (needs critical mass)

---

## Notes

- Multiple triggers can fire simultaneously — prioritize by implementation speed and impact
- Each upgrade should be QA'd on mobile before deployment (70%+ of Nigerian web traffic is mobile)
- All new features must maintain the "Street-Smart Friend" brand voice
- Database migrations should be created alongside each feature
- Commit to GitHub and verify Vercel deployment after each upgrade
