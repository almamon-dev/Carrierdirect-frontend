import React from 'react';
import { Package, ShieldCheck, Thermometer, Layers, Weight, DollarSign } from 'lucide-react';
import { ShipmentItem } from '../../../types';

interface Props {
    cargo: ShipmentItem['cargo'];
    payout: ShipmentItem['payout'];
}

export const CargoSpecsCard: React.FC<Props> = ({ cargo, payout }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Cargo Specifications & Freight Details
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Description */}
                <div className="col-span-2 sm:col-span-3 p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800">
                    <div className="text-[10.5px] font-semibold text-slate-400">Cargo Description</div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white mt-0.5">{cargo.description}</div>
                </div>

                {/* Freight Type */}
                <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800">
                    <div className="text-[10.5px] font-semibold text-slate-400 flex items-center gap-1">
                        <Package size={12} className="text-blue-500" />
                        <span>Equipment / Type</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{cargo.freightType}</div>
                </div>

                {/* Weight */}
                <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800">
                    <div className="text-[10.5px] font-semibold text-slate-400 flex items-center gap-1">
                        <Weight size={12} className="text-purple-500" />
                        <span>Total Weight</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {cargo.weightKg.toLocaleString()} kg
                    </div>
                </div>

                {/* Pallet Count */}
                <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800">
                    <div className="text-[10.5px] font-semibold text-slate-400 flex items-center gap-1">
                        <Layers size={12} className="text-amber-500" />
                        <span>Pallet Count</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {cargo.pallets} Pallets
                    </div>
                </div>

                {/* Temperature */}
                {cargo.temperatureControlled && (
                    <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800">
                        <div className="text-[10.5px] font-semibold text-slate-400 flex items-center gap-1">
                            <Thermometer size={12} className="text-cyan-500" />
                            <span>Temperature Setpoint</span>
                        </div>
                        <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                            {cargo.temperatureControlled}
                        </div>
                    </div>
                )}

                {/* Cargo Value */}
                {cargo.valueEstimate && (
                    <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800">
                        <div className="text-[10.5px] font-semibold text-slate-400 flex items-center gap-1">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            <span>Declared Value</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                            {cargo.valueEstimate}
                        </div>
                    </div>
                )}

                {/* Driver Payout */}
                <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-[4px] border border-emerald-200/80 dark:border-emerald-900/50">
                    <div className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>Driver Net Payout</span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {payout.currency}{payout.driverEarnings.toFixed(2)} (+{payout.currency}{payout.fuelSurcharge} fuel)
                    </div>
                </div>
            </div>
        </div>
    );
};
