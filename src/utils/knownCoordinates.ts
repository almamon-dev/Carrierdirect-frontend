// Well-known coordinates for international & regional logistics hubs
export const KNOWN_CITY_COORDINATES: Record<string, [number, number]> = {
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

    // Bangladesh
    'dhaka': [23.8103, 90.4125],
    'chattogram': [22.3569, 91.7832],
    'chittagong': [22.3569, 91.7832],
    'sylhet': [24.8949, 91.8687],
    'khulna': [22.8456, 89.5403],
    'rajshahi': [24.3636, 88.6241],
    'barishal': [22.7010, 90.3535],
    'barisal': [22.7010, 90.3535],
    'rangpur': [25.7439, 89.2752],
    'mymensingh': [24.7471, 90.4203],
    'cox\'s bazar': [21.4272, 92.0058],
    'coxs bazar': [21.4272, 92.0058],
    'gazipur': [23.9999, 90.4203],
    'narayanganj': [23.6238, 90.5000],
    'benapole': [23.0396, 88.8976],

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
    'london': [51.5074, -0.1278],
    'frankfurt': [50.1109, 8.6821],
    'amsterdam': [52.3676, 4.9041],
    'paris': [48.8566, 2.3522],
    'new york': [40.7128, -74.0060],
    'chicago': [41.8781, -87.6298],
    'los angeles': [34.0522, -118.2437],
    'toronto': [43.6532, -79.3832],
};

/**
 * Extracts approximate coordinates from an address string or city/country name.
 */
export function extractCoordinatesFromAddress(addr?: string): [number, number] | null {
    if (!addr || typeof addr !== 'string') return null;
    const lower = addr.toLowerCase();

    for (const [city, coords] of Object.entries(KNOWN_CITY_COORDINATES)) {
        if (lower.includes(city)) {
            return coords;
        }
    }

    // Country level rough coordinates fallback
    if (lower.includes('united arab emirates') || lower.includes('uae')) return [25.2048, 55.2708];
    if (lower.includes('bangladesh')) return [23.8103, 90.4125];
    if (lower.includes('india')) return [28.6139, 77.2090];
    if (lower.includes('china')) return [31.2304, 121.4737];
    if (lower.includes('united kingdom') || lower.includes('uk')) return [51.5074, -0.1278];
    if (lower.includes('united states') || lower.includes('usa')) return [40.7128, -74.0060];
    if (lower.includes('germany')) return [50.1109, 8.6821];

    return null;
}
