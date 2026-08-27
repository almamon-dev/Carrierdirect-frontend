/**
 * CustomerRouteCard Component
 * Displays shipper profile info, target budget box, and pickup/delivery route grid
 * together in a SINGLE unified card as requested.
 */

import React from 'react';
import { MapPin, Navigation, ShieldCheck, Star } from 'lucide-react';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface CustomerRouteCardProps {
    requestDetails: QuoteRequest;
}

export const CustomerRouteCard: React.FC<CustomerRouteCardProps> = ({ requestDetails }) => {
    const customerInitial = (requestDetails.customer || 'C').charAt(0).toUpperCase();

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs p-5 space-y-5 font-sans">
            {/* Top Section: Customer Profile & Target Budget */}
            <div className="flex flex-wrap items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3.5">
                    {/* Circle Avatar */}
                    {requestDetails.customerAvatar ? (
                        <img
                            src={requestDetails.customerAvatar}
                            alt={requestDetails.customer}
                            className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                            {customerInitial}
                        </div>
                    )}

                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {requestDetails.customer || 'Customer'}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                                <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400" />
                                <span>Verified Shipper</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                <Star size={11} className="fill-amber-500 text-amber-500" />
                                <span>{requestDetails.customerOrdersCount ?? 1} order</span>
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                            {requestDetails.requestDate && (
                                <span>📅 Requested: <strong className="font-semibold text-slate-700 dark:text-slate-300">{requestDetails.requestDate}</strong></span>
                            )}
                            {requestDetails.customerPhone && (
                                <>
                                    <span className="text-slate-300 dark:text-slate-700">•</span>
                                    <span>📞 <strong className="font-semibold text-slate-700 dark:text-slate-300">{requestDetails.customerPhone}</strong></span>
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* Target Budget Box */}
                <div className="border border-emerald-200 dark:border-emerald-800/70 rounded-xl px-5 py-2.5 text-center min-w-[140px]">
                    <span className="text-[10.5px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase block">
                        TARGET BUDGET
                    </span>
                    <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 block mt-0.5">
                        {requestDetails.budget || 'Negotiable'}
                    </span>
                </div>
            </div>

            {/* Bottom Section: Pickup & Delivery Route */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                {/* Pickup Box */}
                <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#181d24] flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                <MapPin size={14} className="text-emerald-500" /> Pickup
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {requestDetails.pickupDate || requestDetails.requestDate || '—'}
                            </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                            {requestDetails.pickup}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                            {requestDetails.pickupFullAddress || requestDetails.pickup}
                        </p>
                    </div>
                    <div className="pt-2.5 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Time Slot:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {requestDetails.pickupTimeWindow || '09:00 AM – 05:00 PM'}
                        </span>
                    </div>
                </div>

                {/* Middle Distance Indicator */}
                <div className="flex flex-col items-center justify-center text-center px-1 self-center py-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 mb-1">
                        <Navigation size={13} className="rotate-45 text-slate-600 dark:text-slate-400" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {requestDetails.distance || '—'}
                    </span>
                    <span className="text-[10.5px] text-slate-400 font-medium whitespace-nowrap">
                        Standard Transit
                    </span>
                </div>

                {/* Delivery Box */}
                <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#181d24] flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                <MapPin size={14} className="text-red-500" /> Delivery
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {requestDetails.deliveryDate || '—'}
                            </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                            {requestDetails.delivery}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                            {requestDetails.deliveryFullAddress || requestDetails.delivery}
                        </p>
                    </div>
                    <div className="pt-2.5 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Time Slot:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {requestDetails.deliveryTimeWindow || 'By 05:00 PM'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
