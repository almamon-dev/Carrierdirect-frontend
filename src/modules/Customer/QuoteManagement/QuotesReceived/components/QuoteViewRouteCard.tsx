import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { QuoteData } from '../hooks/useQuoteViewDetail';

interface QuoteViewRouteCardProps {
    quote: QuoteData;
    requestDetail: any;
}

export const QuoteViewRouteCard: React.FC<QuoteViewRouteCardProps> = ({ quote, requestDetail }) => {
    const req = requestDetail || quote.quote_request;
    const originCity = req?.pickup_city || (req?.pickup_address ? req.pickup_address.split(',')[0] : 'Origin');
    const destCity = req?.delivery_city || (req?.delivery_address ? req.delivery_address.split(',')[0] : 'Destination');

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[5px] p-5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Route & Schedule
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Clock size={13} className="text-[#ff4a1f]" />
                        <span>Transit: <strong>{quote.estimated_delivery || '48 Hours'}</strong></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 dark:bg-[#161a20] rounded-[5px] border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                            <MapPin size={14} className="text-emerald-500" />
                            <span>Pickup (Origin)</span>
                        </div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{originCity}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {req?.pickup_address || 'Address specified in quote request'}
                        </p>
                        <div className="text-[11px] text-slate-400 mt-2 font-medium">
                            📅 {quote.pickup_date || req?.pickup_date || 'Standard Pickup'}
                        </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-[#161a20] rounded-[5px] border border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                            <MapPin size={14} className="text-[#ff4a1f]" />
                            <span>Delivery (Destination)</span>
                        </div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{destCity}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {req?.delivery_address || 'Address specified in quote request'}
                        </p>
                        <div className="text-[11px] text-slate-400 mt-2 font-medium">
                            📅 {quote.delivery_date || req?.delivery_date || 'Estimated Arrival'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[5px] p-5 shadow-2xs">
                <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4">
                    Shipment & Freight Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-[#161a20] rounded-[5px] border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px] font-medium">Vehicle Required</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
                            {req?.vehicle_type || 'Covered Van'}
                        </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#161a20] rounded-[5px] border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px] font-medium">Pallets / Load</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
                            {req?.type_of_pallets || req?.load_type || 'Palletized Cargo'}
                        </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#161a20] rounded-[5px] border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px] font-medium">Total Weight</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
                            {req?.weight ? `${req.weight} KG` : (req?.total_weight || '2,500 KG')}
                        </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#161a20] rounded-[5px] border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[11px] font-medium">Items Count</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block truncate">
                            {req?.items_count || req?.items?.length || 1} Units
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
