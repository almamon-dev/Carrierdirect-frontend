import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

export interface DropdownItem {
    id: string | number;
    name: string;
    key?: string;
    category?: string;
}

export function useDropdownOptions() {
    const [dropdowns, setDropdowns] = useState<Record<string, DropdownItem[]>>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchDropdowns() {
            try {
                const res = await apiClient.get(ENDPOINTS.MASTER_DATA.DROPDOWNS);
                const rawData = res.data?.data || res.data || {};
                
                if (isMounted && typeof rawData === 'object') {
                    const formatted: Record<string, DropdownItem[]> = {};
                    
                    Object.keys(rawData).forEach((category) => {
                        const items = rawData[category];
                        if (Array.isArray(items)) {
                            formatted[category] = items.map((item: any) => ({
                                id: item.label || item.key || item.id,
                                name: item.label || item.key || String(item.id),
                                key: item.key,
                                category: item.category
                            }));
                        }
                    });

                    setDropdowns(formatted);
                }
            } catch (err) {
                // Silently fallback to defaults when API is unreachable or during development
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchDropdowns();
        return () => {
            isMounted = false;
        };
    }, []);

    const getOptions = (category: string, defaultOptions: DropdownItem[]): DropdownItem[] => {
        if (dropdowns[category] && dropdowns[category].length > 0) {
            return dropdowns[category];
        }
        return defaultOptions;
    };

    return { dropdowns, loading, getOptions };
}
