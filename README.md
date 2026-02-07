# 🗺️ Smart Maps Scraper — Google Maps + Tech Stack Detection

**Find leads on Google Maps and instantly know what tech they use.**

Stop wasting time on prospects who don't fit your stack. This actor scrapes Google Maps businesses AND detects their website technology (WordPress, Shopify, Wix, etc.) — all in one run.

---

## 🎯 Why This Actor?

| Feature | Benefit |
|---------|---------|
| **Tech Stack Detection** | Know if they use WordPress, Shopify, Wix, React, etc. |
| **Lead Gen Ready** | Get phone, address, website in one clean JSON |
| **Smart Enrichment** | HTTP-first (fast) + Playwright fallback (reliable) |
| **Pay Per Result** | Only $0.002/result — no subscription |

---

## 👥 Who Is This For?

- **Sales Teams** — Find prospects using specific tech stacks
- **Agencies** — Build lead lists for web dev/redesign pitches
- **Marketers** — Target businesses by technology for ads
- **Researchers** — Analyze local business tech adoption

---

## 📦 What You Get

```json
{
  "title": "Acme Restaurant",
  "address": "123 Main St, New York, NY",
  "phone": "+1 212-555-1234",
  "website": "https://acmerestaurant.com",
  "mapsUrl": "https://google.com/maps/place/...",
  "techStack": ["WordPress", "Google Analytics", "Cloudflare"],
  "enrichmentStatus": "success",
  "scrapedAt": "2026-02-07T22:15:00Z"
}
```

---

## ⚙️ Input Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `searchTerms` | array | required | Keywords to search (e.g., "Dentists", "Restaurants") |
| `location` | string | required | Location (e.g., "New York, NY" or "Paris, France") |
| `maxResults` | number | 20 | Maximum results to scrape |
| `enrichWebsite` | boolean | true | Enable tech stack detection |
| `maxEnrich` | number | 100 | Max websites to analyze |
| `proxyConfiguration` | object | Apify Proxy | Proxy settings (Residential recommended) |

---

## 💰 Pricing

**Pay only for what you use:**
- **$0.002 per result** (~$2 per 1,000 leads)
- No monthly fee
- No minimum

---

## 🔧 How It Works

1. **Search** — Enter keywords + location
2. **Scrape** — Actor visits Google Maps and extracts business details
3. **Enrich** — Each website is analyzed for tech stack (WordPress, Shopify, etc.)
4. **Export** — Get clean JSON ready for your CRM or spreadsheet

---

## ⚠️ Recommendations

- **Memory**: Use **4GB+** for best performance (reduces retries)
- **Proxy**: Residential proxies recommended for Google Maps
- **Rate**: ~1 result/minute with enrichment enabled

---

## 🛠️ Tech Stack Detected

WordPress, Shopify, Wix, Squarespace, Webflow, React, Vue.js, Angular, Next.js, PHP, Laravel, Ruby on Rails, Django, Cloudflare, Nginx, Apache, Google Analytics, and more.

---

## 📬 Support

Questions? Issues? Open a GitHub issue or contact via Apify.

---

**Built for lead gen. Priced for everyone.**
