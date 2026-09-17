import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, FileText, ChevronRight, Triangle } from 'lucide-react';

interface Props {
    shipment: any;
    onOpenBOL: () => void;
}

export const ActiveShipmentCard: React.FC<Props> = ({ shipment, onOpenBOL }) => {
    if (!shipment) return null;

    return (
        <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    Active Shipment in Transit
                </h3>
                <Link
                    to="/driver/shipments"
                    className="text-[12px] font-bold text-[#FF4A1F] hover:underline flex items-center gap-0.5"
                >
                    <span>View All</span>
                    <ChevronRight size={13} />
                </Link>
            </div>

            {/* Active Load Card - Compact rounded-[4px] */}
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3">
                {/* Top Badge Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white">
                            {shipment.orderNumber || '#SHP-987654'}
                        </span>
                        <span className="px-2 py-0.5 text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-[4px] border border-blue-200/60 dark:border-blue-800/60">
                            {shipment.cargoTag || 'Reefer -18°C'}
                        </span>
                    </div>

                    <span className="px-2 py-0.5 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-[4px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{shipment.status || 'In Transit'}</span>
                    </span>
                </div>

                {/* Origin & Destination Timeline */}
                <div className="space-y-3 relative pl-0.5">
                    {/* Origin */}
                    <div className="flex items-start gap-2.5 relative">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FF4A1F] bg-white dark:bg-[#1e2329] flex items-center justify-center shrink-0 mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-[#FF4A1F]" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                {shipment.origin?.name || 'ABC Warehouse Logistics (Bay 4)'}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {shipment.origin?.address || 'Port Logistics Park, Seattle WA'}
                            </div>
                        </div>
                    </div>

                    {/* Vertical connecting line */}
                    <div className="absolute left-[6.5px] top-3.5 bottom-4 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

                    {/* Destination */}
                    <div className="flex items-start gap-2.5 relative pt-0.5">
                        <div className="w-3.5 h-3.5 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin size={15} className="fill-blue-500 text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                {shipment.destination?.name || 'Starlight Supermarket Central (Dock 12)'}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {shipment.destination?.address || '742 Evergreen Terrace, Seattle WA'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Two Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shipment.destination?.address || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98"
                    >
                        <Triangle size={11} className="fill-white rotate-0" />
                        <span>Live GPS Tracking</span>
                    </a>

                    <button
                        type="button"
                        onClick={onOpenBOL}
                        className="py-2 px-3 bg-white dark:bg-[#161a22] hover:bg-slate-50 dark:hover:bg-[#1f2530] border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                        <FileText size={14} className="text-slate-500" />
                        <span>View BOL</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
