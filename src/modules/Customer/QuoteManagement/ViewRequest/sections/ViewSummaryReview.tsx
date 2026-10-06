import React from 'react';
import { CheckCircle2, MapPin, Truck, Euro } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';
import { formatCurrency } from '@/lib/utils';

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
                <div className="p-4 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <MapPin size={15} className="text-slate-500" /> Route Overview
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{formData.pickupCity || '-'} → {formData.deliveryCity || '-'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{formData.pickupDate} - {formData.deliveryDate}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Truck size={15} className="text-slate-500" /> Vehicle & Cargo
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{formData.vehicleType || '-'} • {formData.loadType || '-'}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{formData.weight} KG • {servicesCount} Services Selected</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <Euro size={15} className="text-slate-500" /> Pricing & Budget
                    </div>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(formData.budget, formData.currency)}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Auto Expire: {formData.autoExpire}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pt-2">
                <SectionHeader title="Verification Status" icon={CheckCircle2} />
                <ViewField label="Request Status" value={<span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded">Active / Published</span>} />
                <ViewField label="Reference ID" value={`REQ-${cleanId || 'NEW'}`} />
                <ViewField label="Carrier Bids" value="Awaiting Carrier Bids" />
                <ViewField label="Direct Negotiation" value={formData.allowNegotiation ? 'Open' : 'Closed'} />
            </div>
        </div>
    );
};

export default ViewSummaryReview;
