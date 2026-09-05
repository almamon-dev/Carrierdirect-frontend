import React from 'react';
import { User, Building, Mail, Phone, Calendar, Clock, DollarSign, Settings, ShieldAlert, FileText } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import Badge from '@/components/ui/badge';
import { ViewField, SectionHeader } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { QuoteData } from '../types/quoteViewDetailTypes';
import { formatDisplayDate } from '@/lib/utils';

interface ViewQuoteRequesterProps {
    quote: QuoteData;
    requestDetail: any;
}

export const ViewQuoteRequester: React.FC<ViewQuoteRequesterProps> = ({ quote, requestDetail }) => {
    const req = requestDetail || quote.quote_request || {};
    const customer = req.customer || req.user || {};

    const requesterName = customer.name || req.customer_name || req.user_name || req.contact_name || 'Customer / Consignor';
    const requesterCompany = customer.company_name || req.company_name || 'Direct Shipper';
    const requesterEmail = customer.email || req.customer_email || req.email || 'confidential@customer.com';
    const requesterPhone = customer.phone || req.customer_phone || req.phone || '+49 30 1234567';
    
    const targetBudget = req.budget || req.target_budget || req.price;
    const priority = req.priority || 'Normal';
    const createdDate = req.created_at || req.date;

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <TabHeader title="Request & Requester Details" icon={User} />

                <SectionHeader title="Requester / Shipper Contact" icon={User} />
                <ViewField
                    label="Requester Name"
                    value={
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                            <span>{requesterName}</span>
                            <Badge variant="secondary" className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                Shipper
                            </Badge>
                        </div>
                    }
                />
                <ViewField label="Company Name" value={requesterCompany} />
                <ViewField label="Contact Email" value={requesterEmail} />
                <ViewField label="Contact Phone" value={requesterPhone} />

                <SectionHeader title="Quote Request Information" icon={FileText} />
                <ViewField
                    label="Request Reference"
                    value={
                        <span className="font-mono text-[#ff4a1f] font-bold bg-orange-50 dark:bg-[#ff4a1f]/10 px-2 py-0.5 rounded-[5px] text-xs">
                            REQ-{String(req.id || quote.quote_request_id || '0000').replace(/^REQ-/, '')}
                        </span>
                    }
                />
                <ViewField label="Request Title" value={req.request_title || req.title || 'Transportation Quote Request'} />
                <ViewField
                    label="Request Priority"
                    value={
                        <span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold ${
                            priority.toLowerCase() === 'urgent'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                : priority.toLowerCase() === 'high'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                            {priority}
                        </span>
                    }
                />
                <ViewField label="Date Submitted" value={createdDate ? formatDisplayDate(createdDate) : 'Recent Request'} />

                <SectionHeader title="Requester Budget & Preferences" icon={Settings} />
                <ViewField
                    label="Target Budget"
                    value={
                        targetBudget ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                € {Number(String(targetBudget).replace(/[^0-9.]/g, '') || 0).toFixed(2)}
                            </span>
                        ) : (
                            <span className="text-slate-500 font-medium">Open for supplier bidding</span>
                        )
                    }
                />
                <ViewField
                    label="Price Negotiation"
                    value={
                        req.allow_negotiation ?? true ? (
                            <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-[5px] text-xs font-semibold">
                                Allowed (Counter-offers enabled)
                            </span>
                        ) : (
                            <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-[5px] text-xs font-medium">
                                Fixed Price Only
                            </span>
                        )
                    }
                />
                <ViewField
                    label="Bidding Mode"
                    value={
                        req.receive_multiple_bids ?? true ? (
                            <span className="text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-[5px] text-xs font-semibold">
                                Competitive Bidding (Multiple carriers)
                            </span>
                        ) : (
                            <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-[5px] text-xs font-medium">
                                Direct Exclusive Carrier
                            </span>
                        )
                    }
                />
                <ViewField
                    label="Auto Expire"
                    value={req.auto_expire || req.expires_at || 'Auto-closes on offer acceptance'}
                />

                {(req.cargo_description || req.additional_notes) && (
                    <>
                        <SectionHeader title="Shipper Instructions & Notes" icon={ShieldAlert} />
                        <ViewField
                            label="Special Notes"
                            colSpan
                            value={req.additional_notes || req.cargo_description}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
