import React from 'react';
import { Truck } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow } from '../FormHelpers';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { CargoDimensionsTable } from './CargoDimensionsTable';
import { CargoServicesChecklist } from './CargoServicesChecklist';

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
    const VEHICLE_OPTIONS = getOptions('vehicle_type');
    const LOAD_OPTIONS = getOptions('load_type');

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

                <CargoDimensionsTable
                    dimensions={formData.dimensions}
                    addDimensionRow={addDimensionRow}
                    updateDimension={updateDimension}
                    removeDimension={removeDimension}
                />

                <CargoServicesChecklist
                    formData={formData}
                    handleCheckboxChange={handleCheckboxChange}
                />
            </div>
        </div>
    );
};
