/**
 * Standardized Address Formatter for CarrierDirect
 *
 * Enforces the standardized table column format:
 * "Country, City, State/Region, ZIP/Postal Code"
 *
 * Examples:
 * - Germany, Hamburg, Hamburg, 21129
 * - Germany, Munich, Bavaria, 80331
 * - United Kingdom, Manchester, England, M1 1AE
 * - Bangladesh, Dhaka, Dhaka Division, 1216
 */

const KNOWN_COUNTRIES = [
    'Germany', 'Deutschland',
    'Bangladesh',
    'United Kingdom', 'UK', 'Great Britain',
    'United States', 'USA', 'US',
    'France', 'Italy', 'Spain', 'Netherlands', 'Poland', 'Belgium',
    'Sweden', 'Norway', 'Denmark', 'Austria', 'Switzerland', 'Ireland',
    'India', 'Pakistan', 'Canada', 'Australia', 'UAE', 'Saudi Arabia'
];

// Regex for UK postcodes (e.g. M1 1AE, SW1A 1AA)
const UK_POSTCODE_REGEX = /\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i;
// Regex for 4-6 digit numeric postal codes (e.g. 21129, 80331, 1216, 4000)
const NUMERIC_ZIP_REGEX = /\b(\d{4,6})\b/;

// Street patterns to strip from table displays
const STREET_PATTERNS = [
    /^\s*\d+[\w/-]*\s+/i, // "218/7 ", "123 "
    /\b(?:house|flat|apt|apartment|suite|floor|level|room|block|holding|plot|gate|dock|building)\b[^,]*[,\s]*/gi,
    /\b(?:road|rd|street|st|avenue|ave|lane|ln|boulevard|blvd|highway|expressway|sarani|chowrasta|rasta)\b[^,]*[,\s]*/gi,
    /\b(?:straße|strasse|str\.|weg|platz|allee|damm|gasse|ufer|chaussee)\b[^,]*[,\s]*/gi,
    /\b(?:commercial area|industrial area|epz|sector\s*\d+|ward\s*\d+)\b[^,]*[,\s]*/gi,
];

/**
 * Standardizes an address string to: Country, City, State/Region, ZIP
 */
export function formatAddressString(rawAddress?: string | null): string {
    if (!rawAddress || rawAddress === '—' || rawAddress === '-' || rawAddress.trim() === '') {
        return '—';
    }

    const trimmed = rawAddress.trim();

    // Check for ZIP/Postal code
    let zip = '';
    const ukMatch = trimmed.match(UK_POSTCODE_REGEX);
    if (ukMatch) {
        zip = ukMatch[1].toUpperCase();
    } else {
        const numMatch = trimmed.match(NUMERIC_ZIP_REGEX);
        if (numMatch) {
            zip = numMatch[1];
        }
    }

    // Clean address of ZIP before parsing other tokens
    let cleaned = trimmed
        .replace(UK_POSTCODE_REGEX, '')
        .replace(NUMERIC_ZIP_REGEX, '')
        .replace(/\b(?:ZIP|Postal Code|PLZ):?\s*[A-Z0-9 -]+\b/gi, '')
        .replace(/\(\s*\)/g, '')
        .trim();

    // Split into segments by comma
    const segments = cleaned
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    if (segments.length === 0) {
        return zip || trimmed;
    }

    // Identify country
    let country = '';
    const nonCountrySegments: string[] = [];

    for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const matchedCountry = KNOWN_COUNTRIES.find(
            (c) => c.toLowerCase() === seg.toLowerCase()
        );
        if (matchedCountry && !country) {
            country = matchedCountry;
        } else {
            nonCountrySegments.push(seg);
        }
    }

    // Default country if obvious (fallback to Bangladesh if BD division/zip)
    if (!country) {
        const fullLower = trimmed.toLowerCase();
        if (
            fullLower.includes('dhaka') ||
            fullLower.includes('chattogram') ||
            fullLower.includes('chittagong') ||
            fullLower.includes('sylhet') ||
            fullLower.includes('rajshahi') ||
            fullLower.includes('khulna') ||
            fullLower.includes('barisal') ||
            fullLower.includes('rangpur') ||
            fullLower.includes('mymensingh') ||
            fullLower.includes('kishorganj') ||
            fullLower.includes('agrabad')
        ) {
            country = 'Bangladesh';
        } else if (
            fullLower.includes('hamburg') ||
            fullLower.includes('munich') ||
            fullLower.includes('münchen') ||
            fullLower.includes('berlin') ||
            fullLower.includes('frankfurt') ||
            fullLower.includes('bavaria') ||
            fullLower.includes('bayern')
        ) {
            country = 'Germany';
        } else if (
            fullLower.includes('london') ||
            fullLower.includes('manchester') ||
            fullLower.includes('birmingham') ||
            fullLower.includes('england') ||
            fullLower.includes('scotland')
        ) {
            country = 'United Kingdom';
        }
    }

    // Filter out street-level details from segments
    const validLocationTokens = nonCountrySegments.filter((seg) => {
        let isStreet = false;
        for (const pattern of STREET_PATTERNS) {
            if (pattern.test(seg)) {
                isStreet = true;
                break;
            }
        }
        return !isStreet && seg.length > 1;
    });

    let city = '';
    let state = '';

    if (validLocationTokens.length >= 2) {
        city = validLocationTokens[0];
        state = validLocationTokens[1];
    } else if (validLocationTokens.length === 1) {
        city = validLocationTokens[0];
    } else if (nonCountrySegments.length > 0) {
        // Fallback: take the last non-country segment which is most likely city
        city = nonCountrySegments[nonCountrySegments.length - 1];
    }

    // Assemble components in order: Country, City, State/Region, ZIP
    const components: string[] = [];
    if (country) components.push(country);
    if (city && city.toLowerCase() !== country.toLowerCase()) components.push(city);
    if (state && state.toLowerCase() !== country.toLowerCase() && state.toLowerCase() !== city.toLowerCase()) {
        components.push(state);
    }
    if (zip) components.push(zip);

    return components.length > 0 ? components.join(', ') : trimmed;
}

/**
 * Universal Address Resolver and Formatter for table rows
 * Extracts Country, City, State/Region, ZIP from row objects or strings.
 *
 * @param source - Table row object or raw address string
 * @param type - 'pickup' | 'delivery'
 */
export function formatStandardAddress(
    source: any,
    type: 'pickup' | 'delivery' = 'pickup'
): string {
    if (!source) return '—';

    // If source is a simple string, format it directly
    if (typeof source === 'string') {
        return formatAddressString(source);
    }

    // Try extracting from structured object fields
    const prefix = type === 'pickup' ? 'pickup' : 'delivery';
    const altPrefix = type === 'pickup' ? 'origin' : 'destination';

    const subObj = source[type] || source.quote_request || source.quoteRequest || source.shipping || source.route || {};
    const nested = typeof subObj === 'object' ? subObj : {};

    // 1. Country
    const country =
        source[`${prefix}_country`] ||
        source[`${altPrefix}_country`] ||
        nested[`${prefix}_country`] ||
        nested.country ||
        (type === 'pickup' ? (source.shipper?.country || source.from_country) : (source.consignee?.country || source.to_country)) ||
        '';

    // 2. City
    const city =
        source[`${prefix}_city`] ||
        source[`${altPrefix}_city`] ||
        nested[`${prefix}_city`] ||
        nested.city ||
        (type === 'pickup' ? (source.shipper?.city || source.from_city) : (source.consignee?.city || source.to_city)) ||
        '';

    // 3. State / Region
    const state =
        source[`${prefix}_state`] ||
        source[`${altPrefix}_state`] ||
        source[`${prefix}_region`] ||
        nested[`${prefix}_state`] ||
        nested.state ||
        nested.region ||
        (type === 'pickup' ? (source.shipper?.state || source.from_state) : (source.consignee?.state || source.to_state)) ||
        '';

    // 4. ZIP / Postal Code
    const zip =
        source[`${prefix}_zip`] ||
        source[`${altPrefix}_zip`] ||
        source[`${prefix}_postal_code`] ||
        source[`${prefix}_postalCode`] ||
        nested[`${prefix}_zip`] ||
        nested.zip ||
        nested.postal_code ||
        nested.postalCode ||
        (type === 'pickup' ? (source.shipper?.zip || source.from_zip) : (source.consignee?.zip || source.to_zip)) ||
        '';

    // If we have at least 2 structured fields, construct cleanly:
    if (country || (city && (state || zip))) {
        const parts: string[] = [];
        if (country) parts.push(String(country).trim());
        if (city && String(city).trim().toLowerCase() !== String(country).trim().toLowerCase()) {
            parts.push(String(city).trim());
        }
        if (state && String(state).trim().toLowerCase() !== String(country).trim().toLowerCase()) {
            parts.push(String(state).trim());
        }
        if (zip) parts.push(String(zip).trim());

        if (parts.length >= 2) {
            return parts.join(', ');
        }
    }

    // Fallback: Check raw address fields and format via parser
    const rawAddress =
        source[type] ||
        source[`${prefix}_address`] ||
        source[`${prefix}_full_address`] ||
        source[`${prefix}FullAddress`] ||
        source[altPrefix] ||
        nested[`${prefix}_address`] ||
        nested.address ||
        (type === 'pickup' ? source.shipper?.address : source.consignee?.address) ||
        city;

    if (rawAddress && typeof rawAddress === 'string') {
        const formatted = formatAddressString(rawAddress);
        // If parser found country & city but was missing zip/state, inject any known zip/state
        if (zip && !formatted.includes(zip)) {
            return `${formatted}, ${zip}`;
        }
        return formatted;
    }

    return '—';
}

/**
 * Standardizes a Route string to: "Origin → Destination" using standard formatting
 */
export function formatStandardRoute(
    source: any,
    fallback?: string
): string {
    if (!source) return fallback || '—';

    const origin = formatStandardAddress(source, 'pickup');
    const destination = formatStandardAddress(source, 'delivery');

    if (origin !== '—' && destination !== '—') {
        return `${origin} → ${destination}`;
    }

    if (typeof source === 'string' && source.includes('→')) {
        const [from, to] = source.split('→').map(s => s.trim());
        return `${formatAddressString(from)} → ${formatAddressString(to)}`;
    }

    if (typeof source === 'string' && source.includes('to')) {
        const [from, to] = source.split(/\bto\b/i).map(s => s.trim());
        return `${formatAddressString(from)} → ${formatAddressString(to)}`;
    }

    return fallback || '—';
}

const COUNTRY_CODE_MAP: Record<string, string> = {
    'germany': 'DE', 'deutschland': 'DE',
    'netherlands': 'NL', 'the netherlands': 'NL', 'holland': 'NL',
    'united kingdom': 'UK', 'uk': 'UK', 'england': 'UK', 'great britain': 'UK',
    'france': 'FR',
    'belgium': 'BE',
    'italy': 'IT', 'italia': 'IT',
    'spain': 'ES', 'españa': 'ES',
    'ireland': 'IE',
    'poland': 'PL', 'polska': 'PL',
    'austria': 'AT', 'österreich': 'AT',
    'switzerland': 'CH',
    'sweden': 'SE',
    'denmark': 'DK',
    'portugal': 'PT',
    'czech republic': 'CZ', 'czechia': 'CZ',
    'hungary': 'HU',
    'bangladesh': 'BD',
    'united states': 'US', 'usa': 'US',
};

export function formatCompactAddress(raw: any): string {
    if (!raw) return '—';
    const str = typeof raw === 'string' ? raw : (raw.city ? `${raw.city}, ${raw.country || ''}` : formatStandardAddress(raw));
    if (!str || str === '—') return '—';

    const parts = str.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 0);
    if (parts.length === 0) return '—';

    const firstLower = parts[0].toLowerCase();
    if (COUNTRY_CODE_MAP[firstLower] && parts.length >= 2) {
        const code = COUNTRY_CODE_MAP[firstLower];
        const city = parts[1];
        return `${city}, ${code}`;
    }

    const lastLower = parts[parts.length - 1].toLowerCase();
    if (COUNTRY_CODE_MAP[lastLower] && parts.length >= 2) {
        const code = COUNTRY_CODE_MAP[lastLower];
        const city = parts[0];
        return `${city}, ${code}`;
    }

    if (parts.length >= 2) {
        return `${parts[0]}, ${parts[1]}`;
    }
    return parts[0];
}

/**
 * Compact Route Formatter for narrow table columns (e.g. "London, UK → Manchester, UK" or "Berlin, DE → Amsterdam, NL")
 */
export function formatCompactRoute(
    source: any,
    fallback?: string
): string {
    if (!source) return fallback || '—';

    // 1. Try explicit city/country properties
    const fromCity = source.pickup_city || source.origin_city || source.quote_request?.pickup_city;
    const toCity = source.delivery_city || source.destination_city || source.quote_request?.delivery_city;
    const fromCountry = source.pickup_country || source.origin_country || source.quote_request?.pickup_country;
    const toCountry = source.delivery_country || source.destination_country || source.quote_request?.delivery_country;

    if (fromCity && toCity) {
        const fromCode = fromCountry ? (COUNTRY_CODE_MAP[String(fromCountry).toLowerCase()] || fromCountry) : '';
        const toCode = toCountry ? (COUNTRY_CODE_MAP[String(toCountry).toLowerCase()] || toCountry) : '';
        const fromDisplay = fromCode ? `${fromCity}, ${fromCode}` : fromCity;
        const toDisplay = toCode ? `${toCity}, ${toCode}` : toCity;
        return `${fromDisplay} → ${toDisplay}`;
    }

    // 2. Try resolving from pickup & delivery structured fields or address strings
    const origin = formatStandardAddress(source, 'pickup');
    const destination = formatStandardAddress(source, 'delivery');

    if (origin !== '—' && destination !== '—') {
        const cOrigin = formatCompactAddress(origin);
        const cDest = formatCompactAddress(destination);
        if (cOrigin !== '—' && cDest !== '—') {
            return `${cOrigin} → ${cDest}`;
        }
    }

    // 3. Try string containing arrow
    if (typeof source === 'string' && source.includes('→')) {
        const [from, to] = source.split('→').map((s: string) => s.trim());
        return `${formatCompactAddress(from)} → ${formatCompactAddress(to)}`;
    }

    return fallback || '—';
}


export default formatStandardAddress;
