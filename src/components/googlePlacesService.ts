import apiClient from "@/lib/axios";
import { SuggestionItem, LocationData } from "./googlePlacesTypes";

let cachedGoogleMapsApiKey: string | null = null;
let apiKeyFetchPromise: Promise<string | null> | null = null;
export const memorySuggestionCache = new Map<string, SuggestionItem[]>();

export const getGoogleMapsApiKey = async (): Promise<string | null> => {
    if (cachedGoogleMapsApiKey) return cachedGoogleMapsApiKey;
    if (apiKeyFetchPromise) return apiKeyFetchPromise;

    apiKeyFetchPromise = (async () => {
        try {
            const res = await apiClient.get("/maps-config", { silent: true });
            const key = res?.google_maps_key || res?.data?.google_maps_key;
            if (key) {
                cachedGoogleMapsApiKey = key;
                return key;
            }
        } catch (err) {
            console.warn("Failed to load Google Maps key from backend:", err);
            apiKeyFetchPromise = null;
        }

        const envFallback =
            (import.meta as any).env?.VITE_GOOGLE_MAPS_KEY ||
            (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
        if (envFallback) {
            cachedGoogleMapsApiKey = envFallback;
            return envFallback;
        }

        return null;
    })();

    return apiKeyFetchPromise;
};

export const fetchDirectGoogleSuggestions = async (
    query: string,
    apiKey: string,
    signal: AbortSignal,
    biasCoords?: { lat: number; lng: number } | null
): Promise<SuggestionItem[] | null> => {
    try {
        const centerLat = biasCoords?.lat || 23.8103;
        const centerLng = biasCoords?.lng || 90.4125;

        const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
            },
            body: JSON.stringify({
                input: query,
                includeQueryPredictions: true,
                locationBias: {
                    circle: {
                        center: {
                            latitude: centerLat,
                            longitude: centerLng,
                        },
                        radius: 60000.0,
                    },
                },
            }),
            signal,
        });

        if (response.ok) {
            const data = await response.json();
            if (data?.suggestions && Array.isArray(data.suggestions)) {
                return data.suggestions
                    .map((sug: any) => {
                        const pred = sug?.placePrediction;
                        if (!pred) return null;
                        const mainText = pred?.structuredFormat?.mainText?.text || pred?.text?.text || query;
                        const secondaryText = pred?.structuredFormat?.secondaryText?.text || "";
                        const fullText = pred?.text?.text || (secondaryText ? `${mainText}, ${secondaryText}` : mainText);
                        return {
                            id: pred?.placeId || `pl-${mainText}`,
                            name: mainText,
                            subtitle: secondaryText,
                            fullAddress: fullText,
                            types: pred?.types || [],
                            source: "google_direct",
                        };
                    })
                    .filter(Boolean) as SuggestionItem[];
            }
        }
    } catch (err: any) {
        if (err?.name === "AbortError") throw err;
    }
    return null;
};

export const fetchPlaceDetailsFromGoogle = async (
    placeId: string,
    apiKey: string,
    fallbackAddress: string
): Promise<LocationData | null> => {
    try {
        const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "id,displayName,formattedAddress,location,addressComponents",
            },
        });

        if (res.ok) {
            const data = await res.json();
            const placeLat = data?.location?.latitude ?? null;
            const placeLng = data?.location?.longitude ?? null;
            const displayName = data?.displayName?.text || "";
            let formattedAddress = data?.formattedAddress || fallbackAddress;

            // Preserve establishment / place name if not in formatted address
            if (displayName && !formattedAddress.toLowerCase().includes(displayName.toLowerCase())) {
                formattedAddress = `${displayName}, ${formattedAddress}`;
            }

            let city = "";
            let state = "";
            let country = "";
            let zip = "";

            if (Array.isArray(data?.addressComponents)) {
                for (const comp of data.addressComponents) {
                    const types: string[] = comp.types || [];
                    const text = comp.longText || comp.shortText || "";
                    if (types.includes("locality") || types.includes("postal_town") || types.includes("sublocality")) {
                        if (!city) city = text;
                    }
                    if (types.includes("administrative_area_level_1")) {
                        state = text;
                    }
                    if (types.includes("country")) {
                        country = text;
                    }
                    if (types.includes("postal_code")) {
                        zip = text;
                    }
                }
            }

            return {
                address: formattedAddress,
                lat: placeLat,
                lng: placeLng,
                city,
                state,
                country,
                zip,
                placeId,
            };
        }
    } catch {}
    return null;
};

export const resolveLocationDetails = async (item: SuggestionItem): Promise<LocationData> => {
    if (item.lat && item.lng && item.country) {
        return {
            address: item.fullAddress || item.name,
            lat: item.lat,
            lng: item.lng,
            city: item.city,
            state: item.state,
            country: item.country,
            zip: item.zip,
            placeId: item.id,
        };
    }

    const apiKey = await getGoogleMapsApiKey();
    if (apiKey && item.id && !item.id.startsWith("geo-") && !item.id.startsWith("pl-")) {
        const googleDetails = await fetchPlaceDetailsFromGoogle(
            item.id,
            apiKey,
            item.fullAddress || item.name
        );
        if (googleDetails) {
            if (item.name && !googleDetails.address.toLowerCase().includes(item.name.toLowerCase())) {
                googleDetails.address = `${item.name}, ${googleDetails.address}`;
            }
            return googleDetails;
        }
    }

    if (item.id && !item.id.startsWith("geo-")) {
        try {
            const res = await apiClient.get("/locations/place-details", {
                params: { place_id: item.id },
                silent: true,
            });
            const details = res?.data?.data || res?.data;
            if (details) {
                let resolvedAddress = details.address || item.fullAddress || item.name;
                if (item.name && !resolvedAddress.toLowerCase().includes(item.name.toLowerCase())) {
                    resolvedAddress = `${item.name}, ${resolvedAddress}`;
                }
                return {
                    address: resolvedAddress,
                    lat: details.lat,
                    lng: details.lng,
                    city: details.city,
                    state: details.state,
                    country: details.country,
                    zip: details.zip,
                    placeId: item.id,
                };
            }
        } catch {}
    }

    return {
        address: item.fullAddress || item.name,
        lat: item.lat,
        lng: item.lng,
        city: item.city,
        state: item.state,
        country: item.country,
        zip: item.zip,
        placeId: item.id,
    };
};
