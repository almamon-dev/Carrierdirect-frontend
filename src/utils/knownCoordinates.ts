// Specific local neighborhoods & logistics hubs checked with top priority
export const SPECIFIC_LOCALITIES: Record<string, [number, number]> = {
    'tongi': [23.8981, 90.3972],
    'dhanmondi': [23.7534, 90.3698],
    'tejgaon': [23.7644, 90.3987],
    'uttara': [23.8759, 90.3795],
    'airport': [23.8433, 90.4038],
    'banasree': [23.7622, 90.4293],
    'rampura': [23.7610, 90.4200],
    'gulshan': [23.7925, 90.4078],
    'banani': [23.7937, 90.4066],
    'mirpur': [23.8071, 90.3686],
    'motijheel': [23.7330, 90.4172],
    'agrabad': [22.3243, 91.8142],
    'halishahar': [22.3167, 91.7833],
    'cepz': [22.2858, 91.7766],
    'savar': [23.8475, 90.2577],
    'ashulia': [23.9077, 90.3178],
    'keraniganj': [23.6826, 90.3734],
    'narayanganj': [23.6238, 90.5000],
};

// Well-known coordinates for international & regional logistics hubs
export const KNOWN_CITY_COORDINATES: Record<string, [number, number]> = {
    // Bangladesh Greater Dhaka & Key Districts
    'gazipur': [23.9999, 90.4203],
    'tongi': [23.8981, 90.3972],
    'dhaka': [23.8103, 90.4125],
    'dhanmondi': [23.7534, 90.3698],
    'tejgaon': [23.7644, 90.3987],
    'uttara': [23.8759, 90.3795],
    'banasree': [23.7622, 90.4293],
    'gulshan': [23.7925, 90.4078],
    'banani': [23.7937, 90.4066],
    'mirpur': [23.8071, 90.3686],
    'motijheel': [23.7330, 90.4172],
    'savar': [23.8475, 90.2577],
    'ashulia': [23.9077, 90.3178],
    'keraniganj': [23.6826, 90.3734],
    'narayanganj': [23.6238, 90.5000],
    'tangail': [24.2513, 89.9167],
    'mymensingh': [24.7471, 90.4203],

    // Bangladesh Port & Major Divisions
    'chattogram': [22.3569, 91.7832],
    'chittagong': [22.3569, 91.7832],
    'agrabad': [22.3275, 91.8123],
    "cox's bazar": [21.4272, 92.0058],
    'coxs bazar': [21.4272, 92.0058],
    'sylhet': [24.8949, 91.8687],
    'khulna': [22.8456, 89.5403],
    'benapole': [23.0396, 88.8976],
    'jashore': [23.1664, 89.2081],
    'jessore': [23.1664, 89.2081],
    'rajshahi': [24.3636, 88.6241],
    'bogura': [24.8481, 89.3730],
    'bogra': [24.8481, 89.3730],
    'pabna': [24.0064, 89.2372],
    'sirajganj': [24.4534, 89.7008],
    'kushtia': [23.9013, 89.1205],
    'barishal': [22.7010, 90.3535],
    'barisal': [22.7010, 90.3535],
    'rangpur': [25.7439, 89.2752],
    'cumilla': [23.4682, 91.1788],
    'comilla': [23.4682, 91.1788],
    'feni': [23.0159, 91.3976],
    'noakhali': [22.8696, 91.0998],
    'brahmanbaria': [23.9608, 91.1115],

    // Ireland & Northern Ireland
    'dublin': [53.3498, -6.2603],
    'balbriggan': [53.6111, -6.1833],
    'cork': [51.8985, -8.4756],
    'limerick': [52.6638, -8.6267],
    'galway': [53.2707, -9.0568],
    'shannon': [52.7126, -8.9248],
    'waterford': [52.2593, -7.1101],
    'drogheda': [53.7145, -6.3503],
    'dundalk': [54.0039, -6.4022],
    'swords': [53.4597, -6.2181],
    'bray': [53.2009, -6.0989],
    'navan': [53.6528, -6.6814],
    'kilkenny': [52.6541, -7.2448],
    'belfast': [54.5973, -5.9301],
    'ireland': [53.3498, -6.2603],

    // United Kingdom
    'london': [51.5074, -0.1278],
    'manchester': [53.4808, -2.2426],
    'birmingham': [52.4862, -1.8904],
    'liverpool': [53.4084, -2.9916],
    'leeds': [53.8008, -1.5491],
    'bristol': [51.4545, -2.5879],
    'glasgow': [55.8642, -4.2518],
    'edinburgh': [55.9533, -3.1883],
    'cardiff': [51.4816, -3.1791],

    // UAE / Middle East
    'dubai': [25.2048, 55.2708],
    'abu dhabi': [24.4539, 54.3773],
    'sharjah': [25.3463, 55.4209],
    'doha': [25.2854, 51.5310],
    'riyadh': [24.7136, 46.6753],
    'jeddah': [21.4858, 39.1925],
    'muscat': [23.5880, 58.3829],
    'kuwait': [29.3759, 47.9774],
    'bahrain': [26.0667, 50.5577],

    // India & South Asia
    'kolkata': [22.5726, 88.3639],
    'delhi': [28.6139, 77.2090],
    'mumbai': [19.0760, 72.8777],
    'chennai': [13.0827, 80.2707],
    'bangalore': [12.9716, 77.5946],
    'karachi': [24.8607, 67.0011],
    'lahore': [31.5204, 74.3587],
    'colombo': [6.9271, 79.8612],
    'kathmandu': [27.7172, 85.3240],

    // China & East/SE Asia
    'guangzhou': [23.1291, 113.2644],
    'shanghai': [31.2304, 121.4737],
    'shenzhen': [22.5431, 114.0579],
    'beijing': [39.9042, 116.4074],
    'hong kong': [22.3193, 114.1694],
    'singapore': [1.3521, 103.8198],
    'bangkok': [13.7563, 100.5018],
    'kuala lumpur': [3.1390, 101.6869],

    // Europe & Americas
    'frankfurt': [50.1109, 8.6821],
    'amsterdam': [52.3676, 4.9041],
    'paris': [48.8566, 2.3522],
    'rotterdam': [51.9244, 4.4777],
    'antwerp': [51.2194, 4.4025],
    'hamburg': [53.5511, 9.9937],
    'munich': [48.1351, 11.5820],
    'berlin': [52.5200, 13.4050],
    'warsaw': [52.2297, 21.0122],
    'milan': [45.4642, 9.1900],
    'madrid': [40.4168, -3.7038],
    'barcelona': [41.3879, 2.1699],
    'new york': [40.7128, -74.0060],
    'chicago': [41.8781, -87.6298],
    'los angeles': [34.0522, -118.2437],
    'toronto': [43.6532, -79.3832],
};

/**
 * Extracts approximate coordinates from an address string or city/country name.
 * Prioritizes longer/more specific tokens (e.g. "tongi", "dhanmondi", "gazipur").
 */
export function extractCoordinatesFromAddress(addr?: string): [number, number] | null {
    if (!addr || typeof addr !== 'string') return null;
    const lower = addr.toLowerCase();

    // 1. Check specific neighborhood & terminal localities first
    for (const [locality, coords] of Object.entries(SPECIFIC_LOCALITIES)) {
        if (lower.includes(locality)) {
            return coords;
        }
    }

    // 2. Sort entries by key length descending so specific hubs match first (e.g. 'cox\'s bazar' before 'bazar')
    const sortedEntries = Object.entries(KNOWN_CITY_COORDINATES).sort((a, b) => b[0].length - a[0].length);

    for (const [city, coords] of sortedEntries) {
        if (lower.includes(city)) {
            return coords;
        }
    }

    // Country level rough coordinates fallback
    if (lower.includes('united arab emirates') || lower.includes('uae')) return [25.2048, 55.2708];
    if (lower.includes('bangladesh') || lower.includes('bd')) return [23.8103, 90.4125];
    if (lower.includes('ireland')) return [53.3498, -6.2603];
    if (lower.includes('united kingdom') || lower.includes('uk') || lower.includes('great britain')) return [51.5074, -0.1278];
    if (lower.includes('india')) return [28.6139, 77.2090];
    if (lower.includes('china')) return [31.2304, 121.4737];
    if (lower.includes('united states') || lower.includes('usa')) return [40.7128, -74.0060];
    if (lower.includes('germany') || lower.includes('deutschland')) return [50.1109, 8.6821];

    return null;
}
