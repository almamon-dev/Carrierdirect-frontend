import React from "react";

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

export interface GooglePlacesInputProps {
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
    dropdownPosition?: "top" | "bottom" | "auto";
}

export interface SuggestionItem {
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
