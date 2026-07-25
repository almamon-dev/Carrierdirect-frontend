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
    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <TabHeader title="Load & Vehicle Information" icon={Truck} />
                
                <FormRow label="Vehicle Type" required>
                    <Select name="vehicleType" value={formData.vehicleType} onChange={(e) => handleSelectChange('vehicleType', e.target.value)} showSearch={false}>
                        <option value="">Select vehicle...</option>
                        <option value="Small Van">Small Van</option>
                        <option value="Cargo Van">Cargo Van</option>
                        <option value="Pickup Truck">Pickup Truck</option>
                        <option value="Box Truck">Box Truck</option>
                        <option value="Semi Trailer">Semi Trailer</option>
                    </Select>
                </FormRow>
                
                <FormRow label="Load Type" required>
                    <Select name="loadType" value={formData.loadType} onChange={(e) => handleSelectChange('loadType', e.target.value)} showSearch={false}>
                        <option value="">Select load type...</option>
                        <option value="Boxes">Boxes</option>
                        <option value="Pallets">Pallets</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Machinery">Machinery</option>
                        <option value="Vehicles">Vehicles</option>
                    </Select>
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

                {/* Dimensions Table */}
                <div className="col-span-1 md:col-span-2 pt-2">
                    <SectionHeader title="Cargo Dimensions (L x W x H)" icon={Box} />
                    <div className="space-y-2 mt-2">
                        {formData.dimensions.map((dim) => (
                            <div key={dim.id} className="grid grid-cols-6 gap-2 items-center bg-slate-50 p-2 rounded border border-slate-200 text-xs">
                                <Input placeholder="Length" value={dim.length} onChange={(e) => updateDimension(dim.id, 'length', e.target.value)} className="h-8 text-xs" />
                                <Input placeholder="Width" value={dim.width} onChange={(e) => updateDimension(dim.id, 'width', e.target.value)} className="h-8 text-xs" />
                                <Input placeholder="Height" value={dim.height} onChange={(e) => updateDimension(dim.id, 'height', e.target.value)} className="h-8 text-xs" />
                                <Input placeholder="Qty" value={dim.qty} onChange={(e) => updateDimension(dim.id, 'qty', e.target.value)} className="h-8 text-xs" />
                                <Select value={dim.unit} onChange={(e) => updateDimension(dim.id, 'unit', e.target.value)} className="h-8 text-xs" showSearch={false}>
                                    <option value="CM">CM</option>
                                    <option value="INCH">INCH</option>
                                    <option value="M">M</option>
                                </Select>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeDimension(dim.id)}
                                    disabled={formData.dimensions.length === 1}
                                    className="h-8 text-red-500 hover:bg-red-50 cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={addDimensionRow} className="h-8 text-xs font-semibold cursor-pointer">
                            <Plus size={13} className="mr-1" /> Add Dimension Row
                        </Button>
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
