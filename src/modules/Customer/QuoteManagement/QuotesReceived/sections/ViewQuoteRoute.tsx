import React from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteRouteProps {
    quote: QuoteData;
    requestDetail: any;
}

export const ViewQuoteRoute: React.FC<ViewQuoteRouteProps> = ({ quote, requestDetail }) => {
    const req = requestDetail || quote.quote_request || {};
    const originCity = req.pickup_city || (req.pickup_address ? req.pickup_address.split(',')[0] : (req.pickup || 'Dhaka'));
    const destCity = req.delivery_city || (req.delivery_address ? req.delivery_address.split(',')[0] : (req.delivery || 'Chittagong'));

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Pickup & Delivery Route" icon={MapPin} />

                <SectionHeader title="Pickup Origin Location" icon={MapPin} />
                <ViewField label="Pickup Address" colSpan value={req.pickup_address || req.pickup || 'Pickup address specified in request'} />
                <ViewField label="Pickup City" value={originCity} />
                <ViewField label="Postal / ZIP Code" value={req.pickup_zip || req.pickup_postal_code || '1000'} />
                <ViewField label="Pickup Date" value={quote.pickup_date || req.pickup_date || 'Standard Pickup Schedule'} />
                <ViewField label="Pickup Time Slot" value={req.pickup_time || req.pickup_time_slot || '08:00 - 17:00'} />

                <SectionHeader title="Delivery Destination Location" icon={MapPin} />
                <ViewField label="Delivery Address" colSpan value={req.delivery_address || req.delivery || 'Delivery address specified in request'} />
                <ViewField label="Delivery City" value={destCity} />
                <ViewField label="Postal / ZIP Code" value={req.delivery_zip || req.delivery_postal_code || '4000'} />
                <ViewField label="Est. Delivery Date" value={quote.delivery_date || req.delivery_date || 'Estimated Arrival on Schedule'} />
                <ViewField label="Delivery Time Slot" value={req.delivery_time || req.delivery_time_slot || '08:00 - 17:00'} />

                <SectionHeader title="Route & Transit Specifications" icon={Navigation} />
                <ViewField label="Est. Transit Time" value={<span className="font-bold text-slate-900 dark:text-slate-100">{quote.estimated_delivery || req.expected_transit_time || '48 Hours'}</span>} />
                <ViewField label="Estimated Distance" value={<span className="font-semibold text-slate-800 dark:text-slate-200">{req.distance ? `${req.distance} KM` : '245 KM'}</span>} />
                <ViewField label="Route Type" value="Direct Point-to-Point Transport" />
                <ViewField label="Tracking / GPS" value={<span className="text-emerald-600 font-semibold">Live GPS Updates Included</span>} />
            </div>
        </div>
    );
};
