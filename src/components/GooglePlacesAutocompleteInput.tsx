import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
    MapPin, 
    CheckCircle2, 
    Loader2, 
    Building2, 
    Landmark, 
    HeartPulse, 
    Globe
} from "lucide-react";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";

export interface LocationData {
    address: string;
    lat?: number | null;
    lng?: number | null;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    placeId?: string;
}

interface Props {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLocationSelect?: (data: LocationData) => void;
    placeholder?: string;
    lat?: number | string | null;
    lng?: number | string | null;
    className?: string;
    error?: string;
    disabled?: boolean;
}

interface SuggestionItem {
    id: string;
    name: string;
    subtitle: string;
    fullAddress: string;
    lat?: number | null;
    lng?: number | null;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    types?: string[];
    source?: string;
}

// Global cached API Key & Suggestion Cache for 0ms Repeat Queries
let cachedGoogleMapsApiKey: string | null = null;
let apiKeyFetchPromise: Promise<string | null> | null = null;
const memorySuggestionCache = new Map<string, SuggestionItem[]>();

const getGoogleMapsApiKey = async (): Promise<string | null> => {
    const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_KEY;
    if (envKey) {
        cachedGoogleMapsApiKey = envKey;
        return envKey;
    }
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
        } catch {
            // fallback
        }
        return null;
    })();

    return apiKeyFetchPromise;
};

export const GooglePlacesAutocompleteInput: React.FC<Props> = ({
    name,
    value,
    onChange,
    onLocationSelect,
    placeholder = "Enter address or search place...",
    lat,
    lng,
    className,
    error,
    disabled = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const debounceTimerRef = useRef<any>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const justSelectedRef = useRef(false);

    // Warm up Google Maps key on mount
    useEffect(() => {
        getGoogleMapsApiKey();
    }, []);

    // Fetch suggestions with Direct Places API (New) + Backend fallback + 0ms Cache
    const fetchSuggestions = useCallback(async (query: string) => {
        const trimmed = (query || "").trim();
        if (!trimmed || justSelectedRef.current) {
            setSuggestions([]);
            setIsDropdownOpen(false);
            setIsSearching(false);
            return;
        }

        const cacheKey = trimmed.toLowerCase();
        if (memorySuggestionCache.has(cacheKey)) {
            const cached = memorySuggestionCache.get(cacheKey) || [];
            if (!justSelectedRef.current) {
                setSuggestions(cached);
                setIsDropdownOpen(cached.length > 0);
            }
            setIsSearching(false);
            return;
        }

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        setIsSearching(true);

        const apiKey = cachedGoogleMapsApiKey || (await getGoogleMapsApiKey());

        // 1. Direct Google Places API (New) v1 request (~40ms edge speed)
        if (apiKey) {
            try {
                const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": apiKey,
                    },
                    body: JSON.stringify({
                        input: trimmed,
                        includeQueryPredictions: true,
                    }),
                    signal: abortControllerRef.current.signal,
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data?.suggestions && Array.isArray(data.suggestions)) {
                        const formattedItems: SuggestionItem[] = data.suggestions
                            .map((sug: any) => {
                                const pred = sug?.placePrediction;
                                if (!pred) return null;
                                const mainText = pred?.structuredFormat?.mainText?.text || pred?.text?.text || trimmed;
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

                        memorySuggestionCache.set(cacheKey, formattedItems);
                        if (!justSelectedRef.current) {
                            setSuggestions(formattedItems);
                            setIsDropdownOpen(formattedItems.length > 0);
                        }
                        setIsSearching(false);
                        return;
                    }
                }
            } catch (err: any) {
                if (err?.name === "AbortError") return;
            }
        }

        // 2. High-speed Backend Fallback API
        try {
            const res = await apiClient.get("/locations/autocomplete", {
                params: { q: trimmed },
                silent: true,
            });
            const data = res.data?.data || res.data || [];
            if (Array.isArray(data) && data.length > 0) {
                memorySuggestionCache.set(cacheKey, data);
                if (!justSelectedRef.current) {
                    setSuggestions(data);
                    setIsDropdownOpen(true);
                }
            } else {
                memorySuggestionCache.set(cacheKey, []);
                setSuggestions([]);
                setIsDropdownOpen(false);
            }
        } catch {
            setSuggestions([]);
            setIsDropdownOpen(false);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        justSelectedRef.current = false;
        onChange(e);
        const query = e.target.value;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        
        if (!query.trim()) {
            setSuggestions([]);
            setIsDropdownOpen(false);
            return;
        }

        // 120ms debounce for responsive instant typing
        debounceTimerRef.current = setTimeout(() => {
            if (!justSelectedRef.current) {
                fetchSuggestions(query);
            }
        }, 120);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle Selection & Place Details Extraction
    const handleSelectSuggestion = async (item: SuggestionItem) => {
        justSelectedRef.current = true;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();

        setIsDropdownOpen(false);
        setSuggestions([]);

        // If suggestion already contains full coordinates & address components
        if (item.lat && item.lng && item.country) {
            if (onLocationSelect) {
                onLocationSelect({
                    address: item.fullAddress || item.name,
                    lat: item.lat,
                    lng: item.lng,
                    city: item.city,
                    state: item.state,
                    country: item.country,
                    zip: item.zip,
                    placeId: item.id,
                });
            }
            return;
        }

        const apiKey = cachedGoogleMapsApiKey;

        // Fetch Place Details (New) directly or via backend
        if (apiKey && item.id && !item.id.startsWith("geo-") && !item.id.startsWith("pl-")) {
            try {
                const res = await fetch(`https://places.googleapis.com/v1/places/${item.id}`, {
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
                    const formattedAddress = data?.formattedAddress || item.fullAddress || item.name;

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

                    if (onLocationSelect) {
                        onLocationSelect({
                            address: formattedAddress,
                            lat: placeLat,
                            lng: placeLng,
                            city,
                            state,
                            country,
                            zip,
                            placeId: item.id,
                        });
                    }
                    return;
                }
            } catch {
                // fallback to backend
            }
        }

        // Fallback: Fetch place details via backend
        if (item.id && !item.id.startsWith("geo-")) {
            try {
                const res = await apiClient.get("/locations/place-details", {
                    params: { place_id: item.id },
                    silent: true,
                });
                const details = res?.data?.data || res?.data;
                if (details) {
                    if (onLocationSelect) {
                        onLocationSelect({
                            address: details.address || item.fullAddress || item.name,
                            lat: details.lat,
                            lng: details.lng,
                            city: details.city,
                            state: details.state,
                            country: details.country,
                            zip: details.zip,
                            placeId: item.id,
                        });
                    }
                    return;
                }
            } catch {
                // ignore
            }
        }

        // Generic selection fallback
        if (onLocationSelect) {
            onLocationSelect({
                address: item.fullAddress || item.name,
                lat: item.lat,
                lng: item.lng,
                city: item.city,
                state: item.state,
                country: item.country,
                zip: item.zip,
                placeId: item.id,
            });
        }
    };

    // Render Google Maps contextual icons
    const renderPlaceIcon = (types: string[] = [], name: string = "") => {
        const typeStr = types.join(" ").toLowerCase();
        const lowerName = name.toLowerCase();

        if (typeStr.includes("country") || lowerName === "bangladesh" || lowerName === "germany") {
            return (
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Globe size={13} />
                </div>
            );
        }
        if (typeStr.includes("bank") || typeStr.includes("finance") || typeStr.includes("atm") || lowerName.includes("bank")) {
            return (
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Landmark size={12} />
                </div>
            );
        }
        if (typeStr.includes("hospital") || typeStr.includes("health") || typeStr.includes("doctor") || typeStr.includes("pharmacy") || lowerName.includes("hospital")) {
            return (
                <div className="w-5 h-5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                    <HeartPulse size={12} />
                </div>
            );
        }
        if (typeStr.includes("establishment") || typeStr.includes("store") || typeStr.includes("point_of_interest") || typeStr.includes("museum")) {
            return (
                <div className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Building2 size={12} />
                </div>
            );
        }
        return (
            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <MapPin size={12} />
            </div>
        );
    };

    const hasCoordinates = Boolean(lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng)));

    return (
        <div ref={containerRef} className="relative w-full space-y-1">
            <div className="relative flex items-center w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-slate-400">
                    <MapPin size={15} className={hasCoordinates ? "text-emerald-500" : "text-slate-400"} />
                </div>
                <input
                    ref={inputRef}
                    name={name}
                    type="text"
                    value={value || ""}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (!justSelectedRef.current && suggestions.length > 0) {
                            setIsDropdownOpen(true);
                        }
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    className={cn(
                        "flex h-[36px] w-full rounded-sm border bg-white dark:bg-[#12161c] pl-9 pr-8 py-1 text-[13px] font-normal text-[#202223] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 shadow-none font-sans antialiased",
                        hasCoordinates
                            ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/20"
                            : error
                            ? "border-[#d82c0d] focus:border-[#d82c0d]"
                            : "border-slate-300 dark:border-slate-700/80 focus:border-slate-400",
                        className
                    )}
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center z-10">
                    {isSearching ? (
                        <Loader2 size={14} className="animate-spin text-slate-400" />
                    ) : hasCoordinates ? (
                        <div title={`Coordinates: ${lat}, ${lng}`}>
                            <CheckCircle2 size={15} className="text-emerald-500" />
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Clean Minimalist Google Maps Autocomplete Dropdown */}
            {isDropdownOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-700 rounded-md shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                    <div className="py-1">
                        {suggestions.map((item, idx) => (
                            <button
                                key={item.id || idx}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelectSuggestion(item)}
                                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-100/80 dark:hover:bg-[#ff4a1f]/10 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer flex items-center justify-between gap-3 group"
                            >
                                <div className="min-w-0 flex-1 flex items-center gap-2.5">
                                    {renderPlaceIcon(item.types, item.name)}
                                    <div className="min-w-0 flex-1">
                                        <div className="text-[13px] leading-snug truncate">
                                            <span className="font-semibold text-slate-900 dark:text-white group-hover:text-[#ff4a1f] transition-colors">
                                                {item.name}
                                            </span>
                                            {item.subtitle && (
                                                <span className="text-slate-500 dark:text-slate-400 font-normal ml-1.5 text-xs">
                                                    {item.subtitle}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>


                            </button>
                        ))}
                    </div>
                </div>
            )}


            {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans block">{error}</span>}
        </div>
    );
};

export default GooglePlacesAutocompleteInput;
