import React from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { ServiceAreaFormFields } from './ServiceAreaFormFields';
import { ServiceAreaItem } from '../types/serviceArea.types';
import { CityLocation } from '@/constants/countryLocations';
import { SelectOption } from '@/components/ui/select';

interface ServiceAreaModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingItem: ServiceAreaItem | null;
    submitting: boolean;
    onSave: (e: React.FormEvent) => void;
    formCountry: string;
    formState: string;
    formCity: string;
    formPostalCode: string;
    isCustomState: boolean;
    isCustomCity: boolean;
    countryOptions: SelectOption[];
    stateOptions: SelectOption[];
    cityOptions: SelectOption[];
    availableCities: CityLocation[];
    onCountryChange: (c: string) => void;
    setFormState: (s: string) => void;
    setFormCity: (c: string) => void;
    setFormPostalCode: (p: string) => void;
    setIsCustomState: (b: boolean) => void;
    setIsCustomCity: (b: boolean) => void;
    onSelectState: (s: string) => void;
    onSelectCity: (c: CityLocation) => void;
}

export function ServiceAreaModal({
    isOpen,
    onClose,
    editingItem,
    submitting,
    onSave,
    formCountry,
    formState,
    formCity,
    formPostalCode,
    isCustomState,
    isCustomCity,
    countryOptions,
    stateOptions,
    cityOptions,
    availableCities,
    onCountryChange,
    setFormState,
    setFormCity,
    setFormPostalCode,
    setIsCustomState,
    setIsCustomCity,
    onSelectState,
    onSelectCity,
}: ServiceAreaModalProps) {
    if (!isOpen || typeof document === 'undefined') return null;

    return createPortal(
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
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[3px] cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={onSave} className="p-4 sm:p-5 space-y-4">
                    <ServiceAreaFormFields
                        formCountry={formCountry}
                        formState={formState}
                        formCity={formCity}
                        formPostalCode={formPostalCode}
                        isCustomState={isCustomState}
                        isCustomCity={isCustomCity}
                        countryOptions={countryOptions}
                        stateOptions={stateOptions}
                        cityOptions={cityOptions}
                        availableCities={availableCities}
                        onCountryChange={onCountryChange}
                        setFormState={setFormState}
                        setFormCity={setFormCity}
                        setFormPostalCode={setFormPostalCode}
                        setIsCustomState={setIsCustomState}
                        setIsCustomCity={setIsCustomCity}
                        onSelectState={onSelectState}
                        onSelectCity={onSelectCity}
                    />

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="h-8 px-3.5 text-xs font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={submitting}
                            className="h-8 px-4 bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                        >
                            {submitting && <Loader2 size={13} className="animate-spin" />}
                            <span>{editingItem ? 'Update Area' : 'Save Service Area'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
export default ServiceAreaModal;
