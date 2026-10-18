import React from 'react';
import { Truck, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/input';

interface OverviewEquipmentColumnProps {
    isEditMode: boolean;
    tractorModel: string;
    setTractorModel: (val: string) => void;
    unitNumber: string;
    setUnitNumber: (val: string) => void;
    trailerNumber: string;
    setTrailerNumber: (val: string) => void;
    vinNumber: string;
    setVinNumber: (val: string) => void;
}

export const OverviewEquipmentColumn: React.FC<OverviewEquipmentColumnProps> = ({
    isEditMode,
    tractorModel,
    setTractorModel,
    unitNumber,
    setUnitNumber,
    trailerNumber,
    setTrailerNumber,
    vinNumber,
    setVinNumber,
}) => {
    return (
        <div className="flex flex-col space-y-3 pt-4 lg:pt-0 lg:pl-6">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5">
                    <Truck size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Assigned Equipment & Fleet
                    </h3>
                </div>
                {unitNumber ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/70 rounded-[3px] flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        <span>Assigned</span>
                    </span>
                ) : (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-[3px]">
                        Unassigned
                    </span>
                )}
            </div>

            {/* Equipment Key-Values */}
            <div className="space-y-2 text-xs">
                {/* Tractor Model */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Tractor Model</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={tractorModel}
                            onChange={(e) => setTractorModel(e.target.value)}
                            placeholder="e.g. Freightliner Cascadia"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {tractorModel || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>

                {/* Power Unit Number */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Power Unit</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={unitNumber}
                            onChange={(e) => setUnitNumber(e.target.value)}
                            placeholder="e.g. TRK-101"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-mono font-bold text-blue-700 dark:text-blue-400 truncate">
                            {unitNumber || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>

                {/* Trailer Number */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Trailer Unit</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={trailerNumber}
                            onChange={(e) => setTrailerNumber(e.target.value)}
                            placeholder="e.g. TRL-559"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {trailerNumber || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>

                {/* VIN Number */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">VIN Number</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={vinNumber}
                            onChange={(e) => setVinNumber(e.target.value)}
                            placeholder="e.g. 1FT8W3BT9H..."
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {vinNumber || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
