# syncIO Labs — SEO & Technical Site Audit v2
**Date:** February 17, 2026  
**Site:** synciolabs.com  
**Hosting:** Cloudflare Pages  
**Forms:** Formspree  
**Status:** Site is indexed in Google. Brand search "syncIO Labs" returns homepage as #1 result.

---

## Site Structure (Confirmed)

**Main Pages:**
- `index.html` — Homepage
- `services.html` — Services (Does This Sound Familiar, Tiers, Process, Includes)
- `solutions.html` — Solutions (New Steel Structures case study, 4 interactive dashboard demos)
- `contact.html` — Contact form (Formspree) + phone, email, location
- `thank-you.html` — Form confirmation page (auto-redirects to contact after 5s)

**Subdirectory: `/Solutions/`**
- `NSS-dashboard.html` — New Steel Structures dashboard demo
- `NSS-CaseStudy.pdf` — Downloadable case study PDF
- `syncIO-agent-hub-demo.html` — P.U.L.S.E. AI agent demo
- `PropertyCommand-dashboard.html` — Property management demo
- `ClientView-portal.html` — Client portal demo
- `AutoPilot-dashboard.html` — Automation workflow demo

**Routing Files:**
- `_headers` — Content-Type for vCard downloads (`/syncAndy`, `/syncRJ`)
- `_redirects` — vCard routes (200), portfolio→solutions 301 redirect

**Assets:**
- `og-image.png` — Open Graph social sharing image
- `logo-signature.png` — Email signature logo
- `/vcard/` — Digital business cards (asimsjr.vcf, rjfowler.vcf)

**Missing Files (Need Creation):**
- `robots.txt` — Does not exist
- `sitemap.xml` — Does not exist
- Favicon — No favicon file or `<link>` references on any page
- `404.html` — No custom error page

---

## DMARC Report Analysis

**Report:** `google.com!synciolabs.com!1771027200!1771113599.xml`  
**Period:** February 14, 2026 (24 hours)  
**Sent by:** Google (the receiving mail server reporting back to you)

### What This Report Tells You

Google received **1 email** claiming to be from synciolabs.com during this period. That email was sent from IP `209.85.220.41`, which is Google's own infrastructure (meaning it came from your Google Workspace account). Both authentication checks passed:

- **DKIM:** Pass (selector: `google`) — the email's cryptographic signature is valid
- **SPF:** Pass — the sending IP is authorized to send on behalf of synciolabs.com

**Bottom line: Your email authentication is working correctly.** Emails you send from Google Workspace are fully authenticated. This is the report you want to see.

### What Needs Attention: Your DMARC Policy

Your current DMARC record is set to `p=none`, which means "monitor only." Even if someone spoofs your domain (sends fake emails pretending to be synciolabs.com), receiving servers will log it but won't block it. This is fine during initial setup to make sure legitimate email isn't accidentally blocked, but you've confirmed everything passes.

**Recommended action — update your DMARC DNS record in Cloudflare:**

Phase 1 (do now): Change to quarantine
```
_dmarc.synciolabs.com  TXT  "v=DMARC1; p=quarantine; rua=mailto:asimsjr@synciolabs.com; pct=100"
```

Phase 2 (after 2-4 weeks with no issues): Change to reject
```
_dmarc.synciolabs.com  TXT  "v=DMARC1; p=reject; rua=mailto:asimsjr@synciolabs.com; pct=100"
```

`p=quarantine` tells receiving servers to send spoofed emails to spam. `p=reject` tells them to block spoofed emails entirely. The `rua` parameter sends aggregate reports to your email so you continue receiving these reports.

**Where to do this:** Cloudflare dashboard → DNS → find your existing `_dmarc` TXT record → update the value.

**Why this matters for marketing:** As you scale outreach, email deliverability becomes critical. A `p=reject` DMARC policy signals to Gmail, Outlook, and other providers that your domain is well-managed and less likely to be spoofed. This directly improves your cold email delivery rates.

---

## Files to Create

### 1. robots.txt

This file tells search engine crawlers what they can and cannot access. Without it, crawlers use default behavior (crawl everything), but you miss the opportunity to point them to your sitemap and keep irrelevant pages out of their index.

```
User-agent: *
Allow: /

# Keep demo dashboards and utility pages out of search
Disallow: /Solutions/
Disallow: /thank-you
Disallow: /vcard/

# Sitemap location
Sitemap: https://synciolabs.com/sitemap.xml
```

**Why block `/Solutions/`:** These are interactive dashboard demos embedded via iframe on your solutions page. They're not standalone pages with meaningful content for search — they'd show up as orphaned, context-free results. Anyone searching finds them through the solutions page where they have proper framing.

**Deployment:** Create `robots.txt` in your Cloudflare Pages root directory (same level as index.html). No build step needed.

### 2. sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://synciolabs.com/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://synciolabs.com/services</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://synciolabs.com/solutions</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://synciolabs.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Note:** URLs use clean paths (no `.html` extensions) matching your canonical tags. When you add blog posts, add them here too.

**Deployment:** Same root directory as robots.txt.

### 3. Favicon

No favicon is referenced anywhere on the site. Browsers show a blank tab icon and some search results show a generic globe.

**What to create:**
- `favicon.ico` (32x32, for legacy browsers)
- `favicon-32x32.png` (32x32)
- `favicon-16x16.png` (16x16)
- `apple-touch-icon.png` (180x180, for iOS home screen)

Use the syncIO icon mark SVG (the `</>` brackets) from your project files to generate these. The gold brackets on a dark background will read well at small sizes.

**Add to the `<head>` of every page:**
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" href="/favicon.ico">
```

### 4. Custom 404 Page

Currently, hitting a bad URL shows Cloudflare's default error page. A custom 404 keeps people on your site.

Create `404.html` in your root directory. Cloudflare Pages automatically serves it for missing routes. Match your existing site design (dark background, gold accents), include your nav, and add a CTA to the contact page. Keep it simple.

---

## Content Inconsistency: Call Duration

The site currently shows two different call durations:

| Page | What It Says | Location in Code |
|------|-------------|-----------------|
| **index.html** | "A **15-minute** call to understand your current systems..." | Line 1482 |
| **contact.html** meta description | "Free **15-minute** call..." | Line 9 |
| **contact.html** OG description | "**15-minute** call to talk about your operations..." | Line 495 |
| **services.html** CTA | "**30 minutes** to understand your situation..." | Line 1159 |
| **contact.html** "What to expect" | "**30 minutes**, no longer (unless you want)" | Line 613 |

**Fix:** Change all instances to **15 minutes**. Two edits needed:

`services.html` line 1159:
```
Change: "30 minutes to understand your situation."
To: "15 minutes to understand your situation."
```

`contact.html` line 613:
```
Change: "30 minutes, no longer (unless you want)"
To: "15 minutes, no longer (unless you want)"
```

---

## Page-by-Page SEO Audit

### Homepage (index.html)

**Title tag:** `syncIO Labs | Custom Operational Software for Growing Businesses`  
Status: Functional but could be stronger. Google truncates around 60 characters — this is 65 characters. "Growing Businesses" is vague and not what your target audience searches for.

Recommended:
```
Custom Software for Small Business Operations | syncIO Labs
```
(59 characters. Puts the searchable phrase first, brand second.)

**Meta description:** Present and good. Currently 156 characters — within range.

Recommended tweak:
```
syncIO Labs connects your QuickBooks, CRMs, and business tools into one system. Custom integrations, dashboards, and automation for small businesses. Atlanta, GA.
```
(164 characters — slightly over but Google sometimes pulls longer descriptions. Adds geographic signal and specific tool names people search for.)

**H1:** `We make your systems talk.`  
Good brand copy. Zero search value. This is fine to keep — brand voice matters. But the `hero-tag` div above it that says "Custom Operational Software" is not inside any heading tag, so Google doesn't weight it.

**Canonical:** `https://synciolabs.com/` ✓  
**Open Graph:** All tags present ✓  
**Twitter Card:** Present ✓  
**Favicon:** Missing ✗  
**Structured data:** None ✗  

**Structured data to add (LocalBusiness JSON-LD):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "syncIO Labs",
  "description": "Custom operational software for small businesses. System integrations, dashboards, and workflow automation.",
  "url": "https://synciolabs.com",
  "telephone": "+1-404-229-4838",
  "email": "asimsjr@synciolabs.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Monroe",
    "addressRegion": "GA",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "Country",
    "name": "US"
  },
  "founder": {
    "@type": "Person",
    "name": "Andy Sims",
    "jobTitle": "Founder & Principal Architect"
  },
  "sameAs": [
    "https://www.linkedin.com/in/asimsjr/"
  ]
}
</script>
```
Add this to the homepage `<head>` only. This gives Google explicit business information for local search and knowledge panels.

**Footer:** Has location ("Atlanta, GA") and email ✓. Missing: phone number, links to Services/Solutions/Contact.

**Recommendation:** Expand footer across all pages to include phone, all page links, and email. Footer links are internal links that help Google understand site structure.

---

### Services Page (services.html)

**Title tag:** `Services | syncIO Labs — Integrations, Dashboards & Automation`  
Status: Good. 62 characters — very close to the limit but readable.

**Meta description:** Present. Currently describes "case studies" and "live dashboard demos" which are actually on the Solutions page, not Services.

Recommended:
```
Does this sound familiar? Systems that don't talk, spreadsheets running the business, data entered three times. syncIO Labs builds custom software that fixes operations problems.
```
(Aligns with the actual "Does This Sound Familiar?" content on this page and targets pain-point search queries.)

**H1:** `Software that finally fits.`  
Same situation as homepage — strong brand copy, no search terms. Fine to keep.

**Canonical:** `https://synciolabs.com/services` ✓  
**Open Graph:** Missing `og:title` ✗ (has description, image, URL, but not title)  
**Twitter Card:** Present ✓  
**Favicon:** Missing ✗  

**Fix og:title — add to services.html after the og:description tag:**
```html
<meta property="og:title" content="Services | syncIO Labs — Integrations, Dashboards & Automation" />
```

**Content strength:** The "Does This Sound Familiar?" section is your best SEO content on the entire site. Each scenario card naturally uses phrases people actually search: "entering data into three different systems," "if Sarah quits," "know if we're making money on each job," "software from 2008 and the vendor went out of business." These are gold for long-tail search. The dollar-cost callouts ($13,000/year in wasted labor) are exactly what Google surfaces in featured snippets.

---

### Solutions Page (solutions.html)

**Title tag:** `Solutions | syncIO Labs — Real Systems Solving Real Problems`  
Status: Good. 56 characters.

**Meta description:** Present and strong. Mentions specific deliverables and includes "No six-figure platforms required" which is a differentiator.

**H1:** Not visible in code — the hero section uses `section-label` and likely renders the page title through CSS/styling rather than a proper H1. Need to verify this renders as an `<h1>` in the DOM.

**Canonical:** `https://synciolabs.com/solutions` ✓  
**Open Graph:** All tags present ✓  
**Twitter Card:** Not present ✗ — add twitter:card and twitter:image  
**Favicon:** Missing ✗  

**Case study content:** New Steel Structures section mentions "$20M+ in projects across five states" which is strong proof-point content. The five concept dashboards (P.U.L.S.E., PropertyCommand, ClientView, AutoPilot) are loaded via iframe from `/Solutions/` — these are correctly blocked from crawlers by the robots.txt recommendation above.

**Add Twitter card tags:**
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://synciolabs.com/og-image.png" />
```

---

### Contact Page (contact.html)

**Title tag:** `Contact | syncIO Labs — Free Operations Consultation`  
Status: Good. 52 characters.

**Meta description:** Present. Mentions "15-minute call" ✓ (but body content still says 30 — see inconsistency section above).

**H1:** `Let's talk about your systems.`  
Fine for a contact page.

**Canonical:** `https://synciolabs.com/contact` ✓  
**Open Graph:** All tags present ✓  
**Twitter Card:** Present ✓  
**Favicon:** Missing ✗  

**Location info:** Shows "Atlanta, GA — Serving clients nationwide" ✓. This is good for local search but doesn't specify Monroe, GA. For Google Business Profile alignment, consider adding Monroe.

**Form:** Formspree integration working. Submits via fetch, redirects to thank-you.html. Good field selection (name, company, email, situation dropdown, message).

---

### Thank-You Page (thank-you.html)

**Title tag:** `Message Sent | syncIO Labs`  
**Meta description:** None  
**Canonical:** None  
**Robots meta:** None ✗  

**Critical fix — add noindex:**
```html
<meta name="robots" content="noindex, nofollow">
```
Add this to the `<head>`. This page should never appear in search results. It's a transient confirmation with no standalone value.

---

## Keyword Strategy

### Why Long-Tail First
You can't compete short-term for "custom software development Atlanta." Established competitors (SOLTECH, Winnona Partners, etc.) have years of content, backlinks, and domain authority. You win with specific, pain-point keywords that match how your actual buyers search.

### Primary Keyword Targets by Page

**Homepage:**
- custom software for small business operations
- small business system integration
- connect business tools custom software

**Services:**
- QuickBooks custom integration small business
- custom dashboard small business operations
- automate business workflow custom software
- CRM QuickBooks integration custom
- replace spreadsheets with custom software

**Solutions:**
- custom operational dashboard
- QuickBooks integration dashboard
- construction operations software custom

**Contact:**
- custom software consultation
- operations software assessment

**Blog targets (for future content):**
- when to replace spreadsheets with custom software
- systems don't talk to each other business
- operations manager software vs hiring
- custom software vs off the shelf small business
- AI for small business operations
- QuickBooks CRM integration problems small business

### Geographic Keywords
- custom software Atlanta small business
- software development Georgia SMB
- business automation Atlanta GA
- custom software Monroe GA (long-tail, low competition)

---

## Blog Strategy — 5 Posts for Launch

### URL Structure
```
synciolabs.com/blog/                    (index)
synciolabs.com/blog/replace-spreadsheets
synciolabs.com/blog/operations-manager-vs-software
synciolabs.com/blog/ai-revolution
synciolabs.com/blog/custom-vs-off-the-shelf
synciolabs.com/blog/quickbooks-integration
```
Clean URLs, no dates, no extensions. Add all to sitemap.xml when published.

### Post 1: "When to Replace Your Spreadsheets with Custom Software"
**Target keyword:** when to replace spreadsheets with custom software  
**Angle:** Pain signals — reference the "If Sarah quits" scenario from the homepage. Strongest search-aligned content angle.  
**Length:** 800–1,200 words  
**Internal links:** Services page (Does This Sound Familiar section), Contact page

### Post 2: "Why Hiring an Operations Manager Might Not Fix Your Systems Problem"
**Target keyword:** operations manager software vs hiring  
**Angle:** Directly supports outreach strategy (ops manager job postings). Argument: if the problem is systems not talking, the answer is software not headcount. Send this link in outreach DMs.  
**Length:** 600–800 words  
**Internal links:** Services page (tier comparison), Contact page

### Post 3: "The AI Revolution: What History Tells Us About What's Coming"
**Target keyword:** AI for small business operations  
**Angle:** Already written and published on LinkedIn. Adapt for SEO with keyword-rich title, meta description, internal links.  
**Length:** Existing — optimize, don't rewrite  
**Internal links:** Services page (AI-powered features), Solutions page (P.U.L.S.E. demo)

### Post 4: "Custom Software vs. Off-the-Shelf: How to Decide for Your Small Business"
**Target keyword:** custom software vs off the shelf small business  
**Angle:** Educational comparison, decision framework. Not a sales pitch.  
**Length:** 800–1,000 words  
**Internal links:** Services page (tier section), Solutions page

### Post 5: "What a QuickBooks Integration Actually Looks Like"
**Target keyword:** QuickBooks custom integration small business  
**Angle:** Specific walkthrough of data movement, team impact, ROI. High commercial intent keyword.  
**Length:** 600–800 words  
**Internal links:** Solutions page (New Steel Structures case study), Contact page

### Publishing Plan
- Launch with all 5 posts live
- Then 2 per month (sustainable for two people)
- Each post repurposed into 1–2 LinkedIn posts
- Each post links to Services and Contact internally

---

## Google Search Console

**Status:** Not set up (assumed — verify)

**Setup steps:**
1. Go to search.google.com/search-console
2. Add property: `synciolabs.com`
3. Verify via DNS (add a TXT record in Cloudflare — Google provides the exact value)
4. Submit your sitemap URL: `https://synciolabs.com/sitemap.xml`
5. Use URL Inspection to request indexing on each page

**What Search Console gives you:**
- Which search queries bring people to your site
- Click-through rates per query
- Indexing status for every page
- Crawl errors and mobile usability issues
- Core Web Vitals performance data

This is the single most important free tool for SEO. Without it, you're flying blind.

---

## Google Business Profile

**Status:** Not set up

**Setup steps:**
1. Go to business.google.com
2. Create listing: "syncIO Labs"
3. Address: Monroe, GA (or service-area business covering Metro Atlanta)
4. Category: "Custom Software Development Company"
5. Secondary category: "Software Company"
6. Add: phone (404-229-4838), website, hours, description
7. Verify (Google mails a postcard or offers phone verification)

**Description to use:**
```
syncIO Labs builds custom operational software for small businesses. We connect your existing tools — QuickBooks, CRMs, scheduling systems — into one system that fits how your business actually works. System integrations, real-time dashboards, and workflow automation. Based in Monroe, GA, serving clients nationwide.
```

**Why this matters:** Google Business Profile puts you in the local "map pack" — the 3 business listings that appear at the top of local searches. For "custom software Atlanta" type queries, this is prime real estate.

---

## Technical SEO Checklist

### Must Fix (Blocks ranking or creates inconsistency)

| # | Item | Status | Action |
|---|------|--------|--------|
| 1 | robots.txt | Missing | Create per spec above |
| 2 | sitemap.xml | Missing | Create per spec above |
| 3 | Favicon | Missing on all pages | Generate from icon mark SVG, add `<link>` tags to all pages |
| 4 | Google Search Console | Not set up | Set up, verify, submit sitemap |
| 5 | thank-you.html noindex | Missing | Add `<meta name="robots" content="noindex, nofollow">` |
| 6 | Call duration inconsistency | 15 vs 30 min | Fix services.html line 1159, contact.html line 613 |
| 7 | services.html og:title | Missing | Add og:title meta tag |
| 8 | solutions.html Twitter card | Missing | Add twitter:card and twitter:image tags |
| 9 | DMARC policy | p=none | Upgrade to p=quarantine, then p=reject |
| 10 | Structured data | None on any page | Add LocalBusiness JSON-LD to homepage |

### Should Fix (Improves ranking quality)

| # | Item | Action |
|---|------|--------|
| 11 | Homepage title tag | Tighten to 59 chars with searchable phrase first |
| 12 | Services meta description | Align with actual page content (not case studies) |
| 13 | Footer expansion | Add phone, all page links, consistent location across all pages |
| 14 | Google Business Profile | Set up free listing |
| 15 | Image alt text | Audit all images for descriptive alt attributes |
| 16 | 404.html | Create custom error page matching site design |
| 17 | Directory listings | Create free profiles on Clutch.co and GoodFirms.co |

### Nice to Have (Future optimization)

| # | Item | Action |
|---|------|--------|
| 18 | Page speed audit | Run PageSpeed Insights, target 90+ mobile |
| 19 | Blog section | Build URL structure, publish 5 launch posts |
| 20 | Sitemap auto-generation | Set up for blog posts |
| 21 | Backlink building | Guest content, directory submissions, partner sites |

---

## Priority Execution Order

### Today (30–45 minutes)
1. Create `robots.txt` — deploy to site root
2. Create `sitemap.xml` — deploy to site root
3. Update DMARC DNS record to `p=quarantine` in Cloudflare

### This Week
4. Google Search Console — set up, verify, submit sitemap
5. Fix call duration (2 edits: services.html, contact.html)
6. Add `noindex` to thank-you.html
7. Add `og:title` to services.html
8. Add Twitter card tags to solutions.html
9. Generate and deploy favicon files
10. Add favicon `<link>` tags to all 5 pages

### Before Blog Launch
11. Add structured data (JSON-LD) to homepage
12. Update homepage title tag and meta description
13. Update services.html meta description
14. Expand footers across all pages
15. Create custom 404.html
16. Write and publish 5 blog posts

### Ongoing
17. Google Business Profile — set up and verify
18. Clutch.co and GoodFirms.co profiles
19. Monitor Search Console weekly (queries, clicks, indexing)
20. Publish 2 blog posts per month
21. After 2–4 weeks of clean DMARC reports, upgrade to `p=reject`

---

## Tools (All Free)

| Tool | Purpose | URL |
|------|---------|-----|
| Google Search Console | Search performance, indexing, technical issues | search.google.com/search-console |
| Google Business Profile | Local search, map pack visibility | business.google.com |
| PageSpeed Insights | Page speed and Core Web Vitals | pagespeed.web.dev |
| Schema Validator | Verify structured data | validator.schema.org |
| DMARC Report Analyzer | Parse future DMARC XML reports | dmarcian.com/dmarc-tools |
| Clutch.co | Free software company directory listing | clutch.co |
| GoodFirms.co | Free software company directory listing | goodfirms.co |
