import React from 'react';
import { Truck, UserCheck, UserPlus, Hash, PackageCheck, Layers } from 'lucide-react';
import Button from '@/components/ui/button';

interface SupplierVehicleDetailsProps {
    vehicle: {
        type: string;
        number: string;
        capacity: string;
        goodsType: string;
    };
    driver: {
        id?: number | string;
        name: string;
        phone: string;
        email: string;
    };
    onOpenAssignDriver?: () => void;
}

export const SupplierVehicleDetails: React.FC<SupplierVehicleDetailsProps> = ({
    vehicle,
    driver,
    onOpenAssignDriver,
}) => {
    const isDriverAssigned = Boolean(
        driver?.name &&
        driver.name !== 'Unassigned' &&
        driver.name !== 'Assigned Fleet Driver' &&
        driver.name !== 'Assigned Driver'
    );

    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-3 flex items-center justify-between">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Truck size={14} className="text-[#ff4a1f]" />
                        <span>Fleet & Cargo Specifications</span>
                    </p>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Dedicated Load
                    </span>
                </div>

                <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <Truck size={12} className="text-slate-400" />
                            <span>Vehicle Type</span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                            {vehicle?.type || 'Covered Van (20ft)'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <Hash size={12} className="text-slate-400" />
                            <span>Vehicle Plate</span>
                        </span>
                        <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11.5px]">
                            {vehicle?.number || 'Pending'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <PackageCheck size={12} className="text-slate-400" />
                            <span>Cargo Weight</span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                            {vehicle?.capacity || '1,500 kg'}
                        </span>
                    </div>

                    <div className="flex justify-between items-start min-h-[20px] gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                            <Layers size={12} className="text-slate-400" />
                            <span>Load Packaging</span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-right line-clamp-1">
                            {vehicle?.goodsType || 'Standard Euro Pallets'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Assigned Driver Section */}
            <div className="pt-2.5 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center min-h-[28px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">Dispatched Driver</span>
                    {isDriverAssigned ? (
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-[4px]">
                                <UserCheck size={12} className="text-emerald-600 shrink-0" />
                                <span>{driver.name}</span>
                            </span>
                            {onOpenAssignDriver && (
                                <button
                                    onClick={onOpenAssignDriver}
                                    className="text-[11px] text-[#ff4a1f] hover:underline font-bold cursor-pointer"
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenAssignDriver}
                            className="h-7.5 px-2.5 text-xs font-semibold text-amber-700 bg-amber-50 border-amber-300 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                            <UserPlus size={12} />
                            <span>Assign Driver</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierVehicleDetails;
