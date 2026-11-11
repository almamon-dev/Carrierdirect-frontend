import React from 'react';
import { createPortal } from 'react-dom';
import { Search, SearchX, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SelectOption } from './selectTypes';

interface SelectPortalMenuProps {
    isOpen: boolean;
    onClose: () => void;
    dropdownPos: {
        top?: number;
        bottom?: number;
        left: number;
        width: number;
        maxHeight?: number;
        placement?: 'down' | 'up';
    };
    shouldShowSearch: boolean;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    filteredOptions: SelectOption[];
    size?: "sm" | "md" | "lg";
    isSelected: (optId: any) => boolean;
    onSelectOption: (option: SelectOption) => void;
    onCreate?: (name: string) => void;
}

export const SelectPortalMenu: React.FC<SelectPortalMenuProps> = ({
    isOpen,
    onClose,
    dropdownPos,
    shouldShowSearch,
    searchInputRef,
    searchQuery,
    onSearchChange,
    filteredOptions,
    size = "md",
    isSelected,
    onSelectOption,
    onCreate,
}) => {
    if (!isOpen) return null;

    return createPortal(
        <>
            <div 
                className="fixed inset-0 z-[999998] bg-transparent" 
                onClick={onClose} 
            />

            <div
                style={{
                    position: 'fixed',
                    ...(dropdownPos.placement === 'up'
                        ? { bottom: `${dropdownPos.bottom ?? 0}px` }
                        : { top: `${dropdownPos.top ?? 0}px` }),
                    left: `${dropdownPos.left}px`,
                    width: `${dropdownPos.width}px`,
                    ...(dropdownPos.maxHeight ? { maxHeight: `${dropdownPos.maxHeight}px` } : {}),
                }}
                className="custom-select-portal-menu z-[999999] overflow-hidden rounded-md bg-white dark:bg-[#1a1f26] text-[12px] shadow-xl border border-slate-200/90 dark:border-slate-700/80 focus:outline-none flex flex-col animate-in fade-in zoom-in-95 duration-100 font-sans"
            >
                {shouldShowSearch && (
                    <div className="p-2 bg-slate-50/80 dark:bg-[#151920] border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div className="relative flex items-center">
                            <Search size={13} className="absolute left-2.5 text-slate-400 pointer-events-none z-10" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Type to search..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full h-7 pl-8 pr-2.5 text-xs bg-white dark:bg-[#10141a] border border-slate-200 dark:border-slate-700/80 rounded-[4px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-1 focus:ring-slate-200 dark:focus:ring-slate-700 shadow-2xs font-normal transition-all"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}

                <div className="overflow-y-auto py-1 flex-1 hide-scrollbar no-scrollbar">
                    {filteredOptions.length === 0 && !onCreate ? (
                        <div className="py-6 px-4 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1.5">
                            <SearchX size={22} strokeWidth={1.5} />
                            <span className="text-[11px] font-medium">No results found</span>
                        </div>
                    ) : (
                        <>
                            {filteredOptions.map((option, idx) => {
                                const optId = option.id !== undefined ? option.id : option.value;
                                const isPlaceholder = optId === '' || optId === undefined || optId === null;
                                const isDisabled = Boolean(option.disabled);
                                const active = !isPlaceholder && isSelected(optId);

                                if (isPlaceholder) {
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => onSelectOption(option)}
                                            className="cursor-pointer select-none py-1.5 px-3 text-[11.5px] text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-600 dark:hover:text-slate-400 border-b border-slate-100/70 dark:border-slate-800/70 transition-colors"
                                        >
                                            {option.name || option.label}
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            if (isDisabled) return;
                                            onSelectOption(option);
                                        }}
                                        aria-disabled={isDisabled}
                                        className={cn(
                                            "select-none border-b border-slate-100/60 dark:border-slate-800/40 last:border-0 flex items-center justify-between transition-colors",
                                            option.subtitle ? "py-2 px-3" : (size === "sm" ? "py-1.5 px-2.5 text-xs" : "py-2 px-3 text-[12.5px]"),
                                            isDisabled
                                                ? "opacity-50 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/30"
                                                : active
                                                    ? "cursor-pointer bg-orange-50/70 dark:bg-[#ff4a1f]/15"
                                                    : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/70"
                                        )}
                                    >
                                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                            {option.image && (
                                                <img
                                                    src={option.image.startsWith('http') ? option.image : `/storage/${option.image}`}
                                                    className="w-4 h-4 mt-0.5 object-contain shrink-0 rounded"
                                                    alt=""
                                                />
                                            )}
                                            {option.icon && (
                                                typeof option.icon === 'function' ? (
                                                    React.createElement(option.icon, {
                                                        size: 14,
                                                        className: cn("shrink-0 mt-0.5", active ? "text-[#FF4A1F]" : "text-slate-400 dark:text-slate-500")
                                                    })
                                                ) : React.isValidElement(option.icon) ? (
                                                    <span className={cn("shrink-0 mt-0.5", active ? "text-[#FF4A1F]" : "text-slate-400 dark:text-slate-500")}>
                                                        {option.icon}
                                                    </span>
                                                ) : null
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 justify-between">
                                                    <span className={cn(
                                                        "truncate",
                                                        active 
                                                            ? "font-bold text-[#FF4A1F]" 
                                                            : "font-medium text-slate-800 dark:text-slate-100"
                                                    )}>
                                                        {option.name || option.label}
                                                    </span>
                                                    {option.badge && (
                                                        <span className={cn(
                                                            "text-[9.5px] font-semibold px-1.5 py-0.5 rounded tracking-wide shrink-0",
                                                            option.badgeColor === 'success' || option.badgeColor === 'fleet'
                                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60"
                                                                : option.badgeColor === 'info' || option.badgeColor === 'subcontractor'
                                                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50"
                                                                    : option.badgeColor === 'warning'
                                                                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/50"
                                                                        : option.badgeColor === 'danger'
                                                                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50"
                                                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60"
                                                        )}>
                                                            {option.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {option.subtitle && (
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
                                                        {option.subtitle}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {active && (
                                            <Check size={14} className="text-[#FF4A1F] shrink-0 ml-2 mt-0.5" />
                                        )}
                                    </div>
                                );
                            })}

                            {onCreate && searchQuery && !filteredOptions.find(o => String(o.name || o.label || "").toLowerCase() === searchQuery.toLowerCase()) && (
                                <button
                                    type="button"
                                    onClick={() => onCreate(searchQuery)}
                                    className="w-full text-left py-2 px-3 text-[11.5px] font-bold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-slate-800/70 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 mt-1 cursor-pointer"
                                >
                                    <Plus size={13} /> Quick Add "{searchQuery}"
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};
