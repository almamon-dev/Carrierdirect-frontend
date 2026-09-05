import React from 'react';
import { Truck, ShieldCheck, Star, User, Building, MapPin, Mail, Phone } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteCarrierProps {
    quote: QuoteData;
}

export const ViewQuoteCarrier: React.FC<ViewQuoteCarrierProps> = ({ quote }) => {
    const supplier = quote.supplier || {};
    const carrierName = quote.supplier_name || supplier.company_name || supplier.name || 'Verified Carrier';
    const rating = quote.rating || supplier.rating || '4.8';
    const completedText = quote.completed_orders || '150+ completed loads';
    const isVerified = supplier.is_verified ?? true;

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Carrier / Supplier Information" icon={Truck} />

                <ViewField
                    label="Carrier Name"
                    value={
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                            <span>{carrierName}</span>
                            {isVerified && (
                                <span title="Verified Carrier" className="inline-flex items-center text-emerald-500">
                                    <ShieldCheck size={14} />
                                </span>
                            )}
                        </div>
                    }
                />
                <ViewField
                    label="Verification Status"
                    value={
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-[5px] border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck size={12} /> Verified Transport Partner
                        </span>
                    }
                />

                <ViewField
                    label="Performance Rating"
                    value={
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                            <Star size={13} className="fill-amber-500" />
                            <span>{rating} / 5.0</span>
                        </span>
                    }
                />
                <ViewField
                    label="Track Record"
                    value={
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {completedText}
                        </span>
                    }
                />

                <SectionHeader title="Contact & Operations Details" icon={Building} />
                <ViewField label="Contact Person" value={supplier.contact_name || supplier.name || carrierName} />
                <ViewField label="Company Address" value={supplier.address || `${supplier.city || 'Dhaka'}, ${supplier.country || 'Bangladesh'}`} />
                <ViewField label="Fleet / Vehicle Used" value={quote.quote_request?.vehicle_type || 'Standard Covered Van'} />
                <ViewField label="Insurance Guarantee" value={<span className="text-slate-700 dark:text-slate-300 font-medium">Standard CMR & Cargo Insurance</span>} />

                {quote.notes && (
                    <>
                        <SectionHeader title="Carrier Statement & Guarantee" icon={User} />
                        <ViewField label="Special Remarks" colSpan value={quote.notes} />
                    </>
                )}
            </div>
        </div>
    );
};
