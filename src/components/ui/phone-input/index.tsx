import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, Phone } from 'lucide-react';
import { parsePhoneNumber, getCountries, getCountryCallingCode, Country } from 'react-phone-number-input';
import enLabels from 'react-phone-number-input/locale/en.json';
import { cn } from '@/lib/utils';

export interface PhoneInputProps {
    name?: string;
    value?: string;
    onChange?: (e: any) => void;
    defaultCountry?: Country;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    id?: string;
}

export interface CountryOption {
    code: Country;
    name: string;
    callingCode: string;
    flag: string;
}

const getFlagEmoji = (countryCode: string): string => {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// Generate and prioritize countries list
const ALL_COUNTRIES: CountryOption[] = getCountries().map((c) => ({
    code: c,
    name: (enLabels as Record<string, string>)[c] || c,
    callingCode: `+${getCountryCallingCode(c)}`,
    flag: getFlagEmoji(c)
}));

// Priority countries to place at the top of the dropdown
const PRIORITY_CODES: Country[] = ['BD', 'US', 'GB', 'CA', 'AU', 'AE', 'SA', 'SG', 'IN', 'DE', 'FR'];

const SORTED_COUNTRIES: CountryOption[] = [
    ...ALL_COUNTRIES.filter(c => PRIORITY_CODES.includes(c.code)).sort((a, b) => PRIORITY_CODES.indexOf(a.code) - PRIORITY_CODES.indexOf(b.code)),
    ...ALL_COUNTRIES.filter(c => !PRIORITY_CODES.includes(c.code)).sort((a, b) => a.name.localeCompare(b.name))
];

export const PhoneInput: React.FC<PhoneInputProps> = ({
    name = 'phone',
    value = '',
    onChange,
    defaultCountry = 'BD',
    placeholder = '1711-234567',
    disabled = false,
    error,
    className,
    id
}) => {
    const [selectedCountryCode, setSelectedCountryCode] = useState<Country>(defaultCountry);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 240 });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Safely extract string representation of value even if an event object or non-string is passed
    const safeStringValue = useMemo(() => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null && 'target' in (value as any)) {
            return String((value as any).target?.value || '');
        }
        return String(value);
    }, [value]);

    // Extract country and national number from value prop when value changes
    useEffect(() => {
        if (!safeStringValue) {
            setPhoneNumber('');
            return;
        }

        try {
            const parsed = parsePhoneNumber(safeStringValue.startsWith('+') ? safeStringValue : `+${safeStringValue}`);
            if (parsed && parsed.country) {
                setSelectedCountryCode(parsed.country);
                setPhoneNumber(parsed.nationalNumber || '');
                return;
            }
        } catch {
            // Ignore parse error and fallback
        }

        // If parsing didn't work directly, fallback to matching country code prefix
        if (safeStringValue.startsWith('+')) {
            const matched = SORTED_COUNTRIES.find(c => safeStringValue.startsWith(c.callingCode));
            if (matched) {
                setSelectedCountryCode(matched.code);
                setPhoneNumber(safeStringValue.slice(matched.callingCode.length).trim());
                return;
            }
        }

        // Default fallback
        setPhoneNumber(safeStringValue);
    }, [safeStringValue]);

    const selectedCountry = useMemo(() => {
        return SORTED_COUNTRIES.find(c => c.code === selectedCountryCode) || SORTED_COUNTRIES[0];
    }, [selectedCountryCode]);

    const filteredCountries = useMemo(() => {
        if (!searchQuery.trim()) return SORTED_COUNTRIES;
        const q = searchQuery.toLowerCase().trim();
        return SORTED_COUNTRIES.filter(
            c => c.name.toLowerCase().includes(q) || c.callingCode.includes(q) || c.code.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    const notifyChange = (countryObj: CountryOption, numberStr: string) => {
        const cleanNumber = numberStr.replace(/[^\d]/g, '');
        const fullValue = cleanNumber ? `${countryObj.callingCode}${cleanNumber}` : '';

        if (onChange) {
            // Standard synthetic event for forms
            onChange({
                target: {
                    name,
                    value: fullValue
                }
            });
        }
    };

    const handleCountrySelect = (newCountryCode: Country) => {
        const countryObj = SORTED_COUNTRIES.find(c => c.code === newCountryCode);
        if (countryObj) {
            setSelectedCountryCode(newCountryCode);
            notifyChange(countryObj, phoneNumber);
        }
        setIsOpen(false);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPhoneNumber(val);
        notifyChange(selectedCountry, val);
    };

    const handleToggleDropdown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 240;

            // Open upwards if near bottom of screen
            let top = rect.bottom + 4;
            if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                top = rect.top - dropdownHeight - 4;
            }

            setDropdownPos({
                top,
                left: Math.max(10, rect.left),
                width: 250
            });
            setSearchQuery('');
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    // Auto-focus search input when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

    // Handle escape key and scroll
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        const handleScroll = (e: Event) => {
            // Don't close if scrolling inside the dropdown itself
            const target = e.target as HTMLElement;
            if (target && target.closest && target.closest('.phone-country-dropdown')) {
                return;
            }
            setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    return (
        <div className={cn("flex flex-col gap-1 w-full font-sans antialiased", className)}>
            <div className="flex items-center w-full gap-2">
                {/* 1. Country Code Trigger */}
                <div className="relative w-[115px] shrink-0">
                    <button
                        ref={buttonRef}
                        type="button"
                        onClick={handleToggleDropdown}
                        disabled={disabled}
                        className={cn(
                            "relative w-full h-[36px] cursor-pointer rounded-sm border bg-slate-50 hover:bg-slate-100/80 px-2 py-1 text-left text-[13px] font-semibold text-[#202223] outline-none focus:outline-none transition-all flex items-center justify-between shadow-none",
                            error
                                ? "border-[#d82c0d] focus:border-[#d82c0d]"
                                : "border-slate-300 focus:border-slate-400"
                        )}
                        title={selectedCountry.name}
                    >
                        <span className="flex items-center gap-1.5 truncate">
                            <span className="text-[15px] leading-none">{selectedCountry.flag}</span>
                            <span className="text-[12px] font-bold text-slate-800">{selectedCountry.callingCode}</span>
                        </span>
                        <ChevronDown size={13} className="text-slate-400 shrink-0 ml-1" />
                    </button>
                </div>

                {/* 2. Separate Phone Number Input */}
                <div className="relative flex items-center flex-1">
                    <input
                        id={id || name}
                        type="tel"
                        name={name}
                        value={phoneNumber}
                        onChange={handleNumberChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            "flex h-[36px] w-full rounded-sm border bg-white px-3 py-1 text-[13px] font-normal text-[#202223] placeholder:text-slate-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 shadow-none font-sans antialiased",
                            error
                                ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-[#d82c0d]/20"
                                : "border-slate-300 focus:border-slate-400 focus:ring-slate-300/40"
                        )}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <span className="text-[11px] text-[#d82c0d] font-medium leading-none mt-0.5">
                    {error}
                </span>
            )}

            {/* 3. Floating Portal Country Dropdown (Never Clipped by Modals) */}
            {isOpen && createPortal(
                <>
                    {/* Transparent Click-Outside Overlay */}
                    <div 
                        className="fixed inset-0 z-[999998] bg-transparent" 
                        onClick={() => setIsOpen(false)} 
                    />

                    {/* Floating Dropdown Menu */}
                    <div
                        style={{
                            position: 'fixed',
                            top: `${dropdownPos.top}px`,
                            left: `${dropdownPos.left}px`,
                            width: `${dropdownPos.width}px`,
                        }}
                        className="phone-country-dropdown z-[999999] max-h-60 overflow-hidden rounded-md bg-white text-[12px] shadow-2xl border border-slate-200 focus:outline-none flex flex-col animate-in fade-in zoom-in-95 duration-100 font-sans"
                    >
                        {/* Search Filter */}
                        <div className="p-1.5 bg-slate-50 border-b border-slate-200 shrink-0">
                            <div className="relative flex items-center">
                                <Search size={13} className="absolute left-2 text-slate-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search country or code..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-7 pl-7 pr-2 text-[12px] bg-white border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FF4A1F] placeholder:text-slate-400 font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        {/* Country List */}
                        <div className="overflow-y-auto py-1 flex-1 max-h-[190px] hide-scrollbar no-scrollbar">
                            {filteredCountries.length === 0 ? (
                                <div className="py-5 text-center text-slate-400 text-[11.5px]">
                                    No countries found
                                </div>
                            ) : (
                                filteredCountries.map((c) => {
                                    const isSelected = c.code === selectedCountryCode;
                                    return (
                                        <div
                                            key={c.code}
                                            onClick={() => handleCountrySelect(c.code)}
                                            className={cn(
                                                "cursor-pointer select-none py-1.5 px-3 flex items-center justify-between transition-colors",
                                                isSelected 
                                                    ? "bg-orange-50 text-[#FF4A1F] font-bold" 
                                                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-[15px]">{c.flag}</span>
                                                <span className="truncate text-[12px]">{c.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                                <span className="text-[11px] font-bold text-slate-500">{c.callingCode}</span>
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
            )}
        </div>
    );
};

export default PhoneInput;
