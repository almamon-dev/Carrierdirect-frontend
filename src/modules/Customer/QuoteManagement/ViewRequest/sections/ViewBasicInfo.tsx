import React from 'react';
import { FileText, Activity } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';

interface ViewBasicInfoProps {
    formData: any;
    cleanId?: string;
}

export const ViewBasicInfo: React.FC<ViewBasicInfoProps> = ({ formData, cleanId }) => {
    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Basic Information" icon={FileText} />

                <ViewField label="Request Title" colSpan value={formData.requestTitle} />
                <ViewField label="Request Number" value={<span className="font-mono text-brand font-bold bg-brand-light px-2 py-0.5 rounded text-xs">REQ-{cleanId || 'NEW'}</span>} />
                <ViewField label="Priority" value={<span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700 border border-amber-200 w-fit">{formData.priority}</span>} />
                <ViewField label="Shipment Type" value={formData.shipmentType} />
                <ViewField label="Service Type" value={formData.serviceType} />

                <SectionHeader title="Schedule" icon={Activity} />
                <ViewField label="Pickup Date" value={formData.pickupDate} />
                <ViewField label="Pickup Time" value={formData.pickupTime} />
                <ViewField label="Delivery Date" value={formData.deliveryDate} />
                <ViewField label="Delivery Time" value={formData.deliveryTime} />
                <ViewField label="Transit Time (Days)" value={formData.expectedTransitTime} />
            </div>
        </div>
    );
};
