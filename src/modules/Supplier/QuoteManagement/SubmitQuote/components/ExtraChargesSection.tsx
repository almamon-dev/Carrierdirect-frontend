/**
 * Extra Charges Line Items Section Component
 * Allows carriers to add optional surcharges (Tolls, Fuel, Loading, Custom) to their quote offer.
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';

export interface ExtraChargeItem {
    type: string;
    customName: string;
    amount: string;
}

interface ExtraChargesSectionProps {
    extraCharges: ExtraChargeItem[];
    onChange: (charges: ExtraChargeItem[]) => void;
}

export const ExtraChargesSection: React.FC<ExtraChargesSectionProps> = ({
    extraCharges,
    onChange,
}) => {
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
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
                <FormLabel className="mb-0 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Extra Charges
                </FormLabel>
                <button 
                    type="button"
                    onClick={handleAddCharge}
                    className="text-xs font-semibold text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                    <Plus size={12} /> Add Charge
                </button>
            </div>
            
            {extraCharges.length > 0 && (
                <div className="space-y-2 mb-3">
                    {extraCharges.map((charge, idx) => (
                        <div key={idx} className="space-y-1.5 p-2.5 bg-slate-50 dark:bg-[#181d24] rounded border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <Select
                                    value={charge.type}
                                    onChange={(e) => handleUpdateCharge(idx, 'type', e.target.value)}
                                    showSearch={false}
                                    className="text-xs h-7 flex-1"
                                >
                                    <option value="">Select type...</option>
                                    <option value="Toll">🛣️ Toll Charges</option>
                                    <option value="Fuel Surcharge">⛽ Fuel Surcharge</option>
                                    <option value="Loading/Unloading">📦 Loading / Unloading</option>
                                    <option value="Insurance">🛡️ Insurance</option>
                                    <option value="Hazardous">⚠️ Hazardous Handling</option>
                                    <option value="Storage">🏭 Storage Fee</option>
                                    <option value="Custom">✏️ Custom</option>
                                </Select>
                                <div className="relative w-20 shrink-0">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400 text-xs">€</div>
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        className="pl-5 text-xs h-7 font-bold bg-white dark:bg-[#1e2329]"
                                        value={charge.amount}
                                        onChange={(e) => handleUpdateCharge(idx, 'amount', e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleRemoveCharge(idx)}
                                    className="shrink-0 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                            {charge.type === 'Custom' && (
                                <Input
                                    placeholder="Custom charge name (e.g. Parking Fee)"
                                    className="text-xs h-7 bg-white dark:bg-[#1e2329] w-full"
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
