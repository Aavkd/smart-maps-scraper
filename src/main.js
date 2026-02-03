import { Actor } from 'apify';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import * as cheerio from 'cheerio';

await Actor.init();

// Default input for local testing (fallback)
const DEFAULT_INPUT = {
    searchTerms: ['Dentists'],
    location: 'New York, NY',
    maxResults: 10,
    proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
    }
};

const input = await Actor.getInput() || DEFAULT_INPUT;
const { searchTerms, location, maxResults, proxyConfiguration: proxyConfigInput } = input;

const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfigInput);

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

    // 2. Script Signatures
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

    // 3. HTML Content
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
    proxyConfiguration,
    headless: false,
    maxConcurrency: 2, 
    useSessionPool: true,
    sessionPoolOptions: {
        maxPoolSize: 100,
    },

    requestHandler: async ({ page, request, log, enqueueLinks }) => {
        log.info(`Processing ${request.url} [${request.label}]`);

        // --- SHARED: CONSENT HANDLING ---
        // Run on every request to ensure we bypass the consent wall
        const handleConsent = async () => {
            const consentSelectors = [
                'button[aria-label="Accept all"]',
                'button[aria-label="Tout accepter"]',
                'button:has-text("Accept all")',
                'button:has-text("Tout accepter")',
                'span:has-text("Accept all")',
                'span:has-text("Tout accepter")',
                'form[action*="consent"] button',
                'button[jsname="tBTCr"]' 
            ];
            
            // Fast check first
            try {
                // If title indicates consent page, we MUST look for buttons
                // But generally checking for visibility is enough
                for (const selector of consentSelectors) {
                    const btn = page.locator(selector).first();
                    if (await btn.isVisible({ timeout: 500 })) { 
                        log.info(`[Consent] Found button: ${selector}, clicking...`);
                        await Promise.all([
                            page.waitForLoadState('load', { timeout: 15000 }).catch(() => {}),
                            btn.click()
                        ]);
                        log.info(`[Consent] Accepted.`);
                        // Short wait for transition
                        await page.waitForTimeout(2000);
                        return true;
                    }
                }
            } catch (e) {
                log.debug('Consent check skipped/failed: ' + e.message);
            }
            return false;
        };

        await handleConsent();

        // --- PHASE 1: START (Search) ---
        if (request.label === 'START') {
            const query = `${searchTerms[0]} in ${location}`; 
            
            log.info(`Searching for: ${query}`);
            
            // Wait for search box (robustness after consent)
            let searchBoxSelector = '#searchboxinput';
            try {
                await page.waitForSelector(searchBoxSelector, { timeout: 10000 });
            } catch (e) {
                log.info('Standard search box missing. Checking for input[name="q"]...');
                if (await page.locator('input[name="q"]').isVisible()) {
                    searchBoxSelector = 'input[name="q"]';
                } else {
                    log.warning('Search box missing. Investigating...');
                    throw e;
                }
            }
            
            await page.locator(searchBoxSelector).fill(query);
            await page.locator(searchBoxSelector).press('Enter');
            
            await page.waitForSelector('div[role="feed"]', { timeout: 15000 });
            
            const feed = page.locator('div[role="feed"]');
            
            log.info('Scrolling for results...');
            for (let i = 0; i < 5; i++) {
                const previousCount = await page.locator('a[href^="https://www.google.com/maps/place"]').count();
                await feed.evaluate((el) => el.scrollTop = el.scrollHeight);
                try {
                    await page.waitForFunction(
                        (prev) => document.querySelectorAll('a[href^="https://www.google.com/maps/place"]').length > prev,
                        previousCount,
                        { timeout: 3000 }
                    );
                } catch (e) {
                    // Timeout expected if end of list
                }
            }

            const links = await page.locator('a[href^="https://www.google.com/maps/place"]').all();
            log.info(`Found ${links.length} potential listings.`);
            
            const urls = [];
            for (const link of links) {
                const href = await link.getAttribute('href');
                if (href && !urls.includes(href)) {
                    urls.push(href);
                }
            }
            
            const uniqueUrls = [...new Set(urls)].slice(0, maxResults);
            log.info(`Enqueuing ${uniqueUrls.length} unique places.`);
            
            await crawler.addRequests(uniqueUrls.map(url => ({
                url,
                label: 'DETAIL'
            })));
        }

        // --- PHASE 1: DETAIL (Extract Maps Data) ---
        if (request.label === 'DETAIL') {
            log.info(`Scraping details: ${request.url}`);
            
            try {
                await page.waitForSelector('h1', { timeout: 10000 });
            } catch (e) {
                log.warning(`Failed to load details (h1) for ${request.url} - retrying session.`);
                throw e; 
            }

            const title = await page.locator('h1').first().textContent();
            
            // Double check if we are still on consent page despite handleConsent
            // (Sometimes it takes a moment or selector was missed)
            if (title === 'Before you continue to Google') {
                 log.warning('Still on consent page. Retrying session.');
                 throw new Error('Consent wall blocked details page');
            }

            let website = null;
            let phone = null;
            let address = null;
            
            const webLocator = page.locator('a[data-item-id="authority"]');
            if (await webLocator.count() > 0) {
                website = await webLocator.getAttribute('href');
            }

            const phoneLocator = page.locator('button[data-item-id^="phone:"]');
            if (await phoneLocator.count() > 0) {
                phone = await phoneLocator.getAttribute('aria-label');
                if (phone) phone = phone.replace('Phone: ', '').trim();
            }

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
                const response = await page.waitForResponse(resp => resp.url() === request.url, { timeout: 10000 }).catch(() => null);
                const headers = response ? response.headers() : {};
                const html = await page.content();
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

await crawler.run([
    {
        url: 'https://www.google.com/maps?hl=en',
        label: 'START',
        userData: { ...input } 
    }
]);

await Actor.exit();
