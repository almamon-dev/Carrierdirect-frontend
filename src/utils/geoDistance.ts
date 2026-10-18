/**
 * Geographic Distance & Air Routing Calculation Utilities
 * Supports Ground/Road routing, Haversine Air Distance (Great-Circle Distance),
 * and intelligent City/Country coordinate dictionaries.
 */
import {
    KNOWN_CITY_COORDINATES,
    extractCoordinatesFromAddress
} from './knownCoordinates';

export { KNOWN_CITY_COORDINATES, extractCoordinatesFromAddress };

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

    if (directKm !== undefined && directKm !== null && directKm !== '' && !isNaN(Number(directKm)) && Number(directKm) > 0) {
        const kmVal = Number(directKm);
        const isAir = Boolean(raw.is_air_route || raw.isAirDistance);
        return {
            distanceStr: `${kmVal.toLocaleString()} km${isAir ? ' (Air)' : ''}`,
            distanceKm: kmVal,
            isAirDistance: isAir,
        };
    }

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

    let pLat = raw.pickup_lat ?? raw.pickupLat;
    let pLng = raw.pickup_lng ?? raw.pickupLng;
    let dLat = raw.delivery_lat ?? raw.deliveryLat;
    let dLng = raw.delivery_lng ?? raw.deliveryLng;

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

    return {
        distanceStr: '—',
        distanceKm: null,
        isAirDistance: false,
    };
}
