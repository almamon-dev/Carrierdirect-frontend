import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
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

    const [searchQuery, setSearchQuery] = useState('');
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

    const handleChange = (val: any) => {
        if (onChange) {
            // Pass a mock event object to maintain compatibility with standard input handlers
            onChange({
                target: {
                    name: name,
                    value: val
                }
            });
        }
    };

    const onCreate = (nameToCreate: string) => {
        if (onCreateProp) {
            onCreateProp(nameToCreate);
            setSearchQuery('');
        }
    };


    return (
        <div className={cn("w-full relative", className, disabled && "opacity-60 cursor-not-allowed pointer-events-none")}>
            <Listbox value={normalizedValue} onChange={handleChange} multiple={multiple} disabled={disabled}>
                {({ open }) => (
                    <div className={cn("relative h-full", open && "z-[9999]")}>
                        <Listbox.Button className={cn(
                            "relative w-full h-[36px] cursor-pointer rounded-sm border bg-white dark:bg-[#1e2329] py-1 pr-8 text-left text-[13px] font-medium text-[#202223] dark:text-white outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 transition-all flex items-center shadow-none",
                            error ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-0" : "border-slate-300 dark:border-[#384150] focus:border-slate-400 dark:focus:border-slate-500 focus:ring-0 focus:outline-none",
                            Icon ? "pl-9" : "pl-3"
                        )}>
                            {Icon && (
                                <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-[#8c9196] dark:text-slate-400">
                                    <Icon size={14} aria-hidden="true" />
                                </span>
                            )}
                            <span className={cn("block", multiple ? "break-words whitespace-normal pb-0.5" : "truncate")}>
                                {getSelectedDisplay()}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 dark:text-slate-500">
                                <ChevronDown size={14} aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            show={open}
                            as={Fragment}
                            afterLeave={() => setSearchQuery('')}
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Listbox.Options className={cn(
                                "custom-select-menu absolute z-[9999] max-h-64 w-full overflow-hidden rounded-md text-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border focus:outline-none flex flex-col",
                                direction === "up" ? "bottom-full mb-1" : "mt-1"
                            )}>
                                {/* Search Input Container */}
                                {showSearch && (
                                    <div className="custom-select-search shrink-0">
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full text-[12px] outline-none font-medium focus:ring-0"
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}

                                {/* Options List */}
                                <div className="overflow-y-auto py-1 flex-1 max-h-[300px] hide-scrollbar no-scrollbar">
                                    {filteredOptions.length === 0 && !onCreateProp ? (
                                        <div className="py-10 px-4 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                                            <SearchX size={32} strokeWidth={1} />
                                            <span className="text-[11px] font-medium uppercase tracking-wider">No results found</span>
                                        </div>
                                    ) : (
                                        <>
                                            {filteredOptions.map((option, idx) => {
                                                const active = isSelected(option.id);
                                                return (
                                                    <Listbox.Option
                                                        key={idx}
                                                        className={({ active: isHovered }) =>
                                                            cn(
                                                                "custom-select-option relative cursor-pointer select-none py-2 px-3 border-b border-slate-100/30 dark:border-slate-800/30 last:border-0",
                                                                active ? "is-selected font-bold" : "font-medium",
                                                                isHovered && !active ? "bg-slate-100 dark:bg-slate-800/80 text-[#FF4A1F]" : ""
                                                            )
                                                        }
                                                        value={option.id}
                                                    >
                                                        {() => (
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {option.image && (
                                                                        <img
                                                                            src={option.image.startsWith('http') ? option.image : `/storage/${option.image}`}
                                                                            className="w-4 h-4 object-contain"
                                                                            alt=""
                                                                        />
                                                                    )}
                                                                    <span className="block truncate text-gray-800 dark:text-slate-100">
                                                                        {option.name}
                                                                    </span>
                                                                </div>
                                                                {active && (
                                                                    <Check size={14} className="text-[#FF4A1F]" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                );
                                            })}

                                            {onCreateProp && searchQuery && !filteredOptions.find(o => (o.name || "").toLowerCase() === searchQuery.toLowerCase()) && (
                                                <button
                                                    type="button"
                                                    onClick={() => onCreate(searchQuery)}
                                                    className="w-full text-left py-3 px-10 text-[12px] font-bold text-[#FF4A1F] hover:bg-[#FFF2ED] dark:hover:bg-slate-800/70 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2 mt-1"
                                                >
                                                    <Plus size={14} /> Quick Add "{searchQuery}"
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </Listbox.Options>
                        </Transition>
                    </div>
                )}
            </Listbox>
        </div>
    );
}
