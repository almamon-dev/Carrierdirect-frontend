import React, { useMemo } from 'react';
import { Loader2, Globe2, ExternalLink, MapPin, X } from 'lucide-react';
import FormLabel from '@/components/ui/label';
import Select, { SelectOption } from '@/components/ui/select';

export type ServiceAreaOption = {
    id: number;
    country: string;
    state?: string;
    city?: string;
    postal_code?: string;
    radius_km?: number;
    formatted: string;
    is_active: boolean;
};

interface AssignServiceAreaFormFieldsProps {
    isLoadingAreas: boolean;
    serviceAreas: ServiceAreaOption[];
    selectedAreaIds: string[];
    setSelectedAreaIds: (ids: string[]) => void;
    disabled: boolean;
    onNavigateToRoutes: () => void;
}

export const AssignServiceAreaFormFields: React.FC<AssignServiceAreaFormFieldsProps> = ({
    isLoadingAreas,
    serviceAreas,
    selectedAreaIds,
    setSelectedAreaIds,
    disabled,
    onNavigateToRoutes,
}) => {
    const selectOptions: SelectOption[] = useMemo(() => {
        return serviceAreas.map((area) => ({
            id: String(area.id),
            value: String(area.id),
            name: `${area.formatted}${area.radius_km ? ` (${area.radius_km} km radius)` : ''}`,
            label: `${area.formatted}${area.radius_km ? ` (${area.radius_km} km radius)` : ''}`,
        }));
    }, [serviceAreas]);

    const selectedAreas = useMemo(() => {
        return serviceAreas.filter((a) => selectedAreaIds.includes(String(a.id)));
    }, [serviceAreas, selectedAreaIds]);

    if (isLoadingAreas) {
        return (
            <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                <Loader2 size={18} className="animate-spin text-[#ff4a1f]" />
                <span>Loading company service areas...</span>
            </div>
        );
    }

    if (serviceAreas.length === 0) {
        return (
            <div className="p-4 rounded-[4px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-2">
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                    No Service Areas Configured Yet
                </p>
                <p className="text-amber-700 dark:text-amber-400 text-[11px]">
                    You need to define coverage regions or routes first before assigning them to your drivers.
                </p>
                <button
                    type="button"
                    onClick={onNavigateToRoutes}
                    className="mt-1 text-xs font-bold text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                    <span>Manage Service Areas / Routes</span>
                    <ExternalLink size={12} />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div>
                <div className="flex items-center justify-between mb-1">
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Select Operating Service Areas <span className="text-rose-500">*</span>
                    </FormLabel>
                    <span className="text-[11px] text-slate-400 font-medium">
                        Select multiple areas
                    </span>
                </div>

                <Select
                    multiple={true}
                    showSearch={true}
                    value={selectedAreaIds}
                    onChange={(e: any) => {
                        const val = e?.target?.value ?? e?.value ?? e;
                        const arr = Array.isArray(val) ? val.map(String) : (val ? [String(val)] : []);
                        setSelectedAreaIds(arr);
                    }}
                    options={selectOptions}
                    placeholder="Choose one or multiple service areas..."
                    disabled={disabled}
                    className="w-full"
                    triggerClassName="h-9 text-xs rounded-[4px] bg-slate-50 dark:bg-[#12161c] border-slate-200 dark:border-slate-700 focus:border-[#ff4a1f]"
                />
            </div>

            {/* Selected Areas Badges / Tags */}
            {selectedAreas.length > 0 && (
                <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            Assigned Areas ({selectedAreas.length}):
                        </span>
                        <button
                            type="button"
                            onClick={() => setSelectedAreaIds([])}
                            disabled={disabled}
                            className="text-[11px] font-semibold text-rose-500 hover:underline cursor-pointer"
                        >
                            Clear all
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-[130px] overflow-y-auto pr-1">
                        {selectedAreas.map((area) => (
                            <span
                                key={area.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-900/50 text-[11px] font-semibold"
                            >
                                <MapPin size={10} className="shrink-0" />
                                <span className="truncate max-w-[200px]">{area.formatted}</span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedAreaIds(selectedAreaIds.filter((id) => id !== String(area.id)));
                                        }}
                                        className="hover:bg-orange-200/60 dark:hover:bg-orange-900/60 rounded p-0.5 cursor-pointer ml-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                        title="Remove"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Details Card */}
            {selectedAreas.length === 1 && (
                <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                        <Globe2 size={13} className="text-[#ff4a1f]" />
                        <span>{selectedAreas[0].formatted}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-1">
                        <span>Country: <strong>{selectedAreas[0].country}</strong></span>
                        {selectedAreas[0].city && <span>City: <strong>{selectedAreas[0].city}</strong></span>}
                        {selectedAreas[0].postal_code && <span>Postal Code: <strong>{selectedAreas[0].postal_code}</strong></span>}
                        {selectedAreas[0].radius_km && <span>Coverage Radius: <strong>{selectedAreas[0].radius_km} km</strong></span>}
                    </div>
                </div>
            )}

            {selectedAreas.length > 1 && (
                <div className="p-2.5 rounded-[4px] bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>Driver will be active across <strong>{selectedAreas.length}</strong> service operational regions.</span>
                </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Need to add another area?</span>
                <button
                    type="button"
                    onClick={onNavigateToRoutes}
                    className="text-[#ff4a1f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                    <span>Routes Settings</span>
                    <ExternalLink size={11} />
                </button>
            </div>
        </div>
    );
};

export default AssignServiceAreaFormFields;
