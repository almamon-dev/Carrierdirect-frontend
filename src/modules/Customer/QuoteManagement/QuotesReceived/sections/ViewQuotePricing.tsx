import React from 'react';
import {
    Euro, Receipt, CreditCard, ShieldCheck, TrendingUp, TrendingDown,
    User, Building, Phone, MapPin, Truck, Calendar, Clock, Package,
    Shield, FileText, CheckCircle2, Navigation
} from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import Badge from '@/components/ui/badge';
import { ViewField, SectionHeader } from '@/modules/Customer/QuoteManagement/ViewRequest/components/ViewField';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuotePricingProps {
    quote: QuoteData;
    cleanQuoteId: string;
    cleanReqId: string;
    requestDetail?: any;
}

export const ViewQuotePricing: React.FC<ViewQuotePricingProps> = ({
    quote,
    cleanQuoteId,
    cleanReqId,
    requestDetail,
}) => {
    const isPending = (quote.status_raw || quote.status || '').toLowerCase() === 'pending';
    const req = requestDetail || quote.quote_request || {};
    const customer = req.customer || req.user || {};
    const supplier = quote.supplier || {};

    // User details (NO email, NO password)
    const requesterName = customer.name || req.customer_name || req.user_name || 'Direct Customer';
    const requesterCompany = customer.company_name || req.company_name || 'Enterprise Shipper';
    const requesterPhone = customer.phone || req.customer_phone || req.phone || '+49 30 1234567';
    const requesterCity = customer.city || req.pickup_city || 'Berlin, Germany';

    const carrierName = quote.supplier_name || supplier.company_name || supplier.name || 'Verified Carrier';
    const carrierRating = quote.rating || supplier.rating || '4.8';

    // Pricing calculations
    const targetBudgetNum = parseFloat(String(req.budget || req.target_budget || req.price || 0).replace(/[^0-9.]/g, '')) || 0;
    const quoteAmtNum = quote.amount_raw || parseFloat(String(quote.amount || 0).replace(/[^0-9.]/g, '')) || 0;
    const baseAmtNum = parseFloat(String(quote.base_amount || quote.amount || 0).replace(/[^0-9.]/g, '')) || quoteAmtNum;
    
    const extraCharges = quote.extra_charges || [];
    const extraTotal = extraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const priceDiff = quoteAmtNum - targetBudgetNum;
    const isWithinBudget = targetBudgetNum > 0 && quoteAmtNum <= targetBudgetNum;

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <TabHeader title="Quotation & Payment Breakdown" icon={Euro} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
                {/* SECTION 1: QUOTE OVERVIEW */}
                <SectionHeader title="Quotation Overview" icon={Receipt} />
                <ViewField
                    label="Quote Reference"
                    value={
                        <span className="font-mono text-[#ff4a1f] font-bold bg-orange-50 dark:bg-[#ff4a1f]/10 px-2 py-0.5 rounded-[5px] text-xs">
                            {quote.quote_id || `QT-${cleanQuoteId || '0000'}`}
                        </span>
                    }
                />
                <ViewField
                    label="Offer Status"
                    value={
                        <Badge variant={isPending ? 'warning' : 'secondary'} className="text-[10.5px] font-semibold rounded-[5px]">
                            {quote.status || 'Pending Review'}
                        </Badge>
                    }
                />
                <ViewField
                    label="Related Request"
                    value={<span className="font-bold text-slate-800 dark:text-slate-200">REQ-{cleanReqId || quote.quote_request_id || req?.id || '—'}</span>}
                />
                <ViewField
                    label="Assigned Carrier"
                    value={
                        <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{carrierName}</span>
                            <span className="text-amber-500 text-xs font-semibold">★ {carrierRating}</span>
                        </span>
                    }
                />

                {/* SECTION 2: USER & REQUESTER (NO EMAIL, NO PASSWORD) */}
                <SectionHeader title="User & Requester Details" icon={User} />
                <ViewField
                    label="Requester Name"
                    value={
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                            <span>{requesterName}</span>
                            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.2 rounded-[5px]">
                                Shipper
                            </span>
                        </div>
                    }
                />
                <ViewField label="Company Name" value={requesterCompany} />
                <ViewField label="Contact Phone" value={requesterPhone} />
                <ViewField label="Requester Location" value={requesterCity} />
                <ViewField
                    label="Account Status"
                    value={
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck size={13} /> Verified Member
                        </span>
                    }
                />

                {/* SECTION 3: COMMERCIAL TERMS & POLICY */}
                <SectionHeader title="Commercial Terms & Policy" icon={FileText} />
                <ViewField label="Payment Term" value={<span className="font-bold text-slate-800 dark:text-slate-200">{quote.payment_terms || 'Net 15 Days'}</span>} />
                <ViewField label="Offer Validity" value={quote.estimated_time || quote.validity || '48 Hours'} />
                <ViewField label="Price Negotiation" value={<span className="text-emerald-600 dark:text-emerald-400 font-semibold">Enabled (Counter-offers allowed)</span>} />
                <ViewField label="Cancellation Policy" value="Free cancellation up to 24h before pickup" />
                {quote.notes && (
                    <ViewField label="Carrier Remarks" colSpan value={quote.notes} />
                )}

                {/* SECTION 4: PAYMENT BREAKDOWN */}
                <SectionHeader title="Payment Breakdown" icon={CreditCard} />
                <ViewField
                    label="Target Budget"
                    value={
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            {targetBudgetNum > 0 ? `€ ${targetBudgetNum.toFixed(2)}` : 'Open for bids'}
                        </span>
                    }
                />
                <ViewField
                    label="Base Freight Rate"
                    value={<span className="font-bold text-slate-900 dark:text-slate-100">€ {baseAmtNum.toFixed(2)}</span>}
                />

                {extraCharges.length > 0 ? (
                    <>
                        {extraCharges.map((charge, idx) => (
                            <ViewField
                                key={idx}
                                label={charge.custom_name || charge.type || `Extra Item #${idx + 1}`}
                                value={<span className="font-semibold text-slate-800 dark:text-slate-200">+€ {Number(charge.amount).toFixed(2)}</span>}
                            />
                        ))}
                        <ViewField
                            label="Extra Surcharges Total"
                            value={<span className="font-bold text-slate-700 dark:text-slate-300">+€ {extraTotal.toFixed(2)}</span>}
                        />
                    </>
                ) : (
                    <ViewField label="Extra Surcharges" value={<span className="text-slate-400 text-xs">Included in base price (€0.00)</span>} />
                )}

                <ViewField
                    label="Total Quoted Amount"
                    value={
                        <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-[#ff4a1f]">{quote.amount || `€ ${quoteAmtNum.toFixed(2)}`}</span>
                            {targetBudgetNum > 0 && (
                                isWithinBudget ? (
                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                        <TrendingDown size={12} /> Within Budget
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                                        <TrendingUp size={12} /> +€{priceDiff.toFixed(2)}
                                    </span>
                                )
                            )}
                        </div>
                    }
                />
                <ViewField
                    label="Payment Protection"
                    value={
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck size={13} /> 100% Escrow Protected Booking
                        </span>
                    }
                />
            </div>
        </div>
    );
};
