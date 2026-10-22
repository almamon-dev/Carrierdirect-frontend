import React from 'react';
import { MapPin, Truck, Clock, Calendar } from 'lucide-react';

export interface TrackOverviewCardProps {
    quoteRequestDetails: any;
    quotesCount: number;
    lowestBidPrice: string | null;
}

export const TrackOverviewCard: React.FC<TrackOverviewCardProps> = ({
    quoteRequestDetails,
    quotesCount,
    lowestBidPrice,
}) => {
    if (!quoteRequestDetails) {
        return (
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs h-full flex flex-col justify-between animate-pulse">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-[2px]" />
                    <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-[2px]" />
                </div>
                <div className="space-y-3 py-3">
                    <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-[2px]" />
                    <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-[2px]" />
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-[2px]" />
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-[2px]" />
                </div>
            </div>
        );
    }

    const originCity = quoteRequestDetails?.pickup_city || quoteRequestDetails?.origin_city || (quoteRequestDetails?.origin ? quoteRequestDetails.origin.split(',')[0]?.trim() : '') || (quoteRequestDetails?.pickup_address ? quoteRequestDetails.pickup_address.split(',')[0]?.trim() : '') || 'Origin Location';
    const originAddress = quoteRequestDetails?.pickup_address || quoteRequestDetails?.origin || quoteRequestDetails?.pickup || '';

    const destCity = quoteRequestDetails?.delivery_city || quoteRequestDetails?.destination_city || (quoteRequestDetails?.destination ? quoteRequestDetails.destination.split(',')[0]?.trim() : '') || (quoteRequestDetails?.delivery_address ? quoteRequestDetails.delivery_address.split(',')[0]?.trim() : '') || 'Destination Location';
    const destAddress = quoteRequestDetails?.delivery_address || quoteRequestDetails?.destination || quoteRequestDetails?.delivery || '';

    const pickupDateText = quoteRequestDetails?.pickup_date || quoteRequestDetails?.requested_date || quoteRequestDetails?.pickupDate || 'Flexible Schedule';
    const pickupTimeText = quoteRequestDetails?.pickup_time || quoteRequestDetails?.pickupTime || '';

    const deliveryDateText = quoteRequestDetails?.delivery_date || quoteRequestDetails?.deliveryDate || quoteRequestDetails?.expected_transit_time || 'Estimated Transit';
    const deliveryTimeText = quoteRequestDetails?.delivery_time || quoteRequestDetails?.deliveryTime || '';

    const transitText = quoteRequestDetails?.expected_transit_time || quoteRequestDetails?.transit_time || quoteRequestDetails?.expectedTransitTime || 'Standard Transit';
    const vehicleType = quoteRequestDetails?.vehicle_type || quoteRequestDetails?.vehicleType || 'Covered Van';
    const weightText = quoteRequestDetails?.total_weight || (quoteRequestDetails?.weight ? `${quoteRequestDetails.weight} kg` : (quoteRequestDetails?.load_type || '1 Load'));

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 sm:p-4 shadow-2xs h-full flex flex-col justify-between font-sans">
            <div>
                {/* Header: Section Title & Transit Duration */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin size={13} className="text-[#ff4a1f] shrink-0" />
                        <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                            Route & Schedule
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        <Clock size={11} className="text-[#ff4a1f]" />
                        <span>{transitText}</span>
                    </div>
                </div>

                {/* Route Flow with Prominent Dates on the Left */}
                <div className="space-y-3">
                    {/* Origin / Pickup */}
                    <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/40 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100 truncate" title={originCity}>
                                    {originCity}
                                </span>
                                <div className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-[2px] border border-emerald-200 dark:border-emerald-800/60">
                                    <Calendar size={10.5} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>Pickup: <strong>{pickupDateText}</strong></span>
                                    {pickupTimeText && <span className="text-emerald-600/80">({pickupTimeText})</span>}
                                </div>
                            </div>
                            {originAddress && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={originAddress}>
                                    {originAddress}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Dotted Route Connector */}
                    <div className="ml-1 pl-0.5 -my-1">
                        <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-slate-700 border-l border-dashed border-slate-300 dark:border-slate-600" />
                    </div>

                    {/* Destination / Delivery */}
                    <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#ff4a1f] ring-4 ring-orange-50 dark:ring-orange-950/40 shrink-0" />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100 truncate" title={destCity}>
                                    {destCity}
                                </span>
                                <div className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-[2px] border border-orange-200 dark:border-orange-800/60">
                                    <Calendar size={10.5} className="text-[#ff4a1f] shrink-0" />
                                    <span>Delivery: <strong>{deliveryDateText}</strong></span>
                                    {deliveryTimeText && <span className="text-orange-600/80">({deliveryTimeText})</span>}
                                </div>
                            </div>
                            {destAddress && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={destAddress}>
                                    {destAddress}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Freight Specs & Offers Summary Bar */}
            <div className="pt-2.5 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs min-w-0">
                    <Truck size={13} className="text-indigo-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{vehicleType}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">{weightText}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                        <span className="text-[10px] text-slate-400 block leading-tight">Offers</span>
                        <span className="text-xs font-bold text-[#ff4a1f]">{quotesCount} Bid{quotesCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="text-right">
                        <span className="text-[10px] text-slate-400 block leading-tight">Lowest</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{lowestBidPrice || '—'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
