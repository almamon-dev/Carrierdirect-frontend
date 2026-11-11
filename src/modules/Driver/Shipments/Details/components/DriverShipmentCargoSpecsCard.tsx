import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Package } from 'lucide-react';
import { ShipmentItem } from '../../../types';

interface Props {
    cargo: ShipmentItem['cargo'];
    route: ShipmentItem['route'];
}

export const DriverShipmentCargoSpecsCard: React.FC<Props> = ({ cargo, route }) => {
    const [isCargoOpen, setIsCargoOpen] = useState(true);

    const distanceKm = route.distanceKm || 251;
    const estimatedDuration = route.estimatedDuration || '5 hr 21 min';

    return (
        <div className="space-y-2.5 font-sans">
            {/* Cargo & Equipment Card (Collapsible) */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[6px] shadow-xs overflow-hidden">
                <div
                    onClick={() => setIsCargoOpen(!isCargoOpen)}
                    className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e2329] cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Package size={14} className="text-[#FF4A1F]" />
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            Cargo & Equipment
                        </h3>
                    </div>

                    <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                    >
                        {isCargoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>

                {isCargoOpen && (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                        {/* Equipment Type */}
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Equipment Type</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                {cargo.freightType || 'Euro Pallets (EPAL-1)'}
                            </span>
                        </div>

                        {/* Pallet Quantity */}
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Pallet Quantity</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {cargo.pallets || 1} Standard Pallets
                            </span>
                        </div>

                        {/* Temperature */}
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Temperature</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {cargo.temperatureControlled || 'Ambient / Standard Dry'}
                            </span>
                        </div>

                        {/* Payload Weight */}
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Payload Weight</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                {(cargo.weightKg || 800).toLocaleString()} kg
                            </span>
                        </div>

                        {/* Route Distance */}
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Route Distance</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {distanceKm} km
                            </span>
                        </div>

                        {/* Hazmat Status */}
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Hazmat Status</span>
                            <span className="text-[#FF4A1F] font-bold text-center">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {cargo.hazardous ? 'Yes (ADR Regulated)' : 'No (Standard Cargo)'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
