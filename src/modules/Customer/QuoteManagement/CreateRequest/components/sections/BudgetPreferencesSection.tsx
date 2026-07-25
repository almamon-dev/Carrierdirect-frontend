import React from 'react';
import { Euro } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Checkbox from '@/components/ui/checkbox';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow } from '../FormHelpers';

interface SectionProps {
    formData: QuoteFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSelectChange: (name: keyof QuoteFormData, value: string) => void;
    handleCheckboxChange: (name: keyof QuoteFormData, checked: boolean) => void;
}

export const BudgetPreferencesSection: React.FC<SectionProps> = ({
    formData,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
}) => {
    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <TabHeader title="Budget & Bidding Preferences" icon={Euro} />
                
                <FormRow label="Target Budget (€)" required>
                    <Input type="text" inputMode="numeric" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. 1450" />
                </FormRow>
                
                <FormRow label="Auto Expire RFQ">
                    <Select name="autoExpire" value={formData.autoExpire} onChange={(e) => handleSelectChange('autoExpire', e.target.value)} showSearch={false}>
                        <option value="24 Hours">24 Hours</option>
                        <option value="48 Hours">48 Hours</option>
                        <option value="7 Days">7 Days</option>
                    </Select>
                </FormRow>

                <div className="col-span-1 md:col-span-2 pt-2 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded border border-slate-200 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800">
                        <Checkbox 
                            checked={formData.allowNegotiation} 
                            onChange={(e) => handleCheckboxChange('allowNegotiation', e.target.checked)} 
                        />
                        <span>Allow rate negotiation (Carriers can submit counter-offers)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded border border-slate-200 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800">
                        <Checkbox 
                            checked={formData.receiveMultiple} 
                            onChange={(e) => handleCheckboxChange('receiveMultiple', e.target.checked)} 
                        />
                        <span>Receive quotes from multiple verified suppliers</span>
                    </label>
                </div>
            </div>
        </div>
    );
};
