# Smart Google Maps Scraper

A robust Apify Actor for scraping Google Maps business listings.

## Features
- **Smart Tech Detection**: Identifies website technologies (WordPress, Shopify, React, Next.js, etc.)
- **Robust Consent Handling**: Automatically bypasses Google consent walls (EN, FR, DE, ES).
- **Anti-Blocking**: Detects "unusual traffic" blocking and retries with fresh sessions/proxies.
- **Resilient Selectors**: Uses multiple fallback strategies for finding search boxes and results.

## Usage

### Recommended Apify Memory
For optimal performance, especially when `enrichWebsite` is enabled, we recommend allocating **at least 4GB of memory** on the Apify platform. Enrichment involves concurrent browser sessions (Playwright fallback) which can be memory-intensive.

### Local Development
```bash
# Install dependencies
npm install

# Run locally (uses default input in src/main.js)
npm start
```

### Input Configuration
The actor accepts the following input:
```json
{
    "searchTerms": ["Dentists", "Gyms"],
    "location": "New York, NY",
    "maxResults": 50,
    "proxyConfiguration": {
        "useApifyProxy": true
    }
}
```

## Architecture
1. **Search Phase**: Locating the search box (robustly), scrolling the feed, and collecting Place URLs.
2. **Detail Phase**: Extracting Name, Address, Phone, Website.
3. **Enrichment Phase**: If a website is found, visit it (via fast HTTP or Playwright fallback) to detect the tech stack.

## Recent Updates (Phase 1 - Quick Wins)
- **Faster Enrichment**: Reduced maximum enrichment timeout (HTTP to 30s, Playwright fallback to 45s).
- **Resource Optimization**: Limited enrichment retries to 1 to save costs and avoid hanging on slow sites.
- **Memory Recommendation**: Added note for recommended Apify memory (4GB+).

## Recent Updates (Phase 2 - Performance)
- **Fast HTTP Enrichment**: Uses lightweight HTTP requests (Axios/Cheerio) instead of full browser navigation for technology detection.
- **Enrichment Controls**:
    - `enrichWebsite` (boolean): Toggle website enrichment on/off.
    - `maxEnrich` (integer): Limit the number of websites to enrich to save resources.
- **Fallback Strategy**: Automatically falls back to Playwright if HTTP enrichment fails (e.g., due to blocking or complex SPAs).

## Recent Updates (Phase 3 - Robustness)
- Added multi-language support for cookie consent (FR/DE/ES).
- Implemented soft-fail and retry logic for "Unusual Traffic" blocking.
- Improved selector strategies for search input and result containers.
