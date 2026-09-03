import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';

export interface CargoServiceItem {
    id: number | string;
    category: 'care_requirement' | 'logistic_service' | string;
    key: string;
    label: string;
    description?: string | null;
    icon?: string | null;
    sort_order?: number;
    is_default?: boolean;
    is_active?: boolean;
}

export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Checks if a specific cargo service key is active in formData.
 * Checks original key, camelCase, and snake_case variants.
 */
export function isServiceChecked(formData: any, key: string): boolean {
    if (!formData || !key) return false;
    const camel = toCamelCase(key);
    const snake = toSnakeCase(key);
    return Boolean(
        formData[key] ??
        formData[camel] ??
        formData[snake] ??
        false
    );
}

export function useCargoServices() {
    const [careRequirements, setCareRequirements] = useState<CargoServiceItem[]>([]);
    const [logisticServices, setLogisticServices] = useState<CargoServiceItem[]>([]);
    const [allServices, setAllServices] = useState<CargoServiceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchCargoServices() {
            setLoading(true);
            try {
                const endpoint = ENDPOINTS?.MASTER_DATA?.CARGO_SERVICES || '/cargo-services';
                const res = await apiClient.get(endpoint);
                const rawData = res.data?.data || res.data;

                if (isMounted && rawData) {
                    let care: CargoServiceItem[] = [];
                    let logistic: CargoServiceItem[] = [];
                    let all: CargoServiceItem[] = [];

                    if (Array.isArray(rawData)) {
                        all = rawData;
                        care = rawData.filter((i: any) => i.category === 'care_requirement');
                        logistic = rawData.filter((i: any) => i.category === 'logistic_service' || i.category !== 'care_requirement');
                    } else if (typeof rawData === 'object') {
                        if (Array.isArray(rawData.care_requirements)) care = rawData.care_requirements;
                        if (Array.isArray(rawData.logistic_services)) logistic = rawData.logistic_services;
                        if (Array.isArray(rawData.all)) {
                            all = rawData.all;
                        } else {
                            all = [...care, ...logistic];
                        }
                    }

                    const activeAll = all.filter(s => s.is_active !== false);
                    setAllServices(activeAll);
                    setCareRequirements(care.filter(s => s.is_active !== false));
                    setLogisticServices(logistic.filter(s => s.is_active !== false));
                }
            } catch (err) {
                console.error('Failed to load cargo services from database:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchCargoServices();

        return () => {
            isMounted = false;
        };
    }, []);

    const countSelected = (formData: any): number => {
        if (!formData) return 0;
        return allServices.filter(s => isServiceChecked(formData, s.key)).length;
    };

    return {
        careRequirements,
        logisticServices,
        allServices,
        loading,
        isServiceChecked,
        countSelected,
    };
}
