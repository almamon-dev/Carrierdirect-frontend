import { useState, useMemo, useEffect, useCallback } from 'react';
import { WORLD_COUNTRIES, getCountryFlag } from '@/constants/countries';
import { getStatesForCountry, getCitiesForCountry, CityLocation } from '@/constants/countryLocations';
import { SelectOption } from '@/components/ui/select';
import { useToastStore } from '@/stores/useToastStore';
import apiClient from '@/lib/axios';
import { ServiceAreaItem, ServiceAreaTabKey, ServiceAreaCoverageType } from '../types/serviceArea.types';

const determineCoverageType = (city?: string, state?: string, zip?: string): ServiceAreaCoverageType => {
    if (zip && zip.trim()) return 'Postal Codes';
    if (city && city.trim()) return 'Selected Cities';
    if (state && state.trim()) return 'Regional Zone';
    return 'Whole Country';
};

export function useServiceAreas() {
    const [areas, setAreas] = useState<ServiceAreaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<ServiceAreaTabKey>('countries');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ServiceAreaItem | null>(null);

    const [formCountry, setFormCountry] = useState('France');
    const [formState, setFormState] = useState('');
    const [formCity, setFormCity] = useState('');
    const [formPostalCode, setFormPostalCode] = useState('');
    const [isCustomState, setIsCustomState] = useState(false);
    const [isCustomCity, setIsCustomCity] = useState(false);

    const [dbStates, setDbStates] = useState<string[]>([]);
    const [dbCities, setDbCities] = useState<CityLocation[]>([]);

    const countryOptions: SelectOption[] = useMemo(() => {
        return WORLD_COUNTRIES.map((c) => ({
            id: c.name, value: c.name, name: `${c.flag} ${c.name}`, label: `${c.flag} ${c.name}`,
        }));
    }, []);

    useEffect(() => {
        if (!formCountry) return;
        let isMounted = true;
        Promise.all([
            apiClient.get(`/locations/states?country=${encodeURIComponent(formCountry)}`),
            apiClient.get(`/locations/cities?country=${encodeURIComponent(formCountry)}`),
        ]).then(([statesRes, citiesRes]: any) => {
            if (!isMounted) return;
            const rawStates = statesRes?.data?.data || statesRes?.data || [];
            if (Array.isArray(rawStates)) setDbStates(rawStates.filter(Boolean));
            const rawCities = citiesRes?.data?.data || citiesRes?.data || [];
            if (Array.isArray(rawCities)) {
                setDbCities(rawCities.map((c: any) => ({ name: c.city || c.name, state: c.state, zip: c.postal_code || c.zip })).filter((c: any) => Boolean(c.name)));
            }
        }).catch(() => {});
        return () => { isMounted = false; };
    }, [formCountry]);

    const availableStates = useMemo(() => {
        return Array.from(new Set([...getStatesForCountry(formCountry), ...dbStates]));
    }, [formCountry, dbStates]);

    const availableCities = useMemo(() => {
        const combined = [...getCitiesForCountry(formCountry, formState)];
        dbCities.forEach((dc) => {
            if (!combined.some((c) => c.name.toLowerCase() === dc.name.toLowerCase())) combined.push(dc);
        });
        if (formState && formState.trim()) {
            const sNorm = formState.toLowerCase().trim();
            const filtered = combined.filter((c) => !c.state || c.state.toLowerCase().includes(sNorm) || sNorm.includes(c.state.toLowerCase()));
            return filtered.length > 0 ? filtered : combined;
        }
        return combined;
    }, [formCountry, formState, dbCities]);

    const stateOptions: SelectOption[] = useMemo(() => [
        { id: '', value: '', name: 'All States', label: 'All States' },
        ...availableStates.map((s) => ({ id: s, value: s, name: s, label: s })),
        { id: '__other__', value: '__other__', name: 'Other', label: 'Other' },
    ], [availableStates]);

    const cityOptions: SelectOption[] = useMemo(() => [
        { id: '', value: '', name: 'All Cities', label: 'All Cities' },
        ...availableCities.map((c) => ({ id: c.name, value: c.name, name: c.name, label: c.name })),
        { id: '__other__', value: '__other__', name: 'Other', label: 'Other' },
    ], [availableCities]);

    const loadServiceAreas = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/supplier/service-areas');
            const rawList = response?.data?.data || response?.data || [];
            if (Array.isArray(rawList)) {
                setAreas(rawList.map((item: any) => {
                    const country = item.country || 'Unknown';
                    const flag = getCountryFlag(country);
                    const state = item.state || '';
                    const city = item.city || '';
                    const postalCode = item.postal_code || '';
                    let citiesRegions = city && state ? `${city}, ${state}` : (city || state || `Whole ${country}`);
                    if (postalCode) citiesRegions += ` (${postalCode})`;
                    return {
                        id: String(item.id),
                        country,
                        countryCode: item.country_code,
                        flag,
                        state,
                        city,
                        postal_code: postalCode,
                        citiesRegions,
                        coverageType: determineCoverageType(city, state, postalCode),
                        isActive: Boolean(item.is_active ?? true),
                        routeCode: item.route_code || `SRV-${String(item.id).padStart(4, '0')}`,
                        distance: item.distance || 'Regional',
                        ratePerKm: item.rate_per_km || 'Standard',
                        assignedFleet: item.assigned_fleet || 'All Available Fleet',
                    };
                }));
            }
        } catch {
            setAreas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadServiceAreas(); }, [loadServiceAreas]);

    const handleSaveArea = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                country: formCountry,
                state: formState.trim() || null,
                city: formCity.trim() || null,
                postal_code: formPostalCode.trim() || null,
                is_active: true,
            };
            if (editingItem) {
                await apiClient.post(`/supplier/service-areas/${editingItem.id}`, payload);
                useToastStore.getState().showToast('Service area updated successfully!', 'success');
            } else {
                await apiClient.post('/supplier/service-areas', payload);
                useToastStore.getState().showToast('Service area created successfully!', 'success');
            }
            setShowAddModal(false);
            setEditingItem(null);
            loadServiceAreas();
        } catch (err: any) {
            useToastStore.getState().showToast(err?.data?.message || 'Failed to save service area', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (item: ServiceAreaItem) => {
        setEditingItem(item);
        setFormCountry(item.country);
        setFormState(item.state || '');
        setFormCity(item.city || '');
        setFormPostalCode(item.postal_code || '');
        setIsCustomState(Boolean(item.state && !getStatesForCountry(item.country).includes(item.state)));
        setIsCustomCity(Boolean(item.city && !getCitiesForCountry(item.country).some((c) => c.name.toLowerCase() === item.city?.toLowerCase())));
        setShowAddModal(true);
    };

    const handleToggleStatus = async (item: ServiceAreaItem) => {
        const nextStatus = !item.isActive;
        setAreas(prev => prev.map(a => a.id === item.id ? { ...a, isActive: nextStatus } : a));
        try {
            await apiClient.post(`/supplier/service-areas/${item.id}/toggle`);
            useToastStore.getState().showToast(`Service area ${nextStatus ? 'activated' : 'deactivated'}!`, 'success');
        } catch {
            loadServiceAreas();
        }
    };

    const handleDeleteArea = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this service area?')) return;
        setAreas(prev => prev.filter(a => a.id !== id));
        try {
            await apiClient.delete(`/supplier/service-areas/${id}`);
            useToastStore.getState().showToast('Service area deleted successfully!', 'success');
        } catch {
            loadServiceAreas();
        }
    };

    return {
        areas, loading, submitting, activeTab, setActiveTab, showAddModal, setShowAddModal,
        editingItem, setEditingItem, formCountry, setFormCountry, formState, setFormState,
        formCity, setFormCity, formPostalCode, setFormPostalCode, isCustomState, setIsCustomState,
        isCustomCity, setIsCustomCity, countryOptions, availableCities, stateOptions, cityOptions,
        loadServiceAreas, handleSaveArea, openEditModal, handleToggleStatus, handleDeleteArea,
    };
}
