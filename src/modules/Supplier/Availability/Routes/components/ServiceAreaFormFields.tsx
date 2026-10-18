import React from 'react';
import { RotateCcw, Edit3 } from 'lucide-react';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import Select, { SelectOption } from '@/components/ui/select';
import { CityLocation } from '@/constants/countryLocations';

interface ServiceAreaFormFieldsProps {
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

export function ServiceAreaFormFields({
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
}: ServiceAreaFormFieldsProps) {
    return (
        <div className="space-y-4">
            <div>
                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Country <span className="text-red-500">*</span>
                </FormLabel>
                <div className="mt-1">
                    <Select
                        value={formCountry}
                        onChange={(e: any) => {
                            const val = typeof e === 'object' && e?.target ? e.target.value : e;
                            onCountryChange(String(val || ''));
                        }}
                        options={countryOptions}
                        placeholder="Select country..."
                        showSearch={true}
                        size="sm"
                        triggerClassName="text-xs h-9 rounded-[4px]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            State / Division
                        </FormLabel>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustomState(!isCustomState);
                                setFormState('');
                            }}
                            className="text-[10.5px] text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                        >
                            {isCustomState ? <RotateCcw size={11} /> : <Edit3 size={11} />}
                            <span>{isCustomState ? 'List' : 'Custom'}</span>
                        </button>
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
                                        onSelectState(valStr);
                                    }
                                }}
                                onCreate={(name) => {
                                    setIsCustomState(true);
                                    setFormState(name);
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

                <div>
                    <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            City
                        </FormLabel>
                        <button
                            type="button"
                            onClick={() => {
                                setIsCustomCity(!isCustomCity);
                                setFormCity('');
                            }}
                            className="text-[10.5px] text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-1 font-medium"
                        >
                            {isCustomCity ? <RotateCcw size={11} /> : <Edit3 size={11} />}
                            <span>{isCustomCity ? 'List' : 'Custom'}</span>
                        </button>
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
                                        const found = availableCities.find((c) => c.name.toLowerCase() === valStr.toLowerCase());
                                        if (found) onSelectCity(found);
                                        else setFormCity(valStr);
                                    }
                                }}
                                onCreate={(name) => {
                                    setIsCustomCity(true);
                                    setFormCity(name);
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

            <div>
                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Postal Code (Optional)
                </FormLabel>
                <div className="mt-1">
                    <Input
                        placeholder="e.g. 75001, SW1A 1AA"
                        value={formPostalCode}
                        onChange={(e) => setFormPostalCode(e.target.value)}
                        className="text-xs h-9 rounded-[4px]"
                    />
                </div>
            </div>
        </div>
    );
}
