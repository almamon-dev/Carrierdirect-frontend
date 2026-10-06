/**
 * Extra Charges Line Items Section Component
 * Dynamically loads available services from Database (cargo_services) and allows carriers to add surcharges with Lucide icons.
 */

import React, { useMemo } from 'react';
import { Plus, Trash2, LucideIcon } from 'lucide-react';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { useCargoServices } from '@/hooks/useCargoServices';
import { getServiceIcon } from '@/modules/Customer/QuoteManagement/Negotiation/Actions/components/CounterOfferModal';

export interface ExtraChargeItem {
    type: string;
    customName: string;
    amount: string;
}

interface ExtraChargesSectionProps {
    extraCharges: ExtraChargeItem[];
    onChange: (charges: ExtraChargeItem[]) => void;
}

const DEFAULT_SURCHARGES = [
    { type: 'Toll', label: 'Toll Charges' },
    { type: 'Fuel Surcharge', label: 'Fuel Surcharge' },
    { type: 'Customs Clearance', label: 'Customs Clearance' },
];

export const ExtraChargesSection: React.FC<ExtraChargesSectionProps> = ({
    extraCharges,
    onChange,
}) => {
    const { allServices } = useCargoServices();

    const availableOptions = useMemo(() => {
        const list: Array<{ type: string; label: string; icon?: LucideIcon }> = [...DEFAULT_SURCHARGES];

        if (allServices && allServices.length > 0) {
            allServices.forEach(s => {
                if (!list.some(item => item.label.toLowerCase() === s.label.toLowerCase())) {
                    list.push({
                        type: s.label,
                        label: s.label,
                        icon: getServiceIcon(s.key || s.label)
                    });
                }
            });
        } else {
            list.push(
                { type: 'Loading / Unloading', label: 'Loading / Unloading', icon: getServiceIcon('Loading / Unloading') },
                { type: 'Cargo Insurance', label: 'Cargo Insurance', icon: getServiceIcon('Cargo Insurance') },
                { type: 'Lift Gate Needed', label: 'Lift Gate Needed (Tail-lift)', icon: getServiceIcon('Lift Gate Needed') },
                { type: 'Hazardous Material (ADR)', label: 'Hazardous Material (ADR)', icon: getServiceIcon('Hazardous Material (ADR)') },
                { type: 'Storage Facility', label: 'Storage Facility', icon: getServiceIcon('Storage Facility') },
                { type: 'Inside Delivery', label: 'Inside Delivery', icon: getServiceIcon('Inside Delivery') },
                { type: 'Packaging Required', label: 'Packaging Required', icon: getServiceIcon('Packaging Required') }
            );
        }

        list.push({ type: 'Custom', label: 'Custom', icon: getServiceIcon('Custom') });
        return list;
    }, [allServices]);

    const selectOptions = useMemo(() => {
        return [
            { id: '', value: '', label: 'Select charge type...', name: 'Select charge type...' },
            ...availableOptions.map(opt => ({
                id: opt.type,
                value: opt.type,
                label: opt.label,
                name: opt.label,
                icon: opt.icon || getServiceIcon(opt.label || opt.type),
            }))
        ];
    }, [availableOptions]);

    const handleAddCharge = () => {
        onChange([...extraCharges, { type: '', customName: '', amount: '' }]);
    };

    const handleRemoveCharge = (index: number) => {
        onChange(extraCharges.filter((_, i) => i !== index));
    };

    const handleUpdateCharge = (index: number, key: keyof ExtraChargeItem, value: string) => {
        const next = [...extraCharges];
        next[index][key] = value;
        if (key === 'type' && value !== 'Custom') {
            next[index].customName = '';
        }
        onChange(next);
    };

    return (
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
                <FormLabel className="mb-0 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Extra Charges
                </FormLabel>
                <button 
                    type="button"
                    onClick={handleAddCharge}
                    className="text-xs font-medium text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                    <Plus size={12} strokeWidth={2} /> Add Charge
                </button>
            </div>
            
            {extraCharges.length > 0 && (
                <div className="space-y-2 mb-2">
                    {extraCharges.map((charge, idx) => (
                        <div key={idx} className="flex flex-col gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                    <Select
                                        value={charge.type}
                                        onChange={(e) => handleUpdateCharge(idx, 'type', typeof e === 'object' ? (e.target?.value ?? e.value) : e)}
                                        options={selectOptions}
                                        showSearch={false}
                                        className="text-xs !h-7.5 py-0 rounded-[3px]"
                                    />
                                </div>
                                <div className="w-24 shrink-0">
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        icon={<span className="text-slate-400 text-xs font-medium">€</span>}
                                        className="text-xs !h-7.5 font-medium rounded-[3px]"
                                        value={charge.amount}
                                        onChange={(e) => handleUpdateCharge(idx, 'amount', e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveCharge(idx)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-[3px] transition-colors cursor-pointer shrink-0"
                                    title="Remove charge"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                            {charge.type === 'Custom' && (
                                <Input
                                    placeholder="Custom charge name (e.g. Parking Fee)"
                                    className="text-xs !h-7 rounded-[3px] w-full"
                                    value={charge.customName}
                                    onChange={(e) => handleUpdateCharge(idx, 'customName', e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExtraChargesSection;
