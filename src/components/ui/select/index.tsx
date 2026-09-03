import React, { Fragment, useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, SearchX, Plus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
    id?: string | number;
    value?: string | number;
    name?: string | React.ReactNode;
    image?: string;
    [key: string]: any;
}

export interface SelectProps {
    value?: any;
    onChange?: (e: any) => void;
    options?: SelectOption[];
    placeholder?: string;
    className?: string;
    name?: string;
    multiple?: boolean;
    disabled?: boolean;
    showSearch?: boolean;
    direction?: "up" | "down";
    onCreate?: (name: string) => void;
    icon?: LucideIcon | React.ElementType;
    children?: React.ReactNode;
    error?: string | boolean;
}

export default function Select({
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    className = "",
    name = "",
    multiple = false,
    disabled = false,
    showSearch = true,
    direction = "down",
    onCreate: onCreateProp,
    icon: Icon,
    error,
    children
}: SelectProps) {
    // Extract options from children if they exist (standard native pattern)
    const childOptions = React.Children.toArray(children)
        .filter(child => React.isValidElement(child))
        .map((child: any) => ({
            id: child.props.value !== undefined ? child.props.value : child.key,
            name: child.props.children,
            image: child.props['data-image'] || child.props.image
        }))
        .filter(opt => opt.id !== undefined);

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 200 });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const finalOptions = options.length > 0 ? options : childOptions;

    // Filter options based on search query
    const filteredOptions = finalOptions.filter(opt =>
        String(opt.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper to get raw value from potential objects
    const getRawValue = (val: any) => {
        if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? v.value : v);
        if (typeof val === 'object' && val !== null) return val.value || "";
        return val ?? "";
    };

    const rawValue = getRawValue(value);
    const normalizedValue = multiple
        ? (Array.isArray(rawValue) ? rawValue : (rawValue ? [rawValue] : []))
        : rawValue;

    // Handle selection display
    const getSelectedDisplay = () => {
        if (multiple) {
            const selectedItems = finalOptions.filter(opt =>
                Array.isArray(normalizedValue) && normalizedValue.map(v => String(v)).includes(String(opt.id))
            );
            return selectedItems.length > 0 ? selectedItems.map(i => i.name).join(', ') : placeholder;
        }
        const selected = finalOptions.find(opt => String(opt.id) === String(normalizedValue));
        return selected ? selected.name : placeholder;
    };

    const isSelected = (id: any) => {
        if (multiple) {
            return Array.isArray(normalizedValue) && normalizedValue.map(v => String(v)).includes(String(id));
        }
        return String(normalizedValue) === String(id);
    };

    const handleSelectOption = (optId: any) => {
        if (multiple) {
            const currentArr = Array.isArray(normalizedValue) ? [...normalizedValue] : [];
            const index = currentArr.findIndex(v => String(v) === String(optId));
            let newArr: any[];
            if (index > -1) {
                newArr = currentArr.filter(v => String(v) !== String(optId));
            } else {
                newArr = [...currentArr, optId];
            }
            if (onChange) {
                onChange({
                    target: {
                        name: name,
                        value: newArr
                    }
                });
            }
        } else {
            if (onChange) {
                onChange({
                    target: {
                        name: name,
                        value: optId
                    }
                });
            }
            setIsOpen(false);
        }
    };

    const onCreate = (nameToCreate: string) => {
        if (onCreateProp) {
            onCreateProp(nameToCreate);
            setSearchQuery('');
        }
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 240;

            let top = rect.bottom + 4;
            if ((direction === 'up' || spaceBelow < dropdownHeight) && rect.top > dropdownHeight) {
                top = rect.top - dropdownHeight - 4;
            }

            setDropdownPos({
                top,
                left: rect.left,
                width: Math.max(180, rect.width)
            });
            setSearchQuery('');
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    // Auto-focus search input
    useEffect(() => {
        if (isOpen && showSearch) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [isOpen, showSearch]);

    // Handle outside click & scroll
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target && target.closest && target.closest('.custom-select-portal-menu')) {
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
        <div className={cn("w-full relative font-sans antialiased", className, disabled && "opacity-60 cursor-not-allowed pointer-events-none")}>
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={cn(
                    "relative w-full h-[36px] cursor-pointer rounded-sm border bg-white dark:bg-[#1e2329] py-1 pr-8 text-left text-[13px] font-medium text-[#202223] dark:text-white outline-none focus:outline-none transition-all flex items-center shadow-none",
                    error 
                        ? "border-[#d82c0d] focus:border-[#d82c0d]" 
                        : "border-slate-300 dark:border-[#384150] focus:border-slate-400 dark:focus:border-slate-500",
                    Icon ? "pl-9" : "pl-3"
                )}
            >
                {Icon && (
                    <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-[#8c9196] dark:text-slate-400">
                        <Icon size={14} aria-hidden="true" />
                    </span>
                )}
                <span className={cn("block", multiple ? "break-words whitespace-normal pb-0.5" : "truncate")}>
                    {getSelectedDisplay()}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 dark:text-slate-500">
                    <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform duration-150", isOpen && "rotate-180")} />
                </span>
            </button>

            {/* Floating Portal Dropdown Menu (Never Clipped by Modals) */}
            {isOpen && createPortal(
                <>
                    {/* Transparent Click-Outside Overlay */}
                    <div 
                        className="fixed inset-0 z-[999998] bg-transparent" 
                        onClick={() => setIsOpen(false)} 
                    />

                    {/* Floating Dropdown Container */}
                    <div
                        style={{
                            position: 'fixed',
                            top: `${dropdownPos.top}px`,
                            left: `${dropdownPos.left}px`,
                            width: `${dropdownPos.width}px`,
                        }}
                        className="custom-select-portal-menu z-[999999] max-h-64 overflow-hidden rounded-md bg-white dark:bg-[#1e2329] text-[12px] shadow-2xl border border-slate-200 dark:border-slate-700 focus:outline-none flex flex-col animate-in fade-in zoom-in-95 duration-100 font-sans"
                    >
                        {/* Search Input Container */}
                        {showSearch && (
                            <div className="p-2 bg-slate-50 dark:bg-[#181d24] border-b border-slate-200 dark:border-slate-700 shrink-0">
                                <div className="relative flex items-center">
                                    <Search size={13} className="absolute left-2 text-slate-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-7 pl-7 pr-2 text-[12px] bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#FF4A1F] placeholder:text-slate-400 font-medium"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options List */}
                        <div className="overflow-y-auto py-1 flex-1 max-h-[220px] hide-scrollbar no-scrollbar">
                            {filteredOptions.length === 0 && !onCreateProp ? (
                                <div className="py-6 px-4 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1.5">
                                    <SearchX size={24} strokeWidth={1.5} />
                                    <span className="text-[11px] font-medium">No results found</span>
                                </div>
                            ) : (
                                <>
                                    {filteredOptions.map((option, idx) => {
                                        const active = isSelected(option.id);
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => handleSelectOption(option.id)}
                                                className={cn(
                                                    "cursor-pointer select-none py-2 px-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0 flex items-center justify-between transition-colors",
                                                    active 
                                                        ? "bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] font-bold" 
                                                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900"
                                                )}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    {option.image && (
                                                        <img
                                                            src={option.image.startsWith('http') ? option.image : `/storage/${option.image}`}
                                                            className="w-4 h-4 object-contain shrink-0"
                                                            alt=""
                                                        />
                                                    )}
                                                    <span className="truncate text-[12.5px]">
                                                        {option.name}
                                                    </span>
                                                </div>
                                                {active && (
                                                    <Check size={14} className="text-[#FF4A1F] shrink-0 ml-2" />
                                                )}
                                            </div>
                                        );
                                    })}

                                    {onCreateProp && searchQuery && !filteredOptions.find(o => (o.name || "").toLowerCase() === searchQuery.toLowerCase()) && (
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
            )}
        </div>
    );
}
