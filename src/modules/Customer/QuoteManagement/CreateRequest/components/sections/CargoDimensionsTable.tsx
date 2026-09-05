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
}

export const CargoDimensionsTable: React.FC<CargoDimensionsTableProps> = ({
    dimensions,
    addDimensionRow,
    updateDimension,
    removeDimension,
}) => {
    const { getOptions } = useDropdownOptions();
    const UNIT_OPTIONS = getOptions('dimension_unit');

    return (
        <div className="col-span-1 md:col-span-2 mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <SectionHeader title="Cargo Dimensions (L × W × H)" icon={Box} />
            
            <div className="space-y-1.5 mt-1.5">
                {dimensions.map((dim) => (
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
                            disabled={dimensions.length === 1}
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
    );
};
