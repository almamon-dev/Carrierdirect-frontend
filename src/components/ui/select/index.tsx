import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SelectOption, SelectProps } from './selectTypes';
import { useSelectOptions } from './useSelectOptions';
import { SelectPortalMenu } from './SelectPortalMenu';
import { getRawValue, renderSelectedDisplay } from './selectDisplayUtils';

export type { SelectOption, SelectProps };

export default function Select({
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    className = "",
    triggerClassName = "",
    size = "md",
    name = "",
    multiple = false,
    disabled = false,
    showSearch,
    direction = "down",
    onCreate: onCreateProp,
    icon: Icon,
    error,
    children
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownPos, setDropdownPos] = useState<{
        top?: number;
        bottom?: number;
        left: number;
        width: number;
        maxHeight?: number;
        placement: 'down' | 'up';
    }>({ left: 0, width: 200, placement: 'down' });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const rawValue = getRawValue(value);
    const normalizedValue = multiple
        ? (Array.isArray(rawValue) ? rawValue : (rawValue ? [rawValue] : []))
        : rawValue;

    const { finalOptions, filteredOptions } = useSelectOptions(options, children, searchQuery, normalizedValue);
    const shouldShowSearch = showSearch !== undefined ? showSearch : finalOptions.length > 6;

    const isSelected = (optId: any) => {
        if (multiple) {
            return Array.isArray(normalizedValue) && normalizedValue.map(v => String(v).toLowerCase().trim()).includes(String(optId).toLowerCase().trim());
        }
        const normLower = String(normalizedValue ?? "").toLowerCase().trim();
        const optLower = String(optId ?? "").toLowerCase().trim();
        return normLower !== "" && normLower === optLower;
    };

    const handleSelectOption = (option: SelectOption) => {
        const optId = option.id !== undefined ? option.id : option.value;
        if (multiple) {
            const currentArr = Array.isArray(normalizedValue) ? [...normalizedValue] : [];
            const index = currentArr.findIndex(v => String(v) === String(optId));
            const newArr = index > -1
                ? currentArr.filter(v => String(v) !== String(optId))
                : [...currentArr, optId];

            if (onChange) {
                const eventObj = {
                    target: { name, value: newArr },
                    id: newArr,
                    value: newArr,
                    toString: () => JSON.stringify(newArr),
                    valueOf: () => newArr,
                };
                onChange(eventObj as any);
            }
        } else {
            if (onChange) {
                const eventObj = {
                    target: { name, value: optId },
                    id: optId,
                    value: optId,
                    name: option.name || option.label,
                    label: option.name || option.label,
                    toString: () => String(optId ?? ''),
                    valueOf: () => optId,
                };
                onChange(eventObj as any);
            }
            setIsOpen(false);
        }
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            const count = finalOptions.length || 1;
            const itemHeight = size === 'sm' ? 32 : 36;
            const searchHeight = shouldShowSearch ? 45 : 0;
            const estimatedHeight = Math.min(240, count * itemHeight + searchHeight + 10);

            let placement: 'down' | 'up' = 'down';
            if (direction === 'up') {
                placement = 'up';
            } else if (direction === 'down') {
                if (spaceBelow < 120 && spaceAbove > spaceBelow) {
                    placement = 'up';
                } else {
                    placement = 'down';
                }
            } else {
                if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
                    placement = 'up';
                } else {
                    placement = 'down';
                }
            }

            let top: number | undefined;
            let bottom: number | undefined;
            let maxHeight: number;

            if (placement === 'up') {
                bottom = Math.max(8, window.innerHeight - rect.top + 4);
                maxHeight = Math.min(240, Math.max(100, spaceAbove - 16));
            } else {
                top = rect.bottom + 4;
                maxHeight = Math.min(240, Math.max(100, spaceBelow - 16));
            }

            const width = size === "sm" ? Math.max(rect.width, 100) : Math.max(140, rect.width);
            let left = rect.left;
            if (left + width > window.innerWidth - 12) {
                left = Math.max(10, rect.right - width);
            }

            setDropdownPos({ top, bottom, left, width, maxHeight, placement });
            setSearchQuery('');
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen && shouldShowSearch) {
            setTimeout(() => { searchInputRef.current?.focus(); }, 50);
        }
    }, [isOpen, shouldShowSearch]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target?.closest?.('.custom-select-portal-menu')) return;
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
        <div className={cn("w-full relative font-sans antialiased", className, disabled && "opacity-60 cursor-not-allowed pointer-events-none")}>
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={cn(
                    "relative w-full cursor-pointer rounded-[4px] border bg-white dark:bg-[#1e2329] text-left font-medium text-[#202223] dark:text-white outline-none focus:outline-none transition-all flex items-center shadow-none",
                    size === "sm" 
                        ? "h-[30px] text-xs py-0.5 pr-7" 
                        : size === "lg" 
                            ? "h-[42px] text-sm py-2 pr-9" 
                            : "h-[36px] text-[13px] py-1 pr-8",
                    error 
                        ? "border-[#d82c0d] focus:border-[#d82c0d]" 
                        : "border-slate-300 dark:border-[#384150] focus:border-slate-400 dark:focus:border-slate-500",
                    Icon ? (size === "sm" ? "pl-8" : "pl-9") : (size === "sm" ? "pl-2.5" : "pl-3"),
                    triggerClassName
                )}
            >
                {Icon && (
                    <span className={cn(
                        "pointer-events-none absolute inset-y-0 left-0 flex items-center text-slate-400 dark:text-slate-400",
                        size === "sm" ? "pl-2.5" : "pl-3"
                    )}>
                        <Icon size={size === "sm" ? 13 : 14} aria-hidden="true" />
                    </span>
                )}
                <span className={cn("block truncate", multiple ? "break-words whitespace-normal pb-0.5" : "truncate")}>
                    {renderSelectedDisplay(multiple, normalizedValue, finalOptions, placeholder, size, Icon)}
                </span>
                <span className={cn(
                    "pointer-events-none absolute inset-y-0 right-0 flex items-center text-slate-400 dark:text-slate-500",
                    size === "sm" ? "pr-2" : "pr-2.5"
                )}>
                    <ChevronDown size={size === "sm" ? 13 : 14} aria-hidden="true" className={cn("transition-transform duration-150", isOpen && "rotate-180")} />
                </span>
            </button>

            <SelectPortalMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                dropdownPos={dropdownPos}
                shouldShowSearch={shouldShowSearch}
                searchInputRef={searchInputRef}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filteredOptions={filteredOptions}
                size={size}
                isSelected={isSelected}
                onSelectOption={handleSelectOption}
                onCreate={onCreateProp ? (name) => { onCreateProp(name); setSearchQuery(''); } : undefined}
            />
        </div>
    );
}
