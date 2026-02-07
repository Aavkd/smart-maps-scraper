import { Actor } from 'apify';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { enrichWithHttp } from './utils/enrichment.js';

await Actor.init();

// Default input for local testing (fallback)
const DEFAULT_INPUT = {
    searchTerms: ['Dentists'],
    location: 'New York, NY',
    maxResults: 10,
    enrichWebsite: true,
    maxEnrich: 100,
    proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
    }
};

const input = await Actor.getInput() || DEFAULT_INPUT;
const { 
    searchTerms, 
    location, 
    maxResults, 
    enrichWebsite = true, 
    maxEnrich = 100, 
    proxyConfiguration: proxyConfigInput 
} = input;

const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfigInput);

// Counter for enriched websites to respect maxEnrich
let enrichedCount = 0;

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    headless: false,
    maxConcurrency: 2, 
    useSessionPool: true,
    sessionPoolOptions: {
        maxPoolSize: 100,
    },
    // Set global navigation timeout to 45s (covers enrichment).
    // Maps requests usually complete faster, but this ensures enrichment doesn't hang.
    navigationTimeoutSecs: 45,
    requestHandlerTimeoutSecs: 60, // Allow handler to run a bit longer than navigation

    requestHandler: async ({ page, request, log }) => {
        log.info(`Processing ${request.url} [${request.label}]`);

        // --- SHARED: CONSENT HANDLING ---
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
            
            try {
                for (const selector of consentSelectors) {
                    const btn = page.locator(selector).first();
                    if (await btn.isVisible({ timeout: 500 })) { 
                        log.info(`[Consent] Found button: ${selector}, clicking...`);
                        await Promise.all([
                            page.waitForLoadState('load', { timeout: 15000 }).catch(() => {}),
                            btn.click()
                        ]);
                        log.info(`[Consent] Accepted.`);
                        await page.waitForTimeout(2000);
                        return true;
                    }
                }
            } catch (e) {
                log.debug('Consent check skipped/failed: ' + e.message);
            }
            return false;
        };

        // Run consent handling on Maps pages
        if (request.label === 'START' || request.label === 'DETAIL') {
            await handleConsent();
        }

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
            // Scroll loop
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

            let mapsData = {
                title,
                address,
                phone,
                website,
                mapsUrl: request.url,
                scrapedAt: new Date().toISOString()
            };

            // --- PHASE 2: ENRICHMENT (HTTP + Fallback) ---
            let finalMapsData = { ...mapsData };
            
            if (website && enrichWebsite && enrichedCount < maxEnrich) {
                enrichedCount++;
                log.info(`Enriching ${website} (HTTP)...`);
                
                const { techStack, status, error } = await enrichWithHttp(website);
                
                if (status === 'success') {
                    log.info(`[HTTP] Enriched ${title}: ${techStack.join(', ')}`);
                    finalMapsData = { ...finalMapsData, techStack, enrichmentStatus: 'success' };
                    await Dataset.pushData(finalMapsData);
                } else {
                    log.warning(`[HTTP] Failed for ${website}: ${error}. Falling back to Playwright.`);
                    // Enqueue explicitly for Playwright enrichment if HTTP fails
                    await crawler.addRequests([{
                        url: website,
                        label: 'ENRICH_FALLBACK',
                        userData: { mapsData: finalMapsData },
                        maxRetries: 1 // Limit retries to 1 for enrichment fallback
                    }]);
                    // Return here to avoid pushing data twice or pushing incomplete data
                    return; 
                }
            } else {
                 if (website && enrichedCount >= maxEnrich) {
                     log.info(`Skipping enrichment for ${title} (Limit reached).`);
                     finalMapsData = { ...finalMapsData, enrichmentStatus: 'skipped-limit' };
                 } else {
                     finalMapsData = { ...finalMapsData, enrichmentStatus: website ? 'skipped-config' : 'no-website' };
                 }
                 await Dataset.pushData(finalMapsData);
            }
        }

        // --- PHASE 2: ENRICH FALLBACK (Playwright) ---
        if (request.label === 'ENRICH_FALLBACK') {
            const { mapsData } = request.userData;
            log.info(`[Fallback] Enriching ${request.url} with Playwright...`);

            try {
                // Import locally or move detectTech to utils
                // Since we imported { detectTech } from utils/enrichment.js but detectTech needs cheerio loaded 
                // which is handled inside the utility. Wait, detectTech in utils takes (html, headers).
                // We need to import detectTech from utils.
                
                // (Note: `detectTech` is not imported in this scope yet in the file I wrote? 
                // Ah, I need to check my import statement in this `write` call.)
                // I imported `enrichWithHttp`, but I should also import `detectTech` if I want to use it here.
                // Or I can just do a simple check here since it's a fallback. 
                // Let's rely on the one in utils.
                
                const response = await page.waitForResponse(resp => resp.url() === request.url, { timeout: 10000 }).catch(() => null);
                const headers = response ? response.headers() : {};
                const html = await page.content();
                
                // Dynamic import to avoid top-level await issues if any (though we are in module)
                // actually I can just import it at top.
                const { detectTech } = await import('./utils/enrichment.js');
                
                const techStack = detectTech(html, headers);
                log.info(`[Fallback] Detected Tech: ${techStack.join(', ')}`);

                await Dataset.pushData({
                    ...mapsData,
                    techStack,
                    enrichmentStatus: 'success-fallback'
                });
            } catch (e) {
                log.error(`[Fallback] Failed for ${request.url}: ${e.message}`);
                await Dataset.pushData({
                    ...mapsData,
                    techStack: [],
                    enrichmentStatus: 'failed-fallback',
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
