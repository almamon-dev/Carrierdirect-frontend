import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

export interface CountrySelectOption {
    id: string;
    name: string;
    value: string;
    label: string;
}

let cachedOptions: CountrySelectOption[] | null = null;
let fetchPromise: Promise<CountrySelectOption[]> | null = null;

const extractDataArray = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.data && Array.isArray(res.data.countries)) return res.data.countries;
    return [];
};

export function useCountryOptions() {
    const [countryOptions, setCountryOptions] = useState<CountrySelectOption[]>(
        () => cachedOptions || []
    );
    const [isLoading, setIsLoading] = useState<boolean>(!cachedOptions || cachedOptions.length === 0);

    useEffect(() => {
        if (cachedOptions && cachedOptions.length > 0) {
            setCountryOptions(cachedOptions);
            setIsLoading(false);
            return;
        }

        if (!fetchPromise) {
            fetchPromise = apiClient.get('/locations/countries')
                .then((res: any) => {
                    const list = extractDataArray(res);
                    const options: CountrySelectOption[] = list.map((c: any) => {
                        const name = typeof c === 'string' ? c : (c.name || c.country || String(c));
                        return { id: name, name, value: name, label: name };
                    });

                    cachedOptions = options;
                    return options;
                })
                .catch((err) => {
                    console.error('Failed to load countries from /locations/countries API:', err);
                    return [];
                });
        }

        fetchPromise.then(options => {
            setCountryOptions(options);
            setIsLoading(false);
        });
    }, []);

    return { countryOptions, isLoading };
}

