import { PlaywrightCrawler, Dataset } from 'crawlee';
import * as cheerio from 'cheerio';

// Basic config - user would inject this via Apify Input in prod
const INPUT = {
    searchTerms: ['Dentists'],
    location: 'New York, NY',
    maxResults: 10
};

// --- TECH DETECTION LOGIC ---
const detectTech = (html, headers = {}) => {
    const $ = cheerio.load(html);
    const tech = new Set();
    const htmlString = html.toLowerCase();
    
    // 1. Meta Generators
    const generator = $('meta[name="generator"]').attr('content')?.toLowerCase() || '';
    if (generator.includes('wordpress')) tech.add('WordPress');
    if (generator.includes('shopify')) tech.add('Shopify');
    if (generator.includes('wix')) tech.add('Wix');
    if (generator.includes('squarespace')) tech.add('Squarespace');
    if (generator.includes('joomla')) tech.add('Joomla');

    // 2. Script Signatures (src patterns)
    $('script').each((i, el) => {
        const src = $(el).attr('src') || '';
        if (src.includes('wp-content') || src.includes('wp-includes')) tech.add('WordPress');
        if (src.includes('cdn.shopify.com')) tech.add('Shopify');
        if (src.includes('static.wixstatic.com')) tech.add('Wix');
        if (src.includes('squarespace.com')) tech.add('Squarespace');
        if (src.includes('analytics.js') || src.includes('googletagmanager')) tech.add('Google Analytics');
        if (src.includes('fbevents.js')) tech.add('Meta Pixel');
        if (src.includes('next/static')) tech.add('Next.js');
        if (src.includes('_next/')) tech.add('Next.js');
    });

    // 3. HTML Content Patterns
    if (htmlString.includes('react-root') || htmlString.includes('data-reactroot')) tech.add('React');
    if (htmlString.includes('ng-app') || htmlString.includes('ng-controller')) tech.add('Angular');
    if (htmlString.includes('data-v-')) tech.add('Vue.js');

    // 4. Headers
    const server = headers['server']?.toLowerCase() || '';
    const xPoweredBy = headers['x-powered-by']?.toLowerCase() || '';
    
    if (server.includes('nginx')) tech.add('Nginx');
    if (server.includes('apache')) tech.add('Apache');
    if (server.includes('cloudflare')) tech.add('Cloudflare');
    if (xPoweredBy.includes('next.js')) tech.add('Next.js');
    if (xPoweredBy.includes('express')) tech.add('Express');
    if (xPoweredBy.includes('php')) tech.add('PHP');

    return Array.from(tech);
};

const crawler = new PlaywrightCrawler({
    // Headless false for dev/debugging visibility
    headless: false,
    
    // Concurrency settings
    maxConcurrency: 1, // Keep low for Phase 1 to avoid blocks
    
    requestHandler: async ({ page, request, log, enqueueLinks, parseWithCheerio }) => {
        log.info(`Processing ${request.url} [${request.label}]`);

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
            for (let i = 0; i < 3; i++) { // Reduced scroll count for dev speed
                await feed.evaluate((el) => el.scrollTop = el.scrollHeight);
                await page.waitForTimeout(2000); 
            }

            // 5. Enqueue Listings
            const links = await page.locator('a[href^="https://www.google.com/maps/place"]').all();
            log.info(`Found ${links.length} potential listings.`);
            
            const urls = [];
            for (const link of links) {
                const href = await link.getAttribute('href');
                if (href && !urls.includes(href)) {
                    urls.push(href);
                }
            }
            
            const uniqueUrls = [...new Set(urls)];
            log.info(`Enqueuing ${uniqueUrls.length} unique places.`);
            
            await crawler.addRequests(uniqueUrls.map(url => ({
                url,
                label: 'DETAIL'
            })));
        }

        // --- PHASE 1: DETAIL (Extract Maps Data) ---
        if (request.label === 'DETAIL') {
            log.info(`Scraping details: ${request.url}`);
            
            await page.waitForSelector('h1', { timeout: 10000 });
            const title = await page.locator('h1').textContent();
            
            let website = null;
            let phone = null;
            let address = null;
            
            // Website extraction
            const webLocator = page.locator('a[data-item-id="authority"]');
            if (await webLocator.count() > 0) {
                website = await webLocator.getAttribute('href');
            }

            // Phone extraction
            const phoneLocator = page.locator('button[data-item-id^="phone:"]');
            if (await phoneLocator.count() > 0) {
                phone = await phoneLocator.getAttribute('aria-label');
                if (phone) phone = phone.replace('Phone: ', '').trim();
            }

            // Address extraction
            const addressLocator = page.locator('button[data-item-id="address"]');
            if (await addressLocator.count() > 0) {
                 address = await addressLocator.getAttribute('aria-label');
                 if (address) address = address.replace('Address: ', '').trim();
            }

            const mapsData = {
                title,
                address,
                phone,
                website,
                mapsUrl: request.url,
                scrapedAt: new Date().toISOString()
            };

            // --- PHASE 2: ENRICHMENT ---
            if (website) {
                log.info(`Website found for ${title}: ${website}. Enqueuing enrichment.`);
                await crawler.addRequests([{
                    url: website,
                    label: 'ENRICH',
                    userData: { mapsData }
                }]);
            } else {
                log.info(`No website for ${title}. Saving basic data.`);
                await Dataset.pushData({ ...mapsData, techStack: [], enrichmentStatus: 'no-website' });
            }
        }

        // --- PHASE 2: ENRICH (Visit Site & Detect Tech) ---
        if (request.label === 'ENRICH') {
            const { mapsData } = request.userData;
            log.info(`Enriching data for: ${mapsData.title} (${request.url})`);

            try {
                // Determine response headers
                const response = await page.waitForResponse(resp => resp.url() === request.url, { timeout: 5000 }).catch(() => null);
                const headers = response ? response.headers() : {};

                // Get HTML content
                const html = await page.content();
                
                // Run detection
                const techStack = detectTech(html, headers);
                
                log.info(`Detected Tech: ${techStack.join(', ')}`);

                await Dataset.pushData({
                    ...mapsData,
                    techStack,
                    enrichmentStatus: 'success'
                });

            } catch (e) {
                log.error(`Enrichment failed for ${request.url}: ${e.message}`);
                await Dataset.pushData({
                    ...mapsData,
                    techStack: [],
                    enrichmentStatus: 'failed',
                    error: e.message
                });
            }
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
