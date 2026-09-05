import React from 'react';
import { MapPin, Navigation, ShieldCheck, Star, Package, Calendar } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface CustomerRouteCardProps {
    requestDetails: QuoteRequest;
}

export const CustomerRouteCard: React.FC<CustomerRouteCardProps> = ({ requestDetails }) => {
    const customerInitial = (requestDetails.customer || 'C').charAt(0).toUpperCase();

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] shadow-2xs p-3.5 sm:p-4 space-y-3 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                    {requestDetails.customerAvatar ? (
                        <img
                            src={requestDetails.customerAvatar} alt={requestDetails.customer}
                            className="w-9 h-9 rounded-[3px] object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-semibold text-sm shadow-2xs shrink-0">
                            {customerInitial}
                        </div>
                    )}

                    <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1">
                                <span>{requestDetails.customer || 'Customer'}</span>
                                <span title="Verified Shipper" className="inline-flex items-center">
                                    <ShieldCheck size={13.5} className="text-blue-600 dark:text-blue-400 shrink-0" />
                                </span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80">
                                <Star size={10.5} className="fill-amber-400 text-amber-500 shrink-0" />
                                <span>{(requestDetails.customerRating ?? 4.9).toFixed(1)}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80">
                                <Package size={11} className="text-blue-500 shrink-0" />
                                <span>{requestDetails.customerOrdersCount ?? 1} {Number(requestDetails.customerOrdersCount) === 1 ? 'order' : 'orders'}</span>
                            </span>
                        </div>
                        {requestDetails.requestDate && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 font-normal">
                                <Calendar size={11.5} className="text-slate-400 shrink-0" />
                                <span>Requested: <span className="font-medium text-slate-600 dark:text-slate-300">{requestDetails.requestDate}</span></span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#181d24] border border-slate-200/90 dark:border-slate-800 rounded-[3px] px-3 py-1.5 text-left sm:text-right flex flex-col justify-center min-w-[120px] shrink-0 self-start sm:self-auto">
                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 block">Target Budget</span>
                    <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 block leading-tight mt-0.5">{requestDetails.budget || 'Negotiable'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
                <div className="p-3 rounded-[3px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/50 flex flex-col justify-between h-full space-y-2">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><MapPin size={12.5} className="text-emerald-600" /> Pickup</span>
                            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{requestDetails.pickupDate || requestDetails.requestDate || '—'}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">{requestDetails.pickup}</h4>
                        {requestDetails.pickupFullAddress && requestDetails.pickupFullAddress.trim() !== requestDetails.pickup?.trim() && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal font-normal">{requestDetails.pickupFullAddress}</p>
                        )}
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-normal">Time Slot:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{requestDetails.pickupTimeWindow || '09:00 AM – 05:00 PM'}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center px-1 self-center py-1">
                    <div className="flex items-center justify-center w-6.5 h-6.5 rounded-[3px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 mb-0.5">
                        <Navigation size={11} className="rotate-45 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{requestDetails.distance || '—'}</span>
                    <span className="text-[10px] text-slate-400 font-normal whitespace-nowrap">Standard transit</span>
                </div>

                <div className="p-3 rounded-[3px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/50 flex flex-col justify-between h-full space-y-2">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><MapPin size={12.5} className="text-rose-500" /> Delivery</span>
                            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{requestDetails.deliveryDate || '—'}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">{requestDetails.delivery}</h4>
                        {requestDetails.deliveryFullAddress && requestDetails.deliveryFullAddress.trim() !== requestDetails.delivery?.trim() && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal font-normal">{requestDetails.deliveryFullAddress}</p>
                        )}
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-normal">Time Slot:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{requestDetails.deliveryTimeWindow || 'By 05:00 PM'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
