import React from 'react';
import { MapPin } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField } from '../components/ViewField';

interface ViewLocationsProps {
    formData: any;
}

export const ViewLocations: React.FC<ViewLocationsProps> = ({ formData }) => {
    return (
        <div className="space-y-2.5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                <TabHeader title="Location Information" icon={MapPin} />

                {/* Pickup Info */}
                <div className="col-span-1 md:col-span-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-1">
                    <h3 className="text-xs font-bold text-[#ff4a1f] uppercase tracking-wider mb-2.5 flex items-center gap-1.5 select-none">
                        <MapPin size={14} /> Pickup Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                        <ViewField label="Company Name" value={formData.pickupCompany} />
                        <ViewField label="Contact Person" value={formData.pickupContactName} />
                        <ViewField label="Phone Number" value={formData.pickupPhone} isLink linkHref={`tel:${formData.pickupPhone}`} />
                        <ViewField label="Email" value={formData.pickupEmail} isLink linkHref={`mailto:${formData.pickupEmail}`} />
                        <ViewField label="Country" value={formData.pickupCountry} />
                        <ViewField label="State/Division" value={formData.pickupState} />
                        <ViewField label="City" value={formData.pickupCity} />
                        <ViewField label="ZIP Code" value={formData.pickupZip} />
                        <ViewField label="Pickup Address" colSpan value={formData.pickupAddress} />
                        <ViewField label="Map Location URL" colSpan value={formData.pickupMapUrl} isLink linkHref={formData.pickupMapUrl} />
                        <ViewField label="Pickup Instructions" colSpan value={<span className="whitespace-pre-wrap">{formData.pickupInstructions}</span>} />
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="col-span-1 md:col-span-2 pt-1">
                    <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 select-none">
                        <MapPin size={14} /> Delivery Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                        <ViewField label="Company Name" value={formData.deliveryCompany} />
                        <ViewField label="Contact Person" value={formData.deliveryContactName} />
                        <ViewField label="Phone Number" value={formData.deliveryPhone} isLink linkHref={`tel:${formData.deliveryPhone}`} />
                        <ViewField label="Email" value={formData.deliveryEmail} isLink linkHref={`mailto:${formData.deliveryEmail}`} />
                        <ViewField label="Country" value={formData.deliveryCountry} />
                        <ViewField label="State/Division" value={formData.deliveryState} />
                        <ViewField label="City" value={formData.deliveryCity} />
                        <ViewField label="ZIP Code" value={formData.deliveryZip} />
                        <ViewField label="Delivery Address" colSpan value={formData.deliveryAddress} />
                        <ViewField label="Map Location URL" colSpan value={formData.deliveryMapUrl} isLink linkHref={formData.deliveryMapUrl} />
                        <ViewField label="Delivery Instructions" colSpan value={<span className="whitespace-pre-wrap">{formData.deliveryInstructions}</span>} />
                    </div>
                </div>
            </div>
        </div>
    );
};
