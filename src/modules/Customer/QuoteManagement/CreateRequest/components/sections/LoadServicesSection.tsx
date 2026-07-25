import React from 'react';
import { Truck, Box, Plus, Trash2 } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Checkbox from '@/components/ui/checkbox';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow, SectionHeader } from '../FormHelpers';

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
    const UNIT_OPTIONS = [
        { id: 'CM', name: 'CM' },
        { id: 'INCH', name: 'INCH' },
        { id: 'M', name: 'M' },
    ];

    const VEHICLE_OPTIONS = [
        { id: 'Small Van', name: 'Small Van' },
        { id: 'Cargo Van', name: 'Cargo Van' },
        { id: 'Pickup Truck', name: 'Pickup Truck' },
        { id: 'Box Truck', name: 'Box Truck' },
        { id: 'Semi Trailer', name: 'Semi Trailer' },
    ];

    const LOAD_OPTIONS = [
        { id: 'Boxes', name: 'Boxes' },
        { id: 'Pallets', name: 'Pallets' },
        { id: 'Furniture', name: 'Furniture' },
        { id: 'Machinery', name: 'Machinery' },
        { id: 'Vehicles', name: 'Vehicles' },
    ];

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
                <TabHeader title="Load & Vehicle Information" icon={Truck} />
                
                <FormRow label="Vehicle Type" required>
                    <Select 
                        name="vehicleType" 
                        value={formData.vehicleType} 
                        onChange={(e) => handleSelectChange('vehicleType', e.target.value)} 
                        options={VEHICLE_OPTIONS}
                        placeholder="Select vehicle..."
                        showSearch={false} 
                    />
                </FormRow>
                
                <FormRow label="Load Type" required>
                    <Select 
                        name="loadType" 
                        value={formData.loadType} 
                        onChange={(e) => handleSelectChange('loadType', e.target.value)} 
                        options={LOAD_OPTIONS}
                        placeholder="Select load type..."
                        showSearch={false} 
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
                <div className="col-span-1 md:col-span-2 pt-2">
                    <SectionHeader title="Cargo Dimensions (L x W x H)" icon={Box} />
                    
                    <div className="space-y-2 mt-2">
                        {formData.dimensions.map((dim) => (
                            <div key={dim.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                                <div className="flex-1 min-w-[80px]">
                                    <Input placeholder="Length" value={dim.length} onChange={(e) => updateDimension(dim.id, 'length', e.target.value)} className="h-8 text-xs" />
                                </div>
                                <span className="text-slate-400 text-xs font-semibold select-none">×</span>
                                <div className="flex-1 min-w-[80px]">
                                    <Input placeholder="Width" value={dim.width} onChange={(e) => updateDimension(dim.id, 'width', e.target.value)} className="h-8 text-xs" />
                                </div>
                                <span className="text-slate-400 text-xs font-semibold select-none">×</span>
                                <div className="flex-1 min-w-[80px]">
                                    <Input placeholder="Height" value={dim.height} onChange={(e) => updateDimension(dim.id, 'height', e.target.value)} className="h-8 text-xs" />
                                </div>
                                <div className="w-20 shrink-0">
                                    <Input placeholder="Qty" value={dim.qty} onChange={(e) => updateDimension(dim.id, 'qty', e.target.value)} className="h-8 text-xs text-center" />
                                </div>
                                <div className="w-24 shrink-0">
                                    <Select 
                                        value={dim.unit} 
                                        onChange={(e) => updateDimension(dim.id, 'unit', e.target.value)} 
                                        options={UNIT_OPTIONS}
                                        className="h-8 text-xs" 
                                        showSearch={false} 
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => removeDimension(dim.id)}
                                    disabled={formData.dimensions.length === 1}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors disabled:opacity-20 cursor-pointer shrink-0"
                                    title="Remove"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        
                        <button 
                            type="button" 
                            onClick={addDimensionRow} 
                            className="text-xs font-bold text-[#ff4a1f] hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                        >
                            <Plus size={13} />
                            <span>Add Dimension Row</span>
                        </button>
                    </div>
                </div>

                {/* Logistics Handling Checkboxes */}
                <div className="col-span-1 md:col-span-2 pt-2">
                    <SectionHeader title="Special Cargo Requirements & Services" icon={Truck} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 text-xs font-semibold text-slate-700">
                        {[
                            { name: 'stackable', label: 'Stackable Cargo' },
                            { name: 'fragile', label: 'Fragile Handling' },
                            { name: 'hazardous', label: 'Hazardous Materials' },
                            { name: 'tempControlled', label: 'Temperature Controlled' },
                            { name: 'oversized', label: 'Oversized Cargo' },
                            { name: 'perishable', label: 'Perishable Goods' },
                            { name: 'loadingRequired', label: 'Loading Service Required' },
                            { name: 'unloadingRequired', label: 'Unloading Service Required' },
                            { name: 'packaging', label: 'Packaging Service' },
                            { name: 'insurance', label: 'Cargo Insurance' },
                        ].map((chk) => (
                            <label key={chk.name} className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded border border-slate-200 hover:bg-slate-100 transition-colors">
                                <Checkbox 
                                    checked={Boolean(formData[chk.name as keyof QuoteFormData])} 
                                    onChange={(e) => handleCheckboxChange(chk.name as keyof QuoteFormData, e.target.checked)} 
                                />
                                <span>{chk.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
