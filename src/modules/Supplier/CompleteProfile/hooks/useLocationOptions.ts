import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { OptionItem } from '../types/completeProfile.types';

const extractDataArray = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
};

export function useLocationOptions(country: string, state: string) {
    const [countriesList, setCountriesList] = useState<OptionItem[]>([]);
    const [statesList, setStatesList] = useState<OptionItem[]>([]);
    const [citiesList, setCitiesList] = useState<OptionItem[]>([]);
    const [zipCodesList, setZipCodesList] = useState<OptionItem[]>([]);

    useEffect(() => {
        apiClient.get('/locations/countries')
            .then(res => {
                const list = extractDataArray(res);
                if (list.length > 0) {
                    setCountriesList(list.map((c: string) => ({ id: c, name: c })));
                } else {
                    fallbackCountries();
                }
            })
            .catch(() => fallbackCountries());
    }, []);

    const fallbackCountries = () => {
        const defaultList = [
            'Bangladesh', 'United States', 'Canada', 'United Kingdom',
            'Australia', 'Germany', 'France', 'United Arab Emirates',
            'Saudi Arabia', 'Singapore', 'India', 'Japan'
        ];
        setCountriesList(defaultList.map(c => ({ id: c, name: c })));
    };

    useEffect(() => {
        if (!country.trim()) {
            setStatesList([]);
            setCitiesList([]);
            setZipCodesList([]);
            return;
        }

        apiClient.get('/locations/states', { country })
            .then(res => {
                const states = extractDataArray(res);
                setStatesList(states.filter(Boolean).map((s: string) => ({ id: s, name: s })));
            })
            .catch(() => setStatesList([]));

        apiClient.get('/locations/cities', { country })
            .then(res => {
                const rawCities = extractDataArray(res);
                setCitiesList(rawCities.map((c: any) => ({
                    id: typeof c === 'string' ? c : c.city,
                    name: typeof c === 'string' ? c : c.city,
                    postal_code: c.postal_code
                })));
                const zips = rawCities.map((c: any) => typeof c === 'string' ? null : c.postal_code).filter(Boolean);
                const uniqueZips = Array.from(new Set(zips)).map(z => ({ id: String(z), name: String(z) }));
                setZipCodesList(uniqueZips as OptionItem[]);
            })
            .catch(() => {
                setCitiesList([]);
                setZipCodesList([]);
            });
    }, [country]);

    useEffect(() => {
        if (!country.trim() || !state.trim()) return;
        apiClient.get('/locations/cities', { country, state })
            .then(res => {
                const rawCities = extractDataArray(res);
                if (rawCities.length > 0) {
                    setCitiesList(rawCities.map((c: any) => ({
                        id: typeof c === 'string' ? c : c.city,
                        name: typeof c === 'string' ? c : c.city,
                        postal_code: c.postal_code
                    })));
                    const zips = rawCities.map((c: any) => typeof c === 'string' ? null : c.postal_code).filter(Boolean);
                    const uniqueZips = Array.from(new Set(zips)).map(z => ({ id: String(z), name: String(z) }));
                    setZipCodesList(uniqueZips as OptionItem[]);
                }
            })
            .catch(() => {});
    }, [country, state]);

    return {
        countriesList,
        statesList,
        citiesList,
        zipCodesList,
    };
}
