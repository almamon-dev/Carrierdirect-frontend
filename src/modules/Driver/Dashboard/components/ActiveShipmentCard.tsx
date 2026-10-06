import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, FileText, ChevronRight, Triangle, Truck, ArrowRight } from 'lucide-react';

interface Props {
    shipment: any;
    onOpenBOL: () => void;
    onOpenGPS?: () => void;
}

export const ActiveShipmentCard: React.FC<Props> = ({ shipment, onOpenBOL, onOpenGPS }) => {
    const navigate = useNavigate();

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

                </Link>
            </div>

            {!shipment ? (
                <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-6 text-center space-y-2 shadow-2xs">
                    <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center mx-auto">
                        <Truck size={20} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Active Shipment in Transit</h4>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        When your carrier assigns you a new load, its live route and details will appear here automatically.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3">
                    {/* Top Badge Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/driver/shipments/${shipment.id}`}
                                className="font-mono font-bold text-xs sm:text-[13px] text-[#FF4A1F] hover:underline cursor-pointer"
                            >
                                {shipment.orderNumber || '#SHP-987654'}
                            </Link>
                            <span className="px-2 py-0.5 text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-[4px] border border-blue-200/60 dark:border-blue-800/60">
                                {shipment.cargoTag || 'Standard Freight'}
                            </span>
                        </div>

                        <span className="px-2 py-0.5 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-[4px] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{shipment.status || 'IN TRANSIT'}</span>
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
                                    {shipment.origin?.name || 'Shipper Origin'}
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                    {shipment.origin?.address || 'Pickup Address'}
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
                                    {shipment.destination?.name || 'Delivery Destination'}
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                    {shipment.destination?.address || 'Delivery Address'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => navigate(`/driver/shipments/${shipment.id}`)}
                            className="h-8 px-3.5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer"
                        >
                            <span>Manage Load</span>
                            <ArrowRight size={13} />
                        </button>

                        <button
                            type="button"
                            onClick={() => onOpenGPS && onOpenGPS()}
                            className="h-8 px-3 bg-white dark:bg-[#161a22] hover:bg-slate-50 dark:hover:bg-[#1f2530] border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-xs font-bold text-slate-800 dark:text-slate-200 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                            <Triangle size={11} className="fill-[#FF4A1F] text-[#FF4A1F]" />
                            <span>Live GPS</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => onOpenBOL && onOpenBOL()}
                            className="h-8 px-3 bg-white dark:bg-[#161a22] hover:bg-slate-50 dark:hover:bg-[#1f2530] border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-xs font-bold text-slate-800 dark:text-slate-200 inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                            <FileText size={13} className="text-slate-500" />
                            <span>View BOL</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveShipmentCard;
