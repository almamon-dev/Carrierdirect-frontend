import React from 'react';
import { MapPin, Navigation, Truck, Package, Layers, Shield, FileText } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteRouteCargoProps {
    quote: QuoteData;
    requestDetail: any;
}

export const ViewQuoteRouteCargo: React.FC<ViewQuoteRouteCargoProps> = ({ quote, requestDetail }) => {
    const req = requestDetail || quote.quote_request || {};
    const originCity = req.pickup_city || (req.pickup_address ? req.pickup_address.split(',')[0] : (req.pickup || 'Dhaka'));
    const destCity = req.delivery_city || (req.delivery_address ? req.delivery_address.split(',')[0] : (req.delivery || 'Chittagong'));
    const cargoItems = req.cargo_items || req.cargoItems || req.items || [];

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <TabHeader title="Route, Cargo & Shipping Specifications" icon={Truck} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
                {/* Pickup Origin Details */}
                <SectionHeader title="Pickup Origin Details" icon={MapPin} />
                <ViewField label="Pickup Address" colSpan value={req.pickup_address || req.pickup || 'Pickup address specified in request'} />
                <ViewField label="Pickup City" value={originCity} />
                <ViewField label="Postal / ZIP" value={req.pickup_zip || req.pickup_postal_code || '1000'} />
                <ViewField label="Pickup Date" value={quote.pickup_date || req.pickup_date || 'Standard Pickup Schedule'} />
                <ViewField label="Pickup Time Slot" value={req.pickup_time || req.pickup_time_slot || '08:00 - 17:00'} />

                {/* Delivery Destination Details */}
                <SectionHeader title="Delivery Destination Details" icon={MapPin} />
                <ViewField label="Delivery Address" colSpan value={req.delivery_address || req.delivery || 'Delivery destination specified in request'} />
                <ViewField label="Delivery City" value={destCity} />
                <ViewField label="Postal / ZIP" value={req.delivery_zip || req.delivery_postal_code || '4000'} />
                <ViewField label="Est. Delivery Date" value={quote.delivery_date || req.delivery_date || 'Estimated Arrival on Schedule'} />
                <ViewField label="Delivery Time Slot" value={req.delivery_time || req.delivery_time_slot || '08:00 - 17:00'} />

                {/* Cargo & Equipment Section */}
                <SectionHeader title="Vehicle & Cargo Specifications" icon={Package} />
                <ViewField label="Vehicle Type" value={<span className="font-bold text-slate-900 dark:text-slate-100">{req.vehicle_type || 'Covered Van (20ft)'}</span>} />
                <ViewField label="Shipment Type" value={req.shipment_type || 'Full Truckload (FTL)'} />
                <ViewField label="Load / Cargo Type" value={req.load_type || req.type_of_pallets || 'Palletized Cargo'} />
                <ViewField label="Total Weight" value={<span className="font-bold text-slate-900 dark:text-slate-100">{req.weight ? `${req.weight} KG` : (req.total_weight || '500 KG')}</span>} />
                <ViewField label="Total Volume" value={req.total_volume ? `${req.total_volume} m³` : '2.50 m³'} />
                <ViewField label="Total Quantity" value={`${req.items_count || (cargoItems.length > 0 ? cargoItems.length : 1)} Units / Pallets`} />

                {/* Handling & Special Instructions */}
                <SectionHeader title="Handling & Special Instructions" icon={Shield} />
                <ViewField
                    label="Handling Services"
                    colSpan
                    value={
                        req.handling_services ? (
                            Array.isArray(req.handling_services) ? (
                                <div className="flex flex-wrap gap-1">
                                    {req.handling_services.map((s: string, idx: number) => (
                                        <span key={idx} className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[5px]">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            ) : req.handling_services
                        ) : 'Tail-lift assistance, Inside delivery'
                    }
                />
                
                {(req.additional_notes || req.cargo_description || quote.notes) && (
                    <ViewField
                        label="Special Notes"
                        colSpan
                        value={
                            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-[5px] text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                {req.additional_notes || req.cargo_description || quote.notes}
                            </div>
                        }
                    />
                )}
            </div>
        </div>
    );
};
