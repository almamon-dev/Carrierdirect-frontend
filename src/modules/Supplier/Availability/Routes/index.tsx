import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    Plus,
    MapPin,
    Trash2,
    Edit2,
    X,
    Loader2,
    RotateCcw,
    Edit3
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import Select, { SelectOption } from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { ServiceAreaRowActions } from './components/ServiceAreaRowActions';
import { WORLD_COUNTRIES, getCountryFlag } from '@/constants/countries';
import {
    getStatesForCountry,
    getCitiesForCountry,
    CityLocation
} from '@/constants/countryLocations';
import { useToastStore } from '@/stores/useToastStore';
import apiClient from '@/lib/axios';

export type ServiceAreaItem = {
    id: string;
    country: string;
    countryCode?: string;
    flag: string;
    state?: string;
    city?: string;
    postal_code?: string;
    citiesRegions: string;
    coverageType: 'Whole Country' | 'Selected Cities' | 'Regional Zone' | 'Postal Codes';
    isActive: boolean;
    routeCode?: string;
    distance?: string;
    ratePerKm?: string;
    assignedFleet?: string;
};

const determineCoverageType = (city?: string, state?: string, zip?: string): 'Whole Country' | 'Selected Cities' | 'Regional Zone' | 'Postal Codes' => {
    if (zip && zip.trim()) return 'Postal Codes';
    if (city && city.trim()) return 'Selected Cities';
    if (state && state.trim()) return 'Regional Zone';
    return 'Whole Country';
};

export default function Routes() {
    const [areas, setAreas] = useState<ServiceAreaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'countries' | 'cities' | 'regions' | 'postal_codes'>('countries');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ServiceAreaItem | null>(null);

    // Form inputs for Add/Edit using standard components
    const [formCountry, setFormCountry] = useState('France');
    const [formState, setFormState] = useState('');
    const [formCity, setFormCity] = useState('');
    const [formPostalCode, setFormPostalCode] = useState('');

    // Toggle for custom text entry when "Other" or custom is preferred
    const [isCustomState, setIsCustomState] = useState(false);
    const [isCustomCity, setIsCustomCity] = useState(false);

    // Database dynamic locations fetched from API
    const [dbStates, setDbStates] = useState<string[]>([]);
    const [dbCities, setDbCities] = useState<CityLocation[]>([]);

    // Country options for standard Select component
    const countryOptions: SelectOption[] = useMemo(() => {
        return WORLD_COUNTRIES.map((c) => ({
            id: c.name,
            value: c.name,
            name: `${c.flag} ${c.name}`,
            label: `${c.flag} ${c.name}`,
        }));
    }, []);

    // When country changes, fetch any DB locations and reset local inputs
    useEffect(() => {
        if (!formCountry) return;
        let isMounted = true;

        async function fetchLocations() {
            try {
                const [statesRes, citiesRes] = await Promise.all([
                    apiClient.get(`/locations/states?country=${encodeURIComponent(formCountry)}`),
                    apiClient.get(`/locations/cities?country=${encodeURIComponent(formCountry)}`),
                ]);
                if (isMounted) {
                    const rawStates = statesRes?.data?.data || statesRes?.data || (Array.isArray(statesRes) ? statesRes : []);
                    if (Array.isArray(rawStates)) {
                        setDbStates(rawStates.filter(Boolean));
                    }
                    const rawCities = citiesRes?.data?.data || citiesRes?.data || (Array.isArray(citiesRes) ? citiesRes : []);
                    if (Array.isArray(rawCities)) {
                        const mapped = rawCities.map((c: any) => ({
                            name: c.city || c.name,
                            state: c.state,
                            zip: c.postal_code || c.zip,
                        })).filter((c: any) => Boolean(c.name));
                        setDbCities(mapped);
                    }
                }
            } catch {
                // Fallback to static catalog
            }
        }

        fetchLocations();
        return () => { isMounted = false; };
    }, [formCountry]);

    // Available States for the current country
    const availableStates = useMemo(() => {
        const predefined = getStatesForCountry(formCountry);
        const combined = Array.from(new Set([...predefined, ...dbStates]));
        return combined;
    }, [formCountry, dbStates]);

    // Available Cities for the current country and state
    const availableCities = useMemo(() => {
        const predefined = getCitiesForCountry(formCountry, formState);
        const combined = [...predefined];
        dbCities.forEach((dc) => {
            if (!combined.some((c) => c.name.toLowerCase() === dc.name.toLowerCase())) {
                combined.push(dc);
            }
        });
        if (formState && formState.trim()) {
            const sNorm = formState.toLowerCase().trim();
            const filtered = combined.filter(
                (c) => !c.state || c.state.toLowerCase().includes(sNorm) || sNorm.includes(c.state.toLowerCase())
            );
            return filtered.length > 0 ? filtered : combined;
        }
        return combined;
    }, [formCountry, formState, dbCities]);

    // State Select Options
    const stateOptions: SelectOption[] = useMemo(() => {
        return [
            { id: '', value: '', name: 'All States', label: 'All States' },
            ...availableStates.map((s) => ({
                id: s,
                value: s,
                name: s,
                label: s,
            })),
            { id: '__other__', value: '__other__', name: 'Other', label: 'Other' },
        ];
    }, [availableStates]);

    // City Select Options
    const cityOptions: SelectOption[] = useMemo(() => {
        return [
            { id: '', value: '', name: 'All Cities', label: 'All Cities' },
            ...availableCities.map((c) => ({
                id: c.name,
                value: c.name,
                name: c.name,
                label: c.name,
            })),
            { id: '__other__', value: '__other__', name: 'Other', label: 'Other' },
        ];
    }, [availableCities]);

    // Handle country change
    const handleCountryChange = (newCountry: string) => {
        setFormCountry(newCountry);
        setFormState('');
        setFormCity('');
        setFormPostalCode('');
        setIsCustomState(false);
        setIsCustomCity(false);
    };

    // Quick select city & auto-populate state and zip
    const handleSelectCity = (cityItem: CityLocation) => {
        setFormCity(cityItem.name);
        if (cityItem.state) {
            setFormState(cityItem.state);
        }
        if (cityItem.zip) {
            setFormPostalCode(cityItem.zip);
        }
    };

    // Quick select state & auto filter
    const handleSelectState = (stateName: string) => {
        setFormState(stateName);
        // If current city is not in this state, clear city
        if (formCity) {
            const match = availableCities.find(
                (c) => c.name.toLowerCase() === formCity.toLowerCase()
            );
            if (match && match.state && !match.state.toLowerCase().includes(stateName.toLowerCase())) {
                setFormCity('');
                setFormPostalCode('');
            }
        }
    };

    // Fetch service areas from backend API
    const loadServiceAreas = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/supplier/service-areas');
            const rawList = response?.data?.data || response?.data || (Array.isArray(response) ? response : []);

            if (Array.isArray(rawList)) {
                const formatted: ServiceAreaItem[] = rawList.map((item: any) => {
                    const country = item.country || 'Unknown';
                    const flag = getCountryFlag(country);
                    const state = item.state || '';
                    const city = item.city || '';
                    const postalCode = item.postal_code || '';

                    let citiesRegions = '';
                    if (city && state) {
                        citiesRegions = `${city}, ${state}`;
                    } else if (city) {
                        citiesRegions = city;
                    } else if (state) {
                        citiesRegions = state;
                    } else {
                        citiesRegions = `Whole ${country}`;
                    }

                    if (postalCode) {
                        citiesRegions += ` (${postalCode})`;
                    }

                    const covType = determineCoverageType(city, state, postalCode);

                    return {
                        id: String(item.id),
                        country,
                        countryCode: item.country_code,
                        flag,
                        state: item.state,
                        city: item.city,
                        postal_code: item.postal_code,
                        citiesRegions,
                        coverageType: covType,
                        isActive: Boolean(item.is_active ?? true),
                        routeCode: item.route_code || `SRV-${String(item.id).padStart(4, '0')}`,
                        distance: item.distance || 'Regional',
                        ratePerKm: item.rate_per_km || 'Standard',
                        assignedFleet: item.assigned_fleet || 'All Available Fleet',
                    };
                });
                setAreas(formatted);
            } else {
                setAreas([]);
            }
        } catch (err) {
            console.error('Failed to load service areas from API:', err);
            setAreas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadServiceAreas();
    }, [loadServiceAreas]);

    // Handle Add or Edit Area
    const handleSaveArea = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formCountry) {
            useToastStore.getState().showToast('Please select a country.', 'error');
            return;
        }

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
            setFormState('');
            setFormCity('');
            setFormPostalCode('');
            setIsCustomState(false);
            setIsCustomCity(false);
            setActiveTab('countries');
            await loadServiceAreas();
        } catch (err: any) {
            console.error('Error saving service area:', err);
            const msg = err?.data?.message || err?.message || 'Failed to save service area';
            useToastStore.getState().showToast(msg, 'error');
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

    // Filter by Active Tab
    const filteredAreas = useMemo(() => {
        return areas.filter((item) => {
            if (activeTab === 'countries') return true;
            if (activeTab === 'cities') return item.coverageType === 'Selected Cities';
            if (activeTab === 'regions') return item.coverageType === 'Regional Zone' || item.coverageType === 'Whole Country';
            if (activeTab === 'postal_codes') return item.coverageType === 'Postal Codes';
            return true;
        });
    }, [areas, activeTab]);

    // Tab options with counts
    const areaTabs: { id: 'countries' | 'cities' | 'regions' | 'postal_codes'; label: string; count: number }[] = useMemo(() => [
        { id: 'countries', label: 'All Areas', count: areas.length },
        { id: 'cities', label: 'Selected Cities', count: areas.filter(a => a.coverageType === 'Selected Cities').length },
        { id: 'regions', label: 'Regional Zones', count: areas.filter(a => a.coverageType === 'Regional Zone' || a.coverageType === 'Whole Country').length },
        { id: 'postal_codes', label: 'Postal Codes', count: areas.filter(a => a.coverageType === 'Postal Codes').length },
    ], [areas]);

    // Toggle Active Status
    const handleToggleStatus = async (item: ServiceAreaItem) => {
        try {
            const nextStatus = !item.isActive;
            setAreas((prev) =>
                prev.map((a) => (a.id === item.id ? { ...a, isActive: nextStatus } : a))
            );
            await apiClient.post(`/supplier/service-areas/${item.id}/toggle`);
            useToastStore.getState().showToast(
                `Service area ${nextStatus ? 'activated' : 'deactivated'} successfully!`,
                'success'
            );
        } catch (err) {
            console.error('Failed to update area status:', err);
            useToastStore.getState().showToast('Failed to update area status', 'error');
            loadServiceAreas();
        }
    };

    // Delete Area
    const handleDeleteArea = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this service area?')) return;
        try {
            setAreas((prev) => prev.filter((a) => a.id !== id));
            await apiClient.delete(`/supplier/service-areas/${id}`);
            useToastStore.getState().showToast('Service area deleted successfully!', 'success');
        } catch (err) {
            console.error('Failed to delete service area:', err);
            useToastStore.getState().showToast('Failed to delete service area', 'error');
            loadServiceAreas();
        }
    };

    // Columns config for standard DataTable component
    const columns: Column<ServiceAreaItem>[] = [
        {
            id: 'country',
            label: 'Country',
            className: 'w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="text-base select-none">{row.flag}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {row.country}
                    </span>
                </div>
            ),
        },
        {
            id: 'citiesRegions',
            label: 'Cities / Regions',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <MapPin size={13} className="text-[#FF4A1F] shrink-0" />
                    <span>{row.citiesRegions}</span>
                </div>
            ),
        },
        {
            id: 'coverageType',
            label: 'Coverage Type',
            className: 'w-[150px]',
            render: (row) => {
                const type = row.coverageType;
                let badgeClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                if (type === 'Whole Country') badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
                if (type === 'Selected Cities') badgeClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
                if (type === 'Regional Zone') badgeClass = 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
                if (type === 'Postal Codes') badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800';

                return (
                    <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-semibold tracking-wide ${badgeClass}`}>
                        {type}
                    </span>
                );
            },
        },
        {
            id: 'status',
            label: 'Status',
            className: 'w-[120px] text-center',
            render: (row) => (
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => handleToggleStatus(row)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            row.isActive
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${row.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{row.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                        <span>Operational Service Areas</span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200 dark:border-orange-800 rounded-full">
                            {areas.length} {areas.length === 1 ? 'Area' : 'Areas'}
                        </span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Add the countries, cities or regions where you provide transport services.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => {
                            setEditingItem(null);
                            setFormCountry('France');
                            setFormState('');
                            setFormCity('');
                            setFormPostalCode('');
                            setIsCustomState(false);
                            setIsCustomCity(false);
                            setShowAddModal(true);
                        }}
                        className="h-8 px-3.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px] self-start sm:self-auto transition-colors"
                    >
                        <Plus size={15} strokeWidth={2.5} />
                        <span>Add Service Area</span>
                    </Button>
                </div>
            </div>

            {/* Standard Project DataTable Component */}
            {loading ? (
                <div className="bg-white dark:bg-[#18202a] border border-slate-200 dark:border-slate-800 rounded-[4px] p-12 text-center flex flex-col items-center justify-center gap-3">
                    <Loader2 size={24} className="animate-spin text-[#ff4a1f]" />
                    <p className="text-xs font-medium text-slate-500">Loading service areas...</p>
                </div>
            ) : (
                <DataTable
                    data={filteredAreas}
                    columns={columns}
                    keyExtractor={(item: ServiceAreaItem) => item.id}
                    actions={(item: ServiceAreaItem) => (
                        <ServiceAreaRowActions
                            row={item}
                            onEdit={(row) => openEditModal(row)}
                            onToggleStatus={(id) => {
                                const found = areas.find((a) => a.id === id);
                                if (found) handleToggleStatus(found);
                            }}
                            onDelete={(id) => handleDeleteArea(id)}
                        />
                    )}
                    actionsColumnClassName="w-[80px] min-w-[80px] text-right pr-3.5"
                    headerTabs={
                        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto hide-scrollbar mb-[-1px]">
                            {areaTabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-1.5 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 text-xs ${
                                            isActive
                                                ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`text-[11px] font-medium px-1.5 py-0.2 rounded-full transition-colors ${
                                                isActive
                                                    ? 'bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f]'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    }
                    searchPlaceholder="Search country, state or city..."
                    emptyState={
                        <EmptyState
                            icon={MapPin}
                            title="No Service Areas Defined"
                            description="You have not configured any operational coverage zones yet. Click 'Add Service Area' to define where your fleet operates."
                            actionLabel="Add Service Area"
                            onAction={() => {
                                setEditingItem(null);
                                setFormCountry('France');
                                setFormState('');
                                setFormCity('');
                                setFormPostalCode('');
                                setIsCustomState(false);
                                setIsCustomCity(false);
                                setShowAddModal(true);
                            }}
                        />
                    }
                />
            )}

            {/* Add / Edit Service Area Modal */}
            {showAddModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-[#18202a] w-full max-w-lg rounded-[6px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-visible font-sans relative">
                        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                                    <MapPin size={15} />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {editingItem ? 'Edit Service Area' : 'Add New Service Area'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[3px] cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveArea} className="p-4 sm:p-5 space-y-4">
                            {/* Country Dropdown Component */}
                            <div>
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Country <span className="text-red-500">*</span>
                                </FormLabel>
                                <div className="mt-1">
                                    <Select
                                        value={formCountry}
                                        onChange={(e: any) => {
                                            const val = typeof e === 'object' && e?.target ? e.target.value : e;
                                            handleCountryChange(String(val || ''));
                                        }}
                                        options={countryOptions}
                                        placeholder="Select country..."
                                        showSearch={true}
                                        size="sm"
                                        triggerClassName="text-xs h-9 rounded-[4px]"
                                    />
                                </div>
                            </div>

                            {/* 2x2 Grid for State / Division and City Dropdowns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* State / Division Dropdown Component */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            State / Division
                                        </FormLabel>
                                        {isCustomState ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomState(false);
                                                    setFormState('');
                                                }}
                                                className="text-[10.5px] text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                                            >
                                                <RotateCcw size={11} />
                                                <span>List</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomState(true);
                                                    setFormState('');
                                                }}
                                                className="text-[10.5px] text-slate-500 hover:text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                                            >
                                                <Edit3 size={11} />
                                                <span>Custom</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-1">
                                        {isCustomState ? (
                                            <Input
                                                placeholder="e.g. Île-de-France, Bavaria"
                                                value={formState}
                                                onChange={(e) => setFormState(e.target.value)}
                                                className="text-xs h-9 rounded-[4px]"
                                                autoFocus
                                            />
                                        ) : (
                                            <Select
                                                value={formState}
                                                onChange={(e: any) => {
                                                    const val = typeof e === 'object' && e?.target ? e.target.value : e;
                                                    const valStr = String(val ?? '');
                                                    if (valStr === '__other__') {
                                                        setIsCustomState(true);
                                                        setFormState('');
                                                    } else {
                                                        handleSelectState(valStr);
                                                    }
                                                }}
                                                onCreate={(customName) => {
                                                    setIsCustomState(true);
                                                    setFormState(customName);
                                                }}
                                                options={stateOptions}
                                                placeholder="Select state..."
                                                showSearch={true}
                                                size="sm"
                                                triggerClassName="text-xs h-9 rounded-[4px]"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* City Dropdown Component */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            City
                                        </FormLabel>
                                        {isCustomCity ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomCity(false);
                                                    setFormCity('');
                                                }}
                                                className="text-[10.5px] text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                                            >
                                                <RotateCcw size={11} />
                                                <span>List</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomCity(true);
                                                    setFormCity('');
                                                }}
                                                className="text-[10.5px] text-slate-500 hover:text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                                            >
                                                <Edit3 size={11} />
                                                <span>Custom</span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-1">
                                        {isCustomCity ? (
                                            <Input
                                                placeholder="e.g. Paris, Lyon, Berlin"
                                                value={formCity}
                                                onChange={(e) => setFormCity(e.target.value)}
                                                className="text-xs h-9 rounded-[4px]"
                                                autoFocus
                                            />
                                        ) : (
                                            <Select
                                                value={formCity}
                                                onChange={(e: any) => {
                                                    const val = typeof e === 'object' && e?.target ? e.target.value : e;
                                                    const valStr = String(val ?? '');
                                                    if (valStr === '__other__') {
                                                        setIsCustomCity(true);
                                                        setFormCity('');
                                                    } else {
                                                        const found = availableCities.find(
                                                            (c) => c.name.toLowerCase() === valStr.toLowerCase()
                                                        );
                                                        if (found) {
                                                            handleSelectCity(found);
                                                        } else {
                                                            setFormCity(valStr);
                                                        }
                                                    }
                                                }}
                                                onCreate={(customName) => {
                                                    setIsCustomCity(true);
                                                    setFormCity(customName);
                                                }}
                                                options={cityOptions}
                                                placeholder="Select city..."
                                                showSearch={true}
                                                size="sm"
                                                triggerClassName="text-xs h-9 rounded-[4px]"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ZIP Code Input Component */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        ZIP / Postal Code
                                    </FormLabel>
                                    {formPostalCode && (
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                            ✓ Auto-suggested for {formCity || formCountry}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    placeholder="e.g. 75001, EC1A 1BB, 10115"
                                    value={formPostalCode}
                                    onChange={(e) => setFormPostalCode(e.target.value)}
                                    className="text-xs h-9 mt-1 rounded-[4px] font-mono"
                                />
                                <p className="text-[10.5px] text-slate-400 mt-1">
                                    Optional: Leave blank to cover all postal codes in the selected city or country.
                                </p>
                            </div>

                            <div className="pt-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[11px] text-slate-500">
                                    Coverage: <strong>{determineCoverageType(formCity, formState, formPostalCode)}</strong>
                                </span>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowAddModal(false)}
                                        className="text-xs rounded-[4px] cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={submitting}
                                        className="text-xs bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold rounded-[4px] flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                        {submitting && <Loader2 size={12} className="animate-spin" />}
                                        <span>{editingItem ? 'Save Changes' : 'Add Service Area'}</span>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
