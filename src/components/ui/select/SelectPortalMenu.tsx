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
                className="custom-select-portal-menu z-[999999] overflow-hidden rounded-md bg-white dark:bg-[#1e2329] text-[12px] shadow-2xl border border-slate-200 dark:border-slate-700 focus:outline-none flex flex-col animate-in fade-in zoom-in-95 duration-100 font-sans"
            >
                {shouldShowSearch && (
                    <div className="p-2 bg-slate-50 dark:bg-[#181d24] border-b border-slate-200 dark:border-slate-700 shrink-0">
                        <div className="relative flex items-center">
                            <Search size={13} className="absolute left-2 text-slate-400 pointer-events-none z-10" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full h-7 pl-7 pr-2 text-[12px] bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#FF4A1F] placeholder:text-slate-400 font-medium"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}

                <div className="overflow-y-auto py-1 flex-1 hide-scrollbar no-scrollbar">
                    {filteredOptions.length === 0 && !onCreate ? (
                        <div className="py-6 px-4 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1.5">
                            <SearchX size={24} strokeWidth={1.5} />
                            <span className="text-[11px] font-medium">No results found</span>
                        </div>
                    ) : (
                        <>
                            {filteredOptions.map((option, idx) => {
                                const optId = option.id !== undefined ? option.id : option.value;
                                const active = isSelected(optId);
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => onSelectOption(option)}
                                        className={cn(
                                            "cursor-pointer select-none border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 flex items-center justify-between transition-colors",
                                            size === "sm" ? "py-1.5 px-2.5 text-xs" : "py-2 px-3 text-[12.5px]",
                                            active 
                                                ? "bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] font-semibold" 
                                                : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 font-normal"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            {option.image && (
                                                <img
                                                    src={option.image.startsWith('http') ? option.image : `/storage/${option.image}`}
                                                    className="w-3.5 h-3.5 object-contain shrink-0"
                                                    alt=""
                                                />
                                            )}
                                            {option.icon && (
                                                typeof option.icon === 'function' ? (
                                                    React.createElement(option.icon, {
                                                        size: size === "sm" ? 13 : 14,
                                                        className: cn("shrink-0", active ? "text-[#FF4A1F]" : "text-slate-400 dark:text-slate-500")
                                                    })
                                                ) : React.isValidElement(option.icon) ? (
                                                    <span className={cn("shrink-0", active ? "text-[#FF4A1F]" : "text-slate-400 dark:text-slate-500")}>
                                                        {option.icon}
                                                    </span>
                                                ) : null
                                            )}
                                            <span className={cn("truncate", size === "sm" ? "text-xs" : "text-[12.5px]")}>
                                                {option.name || option.label}
                                            </span>
                                        </div>
                                        {active && (
                                            <Check size={size === "sm" ? 12 : 14} className="text-[#FF4A1F] shrink-0 ml-1.5" />
                                        )}
                                    </div>
                                );
                            })}

                            {onCreate && searchQuery && !filteredOptions.find(o => String(o.name || o.label || "").toLowerCase() === searchQuery.toLowerCase()) && (
                                <button
                                    type="button"
                                    onClick={() => onCreate(searchQuery)}
                                    className="w-full text-left py-2.5 px-3 text-[12px] font-bold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-slate-800/70 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 mt-1 cursor-pointer"
                                >
                                    <Plus size={14} /> Quick Add "{searchQuery}"
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
