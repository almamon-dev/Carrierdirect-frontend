import { useState, useRef, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios";
import { SuggestionItem } from "./googlePlacesTypes";
import {
    getGoogleMapsApiKey,
    memorySuggestionCache,
    fetchDirectGoogleSuggestions,
} from "./googlePlacesService";

export function usePlacesAutocomplete(
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    biasCoords?: { lat?: number | string | null; lng?: number | string | null }
) {
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const debounceTimerRef = useRef<any>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const justSelectedRef = useRef(false);

    useEffect(() => {
        getGoogleMapsApiKey();
    }, []);

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

        const apiKey = await getGoogleMapsApiKey();

        const validCoords =
            biasCoords?.lat && biasCoords?.lng && !isNaN(Number(biasCoords.lat)) && !isNaN(Number(biasCoords.lng))
                ? { lat: Number(biasCoords.lat), lng: Number(biasCoords.lng) }
                : { lat: 23.8103, lng: 90.4125 };

        if (apiKey) {
            try {
                const directResults = await fetchDirectGoogleSuggestions(
                    trimmed,
                    apiKey,
                    abortControllerRef.current.signal,
                    validCoords
                );
                if (directResults) {
                    memorySuggestionCache.set(cacheKey, directResults);
                    if (!justSelectedRef.current) {
                        setSuggestions(directResults);
                        setIsDropdownOpen(directResults.length > 0);
                    }
                    setIsSearching(false);
                    return;
                }
            } catch (err: any) {
                if (err?.name === "AbortError") return;
            }
        }

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

        debounceTimerRef.current = setTimeout(() => {
            if (!justSelectedRef.current) {
                fetchSuggestions(query);
            }
        }, 120);
    };

    const clearSuggestions = () => {
        justSelectedRef.current = true;
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        if (abortControllerRef.current) abortControllerRef.current.abort();
        setIsDropdownOpen(false);
        setSuggestions([]);
    };

    return {
        suggestions,
        isSearching,
        isDropdownOpen,
        setIsDropdownOpen,
        justSelectedRef,
        handleInputChange,
        clearSuggestions,
    };
}
