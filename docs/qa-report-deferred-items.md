# MyHustle QA Report — Deferred Items for Later Phases

**Source:** Independent QA Report by Victor Chime (May 29, 2026)
**Created:** 2026-06-01
**Status:** Deferred — implement as traction grows

---

## Context

Victor Chime's independent QA report identified several improvement areas.
The critical issue (business page 404s) and high-priority items (geo-restriction
messaging, search autocomplete) were fixed immediately. The items below are
deferred to later phases as they require traction data or are lower priority.

### Items Already Addressed (2026-06-01)

| # | Issue | Resolution | Commit |
|---|-------|-----------|--------|
| 1 | All business pages returning 404 | Fixed broken Supabase FK hint | `764dd0e` |
| 2 | Geo-restriction hard block | Redesigned /nigeria-only with helpful messaging | `3656ad3` |
| 3 | No search autocomplete | Added autocomplete API + component | `3656ad3` |

---

## Deferred Item A: Homepage Social Proof & Testimonials

### What
Add a testimonials/social proof section to the homepage featuring:
- Business owner success stories ("Since listing on MyHustle, my bookings increased by...")
- User testimonials ("I found the perfect tailor through MyHustle")
- Key metrics (businesses listed, cities covered, bookings made)
- Optional: video testimonials for higher impact

### Why Deferred
- Need real success stories from actual business owners (not fabricated)
- Need sufficient platform usage to generate authentic testimonials
- Overlaps with Priority 2A (Social Proof Widgets) in SCHEDULED_UPGRADES_P2_P3.md

### Activation Triggers

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Business owners with positive outcomes | ≥ 5 verifiable success stories |
| **Secondary** | Total bookings/contacts via platform | ≥ 100 total interactions |
| **Validation** | Business owner willing to provide testimonial | ≥ 3 written or video testimonials collected |

### Implementation Plan
- Add testimonial section between hero and categories on homepage
- Carousel/grid of 3-6 testimonials with photo, name, business, quote
- Include star rating and business category for context
- Mobile-optimized card layout
- Optional: link to full case study page

### Estimated Effort: 1 day
### Priority: Medium (high impact once testimonials are available)

---

## Deferred Item B: Advanced Search Filters

### What
Add filter controls to search results page allowing users to narrow results by:
- Rating (4+ stars, 3+ stars, etc.)
- Verification status (verified businesses only)
- Business hours (open now — requires hours data)
- Services offered (when service data is populated)
- Sort options already exist (relevant, rating, newest, A-Z)

### Why Deferred
- Current search works well for the existing dataset
- Rating filter needs more reviews to be meaningful
- "Open now" filter needs business hours data (most listings lack this)
- Verification filter needs more verified businesses
- Search autocomplete (just implemented) addresses the most urgent UX gap

### Activation Triggers

| Trigger | Metric | Threshold |
|---------|--------|-----------|
| **Primary** | Businesses with ≥1 review | ≥ 500 businesses with reviews |
| **Secondary** | Businesses with hours data | ≥ 30% of active listings |
| **Tertiary** | Search queries per week | ≥ 200 searches/week |
| **Validation** | User feedback requesting filters | ≥ 5 requests |

### Implementation Plan
- Add collapsible filter sidebar on search results page (desktop)
- Bottom sheet / modal filter on mobile
- Filters: rating range, verified only toggle, category multi-select, area
- URL-based filter state (shareable filtered URLs)
- Update Supabase queries to support compound filtering
- Show active filter count badge on mobile filter button

### Estimated Effort: 2-3 days
### Priority: Medium (becomes important with scale)

---

## Other Minor Items Noted in QA Report

These are polish items to address during regular development cycles:

| Item | Report Section | Notes |
|------|---------------|-------|
| Homepage text-heavy | §1 | Tighten hero copy, more visual elements |
| Spacing inconsistencies | §2 | Design pass for consistent padding/margins |
| No trust badges | §6 | Add when partnerships/certifications exist |
| Click depth to businesses | §3 | Consider quick-view cards on category pages |
| Repetitive CTAs | §9 | Audit and reduce CTA repetition |
| Map view for discovery | §7 | Already documented in SCHEDULED_UPGRADES (Priority 4) |
| Blog/content marketing | §10 | Already documented in seo-deferred-recommendations.md (#7) |
| Mobile testing on low-end devices | §4 | Schedule testing on Tecno/Infinix devices |
| Performance on poor internet | §5 | Test on throttled 3G connections |

---

## Cross-References

- **Social Proof Widgets (real-time):** See `SCHEDULED_UPGRADES_P2_P3.md` → Priority 2A
- **Content Marketing:** See `SCHEDULED_UPGRADES_P2_P3.md` → Priority 3C
- **Interactive Maps:** See `SCHEDULED_UPGRADES_P2_P3.md` → Priority 4
- **Roundup Pages:** See `seo-deferred-recommendations.md` → Recommendation 5
- **Content Guides:** See `seo-deferred-recommendations.md` → Recommendation 7
