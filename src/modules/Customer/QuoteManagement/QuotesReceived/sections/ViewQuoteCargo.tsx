import React from 'react';
import { Truck, Package, Layers, Shield } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteCargoProps {
    quote: QuoteData;
    requestDetail: any;
}

export const ViewQuoteCargo: React.FC<ViewQuoteCargoProps> = ({ quote, requestDetail }) => {
    const req = requestDetail || quote.quote_request || {};
    const cargoItems = req.cargo_items || req.cargoItems || req.items || [];

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Cargo & Vehicle Requirements" icon={Package} />

                <SectionHeader title="Vehicle & Equipment Requirements" icon={Truck} />
                <ViewField label="Vehicle Type" value={<span className="font-bold text-slate-900 dark:text-slate-100">{req.vehicle_type || 'Covered Van (20ft)'}</span>} />
                <ViewField label="Shipment Type" value={req.shipment_type || 'Full Truckload (FTL)'} />
                <ViewField label="Service Type" value={req.service_type || 'Standard Freight'} />
                <ViewField label="Loading Access" value={req.loading_access || 'Standard Loading Bay / Ramp'} />

                <SectionHeader title="Cargo Specifications" icon={Layers} />
                <ViewField label="Load / Cargo Type" value={req.load_type || req.type_of_pallets || 'Palletized Cargo'} />
                <ViewField label="Total Weight" value={<span className="font-bold text-slate-900 dark:text-slate-100">{req.weight ? `${req.weight} KG` : (req.total_weight || '500 KG')}</span>} />
                <ViewField label="Total Volume" value={req.total_volume ? `${req.total_volume} m³` : '2.50 m³'} />
                <ViewField label="Total Quantity" value={`${req.items_count || (cargoItems.length > 0 ? cargoItems.length : 1)} Units / Pallets`} />
                
                {req.cargo_description && (
                    <ViewField label="Cargo Description" colSpan value={req.cargo_description} />
                )}

                <SectionHeader title="Handling & Special Services" icon={Shield} />
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
            </div>
        </div>
    );
};
