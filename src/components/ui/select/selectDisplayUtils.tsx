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
            Array.isArray(normalizedValue) && normalizedValue.map(v => String(v).toLowerCase().trim()).includes(String(opt.id).toLowerCase().trim())
        );
        if (selectedItems.length === 0) {
            if (Array.isArray(normalizedValue) && normalizedValue.length > 0) {
                return (
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {normalizedValue.length} selected
                    </span>
                );
            }
            return placeholder;
        }
        return (
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
                {selectedItems.length} selected
            </span>
        );
    }

    if (normalizedValue === null || normalizedValue === undefined || normalizedValue === "") {
        return placeholder;
    }

    const normStr = String(normalizedValue).trim();
    if (!normStr) return placeholder;
    const normLower = normStr.toLowerCase();

    // 1. Exact match by id or value
    let selected = finalOptions.find(opt => 
        String(opt.id) === normStr || 
        String(opt.value) === normStr ||
        (opt.rawId && String(opt.rawId) === normStr) ||
        (opt.order_id && String(opt.order_id) === normStr)
    );

    // 2. Case-insensitive match on id, value, key, name, or label
    if (!selected) {
        selected = finalOptions.find(opt => 
            String(opt.id).toLowerCase().trim() === normLower || 
            String(opt.value).toLowerCase().trim() === normLower ||
            (opt.rawId && String(opt.rawId).toLowerCase().trim() === normLower) ||
            (opt.order_id && String(opt.order_id).toLowerCase().trim() === normLower) ||
            (opt.key && String(opt.key).toLowerCase().trim() === normLower) ||
            (opt.name && String(opt.name).toLowerCase().trim() === normLower) ||
            (opt.label && String(opt.label).toLowerCase().trim() === normLower)
        );
    }

    // 3. Substring / partial match (e.g. "Euro Pallets" matching "Pallets")
    if (!selected) {
        selected = finalOptions.find(opt => {
            const optName = String(opt.name || opt.label || opt.id || "").toLowerCase().trim();
            return optName.length > 2 && (normLower.includes(optName) || optName.includes(normLower));
        });
    }

    // 4. Safe fallback: If not found in options but value exists, display the value itself!
    if (!selected) {
        return (
            <div className="flex items-center gap-1.5 truncate">
                <span className="truncate text-slate-800 dark:text-slate-200 font-medium">
                    {normStr}
                </span>
            </div>
        );
    }

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
            <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                {selected.selectedLabel || (typeof (selected.name || selected.label) === 'string' ? (selected.name || selected.label) : (selected.name || selected.label))}
            </span>
            {selected.badge && (
                <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    selected.badgeColor === 'subcontractor'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50'
                }`}>
                    {selected.badge}
                </span>
            )}
        </div>
    );
};
