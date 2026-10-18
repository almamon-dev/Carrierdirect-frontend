import React, { useMemo } from 'react';
import { SelectOption } from './selectTypes';

export function useSelectOptions(
    options: SelectOption[] = [],
    children?: React.ReactNode,
    searchQuery: string = ''
) {
    const childOptions: SelectOption[] = useMemo(() => {
        return React.Children.toArray(children)
            .filter(child => React.isValidElement(child))
            .map((child: any) => {
                const val = child.props.value !== undefined ? child.props.value : child.key;
                const label = child.props.children;
                return {
                    id: val,
                    value: val,
                    name: label,
                    label: label,
                    image: child.props['data-image'] || child.props.image,
                    icon: child.props['data-icon'] || child.props.icon
                };
            })
            .filter(opt => opt.id !== undefined);
    }, [children]);

    const finalOptions: SelectOption[] = useMemo(() => {
        const rawList = options && options.length > 0 ? options : childOptions;
        return rawList.map((opt: any) => {
            if (typeof opt === 'string' || typeof opt === 'number') {
                return {
                    id: opt,
                    value: opt,
                    name: String(opt),
                    label: String(opt),
                };
            }
            const id = opt.value !== undefined ? opt.value : (opt.id !== undefined ? opt.id : opt.key);
            const name = opt.label !== undefined ? opt.label : (opt.name !== undefined ? opt.name : (opt.title ?? (id !== undefined ? String(id) : '')));
            return {
                ...opt,
                id,
                value: id,
                name,
                label: name,
                image: opt.image || opt['data-image'],
                icon: opt.icon || opt['data-icon'],
            };
        });
    }, [options, childOptions]);

    const filteredOptions = useMemo(() => {
        if (!searchQuery.trim()) return finalOptions;
        const q = searchQuery.toLowerCase();
        return finalOptions.filter(opt => {
            const nameStr = typeof opt.name === 'string' ? opt.name : '';
            const labelStr = typeof opt.label === 'string' ? opt.label : '';
            const valStr = opt.value !== undefined ? String(opt.value) : '';
            const idStr = opt.id !== undefined ? String(opt.id) : '';
            return (
                nameStr.toLowerCase().includes(q) ||
                labelStr.toLowerCase().includes(q) ||
                valStr.toLowerCase().includes(q) ||
                idStr.toLowerCase().includes(q)
            );
        });
    }, [finalOptions, searchQuery]);

    return {
        finalOptions,
        filteredOptions,
    };
}
