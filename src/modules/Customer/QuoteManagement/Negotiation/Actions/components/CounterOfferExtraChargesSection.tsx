import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Select from '@/components/ui/select';
import { ExtraChargeItem, getServiceIcon } from './counterOfferModalConstants';

interface CounterOfferExtraChargesSectionProps {
    activeTypesForSelect: string[];
    selectOptions: any[];
    handleSelectDropdownService: (val: any) => void;
    showAddCustom: boolean;
    setShowAddCustom: (val: boolean) => void;
    customChargeName: string;
    setCustomChargeName: (val: string) => void;
    customChargeAmount: string;
    setCustomChargeAmount: (val: string) => void;
    handleAddCustomCharge: () => void;
    supplierExtras: ExtraChargeItem[];
    getChargeMeta: (extra: ExtraChargeItem) => any;
    handleUpdateExtraAmount: (index: number, newAmount: string) => void;
    handleRemoveExtra: (index: number) => void;
}

export const CounterOfferExtraChargesSection: React.FC<CounterOfferExtraChargesSectionProps> = ({
    activeTypesForSelect,
    selectOptions,
    handleSelectDropdownService,
    showAddCustom,
    setShowAddCustom,
    customChargeName,
    setCustomChargeName,
    customChargeAmount,
    setCustomChargeAmount,
    handleAddCustomCharge,
    supplierExtras,
    getChargeMeta,
    handleUpdateExtraAmount,
    handleRemoveExtra,
}) => {
    return (
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Additional Services
                </span>
                {!showAddCustom && (
                    <button
                        type="button"
                        onClick={() => setShowAddCustom(true)}
                        className="text-[10.5px] font-semibold text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                        <Plus size={11} />
                        <span>Add Custom</span>
                    </button>
                )}
            </div>

            <Select
                value={activeTypesForSelect}
                multiple={true}
                onChange={handleSelectDropdownService}
                placeholder="Select additional services..."
                options={selectOptions}
                showSearch={false}
                size="sm"
                className="text-[11px] !h-[30px] rounded"
            />

            {showAddCustom && (
                <div className="flex items-center gap-1 p-1.5 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
                    <input
                        type="text"
                        placeholder="Service Name"
                        value={customChargeName}
                        onChange={e => setCustomChargeName(e.target.value)}
                        className="flex-1 min-w-0 h-[26px] px-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px]"
                        autoFocus
                    />
                    <input
                        type="number"
                        placeholder="0.00"
                        value={customChargeAmount}
                        onChange={e => setCustomChargeAmount(e.target.value)}
                        className="w-16 h-[26px] px-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-bold text-right"
                    />
                    <button
                        type="button"
                        onClick={handleAddCustomCharge}
                        className="h-[26px] px-2 rounded bg-[#ff4a1f] text-white text-[10.5px] font-bold hover:bg-[#e03e15] cursor-pointer shrink-0"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAddCustom(false)}
                        className="h-[26px] px-1 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                    >
                        ✕
                    </button>
                </div>
            )}

            {supplierExtras.length > 0 && (
                <div className="space-y-1 pt-0.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                    {supplierExtras.map((extra, idx) => {
                        const meta = getChargeMeta(extra);
                        const ChargeIcon = meta.icon || getServiceIcon(extra.customName || extra.type);
                        return (
                            <div
                                key={extra.id ? `extra-${extra.id}` : `extra-${extra.type}-${idx}`}
                                className="flex items-center justify-between gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px]"
                            >
                                <div className="flex items-center gap-1.5 truncate flex-1 min-w-0" title={meta.label}>
                                    <ChargeIcon size={12} className="text-[#ff4a1f] shrink-0" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                        {meta.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <input
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={extra.amount || ''}
                                        onChange={e => handleUpdateExtraAmount(idx, e.target.value)}
                                        className="w-16 h-[22px] px-1 text-right font-bold text-[11px] rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExtra(idx)}
                                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-rose-500 rounded cursor-pointer shrink-0"
                                        title="Remove"
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
