import React, { useState, useEffect, useRef } from 'react';
import Input from '@/components/ui/input';
import { OptionItem } from '../types/completeProfile.types';

export interface AutocompleteInputProps {
    id?: string;
    nextFieldId?: string;
    value: string;
    onChange: (val: string) => void;
    onSelect?: (val: string, item?: OptionItem) => void;
    options: OptionItem[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}

export function AutocompleteInput({
    id,
    nextFieldId,
    value,
    onChange,
    onSelect,
    options,
    placeholder = 'Type to search...',
    disabled = false,
    error,
}: AutocompleteInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const focusNextField = () => {
        if (nextFieldId) {
            setTimeout(() => {
                const nextElem = document.getElementById(nextFieldId);
                if (nextElem) {
                    nextElem.focus();
                }
            }, 100);
        }
    };

    const searchTrimmed = (value || '').trim().toLowerCase();
    const hasTypedText = searchTrimmed.length > 0;

    const filtered = hasTypedText
        ? options.filter(opt => opt.name.toLowerCase().includes(searchTrimmed))
        : [];

    return (
        <div ref={containerRef} className="relative w-full">
            <Input
                id={id}
                type="text"
                className="bg-white"
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => {
                    if (!disabled && hasTypedText) setIsOpen(true);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (isOpen && filtered.length > 0) {
                            const firstMatch = filtered[0];
                            onChange(firstMatch.name);
                            if (onSelect) onSelect(firstMatch.name, firstMatch);
                            setIsOpen(false);
                        }
                        focusNextField();
                    }
                }}
                error={error}
            />
            {isOpen && !disabled && hasTypedText && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto font-sans antialiased">
                    {filtered.map((item, idx) => (
                        <div
                            key={idx}
                            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#FF4A1F] cursor-pointer transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange(item.name);
                                if (onSelect) onSelect(item.name, item);
                                setIsOpen(false);
                                focusNextField();
                            }}
                        >
                            <span>{item.name}</span>
                            {item.postal_code && (
                                <span className="text-[10px] text-slate-400 font-normal">ZIP: {item.postal_code}</span>
                            )}
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div
                            className="px-3 py-2 text-xs font-semibold text-[#FF4A1F] hover:bg-orange-50 cursor-pointer transition-colors border-t border-slate-100 flex items-center gap-1"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange(value);
                                if (onSelect) onSelect(value);
                                setIsOpen(false);
                                focusNextField();
                            }}
                        >
                            <span>Use custom:</span>
                            <span className="italic font-bold">"{value.trim()}"</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default AutocompleteInput;
