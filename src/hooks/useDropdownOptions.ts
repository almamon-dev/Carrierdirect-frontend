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

const BUILT_IN_DROPDOWNS: Record<string, DropdownItem[]> = {
    load_type: [
        { id: 'Euro Pallets', name: 'Euro Pallets', key: 'euro_pallets' },
        { id: 'Industrial Pallets', name: 'Industrial Pallets', key: 'industrial_pallets' },
        { id: 'Pallets', name: 'Pallets', key: 'pallets' },
        { id: 'Boxes', name: 'Boxes', key: 'boxes' },
        { id: 'Crates', name: 'Crates', key: 'crates' },
        { id: 'Machinery', name: 'Machinery', key: 'machinery' },
        { id: 'Vehicles', name: 'Vehicles', key: 'vehicles' },
        { id: 'Furniture', name: 'Furniture', key: 'furniture' },
        { id: 'Dry Freight', name: 'Dry Freight', key: 'dry_freight' },
        { id: 'Packages', name: 'Packages', key: 'packages' },
        { id: 'Containers', name: 'Containers', key: 'containers' },
        { id: 'Other', name: 'Other', key: 'other' },
    ],
    vehicle_type: [
        { id: 'Curtainsider', name: 'Curtainsider', key: 'curtainsider' },
        { id: 'Box Truck', name: 'Box Truck', key: 'box_truck' },
        { id: 'Box Truck with Tail Lift', name: 'Box Truck with Tail Lift', key: 'box_truck_tail_lift' },
        { id: 'Refrigerated Trailer', name: 'Refrigerated Trailer', key: 'refrigerated_trailer' },
        { id: 'Sprinter Van', name: 'Sprinter Van', key: 'sprinter_van' },
        { id: 'Small Van', name: 'Small Van', key: 'small_van' },
        { id: 'Cargo Van', name: 'Cargo Van', key: 'cargo_van' },
        { id: 'Mega Trailer', name: 'Mega Trailer', key: 'mega_trailer' },
        { id: 'Semi Trailer', name: 'Semi Trailer', key: 'semi_trailer' },
        { id: 'Flatbed Trailer', name: 'Flatbed Trailer', key: 'flatbed_trailer' },
        { id: 'Flatbed Truck', name: 'Flatbed Truck', key: 'flatbed_truck' },
        { id: 'Pickup Truck', name: 'Pickup Truck', key: 'pickup_truck' },
        { id: 'Covered Van (20ft)', name: 'Covered Van (20ft)', key: 'covered_van_20ft' },
    ],
};

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
     * Retrieve options by category with alias key fallback, built-in options and default options.
     */
    const getOptions = (category: string, defaultOptions: DropdownItem[] = []): DropdownItem[] => {
        let result: DropdownItem[] = [];

        // Direct category match
        if (dropdowns[category] && Array.isArray(dropdowns[category]) && dropdowns[category].length > 0) {
            result = dropdowns[category];
        } else {
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
                    result = dropdowns[alias];
                    break;
                }
            }
        }

        const builtin = BUILT_IN_DROPDOWNS[category] || BUILT_IN_DROPDOWNS[category.toLowerCase()] || [];
        const baseFallbacks = defaultOptions.length > 0 ? defaultOptions : builtin;

        if (result.length === 0) {
            return baseFallbacks;
        }

        if (baseFallbacks.length > 0) {
            const existingKeys = new Set(result.map(r => String(r.name || r.label || r.id).toLowerCase().trim()));
            const missing = baseFallbacks.filter(b => !existingKeys.has(String(b.name || b.label || b.id).toLowerCase().trim()));
            return [...result, ...missing];
        }

        return result;
    };

    return { dropdowns, loading, getOptions };
}
