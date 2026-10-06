import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search } from 'lucide-react';
import PhoneInputWithCountry, {
    Country,
    getCountries,
    getCountryCallingCode,
    parsePhoneNumber
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './phone-input.css';
import enLabels from 'react-phone-number-input/locale/en.json';
import { cn } from '@/lib/utils';

export interface CountryOption {
    code: Country;
    name: string;
    callingCode: string;
    flag: string;
}

export interface PhoneInputProps {
    name?: string;
    value?: string;
    onChange?: (e: any) => void;
    onCountryChange?: (country: CountryOption) => void;
    country?: string | Country;
    defaultCountry?: Country;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    className?: string;
    id?: string;
}

const getFlagEmoji = (countryCode: string): string => {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// Priority country list
const PRIORITY_CODES: Country[] = ['BD', 'US', 'GB', 'CA', 'AU', 'AE', 'SA', 'SG', 'IN', 'DE', 'FR'];

// Search keywords / aliases
const COUNTRY_ALIASES: Record<string, string[]> = {
    BD: ['bangladesh', 'bd', 'dhaka', 'chittagong', 'sylhet', '880', '+880'],
    US: ['united states', 'usa', 'us', 'america', 'united states of america', '1', '+1'],
    GB: ['united kingdom', 'uk', 'great britain', 'england', 'britain', 'london', '44', '+44'],
    CA: ['canada', 'ca', 'toronto', 'vancouver', '1', '+1'],
    AU: ['australia', 'au', 'sydney', 'melbourne', '61', '+61'],
    AE: ['united arab emirates', 'uae', 'dubai', 'abu dhabi', 'emirates', '971', '+971'],
    SA: ['saudi arabia', 'saudi', 'ksa', 'riyadh', 'jeddah', '966', '+966'],
    QA: ['qatar', 'doha', '974', '+974'],
    KW: ['kuwait', '965', '+965'],
    OM: ['oman', 'muscat', '968', '+968'],
    BH: ['bahrain', '973', '+973'],
    SG: ['singapore', 'sg', '65', '+65'],
    MY: ['malaysia', 'my', 'kuala lumpur', '60', '+60'],
    IN: ['india', 'in', 'delhi', 'mumbai', 'kolkata', '91', '+91'],
    PK: ['pakistan', 'pk', 'karachi', 'lahore', 'islamabad', '92', '+92'],
    DE: ['germany', 'deutschland', 'de', 'berlin', '49', '+49'],
    FR: ['france', 'fr', 'paris', '33', '+33'],
    IT: ['italy', 'italia', 'it', 'rome', 'milan', '39', '+39'],
    ES: ['spain', 'espana', 'es', 'madrid', 'barcelona', '34', '+34'],
    TR: ['turkey', 'turkiye', 'tr', 'istanbul', 'ankara', '90', '+90'],
    CN: ['china', 'cn', 'beijing', 'shanghai', '86', '+86'],
    JP: ['japan', 'jp', 'tokyo', '81', '+81'],
    KR: ['south korea', 'korea', 'kr', 'seoul', '82', '+82'],
    TH: ['thailand', 'th', 'bangkok', '66', '+66'],
    ID: ['indonesia', 'id', 'jakarta', '62', '+62'],
    PH: ['philippines', 'ph', 'manila', '63', '+63'],
    VN: ['vietnam', 'vn', 'hanoi', '84', '+84'],
    NL: ['netherlands', 'holland', 'amsterdam', 'nl', '31', '+31'],
    CH: ['switzerland', 'swiss', 'ch', 'zurich', 'geneva', '41', '+41'],
    SE: ['sweden', 'se', 'stockholm', '46', '+46'],
    NO: ['norway', 'no', 'oslo', '47', '+47'],
    DK: ['denmark', 'dk', 'copenhagen', '45', '+45'],
    IE: ['ireland', 'ie', 'dublin', '353', '+353'],
    NZ: ['new zealand', 'nz', 'auckland', '64', '+64'],
    ZA: ['south africa', 'za', 'johannesburg', 'cape town', '27', '+27'],
    EG: ['egypt', 'eg', 'cairo', '20', '+20'],
    BR: ['brazil', 'brasil', 'br', 'sao paulo', '55', '+55'],
    MX: ['mexico', 'mx', '52', '+52'],
};

// Map country names and aliases to 2-letter ISO Country codes
const COUNTRY_NAME_TO_CODE: Record<string, Country> = {};
getCountries().forEach((c) => {
    const label = (enLabels as Record<string, string>)[c];
    if (label) {
        COUNTRY_NAME_TO_CODE[label.toLowerCase()] = c;
    }
    COUNTRY_NAME_TO_CODE[c.toLowerCase()] = c;
});

// Common Aliases
COUNTRY_NAME_TO_CODE['usa'] = 'US';
COUNTRY_NAME_TO_CODE['united states of america'] = 'US';
COUNTRY_NAME_TO_CODE['uk'] = 'GB';
COUNTRY_NAME_TO_CODE['great britain'] = 'GB';
COUNTRY_NAME_TO_CODE['england'] = 'GB';
COUNTRY_NAME_TO_CODE['uae'] = 'AE';
COUNTRY_NAME_TO_CODE['dubai'] = 'AE';
COUNTRY_NAME_TO_CODE['emirates'] = 'AE';
COUNTRY_NAME_TO_CODE['saudi'] = 'SA';
COUNTRY_NAME_TO_CODE['ksa'] = 'SA';
COUNTRY_NAME_TO_CODE['bd'] = 'BD';

function resolveCountry(val?: string | Country): Country | undefined {
    if (!val) return undefined;
    const clean = String(val).trim().toLowerCase();
    if (COUNTRY_NAME_TO_CODE[clean]) {
        return COUNTRY_NAME_TO_CODE[clean];
    }
    if (clean.length === 2) {
        return clean.toUpperCase() as Country;
    }
    return undefined;
}

/**
 * Custom Searchable Floating Country Dropdown Component for react-phone-number-input
 */
const CustomCountrySelect: React.FC<{
    value?: Country;
    onChange: (value?: Country) => void;
    options: { value?: Country; label: string; divider?: boolean }[];
    disabled?: boolean;
}> = ({ value = 'BD', onChange, options, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 260 });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Selected country info
    const selectedCallingCode = useMemo(() => {
        if (!value) return '+880';
        try {
            return `+${getCountryCallingCode(value)}`;
        } catch {
            return '+880';
        }
    }, [value]);

    const selectedFlag = useMemo(() => {
        return value ? getFlagEmoji(value) : '🇧🇩';
    }, [value]);

    const selectedLabel = useMemo(() => {
        const opt = options.find(o => o.value === value);
        return opt ? opt.label : value;
    }, [options, value]);

    // Filter and sort options
    const filteredOptions = useMemo(() => {
        const validOptions = options.filter(o => o.value) as { value: Country; label: string }[];

        // Sort with priority codes first
        const sorted = [
            ...validOptions.filter(o => PRIORITY_CODES.includes(o.value)).sort((a, b) => PRIORITY_CODES.indexOf(a.value) - PRIORITY_CODES.indexOf(b.value)),
            ...validOptions.filter(o => !PRIORITY_CODES.includes(o.value)).sort((a, b) => a.label.localeCompare(b.label))
        ];

        if (!searchQuery.trim()) return sorted;

        const q = searchQuery.toLowerCase().trim();
        const cleanQ = q.replace('+', '');

        return sorted.filter(o => {
            if (o.label.toLowerCase().includes(q)) return true;
            if (o.value.toLowerCase().includes(q)) return true;

            try {
                const code = getCountryCallingCode(o.value);
                if (code.includes(cleanQ)) return true;
            } catch {}

            const aliases = COUNTRY_ALIASES[o.value];
            if (aliases && aliases.some(a => a.includes(q) || a.replace('+', '').includes(cleanQ))) {
                return true;
            }

            return false;
        });
    }, [options, searchQuery]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 240;

            let top = rect.bottom + 4;
            if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                top = rect.top - dropdownHeight - 4;
            }

            setDropdownPos({
                top,
                left: Math.max(10, rect.left),
                width: 260
            });
            setSearchQuery('');
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (code: Country) => {
        onChange(code);
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        const handleScroll = (e: Event) => {
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
        <div className="relative shrink-0 flex items-center">
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className="flex items-center gap-1.5 cursor-pointer bg-transparent border-0 px-0.5 py-0 text-left text-[13px] font-semibold text-slate-800 dark:text-slate-100 outline-none focus:outline-none transition-all select-none"
                title={selectedLabel}
            >
                <span className="text-[15px] leading-none">{selectedFlag}</span>
                <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">{selectedCallingCode}</span>
                <ChevronDown size={13} className="text-slate-400 shrink-0 ml-0.5" />
            </button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[999998] bg-transparent"
                        onClick={() => setIsOpen(false)}
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
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                            onClick={() => handleSelect(opt.value)}
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
            )}
        </div>
    );
};

/**
 * Custom Input Component that automatically strips leading 0 in real-time
 */
const StripLeadingZeroInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onChange, onKeyDown, ...props }, ref) => {
        // Strip leading 0 from formatted display value
        const displayValue = useMemo(() => {
            if (typeof value !== 'string') return value;
            if (value.startsWith('0')) {
                return value.replace(/^0+/, '');
            }
            return value;
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let val = e.target.value;
            // Strip leading zero in live time if user types or pastes starting with 0
            if (val.startsWith('0')) {
                val = val.replace(/^0+/, '');
                e.target.value = val;
            }
            if (onChange) {
                onChange(e);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            // If field is empty and user presses 0 (e.g. typing 017... out of habit), ignore the 0
            if (e.key === '0' && (!e.currentTarget.value || e.currentTarget.selectionStart === 0)) {
                e.preventDefault();
                return;
            }
            if (onKeyDown) {
                onKeyDown(e);
            }
        };

        return (
            <input
                ref={ref}
                {...props}
                value={displayValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        );
    }
);
StripLeadingZeroInput.displayName = 'StripLeadingZeroInput';

export const PhoneInput: React.FC<PhoneInputProps> = ({
    name = 'phone',
    value = '',
    onChange,
    onCountryChange,
    country,
    defaultCountry = 'BD',
    placeholder = '1711-234567',
    disabled = false,
    error,
    label,
    className,
    id
}) => {
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : name);

    // Resolve ISO Country code from string name (e.g. "Bangladesh" -> "BD")
    const resolvedCountry = useMemo(() => resolveCountry(country), [country]);
    const resolvedDefault = useMemo(() => resolveCountry(defaultCountry) || 'BD', [defaultCountry]);

    const handleValueChange = (newVal?: string) => {
        const fullString = newVal || '';

        // Notify parent with synthetic event object and string value compatibility
        if (onChange) {
            onChange({
                target: {
                    name,
                    value: fullString
                }
            });
        }

        // Detect country from new phone string and notify parent if requested
        if (onCountryChange && fullString) {
            try {
                const parsed = parsePhoneNumber(fullString);
                if (parsed && parsed.country) {
                    const countryName = (enLabels as Record<string, string>)[parsed.country] || parsed.country;
                    onCountryChange({
                        code: parsed.country,
                        name: countryName,
                        callingCode: `+${parsed.countryCallingCode}`,
                        flag: getFlagEmoji(parsed.country)
                    });
                }
            } catch {
                // Ignore parse errors while typing
            }
        }
    };

    const renderLabel = (labelStr: string) => {
        if (labelStr.endsWith('*')) {
            const baseText = labelStr.slice(0, -1).trim();
            return (
                <>
                    {baseText} <span className="text-red-500 font-bold ml-0.5">*</span>
                </>
            );
        }
        return labelStr;
    };

    return (
        <div className={cn("flex flex-col gap-1 w-full font-sans antialiased", className)}>
            {label && (
                <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 font-sans">
                    {renderLabel(label)}
                </label>
            )}

            <div className={cn("custom-phone-input-wrapper w-full", error && "has-error")}>
                <PhoneInputWithCountry
                    id={inputId}
                    name={name}
                    value={value || undefined}
                    onChange={handleValueChange}
                    country={resolvedCountry}
                    defaultCountry={resolvedDefault}
                    countrySelectComponent={CustomCountrySelect as any}
                    inputComponent={StripLeadingZeroInput}
                    international={false}
                    disabled={disabled}
                    placeholder={placeholder}
                    labels={enLabels}
                    className="w-full"
                />
            </div>

            {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
        </div>
    );
};

export default PhoneInput;
