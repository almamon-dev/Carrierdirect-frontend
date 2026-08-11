import React from 'react';
import { Euro } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Checkbox from '@/components/ui/checkbox';
import TabHeader from '@/components/ui/tab-header';
import { QuoteFormData } from '../../types/formTypes';
import { FormRow } from '../FormHelpers';

import { useDropdownOptions } from '@/hooks/useDropdownOptions';

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
    const { getOptions } = useDropdownOptions();

    const EXPIRE_OPTIONS = getOptions('auto_expire', [
        { id: '24 Hours', name: '24 Hours' },
        { id: '48 Hours', name: '48 Hours' },
        { id: '7 Days', name: '7 Days' },
    ]);

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
                <TabHeader title="Budget & Bidding Preferences" icon={Euro} />
                
                <FormRow label="Target Budget (€)">
                    <Input type="text" inputMode="numeric" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g. 1450 (Optional)" />
                </FormRow>
                
                <FormRow label="Auto Expire RFQ">
                    <Select 
                        name="autoExpire" 
                        value={formData.autoExpire} 
                        onChange={(e) => handleSelectChange('autoExpire', e.target.value)} 
                        options={EXPIRE_OPTIONS}
                        showSearch={false} 
                    />
                </FormRow>

                <div className="col-span-1 md:col-span-2 pt-2 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-[#1e2329] p-2.5 rounded border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Checkbox 
                            checked={formData.allowNegotiation} 
                            onChange={(e) => handleCheckboxChange('allowNegotiation', e.target.checked)} 
                        />
                        <span>Allow rate negotiation (Carriers can submit counter-offers)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-[#1e2329] p-2.5 rounded border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200">
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
