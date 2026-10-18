import React from "react";
import { createPortal } from "react-dom";
import { 
    MapPin, 
    Building2, 
    Landmark, 
    HeartPulse, 
    Globe 
} from "lucide-react";
import { SuggestionItem } from "./googlePlacesTypes";
import { cn } from "@/lib/utils";

interface GooglePlacesDropdownProps {
    suggestions: SuggestionItem[];
    onSelect: (item: SuggestionItem) => void;
    position?: "top" | "bottom";
    dropdownPos?: {
        top?: number;
        bottom?: number;
        left: number;
        width: number;
        maxHeight?: number;
    } | null;
}

export const renderPlaceIcon = (types: string[] = [], name: string = "") => {
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

export const GooglePlacesDropdown: React.FC<GooglePlacesDropdownProps> = ({
    suggestions,
    onSelect,
    position = "bottom",
    dropdownPos,
}) => {
    const isTop = position === "top";

    const content = (
        <div
            style={
                dropdownPos
                    ? {
                          position: "fixed",
                          left: `${dropdownPos.left}px`,
                          width: `${dropdownPos.width}px`,
                          zIndex: 999999,
                          ...(dropdownPos.top !== undefined ? { top: `${dropdownPos.top}px` } : {}),
                          ...(dropdownPos.bottom !== undefined ? { bottom: `${dropdownPos.bottom}px` } : {}),
                          ...(dropdownPos.maxHeight ? { maxHeight: `${dropdownPos.maxHeight}px` } : {}),
                      }
                    : undefined
            }
            className={cn(
                "google-places-portal-dropdown bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-700 rounded-md shadow-2xl overflow-hidden overflow-y-auto font-sans",
                !dropdownPos && "absolute left-0 right-0 z-50 max-h-64",
                !dropdownPos && (isTop ? "bottom-full mb-1.5" : "top-full mt-1")
            )}
        >
            <div className="py-1">
                {suggestions.map((item, idx) => (
                    <button
                        key={item.id || idx}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onSelect(item)}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-100/80 dark:hover:bg-[#ff4a1f]/10 transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer flex items-center justify-between gap-3 group"
                    >
                        <div className="min-w-0 flex-1 flex items-center gap-2.5">
                            {renderPlaceIcon(item.types, item.name)}
                            <div className="min-w-0 flex-1">
                                <div className="text-[12.5px] leading-snug truncate">
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
    );

    if (dropdownPos) {
        return createPortal(content, document.body);
    }

    return content;
};
