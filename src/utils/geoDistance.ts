/**
 * Geographic Distance & Air Routing Calculation Utilities
 * Supports Ground/Road routing, Haversine Air Distance (Great-Circle Distance),
 * and intelligent City/Country coordinate dictionaries.
 */

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

/**
 * Calculates straight-line aerial flight distance between two GPS coordinates using the Haversine formula.
 */
export function calculateAirDistanceKm(
    lat1: number | string | null | undefined,
    lon1: number | string | null | undefined,
    lat2: number | string | null | undefined,
    lon2: number | string | null | undefined
): number | null {
    if (
        lat1 === null || lat1 === undefined || lat1 === '' ||
        lon1 === null || lon1 === undefined || lon1 === '' ||
        lat2 === null || lat2 === undefined || lat2 === '' ||
        lon2 === null || lon2 === undefined || lon2 === ''
    ) {
        return null;
    }

    const pLat = Number(lat1);
    const pLon = Number(lon1);
    const dLat = Number(lat2);
    const dLon = Number(lon2);

    if (isNaN(pLat) || isNaN(pLon) || isNaN(dLat) || isNaN(dLon)) {
        return null;
    }

    if (pLat === dLat && pLon === dLon) {
        return 0;
    }

    const R = 6371; // Earth radius in km
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLatRad = toRad(dLat - pLat);
    const dLonRad = toRad(dLon - pLon);

    const a =
        Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
        Math.cos(toRad(pLat)) *
        Math.cos(toRad(dLat)) *
        Math.sin(dLonRad / 2) *
        Math.sin(dLonRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    return Math.round(distanceKm);
}

/**
 * Estimates flight cargo transit duration in hours and minutes
 * Based on average commercial cargo flight cruise speed (~750 km/h) + standard ground/handling buffer
 */
export function estimateFlightDuration(distanceKm: number): string {
    if (!distanceKm || distanceKm <= 0) return '—';
    const cruiseHours = distanceKm / 750;
    const totalHours = Math.max(1, Math.round(cruiseHours * 10) / 10);
    
    if (totalHours < 1) {
        return `${Math.round(totalHours * 60)} mins (Flight)`;
    }
    const wholeHours = Math.floor(totalHours);
    const remainingMins = Math.round((totalHours - wholeHours) * 60);
    return remainingMins > 0 ? `${wholeHours}h ${remainingMins}m (Flight)` : `${wholeHours}h (Flight)`;
}

export interface ResolvedDistance {
    distanceStr: string;
    distanceKm: number | null;
    isAirDistance: boolean;
}

/**
 * Unified distance resolver for Quote Requests & Negotiations.
 * 1. Uses explicit driving/road distance (distance_km, distance, est_distance) if available.
 * 2. If road distance is missing, calculates Haversine Air Distance via GPS coordinates.
 * 3. If GPS coordinates are missing, extracts coordinates from pickup/delivery address/city names!
 * 4. Returns structured result with display string and metadata.
 */
export function resolveQuoteDistance(raw: {
    distance_km?: any;
    distanceKm?: any;
    distance?: any;
    est_distance?: any;
    estDistance?: any;
    distance_miles?: any;
    pickup_lat?: any;
    pickup_lng?: any;
    delivery_lat?: any;
    delivery_lng?: any;
    pickupLat?: any;
    pickupLng?: any;
    deliveryLat?: any;
    deliveryLng?: any;
    pickup_address?: any;
    delivery_address?: any;
    pickup_city?: any;
    delivery_city?: any;
    pickup?: any;
    delivery?: any;
    [key: string]: any;
}): ResolvedDistance {
    if (!raw) {
        return { distanceStr: '—', distanceKm: null, isAirDistance: false };
    }

    const directKm = raw.distance_km ?? raw.distanceKm;
    const fallbackDist = raw.distance ?? raw.est_distance ?? raw.estDistance ?? raw.distance_miles;

    // 1. Direct numeric distance_km
    if (directKm !== undefined && directKm !== null && directKm !== '' && !isNaN(Number(directKm)) && Number(directKm) > 0) {
        const kmVal = Number(directKm);
        const isAir = Boolean(raw.is_air_route || raw.isAirDistance);
        return {
            distanceStr: `${kmVal.toLocaleString()} km${isAir ? ' (Air)' : ''}`,
            distanceKm: kmVal,
            isAirDistance: isAir,
        };
    }

    // 2. String distance field if already formatted
    if (typeof fallbackDist === 'string' && fallbackDist.trim() !== '' && fallbackDist !== '—' && fallbackDist !== '-') {
        const isAir = fallbackDist.toLowerCase().includes('(air)') || fallbackDist.toLowerCase().includes('flight') || fallbackDist.includes('✈');
        const numOnly = parseFloat(fallbackDist.replace(/[^0-9.]/g, ''));
        return {
            distanceStr: fallbackDist.toLowerCase().includes('km') || fallbackDist.toLowerCase().includes('mi') ? fallbackDist : `${fallbackDist} km`,
            distanceKm: !isNaN(numOnly) ? numOnly : null,
            isAirDistance: isAir,
        };
    }

    if (typeof fallbackDist === 'number' && fallbackDist > 0) {
        return {
            distanceStr: `${fallbackDist.toLocaleString()} km`,
            distanceKm: fallbackDist,
            isAirDistance: false,
        };
    }

    // 3. Haversine Air Distance calculation using GPS Coordinates
    let pLat = raw.pickup_lat ?? raw.pickupLat;
    let pLng = raw.pickup_lng ?? raw.pickupLng;
    let dLat = raw.delivery_lat ?? raw.deliveryLat;
    let dLng = raw.delivery_lng ?? raw.deliveryLng;

    // 4. Fallback: If coordinates not present, extract from address / city strings
    if (pLat === null || pLat === undefined || pLng === null || pLng === undefined) {
        const pickupStr = raw.pickup_address || raw.pickup_city || raw.pickup || '';
        const pCoords = extractCoordinatesFromAddress(pickupStr);
        if (pCoords) {
            pLat = pCoords[0];
            pLng = pCoords[1];
        }
    }

    if (dLat === null || dLat === undefined || dLng === null || dLng === undefined) {
        const deliveryStr = raw.delivery_address || raw.delivery_city || raw.delivery || '';
        const dCoords = extractCoordinatesFromAddress(deliveryStr);
        if (dCoords) {
            dLat = dCoords[0];
            dLng = dCoords[1];
        }
    }

    const airKm = calculateAirDistanceKm(pLat, pLng, dLat, dLng);
    if (airKm !== null && airKm > 0) {
        return {
            distanceStr: `${airKm.toLocaleString()} km (Air)`,
            distanceKm: airKm,
            isAirDistance: true,
        };
    }

    // 5. Default empty fallback
    return {
        distanceStr: '—',
        distanceKm: null,
        isAirDistance: false,
    };
}
