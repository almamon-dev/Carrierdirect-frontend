import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Country, getCountryCallingCode } from 'react-phone-number-input';
import {
    getFlagEmoji,
    PRIORITY_CODES,
    COUNTRY_ALIASES
} from './phoneInputConstants';
import { PhoneCountryDropdownMenu } from './PhoneCountryDropdownMenu';

interface CustomCountrySelectProps {
    value?: Country;
    onChange: (value?: Country) => void;
    options: { value?: Country; label: string; divider?: boolean }[];
    disabled?: boolean;
}

export const CustomCountrySelect: React.FC<CustomCountrySelectProps> = ({
    value = 'BD',
    onChange,
    options,
    disabled
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 260 });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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

    const filteredOptions = useMemo(() => {
        const validOptions = options.filter(o => o.value) as { value: Country; label: string }[];

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

            <PhoneCountryDropdownMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                dropdownPos={dropdownPos}
                searchInputRef={searchInputRef}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filteredOptions={filteredOptions}
                value={value}
                onSelect={handleSelect}
            />
        </div>
    );
};
