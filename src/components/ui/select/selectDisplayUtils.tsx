import React from 'react';
import { LucideIcon } from 'lucide-react';
import { SelectOption } from './selectTypes';

export const getRawValue = (val: any) => {
    if (Array.isArray(val)) return val.map(v => typeof v === 'object' ? (v.id ?? v.value) : v);
    if (typeof val === 'object' && val !== null) return val.id ?? val.value ?? "";
    return val ?? "";
};

export const renderSelectedDisplay = (
    multiple: boolean,
    normalizedValue: any,
    finalOptions: SelectOption[],
    placeholder: string,
    size: "sm" | "md" | "lg",
    Icon?: LucideIcon | React.ElementType
) => {
    if (multiple) {
        const selectedItems = finalOptions.filter(opt =>
            Array.isArray(normalizedValue) && normalizedValue.map(v => String(v)).includes(String(opt.id))
        );
        if (selectedItems.length === 0) return placeholder;
        return (
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
                {selectedItems.length} selected
            </span>
        );
    }
    const selected = finalOptions.find(opt => 
        String(opt.id) === String(normalizedValue) || 
        String(opt.value) === String(normalizedValue)
    );
    if (!selected) return placeholder;

    return (
        <div className="flex items-center gap-1.5 truncate">
            {selected.image && (
                <img
                    src={selected.image.startsWith('http') ? selected.image : `/storage/${selected.image}`}
                    className="w-3.5 h-3.5 object-contain shrink-0"
                    alt=""
                />
            )}
            {selected.icon && !Icon && (
                typeof selected.icon === 'function' ? (
                    React.createElement(selected.icon, {
                        size: size === "sm" ? 13 : 14,
                        className: "shrink-0 text-slate-500 dark:text-slate-400"
                    })
                ) : React.isValidElement(selected.icon) ? (
                    <span className="shrink-0 text-slate-500 dark:text-slate-400">
                        {selected.icon}
                    </span>
                ) : null
            )}
            <span className="truncate">
                {typeof (selected.name || selected.label) === 'string' ? (selected.name || selected.label) : (selected.name || selected.label)}
            </span>
        </div>
    );
};
