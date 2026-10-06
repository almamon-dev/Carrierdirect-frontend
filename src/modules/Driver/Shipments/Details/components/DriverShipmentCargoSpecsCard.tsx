import React from 'react';
import { Truck, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';
import { ShipmentItem } from '../../../types';

interface Props {
    cargo: ShipmentItem['cargo'];
    route: ShipmentItem['route'];
}

export const DriverShipmentCargoSpecsCard: React.FC<Props> = ({ cargo, route }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs font-sans overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Cargo Manifest & Equipment Specifications
                    </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {cargo.hazardous ? (
                        <span className="h-6.5 px-2.5 text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-[4px] border border-amber-200/80 dark:border-amber-800/80 inline-flex items-center gap-1.5 whitespace-nowrap">
                            <AlertTriangle size={12} className="shrink-0 text-amber-600" />
                            <span>ADR / Hazmat</span>
                        </span>
                    ) : (
                        <span className="h-6.5 px-2.5 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-[4px] border border-emerald-200/80 dark:border-emerald-800/80 inline-flex items-center gap-1.5 whitespace-nowrap">
                            <ShieldCheck size={12} className="shrink-0 text-emerald-600" />
                            <span>Standard Dry Freight</span>
                        </span>
                    )}
                    {cargo.temperatureControlled && (
                        <span className="h-6.5 px-2.5 text-[11px] font-bold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 rounded-[4px] border border-cyan-200/80 dark:border-cyan-800/80 inline-flex items-center gap-1.5 whitespace-nowrap">
                            <Thermometer size={12} className="shrink-0 text-cyan-600" />
                            <span>Reefer {cargo.temperatureControlled}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Aligned Key : Value Specifications Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {/* 1. Equipment Type */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Equipment Type</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{cargo.freightType}</span>
                </div>

                {/* 2. Payload Weight */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Payload Weight</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{cargo.weightKg.toLocaleString()} kg</span>
                </div>

                {/* 3. Pallet Quantity */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Pallet Quantity</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cargo.pallets} Standard Pallets</span>
                </div>

                {/* 4. Route Distance */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Route Distance</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{route.distanceKm} km ({route.estimatedDuration})</span>
                </div>

                {/* 5. Temperature Setting */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Temperature</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cargo.temperatureControlled || 'Ambient / Standard Dry'}</span>
                </div>

                {/* 6. Hazmat ADR */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Hazmat Status</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cargo.hazardous ? 'Yes (ADR Compliance Required)' : 'No (Standard Cargo)'}</span>
                </div>

                {/* 7. Manifest Description (Full width across 2 cols) */}
                <div className="md:col-span-2 grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Cargo Manifest</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">{cargo.description}</span>
                </div>
            </div>
        </div>
    );
};
