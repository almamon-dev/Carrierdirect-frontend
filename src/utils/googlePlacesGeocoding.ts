import { getGoogleMapsApiKey } from '@/components/googlePlacesService';
import { extractCoordinatesFromAddress } from './knownCoordinates';

const geocodeCache = new Map<string, [number, number]>();
const routeCache = new Map<string, { points: [number, number][]; distanceKm: number; distanceText: string; durationText: string }>();

/**
 * Decode Google encoded polyline string into array of [lat, lng] coordinates.
 */
export function decodeGooglePolyline(encoded: string): [number, number][] {
    const points: [number, number][] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
        let b: number;
        let shift = 0;
        let result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
}

/**
 * Geocodes an address string using Google Places TextSearch API (v1),
 * exactly matching the Flutter driver app implementation.
 * Falls back to known coordinates dictionary if API is offline.
 */
export async function geocodeAddressWithGooglePlaces(
    address: string,
    fallbackCity?: string
): Promise<[number, number] | null> {
    const clean = (address || '').trim();
    if (!clean || clean === '—' || clean === 'Origin' || clean === 'Destination') {
        return fallbackCity ? extractCoordinatesFromAddress(fallbackCity) : null;
    }

    const cacheKey = clean.toLowerCase();
    if (geocodeCache.has(cacheKey)) {
        return geocodeCache.get(cacheKey)!;
    }

    try {
        const apiKey = await getGoogleMapsApiKey();
        if (apiKey) {
            const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
                },
                body: JSON.stringify({ textQuery: clean }),
            });

            if (res.ok) {
                const data = await res.json();
                const place = data?.places?.[0];
                const loc = place?.location;
                if (loc?.latitude && loc?.longitude) {
                    const coords: [number, number] = [Number(loc.latitude), Number(loc.longitude)];
                    geocodeCache.set(cacheKey, coords);
                    return coords;
                }
            }
        }
    } catch (err) {
        console.warn('Google Places geocoding warning:', err);
    }

    // Fallback to local coordinate resolution
    const local = extractCoordinatesFromAddress(clean) || (fallbackCity ? extractCoordinatesFromAddress(fallbackCity) : null);
    if (local) {
        geocodeCache.set(cacheKey, local);
        return local;
    }

    return null;
}

/**
 * Helper to format duration seconds cleanly into Google Maps style (e.g. "6 hr 42 min" or "35 min")
 */
export function formatGoogleDuration(seconds: number): string {
    const mins = Math.max(1, Math.round(seconds / 60));
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0) {
        return remainingMins > 0 ? `${hours} hr ${remainingMins} min` : `${hours} hr`;
    }
    return `${mins} min`;
}

/**
 * Helper to format distance matching Google Maps style (e.g. "243 km" if >= 10 km, else "7.5 km")
 */
export function formatGoogleDistance(meters: number): string {
    const km = meters / 1000;
    if (km >= 10) {
        return `${Math.round(km)} km`;
    }
    return `${km.toFixed(1)} km`;
}

export interface GoogleRouteResult {
    index: number;
    label: string;
    description: string;
    distanceKm: number;
    distanceText: string;
    distanceMeters: number;
    durationMinutes: number;
    durationSeconds: number;
    durationText: string;
    points: [number, number][];
}

const routesCache = new Map<string, GoogleRouteResult[]>();

/**
 * Fetches real driving routes (primary + alternatives) from Google Routes API (v2:computeRoutes)
 * exactly matching native Google Maps routing, distances, durations, and geometry.
 */
export async function fetchGoogleDrivingRoutes(
    origin: [number, number],
    destination: [number, number]
): Promise<GoogleRouteResult[]> {
    const cacheKey = `${origin[0].toFixed(5)},${origin[1].toFixed(5)}->${destination[0].toFixed(5)},${destination[1].toFixed(5)}`;
    if (routesCache.has(cacheKey)) {
        return routesCache.get(cacheKey)!;
    }

    try {
        const apiKey = await getGoogleMapsApiKey();
        if (apiKey) {
            const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.description,routes.polyline.encodedPolyline',
                },
                body: JSON.stringify({
                    origin: {
                        location: {
                            latLng: {
                                latitude: origin[0],
                                longitude: origin[1],
                            },
                        },
                    },
                    destination: {
                        location: {
                            latLng: {
                                latitude: destination[0],
                                longitude: destination[1],
                            },
                        },
                    },
                    travelMode: 'DRIVE',
                    computeAlternativeRoutes: true,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const rawRoutes = data?.routes as any[];
                if (Array.isArray(rawRoutes) && rawRoutes.length > 0) {
                    const parsed: GoogleRouteResult[] = rawRoutes.map((r, idx) => {
                        const encoded = r.polyline?.encodedPolyline || '';
                        const points = encoded ? decodeGooglePolyline(encoded) : [origin, destination];
                        const meters = Number(r.distanceMeters || 0);
                        const distanceKm = meters > 0 ? Number((meters / 1000).toFixed(1)) : 0;
                        const durationRaw = String(r.duration || '1800s').replace('s', '');
                        const seconds = parseInt(durationRaw, 10) || 1800;
                        const durationMinutes = Math.max(1, Math.round(seconds / 60));
                        const durationText = formatGoogleDuration(seconds);
                        const desc = r.description || '';

                        return {
                            index: idx,
                            label: idx === 0 ? 'Fastest' : (desc ? `via ${desc.split('/')[0].trim()}` : `Alternative ${idx}`),
                            description: desc,
                            distanceKm,
                            distanceText: formatGoogleDistance(meters),
                            distanceMeters: meters,
                            durationMinutes,
                            durationSeconds: seconds,
                            durationText,
                            points,
                        };
                    });

                    routesCache.set(cacheKey, parsed);
                    return parsed;
                }
            }
        }
    } catch (err) {
        console.warn('Google Routes API fetch error:', err);
    }

    return [];
}

/**
 * Fetches primary driving route from Google Routes API (v2:computeRoutes)
 */
export async function fetchGoogleDrivingRoute(
    origin: [number, number],
    destination: [number, number]
): Promise<{ points: [number, number][]; distanceKm: number; distanceText: string; durationText: string } | null> {
    const all = await fetchGoogleDrivingRoutes(origin, destination);
    if (all.length > 0) {
        return {
            points: all[0].points,
            distanceKm: all[0].distanceKm,
            distanceText: all[0].distanceText,
            durationText: all[0].durationText,
        };
    }
    return null;
}
