import { PlaywrightCrawler, Dataset } from 'crawlee';

// Basic config - user would inject this via Apify Input in prod
const INPUT = {
    searchTerms: ['Dentists'],
    location: 'New York, NY',
    maxResults: 10
};

const crawler = new PlaywrightCrawler({
    // Headless false for dev/debugging visibility
    headless: false,
    
    // Concurrency settings
    maxConcurrency: 1, // Keep low for Phase 1 to avoid blocks
    
    requestHandler: async ({ page, request, log, enqueueLinks }) => {
        log.info(`Processing ${request.url}`);

        // --- PHASE 1: START (Search) ---
        if (request.label === 'START') {
            const { searchTerms, location } = request.userData;
            const query = `${searchTerms[0]} in ${location}`; // Taking first term for MVP
            
            log.info(`Searching for: ${query}`);
            
            // 1. Handle Consent (Google keeps changing this, basic attempt)
            try {
                const consentBtn = page.getByRole('button', { name: 'Accept all' }).first();
                if (await consentBtn.isVisible({ timeout: 2000 })) {
                    await consentBtn.click();
                    log.info('Consent accepted');
                }
            } catch (e) {}

            // 2. Input Search
            await page.waitForSelector('#searchboxinput');
            await page.locator('#searchboxinput').fill(query);
            await page.locator('#searchbox-searchbutton').click();
            
            // 3. Wait for feed
            await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
            
            // 4. Scroll & Collect
            // We scroll a few times to get initial results
            const feed = page.locator('div[role="feed"]');
            
            log.info('Scrolling for results...');
            for (let i = 0; i < 5; i++) {
                await feed.evaluate((el) => el.scrollTop = el.scrollHeight);
                await page.waitForTimeout(2000); // Give time for network
                
                // Check if we hit end or have enough (TODO)
            }

            // 5. Enqueue Listings
            // Strategy: Find all links that look like places
            const links = await page.locator('a[href^="https://www.google.com/maps/place"]').all();
            log.info(`Found ${links.length} potential listings.`);
            
            const urls = [];
            for (const link of links) {
                const href = await link.getAttribute('href');
                if (href && !urls.includes(href)) {
                    urls.push(href);
                }
            }
            
            // Dedupe and enqueue
            const uniqueUrls = [...new Set(urls)];
            log.info(`Enqueuing ${uniqueUrls.length} unique places.`);
            
            await crawler.addRequests(uniqueUrls.map(url => ({
                url,
                label: 'DETAIL'
            })));
        }

        // --- PHASE 2: DETAIL (Extract) ---
        if (request.label === 'DETAIL') {
            log.info(`Scraping details: ${request.url}`);
            
            // Wait for main header
            await page.waitForSelector('h1', { timeout: 10000 });
            
            const title = await page.locator('h1').textContent();
            
            let website = null;
            let phone = null;
            let address = null;
            
            // Heuristic extraction based on icons/aria-labels
            // Website usually has data-item-id="authority"
            const webLocator = page.locator('a[data-item-id="authority"]');
            if (await webLocator.count() > 0) {
                website = await webLocator.getAttribute('href');
            }

            // Phone usually starts with "phone:" in aria-label or just check text structure
            // Simplified for MVP: Look for button with phone icon
            const phoneLocator = page.locator('button[data-item-id^="phone:"]');
            if (await phoneLocator.count() > 0) {
                phone = await phoneLocator.getAttribute('aria-label'); // often format: "Phone: +1 234..."
                if (phone) phone = phone.replace('Phone: ', '').trim();
            }

            // Address
            const addressLocator = page.locator('button[data-item-id="address"]');
            if (await addressLocator.count() > 0) {
                 address = await addressLocator.getAttribute('aria-label');
                 if (address) address = address.replace('Address: ', '').trim();
            }

            log.info(`RESULTS: ${title} | ${website} | ${phone}`);
            
            await Dataset.pushData({
                title,
                address,
                phone,
                website,
                mapsUrl: request.url,
                scrapedAt: new Date().toISOString()
            });
        }
    },
});

// Run
await crawler.run([
    {
        url: 'https://www.google.com/maps',
        label: 'START',
        userData: INPUT
    }
]);
