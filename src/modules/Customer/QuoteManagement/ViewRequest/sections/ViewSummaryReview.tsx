import React from 'react';
import { CheckCircle2, MapPin, Truck, Euro } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';

interface ViewSummaryReviewProps {
    formData: any;
    cleanId?: string;
    servicesCount: number;
}

export const ViewSummaryReview: React.FC<ViewSummaryReviewProps> = ({ formData, cleanId, servicesCount }) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <TabHeader title="Summary & Specification Review" icon={CheckCircle2} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <MapPin size={15} className="text-slate-500" /> Route Overview
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{formData.pickupCity || '-'} → {formData.deliveryCity || '-'}</p>
                    <p className="text-[11px] text-slate-500">{formData.pickupDate} - {formData.deliveryDate}</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Truck size={15} className="text-slate-500" /> Vehicle & Cargo
                    </div>
                    <p className="text-xs font-semibold text-slate-900">{formData.vehicleType || '-'} • {formData.loadType || '-'}</p>
                    <p className="text-[11px] text-slate-500">{formData.weight} KG • {servicesCount} Services Selected</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Euro size={15} className="text-slate-500" /> Pricing & Budget
                    </div>
                    <p className="text-xs font-bold text-emerald-600">
                        {formData.currency} {Number(String(formData.budget).replace(/[^0-9.]/g, '') || 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-500">Auto Expire: {formData.autoExpire}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pt-2">
                <SectionHeader title="Verification Status" icon={CheckCircle2} />
                <ViewField label="Request Status" value={<span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">Active / Published</span>} />
                <ViewField label="Reference ID" value={`REQ-${cleanId || 'NEW'}`} />
                <ViewField label="Carrier Bids" value="Awaiting Carrier Bids" />
                <ViewField label="Direct Negotiation" value={formData.allowNegotiation ? 'Open' : 'Closed'} />
            </div>
        </div>
    );
};
