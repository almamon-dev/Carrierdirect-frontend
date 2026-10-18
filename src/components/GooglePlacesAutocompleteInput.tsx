import React, { useEffect, useRef } from "react";
import { MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    LocationData,
    GooglePlacesInputProps,
    SuggestionItem,
} from "./googlePlacesTypes";
import { resolveLocationDetails } from "./googlePlacesService";
import { GooglePlacesDropdown } from "./GooglePlacesDropdown";
import { usePlacesAutocomplete } from "./usePlacesAutocomplete";

export type { LocationData };

export const GooglePlacesAutocompleteInput: React.FC<GooglePlacesInputProps> = ({
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
    dropdownPosition = "auto",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        suggestions,
        isSearching,
        isDropdownOpen,
        setIsDropdownOpen,
        justSelectedRef,
        handleInputChange,
        clearSuggestions,
    } = usePlacesAutocomplete(onChange, { lat, lng });

    const [computedPosition, setComputedPosition] = React.useState<"top" | "bottom">(
        dropdownPosition === "top" ? "top" : "bottom"
    );
    const [dropdownPos, setDropdownPos] = React.useState<{
        top?: number;
        bottom?: number;
        left: number;
        width: number;
        maxHeight?: number;
    } | null>(null);

    const updateDropdownPosition = React.useCallback(() => {
        if (!inputRef.current) return;
        const rect = inputRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        const isTop =
            dropdownPosition === "top" ||
            (dropdownPosition === "auto" && spaceBelow < 230 && spaceAbove > spaceBelow);

        setComputedPosition(isTop ? "top" : "bottom");

        if (isTop) {
            setDropdownPos({
                bottom: window.innerHeight - rect.top + 4,
                left: rect.left,
                width: rect.width,
                maxHeight: Math.min(220, Math.max(100, spaceAbove - 20)),
            });
        } else {
            setDropdownPos({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                maxHeight: Math.min(260, Math.max(100, spaceBelow - 20)),
            });
        }
    }, [dropdownPosition]);

    useEffect(() => {
        if (!isDropdownOpen) {
            setDropdownPos(null);
            return;
        }
        updateDropdownPosition();
        window.addEventListener("scroll", updateDropdownPosition, true);
        window.addEventListener("resize", updateDropdownPosition);
        return () => {
            window.removeEventListener("scroll", updateDropdownPosition, true);
            window.removeEventListener("resize", updateDropdownPosition);
        };
    }, [isDropdownOpen, updateDropdownPosition]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                containerRef.current &&
                !containerRef.current.contains(target as Node) &&
                !target?.closest?.(".google-places-portal-dropdown")
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsDropdownOpen]);

    const handleSelectSuggestion = async (item: SuggestionItem) => {
        clearSuggestions();
        setIsDropdownOpen(false);
        const locData = await resolveLocationDetails(item);
        onLocationSelect?.(locData);
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

                {isDropdownOpen && suggestions.length > 0 && (
                    <GooglePlacesDropdown
                        suggestions={suggestions}
                        onSelect={handleSelectSuggestion}
                        position={computedPosition}
                        dropdownPos={dropdownPos}
                    />
                )}
            </div>

            {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans block">{error}</span>}
        </div>
    );
};

export default GooglePlacesAutocompleteInput;
