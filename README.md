# Smart Maps Scraper

**Smart Maps Scraper** is a powerful Apify actor designed to extract business listings from Google Maps and enrich them with technology stack data. It not only finds businesses but also analyzes their websites to identify the technologies they use (e.g., WordPress, Shopify, Next.js).

## 🚀 Features

-   **📍 Google Maps Extraction**: Scrapes business details including title, address, phone number, and website URL.
-   **🛠️ Tech Stack Detection**: Visits the business website to detect used technologies (CMS, Frameworks, Analytics, etc.).
-   **⚡ Lead Enrichment**: Enhances basic maps data with valuable technical insights for better lead qualification.
-   **🛡️ Proxy Support**: Built-in support for Apify Proxy to ensure reliable scraping.

## 📋 Usage

This actor requires the following inputs:

-   **Search Terms**: A list of keywords to search for (e.g., "Dentists", "Coffee Shops").
-   **Location**: The geographic area to search in (e.g., "London", "New York, NY").
-   **Max Results**: Limit the number of results to scrape.
-   **Proxy Configuration**: Proxy settings (Residential proxies recommended).

### Example Input

```json
{
    "searchTerms": ["Marketing Agencies"],
    "location": "San Francisco, CA",
    "maxResults": 50,
    "proxyConfiguration": {
        "useApifyProxy": true,
        "apifyProxyGroups": ["RESIDENTIAL"]
    }
}
```

## 📊 Output

The actor stores results in the default dataset. Each item contains:

-   `title`: Business Name
-   `address`: Full Address
-   `phone`: Phone Number
-   `website`: Website URL
-   `mapsUrl`: Google Maps Link
-   `techStack`: List of detected technologies (e.g., `["WordPress", "Google Analytics"]`)
-   `enrichmentStatus`: Status of the website analysis (`success`, `no-website`, `failed`)

## 💡 Use Cases

-   **Lead Generation**: Find businesses using specific technologies (e.g., "Find Shopify stores in London").
-   **Market Research**: Analyze the tech adoption of businesses in a specific region.
-   **Competitor Analysis**: Gather data on competitors' locations and stacks.

---