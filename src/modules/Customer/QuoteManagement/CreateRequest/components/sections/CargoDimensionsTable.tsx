import React from 'react';
import { Box, Plus, Trash2 } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { SectionHeader } from '../FormHelpers';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

interface CargoDimensionsTableProps {
    dimensions: Array<{ id: number; length: string; width: string; height: string; qty: string; unit: string }>;
    addDimensionRow: () => void;
    updateDimension: (id: number, field: string, value: string) => void;
    removeDimension: (id: number) => void;
    error?: string;
}

export const CargoDimensionsTable: React.FC<CargoDimensionsTableProps> = ({
    dimensions,
    addDimensionRow,
    updateDimension,
    removeDimension,
    error,
}) => {
    const { getOptions } = useDropdownOptions();
    const UNIT_OPTIONS = getOptions('dimension_unit');

    return (
        <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <SectionHeader title="Cargo Dimensions (L × W × H)" icon={Box} required />
            
            <div className="space-y-1.5 mt-1">
                {dimensions.map((dim, idx) => (
                    <div key={dim.id || idx} className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
                        <div className="flex-1 min-w-[70px]">
                            <Input 
                                type="text"
                                inputMode="numeric"
                                placeholder="Length" 
                                value={dim.length} 
                                onChange={(e) => updateDimension(dim.id, 'length', e.target.value)} 
                                className="h-[28px] !h-[28px] text-[12px] py-0.5 px-2 rounded-[3px]" 
                            />
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold select-none">×</span>
                        <div className="flex-1 min-w-[70px]">
                            <Input 
                                type="text"
                                inputMode="numeric"
                                placeholder="Width" 
                                value={dim.width} 
                                onChange={(e) => updateDimension(dim.id, 'width', e.target.value)} 
                                className="h-[28px] !h-[28px] text-[12px] py-0.5 px-2 rounded-[3px]" 
                            />
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold select-none">×</span>
                        <div className="flex-1 min-w-[70px]">
                            <Input 
                                type="text"
                                inputMode="numeric"
                                placeholder="Height" 
                                value={dim.height} 
                                onChange={(e) => updateDimension(dim.id, 'height', e.target.value)} 
                                className="h-[28px] !h-[28px] text-[12px] py-0.5 px-2 rounded-[3px]" 
                            />
                        </div>
                        <div className="w-16 shrink-0">
                            <Input 
                                type="text"
                                inputMode="numeric"
                                placeholder="Qty" 
                                value={dim.qty} 
                                onChange={(e) => updateDimension(dim.id, 'qty', e.target.value)} 
                                className="h-[28px] !h-[28px] text-[12px] py-0.5 px-1.5 text-center rounded-[3px]" 
                            />
                        </div>
                        <div className="w-20 shrink-0">
                            <Select 
                                value={dim.unit} 
                                onChange={(e) => updateDimension(dim.id, 'unit', e.target.value)} 
                                options={UNIT_OPTIONS}
                                size="sm"
                                className="h-[28px] [&>button]:h-[28px] [&>button]:!h-[28px] [&>button]:py-0 [&>button]:text-[11.5px] [&>button]:px-2 rounded-[3px]" 
                                showSearch={false} 
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={() => removeDimension(dim.id)}
                            disabled={dimensions.length === 1}
                            className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors disabled:opacity-20 cursor-pointer shrink-0"
                            title="Remove"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                ))}
                
                {error && (
                    <p className="text-[11.5px] text-[#d82c0d] font-medium mt-1 animate-in fade-in duration-200">
                        {error}
                    </p>
                )}

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
    );
};
