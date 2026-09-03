import React from 'react';
import { 
    Truck, Box, Plus, Trash2, Layers, Wine, AlertTriangle, 
    Thermometer, Maximize2, Clock, ArrowUpCircle, ArrowDownCircle, 
    Package, ShieldCheck, Sparkles, Wrench, DoorOpen, Warehouse, Settings 
} from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Checkbox from '@/components/ui/checkbox';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow, SectionHeader } from '../FormHelpers';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { useCargoServices, isServiceChecked, toCamelCase, CargoServiceItem } from '@/hooks/useCargoServices';

const ICON_MAP: Record<string, any> = {
    Layers, Wine, AlertTriangle, Thermometer, Maximize2, Clock,
    ArrowUpCircle, ArrowDownCircle, Package, ShieldCheck, Truck,
    Sparkles, Wrench, DoorOpen, Warehouse, Settings
};

interface SectionProps {
    formData: QuoteFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: keyof QuoteFormData, value: string) => void;
    handleCheckboxChange: (name: keyof QuoteFormData, checked: boolean) => void;
    addDimensionRow: () => void;
    updateDimension: (id: number, field: string, value: string) => void;
    removeDimension: (id: number) => void;
}

export const LoadServicesSection: React.FC<SectionProps> = ({
    formData,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    addDimensionRow,
    updateDimension,
    removeDimension,
}) => {
    const { getOptions } = useDropdownOptions();
    const { careRequirements, logisticServices, loading: servicesLoading } = useCargoServices();

    const UNIT_OPTIONS = getOptions('dimension_unit');
    const VEHICLE_OPTIONS = getOptions('vehicle_type');
    const LOAD_OPTIONS = getOptions('load_type');

    const onServiceToggle = (srv: CargoServiceItem, checked: boolean) => {
        handleCheckboxChange(srv.key as any, checked);
        const camel = toCamelCase(srv.key);
        if (camel !== srv.key) {
            handleCheckboxChange(camel as any, checked);
        }
    };

    const renderServiceCheckbox = (srv: CargoServiceItem) => {
        const isChecked = isServiceChecked(formData, srv.key);
        const Icon = (srv.icon && ICON_MAP[srv.icon]) ? ICON_MAP[srv.icon] : (srv.category === 'care_requirement' ? Box : Truck);

        return (
            <label 
                key={srv.key || srv.id} 
                title={srv.description || srv.label}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-all cursor-pointer select-none ${
                    isChecked
                        ? 'bg-orange-50/70 dark:bg-orange-950/25 border-orange-300 dark:border-orange-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-[#181d24] border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
            >
                <div className="shrink-0 flex items-center">
                    <Checkbox 
                        checked={isChecked} 
                        onChange={(e) => onServiceToggle(srv, e.target.checked)} 
                    />
                </div>
                <Icon size={13} className={isChecked ? 'text-[#ff4a1f] shrink-0' : 'text-slate-400 dark:text-slate-500 shrink-0'} />
                <span className="truncate text-[11.5px] leading-tight" title={srv.label}>
                    {srv.label}
                </span>
            </label>
        );
    };

    return (
        <div className="space-y-2.5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                <TabHeader title="Load & Vehicle Information" icon={Truck} />
                
                <FormRow label="Vehicle Type" required>
                    <Select 
                        name="vehicleType" 
                        value={formData.vehicleType} 
                        onChange={(e) => handleSelectChange('vehicleType', e.target.value)} 
                        options={VEHICLE_OPTIONS}
                        placeholder="Select vehicle..."
                        showSearch={true} 
                    />
                </FormRow>
                
                <FormRow label="Load Type" required>
                    <Select 
                        name="loadType" 
                        value={formData.loadType} 
                        onChange={(e) => handleSelectChange('loadType', e.target.value)} 
                        options={LOAD_OPTIONS}
                        placeholder="Select load type..."
                        showSearch={true} 
                    />
                </FormRow>
                
                <FormRow label="Items Count">
                    <Input type="text" inputMode="numeric" name="itemsCount" value={formData.itemsCount} onChange={handleChange} placeholder="e.g. 25" />
                </FormRow>
                
                <FormRow label="Pallets Count">
                    <Input type="text" inputMode="numeric" name="palletsCount" value={formData.palletsCount} onChange={handleChange} placeholder="e.g. 5" />
                </FormRow>
                
                <FormRow label="Total Weight (kg)" required>
                    <Input type="text" inputMode="numeric" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 4500" />
                </FormRow>
                
                <FormRow label="Total Volume (m³)">
                    <Input type="text" inputMode="numeric" name="volume" value={formData.volume} onChange={handleChange} placeholder="e.g. 18" />
                </FormRow>

                {/* Minimal Cargo Dimensions */}
                <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <SectionHeader title="Cargo Dimensions (L × W × H)" icon={Box} />
                    
                    <div className="space-y-1.5 mt-1.5">
                        {formData.dimensions.map((dim) => (
                            <div key={dim.id} className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
                                <div className="flex-1 min-w-[75px]">
                                    <Input placeholder="Length" value={dim.length} onChange={(e) => updateDimension(dim.id, 'length', e.target.value)} className="h-7.5 text-xs" />
                                </div>
                                <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold select-none">×</span>
                                <div className="flex-1 min-w-[75px]">
                                    <Input placeholder="Width" value={dim.width} onChange={(e) => updateDimension(dim.id, 'width', e.target.value)} className="h-7.5 text-xs" />
                                </div>
                                <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold select-none">×</span>
                                <div className="flex-1 min-w-[75px]">
                                    <Input placeholder="Height" value={dim.height} onChange={(e) => updateDimension(dim.id, 'height', e.target.value)} className="h-7.5 text-xs" />
                                </div>
                                <div className="w-18 shrink-0">
                                    <Input placeholder="Qty" value={dim.qty} onChange={(e) => updateDimension(dim.id, 'qty', e.target.value)} className="h-7.5 text-xs text-center" />
                                </div>
                                <div className="w-22 shrink-0">
                                    <Select 
                                        value={dim.unit} 
                                        onChange={(e) => updateDimension(dim.id, 'unit', e.target.value)} 
                                        options={UNIT_OPTIONS}
                                        className="h-7.5 text-xs" 
                                        showSearch={false} 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeDimension(dim.id)}
                                    disabled={formData.dimensions.length === 1}
                                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors disabled:opacity-20 cursor-pointer shrink-0"
                                    title="Remove"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                        
                        <button 
                            type="button" 
                            onClick={addDimensionRow} 
                            className="text-[11.5px] font-bold text-[#ff4a1f] hover:underline inline-flex items-center gap-1 mt-0.5 cursor-pointer"
                        >
                            <Plus size={12} />
                            <span>Add Dimension Row</span>
                        </button>
                    </div>
                </div>

                {/* Special Care Requirements from Database */}
                <div className="col-span-1 md:col-span-2 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                    <SectionHeader title="Special Care Requirements" icon={Box} />
                    {servicesLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                            {careRequirements.map(renderServiceCheckbox)}
                        </div>
                    )}
                </div>

                {/* Additional Logistic Services from Database */}
                <div className="col-span-1 md:col-span-2 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                    <SectionHeader title="Additional Logistic Services" icon={Truck} />
                    {servicesLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                            {logisticServices.map(renderServiceCheckbox)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
