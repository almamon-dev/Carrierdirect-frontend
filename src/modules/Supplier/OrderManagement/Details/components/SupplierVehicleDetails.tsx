import React from 'react';
import { Truck, UserCheck, Phone, Mail, UserPlus } from 'lucide-react';

export default function SupplierVehicleDetails({
    vehicle,
    driver,
    onOpenAssignDriver,
}: {
    vehicle: any;
    driver: any;
    onOpenAssignDriver?: () => void;
}) {
    const isDriverAssigned = driver?.name &&
        driver.name !== 'Unassigned' &&
        driver.name !== 'Assigned Fleet Driver' &&
        driver.name !== 'Assigned Driver';

    return (
        <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2.5 mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Truck size={16} className="text-[#ff4a1f]" /> Assigned Fleet & Cargo Specs
                    </p>
                </div>

                <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Vehicle Type</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle?.type || 'Covered Van (20ft)'}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">License Plate</span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle?.number || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Cargo Weight</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle?.capacity || '1,500 KG'}</span>
                    </div>
                    <div className="flex justify-between items-center min-h-[26px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Goods Classification</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px]">{vehicle?.goodsType || 'Pallets'}</span>
                    </div>
                </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center min-h-[28px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px]">Assigned Driver</span>
                    {isDriverAssigned ? (
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col items-end leading-tight">
                                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-[13px]">
                                    <UserCheck size={14} className="text-emerald-600 shrink-0" />
                                    <span>{driver.name}</span>
                                </span>
                                {driver.email && (
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                        <Mail size={10} /> {driver.email}
                                    </span>
                                )}
                                {driver.phone && !driver.email && (
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                                        <Phone size={10} /> {driver.phone}
                                    </span>
                                )}
                            </div>
                            {onOpenAssignDriver && (
                                <button
                                    type="button"
                                    onClick={onOpenAssignDriver}
                                    className="text-xs font-semibold text-[#ff4a1f] hover:underline cursor-pointer ml-1"
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                                Unassigned
                            </span>
                            {onOpenAssignDriver && (
                                <button
                                    type="button"
                                    onClick={onOpenAssignDriver}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff4a1f] hover:underline cursor-pointer"
                                >
                                    <UserPlus size={12} /> Assign
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
