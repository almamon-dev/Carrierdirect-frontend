import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

export interface DropdownItem {
    id: string | number;
    name: string;
    key?: string;
    category?: string;
    [key: string]: any;
}

export function useDropdownOptions() {
    const [dropdowns, setDropdowns] = useState<Record<string, DropdownItem[]>>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchDropdowns() {
            try {
                const res = await apiClient.get(ENDPOINTS.MASTER_DATA.DROPDOWNS);
                const rawData = res.data?.data || res.data || {};

                if (isMounted && typeof rawData === 'object' && rawData !== null) {
                    const formatted: Record<string, DropdownItem[]> = {};

                    Object.keys(rawData).forEach((catKey) => {
                        const items = rawData[catKey];
                        if (Array.isArray(items)) {
                            formatted[catKey] = items.map((item: any, index: number) => {
                                if (typeof item === 'string') {
                                    return {
                                        id: item,
                                        name: item,
                                        key: item,
                                        category: catKey,
                                    };
                                }
                                if (typeof item === 'object' && item !== null) {
                                    const displayLabel = item.label || item.name || item.title || item.value || (item.id ? String(item.id) : `Option ${index + 1}`);
                                    const valueId = item.label || item.name || item.value || item.title || item.id || item.key || displayLabel;
                                    return {
                                        id: valueId,
                                        name: displayLabel,
                                        key: item.key || item.id || String(valueId),
                                        category: item.category || catKey,
                                        image: item.image,
                                    };
                                }
                                return {
                                    id: String(item),
                                    name: String(item),
                                    category: catKey,
                                };
                            });
                        }
                    });

                    if (Object.keys(formatted).length > 0) {
                        setDropdowns(formatted);
                    }
                }
            } catch (err) {
                // Silently fallback
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchDropdowns();

        return () => {
            isMounted = false;
        };
    }, []);

    /**
     * Retrieve options by category with alias key fallback and default options.
     */
    const getOptions = (category: string, defaultOptions: DropdownItem[] = []): DropdownItem[] => {
        // Direct category match
        if (dropdowns[category] && Array.isArray(dropdowns[category]) && dropdowns[category].length > 0) {
            return dropdowns[category];
        }

        // Aliases check
        const aliases = [
            category.toLowerCase(),
            category.toUpperCase(),
            category.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), // camelCase
            `${category}s`,
            `${category}_types`,
            category.replace(/_type$/i, ''),
            `${category.replace(/_type$/i, '')}s`,
        ];

        for (const alias of aliases) {
            if (dropdowns[alias] && Array.isArray(dropdowns[alias]) && dropdowns[alias].length > 0) {
                return dropdowns[alias];
            }
        }

        return defaultOptions;
    };

    return { dropdowns, loading, getOptions };
}
