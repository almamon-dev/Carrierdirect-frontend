import React from 'react';
import { Gauge, Fuel, Thermometer, ShieldCheck, Wifi, Radio } from 'lucide-react';

interface Props {
    telemetry: any;
}

export const VehicleTelemetryCard: React.FC<Props> = ({ telemetry }) => {
    if (!telemetry) return null;

    return (
        <div className="bg-white dark:bg-[#12161c] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Radio size={16} className="text-emerald-500 animate-pulse" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Fleet Vehicle Telemetry ({telemetry.vehiclePlate})
                    </h2>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Wifi size={11} />
                    <span>Live GPS Telematics</span>
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Speed */}
                <div className="p-3 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Gauge size={13} className="text-blue-500" />
                        <span>Cruising Speed</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{telemetry.speed}</div>
                </div>

                {/* Fuel Level */}
                <div className="p-3 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Fuel size={13} className="text-amber-500" />
                        <span>Diesel Fuel</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{telemetry.fuelLevel}%</div>
                </div>

                {/* Engine Temp */}
                <div className="p-3 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Thermometer size={13} className="text-red-500" />
                        <span>Engine Temp</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{telemetry.engineTemp}</div>
                </div>

                {/* Odometer */}
                <div className="p-3 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <ShieldCheck size={13} className="text-emerald-500" />
                        <span>Odometer</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{telemetry.odometer}</div>
                </div>
            </div>
        </div>
    );
};
