import React from 'react';
import { MapPin, ArrowRight, Truck, Clock } from 'lucide-react';

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
    if (!quoteRequestDetails) return null;

    const originText = quoteRequestDetails?.pickup_city || quoteRequestDetails?.origin_city || (quoteRequestDetails?.origin ? quoteRequestDetails.origin.split(',')[0]?.trim() : '') || (quoteRequestDetails?.pickup_address ? quoteRequestDetails.pickup_address.split(',')[0]?.trim() : '') || 'Origin Location';
    const destText = quoteRequestDetails?.delivery_city || quoteRequestDetails?.destination_city || (quoteRequestDetails?.destination ? quoteRequestDetails.destination.split(',')[0]?.trim() : '') || (quoteRequestDetails?.delivery_address ? quoteRequestDetails.delivery_address.split(',')[0]?.trim() : '') || 'Destination Location';
    const pickupDateText = quoteRequestDetails?.pickup_date || quoteRequestDetails?.requested_date || 'Flexible Date';
    const transitText = quoteRequestDetails?.expected_transit_time || quoteRequestDetails?.transit_time || 'Standard Transit';

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 sm:p-4 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                <div className="space-y-1">
                    <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Shipment Route</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100" title={`${originText} → ${destText}`}>
                        <MapPin size={13} className="text-[#ff4a1f] shrink-0" />
                        <span className="truncate max-w-[100px]">{originText}</span>
                        <ArrowRight size={11} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[100px]">{destText}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Cargo & Equipment</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Truck size={13} className="text-indigo-500 shrink-0" />
                        <span className="truncate max-w-[110px]">{quoteRequestDetails.vehicle_type || 'Covered Van'}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{quoteRequestDetails.total_weight || (quoteRequestDetails.weight ? `${quoteRequestDetails.weight} kg` : '1 Load')}</span>
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pickup & Transit</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <Clock size={13} className="text-amber-500 shrink-0" />
                        <span>{pickupDateText}</span>
                        <span className="text-slate-400 text-[11px]">({transitText})</span>
                    </div>
                </div>

                <div className="flex items-center justify-start lg:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left lg:text-right">
                        <span className="text-[10px] font-medium text-slate-400 block">Total Offers</span>
                        <span className="text-xs font-bold text-[#ff4a1f]">{quotesCount} Carrier{quotesCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="text-left lg:text-right">
                        <span className="text-[10px] font-medium text-slate-400 block">Lowest Offer</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{lowestBidPrice || '—'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
