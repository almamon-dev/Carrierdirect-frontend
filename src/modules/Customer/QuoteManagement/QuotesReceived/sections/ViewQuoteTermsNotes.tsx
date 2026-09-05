import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, CreditCard } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteTermsNotesProps {
    quote: QuoteData;
    requestDetail: any;
}

export const ViewQuoteTermsNotes: React.FC<ViewQuoteTermsNotesProps> = ({ quote, requestDetail }) => {
    const req = requestDetail || quote.quote_request || {};

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Terms, Remarks & Instructions" icon={FileText} />

                <SectionHeader title="Quote Terms & Policy" icon={CreditCard} />
                <ViewField label="Payment Term" value={<span className="font-bold text-slate-800 dark:text-slate-200">{quote.payment_terms || 'Net 15 Days'}</span>} />
                <ViewField label="Offer Validity" value={<span className="font-bold text-slate-800 dark:text-slate-200">{quote.estimated_time || quote.validity || '48 Hours'}</span>} />
                <ViewField label="Escrow Protection" value={<span className="text-emerald-600 font-semibold">100% Escrow Protected Booking</span>} />
                <ViewField label="Cancellation Policy" value="Free cancellation up to 24h prior to pickup" />

                <SectionHeader title="Carrier Commercial Remarks" icon={FileText} />
                <ViewField
                    label="Carrier Remarks"
                    colSpan
                    value={
                        quote.notes ? (
                            <div className="p-3 bg-slate-50 dark:bg-[#181d24] border border-slate-200/80 dark:border-slate-800 rounded-[5px] text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                                "{quote.notes}"
                            </div>
                        ) : 'No special carrier notes provided.'
                    }
                />

                <SectionHeader title="Customer Shipping Instructions" icon={ShieldAlert} />
                <ViewField
                    label="Shipping Instructions"
                    colSpan
                    value={
                        req.additional_notes || req.notes ? (
                            <div className="p-3 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/60 dark:border-orange-800/40 rounded-[5px] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                {req.additional_notes || req.notes}
                            </div>
                        ) : 'Standard transport and handling instructions specified in quote request.'
                    }
                />
            </div>
        </div>
    );
};
