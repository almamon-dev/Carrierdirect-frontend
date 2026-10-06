import { formatTimeSlotWindow, formatDeliveryTime } from '@/modules/Supplier/QuoteManagement/SubmitQuote/utils/detailMapper';
import TabHeader from '@/components/ui/tab-header';
import { SectionHeader, ViewField } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { resolveQuoteDistance } from '@/utils/geoDistance';
import { MapPin, Navigation, Plane } from 'lucide-react';
import React from 'react';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteRouteProps {
    quote: QuoteData;
    requestDetail: any;
}

export const ViewQuoteRoute: React.FC<ViewQuoteRouteProps> = ({ quote, requestDetail }) => {
    const req = requestDetail || quote.quote_request || {};
    const originCity = req.pickup_city || (req.pickup_address ? req.pickup_address.split(',')[0] : (req.pickup || 'Dhaka'));
    const destCity = req.delivery_city || (req.delivery_address ? req.delivery_address.split(',')[0] : (req.delivery || 'Chittagong'));
    const distInfo = resolveQuoteDistance(req);

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Pickup & Delivery Route" icon={MapPin} />

                <SectionHeader title="Pickup Origin Location" icon={MapPin} />
                <ViewField label="Pickup Address" colSpan value={req.pickup_address || req.pickup || 'Pickup address specified in request'} />
                <ViewField label="Pickup City" value={originCity} />
                <ViewField label="Postal / ZIP Code" value={req.pickup_zip || req.pickup_postal_code || '1000'} />
                <ViewField label="Pickup Date" value={quote.pickup_date || req.pickup_date || 'Standard Pickup Schedule'} />
                <ViewField label="Pickup Time Slot" value={formatTimeSlotWindow(req.pickup_time_from, req.pickup_time_till, req.pickup_time_window || req.pickup_time_slot, req.pickup_time) || "—"} />

                <SectionHeader title="Delivery Destination Location" icon={MapPin} />
                <ViewField label="Delivery Address" colSpan value={req.delivery_address || req.delivery || 'Delivery address specified in request'} />
                <ViewField label="Delivery City" value={destCity} />
                <ViewField label="Postal / ZIP Code" value={req.delivery_zip || req.delivery_postal_code || '4000'} />
                <ViewField label="Est. Delivery Date" value={quote.delivery_date || req.delivery_date || 'Estimated Arrival on Schedule'} />
                <ViewField label="Delivery Time Slot" value={formatDeliveryTime(req.delivery_time_from, req.delivery_time_till, req.delivery_time_window || req.delivery_time_slot, req.delivery_time) || "—"} />

                <SectionHeader title="Route & Transit Specifications" icon={Navigation} />
                <ViewField label="Est. Transit Time" value={<span className="font-bold text-slate-900 dark:text-slate-100">{quote.estimated_delivery || req.expected_transit_time || '48 Hours'}</span>} />
                <ViewField
                    label="Estimated Distance"
                    value={
                        <span className="font-semibold text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5">
                            {distInfo.isAirDistance && <Plane size={13} className="text-sky-500 shrink-0" />}
                            {distInfo.distanceStr}
                        </span>
                    }
                />
                <ViewField label="Route Type" value={distInfo.isAirDistance ? 'Air Freight / Direct Flight Corridor' : 'Direct Point-to-Point Road Transport'} />
                <ViewField label="Tracking / GPS" value={<span className="text-emerald-600 font-semibold">Live GPS Updates Included</span>} />
            </div>
        </div>
    );
};
