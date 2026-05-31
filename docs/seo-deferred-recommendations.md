# MyHustle SEO Recommendations — Deferred to Later Phases

**Created:** 2026-05-31  
**Status:** Pending implementation  
**Context:** From directory SEO deep research (May 2026)

---

## Recommendation 5: Auto-Generated "Best Of" Roundup Pages

### Overview
Create programmatic roundup pages like "Best Restaurants in Lekki" or "Top 10 Hair Salons in Ikeja" that aggregate top-rated businesses per category+area.

### Implementation Plan
- Generate pages at `/best/{category}/{area}` routes
- Query top businesses by rating, review count, and verification tier
- Include rich content: intro paragraph, numbered list with mini-reviews, comparison table
- Add `ItemList` schema markup with `ListItem` entries
- Internal link from category pages, area pages, and business pages
- Auto-regenerate periodically as new reviews come in (ISR/revalidation)

### SEO Value
- Targets high-intent "best [service] in [location]" keywords
- Creates additional internal linking opportunities
- Provides unique aggregated content Google values

### Priority: Medium
### Estimated Effort: 2-3 days

---

## Recommendation 6: Google Business Profile Data Sync (Owner-Initiated)

### Overview
Allow business owners to optionally sync their MyHustle listing data with their Google Business Profile. **This must NOT be automatic** — owners explicitly choose to sync.

### Implementation Plan
- Add "Sync with Google" button in business owner dashboard
- Use Google Business Profile API (formerly Google My Business API)
- OAuth2 flow: owner authenticates their Google account
- Present a preview of what will be synced before confirming
- Sync fields: business name, address, phone, hours, categories, photos, description
- One-way sync options:
  - **Push to Google**: Update GBP from MyHustle data
  - **Pull from Google**: Update MyHustle from GBP data
  - **Manual merge**: Show diff and let owner choose per field
- Store sync status and last sync timestamp in database
- Add Prisma schema fields: `google_place_id`, `google_sync_enabled`, `last_google_sync`

### Owner Controls
- Toggle sync on/off per listing
- Choose sync direction
- Review changes before applying
- Disconnect Google account at any time

### API Requirements
- Google Business Profile API access
- OAuth2 consent screen setup
- API key with appropriate scopes

### SEO Value
- Ensures NAP (Name, Address, Phone) consistency across platforms
- Improves local search ranking signals
- Reduces data staleness

### Priority: Low-Medium
### Estimated Effort: 5-7 days

---

## Recommendation 7: Content Layer — How-To Guides & Area Guides

### Overview
Build a content marketing layer with two types of guides:
1. **How-To Guides**: "How to Choose a Plumber in Lagos", "What to Look for in a Restaurant"
2. **Area Guides**: "Business Guide to Lekki", "Shopping in Ikeja — Complete Guide"

### Implementation Plan

#### How-To Guides
- Route: `/guides/how-to/{slug}`
- Template-driven with category-specific content
- Include checklist, tips, red flags, and CTA to browse category
- Internal links to relevant category and business pages
- FAQ section with `FAQPage` schema

#### Area Guides
- Route: `/guides/area/{city}/{area}`
- Overview of the area with business highlights
- Top businesses per category in the area
- Map overview, transport info, local tips
- Internal links to area pages and business listings
- `Article` schema with `about: Place`

#### Content Generation Strategy
- Use AI-assisted content generation with human review
- Start with top 10 categories × top 10 areas = 100 guides
- Add editorial calendar for ongoing content
- Interlink guides with existing listing pages

### SEO Value
- Targets informational search intent (top of funnel)
- Builds topical authority for location + service keywords
- Creates natural internal linking web
- Increases time on site and pages per session

### Priority: Medium
### Estimated Effort: 5-8 days (infrastructure + initial batch)

---

## Implementation Order (Suggested)

1. **Recommendation 5** (Roundup Pages) — Quick win, builds on existing data
2. **Recommendation 7** (Content Layer) — High SEO impact, content-driven growth
3. **Recommendation 6** (Google Sync) — Requires API setup, owner adoption
