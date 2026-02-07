import axios from 'axios';
import * as cheerio from 'cheerio';
import { PlaywrightCrawler } from 'crawlee';

/**
 * Detects technologies from HTML content and headers.
 * @param {string} html 
 * @param {object} headers 
 * @returns {string[]} Detected technologies
 */
export const detectTech = (html, headers = {}) => {
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

/**
 * Enriches a website URL using HTTP requests (Axios + Cheerio).
 * Falls back to Playwright if needed (not implemented here, handled in caller).
 * @param {string} url 
 * @returns {Promise<{techStack: string[], status: string, error?: string}>}
 */
export const enrichWithHttp = async (url) => {
    try {
        const response = await axios.get(url, {
            timeout: 30000, // Increased to 30s as per Phase 1 reqs
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            validateStatus: (status) => status < 400
        });

        const techStack = detectTech(response.data, response.headers);
        return { techStack, status: 'success' };
    } catch (error) {
        return { techStack: [], status: 'failed', error: error.message };
    }
};
