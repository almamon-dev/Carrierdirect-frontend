import React from 'react';
import { MapPin, Navigation, ShieldCheck, Star, Package, Calendar } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface CustomerRouteCardProps {
    requestDetails: QuoteRequest;
}

export const CustomerRouteCard: React.FC<CustomerRouteCardProps> = ({ requestDetails }) => {
    const customerInitial = (requestDetails.customer || 'C').charAt(0).toUpperCase();

    return (
        <div
    className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs p-3 sm:p-4 space-y-2.5 sm:space-y-3 font-sans">
            {/* Customer & Budget Header */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {requestDetails.customerAvatar ? (
                        <img
                            src={requestDetails.customerAvatar} alt={requestDetails.customer}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-semibold text-xs sm:text-sm shadow-2xs shrink-0">
                            {customerInitial}
                        </div>
                    )}

                    <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1">
                                <span className="truncate max-w-[120px] sm:max-w-none">{requestDetails.customer || 'Customer'}</span>
                                <span title="Verified Shipper" className="inline-flex items-center">
                                    <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                </span>
                            </span>
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80">
                                <Star size={10} className="fill-amber-400 text-amber-500 shrink-0" />
                                <span>{(requestDetails.customerRating ?? 4.9).toFixed(1)}</span>
                            </span>
                            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80">
                                <Package size={10} className="text-blue-500 shrink-0" />
                                <span>{requestDetails.customerOrdersCount ?? 1} {Number(requestDetails.customerOrdersCount) === 1 ? 'order' : 'orders'}</span>
                            </span>
                        </div>
                        {requestDetails.requestDate && (
                            <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal">
                                <span>Requested</span>
                                <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                                <span className="font-medium text-slate-600 dark:text-slate-300 truncate">{requestDetails.requestDate}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div
    className="bg-slate-50 dark:bg-[#181d24] border border-slate-200/90 dark:border-slate-800 rounded-lg px-2.5 py-1 sm:px-3.5 sm:py-2 text-right shrink-0">
                    <span className="text-[10px] sm:text-[11px] font-normal text-slate-500 dark:text-slate-400 block leading-none">Target Budget</span>
                    <span className="text-sm sm:text-lg font-bold text-slate-900 dark:text-slate-100 block leading-tight mt-0.5">{requestDetails.budget || 'Negotiable'}</span>
                </div>
            </div>

            {/* Route Cards */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 items-stretch">
                {/* Pickup Card */}
                <div
    className="p-2.5 sm:p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/50 flex flex-col justify-between space-y-2">
                    <div className="pb-1 sm:pb-1.5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" /> Pickup Location
                        </span>
                    </div>
                    <div className="space-y-1 sm:space-y-1.5 text-xs">
                        <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                            <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Location</span>
                            <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-[11.5px] sm:text-xs">{requestDetails.pickup}</span>
                        </div>
                        {requestDetails.pickupFullAddress && requestDetails.pickupFullAddress.trim() !== requestDetails.pickup?.trim() && (
                            <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Address</span>
                                <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                                <span className="text-[10.5px] sm:text-[11px] text-slate-600 dark:text-slate-300 leading-tight">{requestDetails.pickupFullAddress}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                            <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Date</span>
                            <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">{requestDetails.pickupDate || requestDetails.requestDate || '—'}</span>
                        </div>
                        <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                            <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Time Slot</span>
                            <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">{requestDetails.pickupTimeWindow || '09:00 – 17:00'}</span>
                        </div>
                    </div>
                </div>

                {/* Distance Indicator - Mobile Divider */}
                <div className="flex md:hidden items-center justify-center gap-2 py-0.5 text-xs text-slate-500">
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10.5px] font-medium text-slate-700 dark:text-slate-300 shadow-2xs shrink-0">
                        <Navigation size={9.5} className="rotate-45 text-slate-500" />
                        <span>{requestDetails.distance || '—'}</span>
                        <span className="text-slate-400 font-normal">• Standard transit</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                </div>

                {/* Distance Indicator - Desktop Center */}
                <div className="hidden md:flex flex-col items-center justify-center text-center px-1 self-center py-1">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 mb-0.5">
                        <Navigation size={11} className="rotate-45 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{requestDetails.distance || '—'}</span>
                    <span className="text-[10px] text-slate-400 font-normal whitespace-nowrap">Standard transit</span>
                </div>

                {/* Delivery Card */}
                <div
    className="p-2.5 sm:p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/50 flex flex-col justify-between space-y-2">
                    <div className="pb-1 sm:pb-1.5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                            <MapPin size={13} className="text-rose-500 dark:text-rose-400 shrink-0" /> Delivery Location
                        </span>
                    </div>
                    <div className="space-y-1 sm:space-y-1.5 text-xs">
                        <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                            <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Location</span>
                            <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-[11.5px] sm:text-xs">{requestDetails.delivery}</span>
                        </div>
                        {requestDetails.deliveryFullAddress && requestDetails.deliveryFullAddress.trim() !== requestDetails.delivery?.trim() && (
                            <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                                <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Address</span>
                                <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                                <span className="text-[10.5px] sm:text-[11px] text-slate-600 dark:text-slate-300 leading-tight">{requestDetails.deliveryFullAddress}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                            <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Date</span>
                            <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">{requestDetails.deliveryDate || '—'}</span>
                        </div>
                        <div className="grid grid-cols-[64px_10px_1fr] sm:grid-cols-[68px_12px_1fr] items-baseline">
                            <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px] sm:text-[11.5px]">Time Slot</span>
                            <span className="text-slate-400 dark:text-slate-500 text-center select-none">:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">{requestDetails.deliveryTimeWindow || '09:00 – 17:00'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
