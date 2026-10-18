import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Search } from 'lucide-react';
import { Country, getCountryCallingCode } from 'react-phone-number-input';
import { cn } from '@/lib/utils';
import { getFlagEmoji } from './phoneInputConstants';

interface PhoneCountryDropdownMenuProps {
    isOpen: boolean;
    onClose: () => void;
    dropdownPos: { top: number; left: number; width: number };
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    filteredOptions: { value: Country; label: string }[];
    value: Country;
    onSelect: (code: Country) => void;
}

export const PhoneCountryDropdownMenu: React.FC<PhoneCountryDropdownMenuProps> = ({
    isOpen,
    onClose,
    dropdownPos,
    searchInputRef,
    searchQuery,
    onSearchChange,
    filteredOptions,
    value,
    onSelect,
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
                    top: `${dropdownPos.top}px`,
                    left: `${dropdownPos.left}px`,
                    width: `${dropdownPos.width}px`,
                }}
                className="phone-country-dropdown z-[999999] max-h-60 overflow-hidden rounded-md bg-white dark:bg-[#181a20] text-[12px] shadow-2xl border border-slate-200 dark:border-slate-700 focus:outline-none flex flex-col animate-in fade-in zoom-in-95 duration-100 font-sans"
            >
                <div className="p-2 bg-slate-50 dark:bg-[#12161c] border-b border-slate-200 dark:border-slate-700 shrink-0">
                    <div className="relative flex items-center">
                        <Search size={13} className="absolute left-2.5 text-slate-400 pointer-events-none z-10" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search country or code..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full h-7 pl-8 pr-2 text-[12px] bg-white dark:bg-[#181a20] border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-400 placeholder:text-slate-400 font-medium"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                <div className="overflow-y-auto py-1 flex-1 max-h-[190px] hide-scrollbar no-scrollbar">
                    {filteredOptions.length === 0 ? (
                        <div className="py-5 text-center text-slate-400 text-[11.5px]">
                            No countries found
                        </div>
                    ) : (
                        filteredOptions.map((opt) => {
                            const isSelected = opt.value === value;
                            let calling = '';
                            try {
                                calling = `+${getCountryCallingCode(opt.value)}`;
                            } catch {}

                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => onSelect(opt.value)}
                                    className={cn(
                                        "cursor-pointer select-none py-1.5 px-3 flex items-center justify-between transition-colors",
                                        isSelected
                                            ? "bg-orange-50 dark:bg-orange-950/30 text-[#FF4A1F] font-bold"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                                    )}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="text-[15px]">{getFlagEmoji(opt.value)}</span>
                                        <span className="truncate text-[12px]">{opt.label}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                        <span className="text-[11px] font-bold text-slate-500">{calling}</span>
                                        {isSelected && <Check size={13} className="text-[#FF4A1F]" />}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};
