import React, { useState } from 'react';
import { 
    CheckCircle2, Clock, FileText, Send, MessageSquare, 
    Check, Truck, History, AlertCircle, XCircle, 
    FileCheck, CheckCheck, UploadCloud, LucideIcon
} from 'lucide-react';
import Badge from '@/components/ui/badge';
import { formatDisplayDate } from '@/lib/utils';
import { QuoteHistoryDrawer } from './QuoteHistoryDrawer';

export interface QuoteLifecycleStep {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    timestamp?: string;
    dateFormatted?: string;
    status: 'completed' | 'active' | 'pending' | 'rejected' | 'expired';
    icon: LucideIcon | React.ComponentType<any>;
    actor?: string;
}

export interface QuoteLifecycleTrackerProps {
    quote: any;
    requestDetail?: any;
    className?: string;
    compact?: boolean;
    allBids?: any[];
}

export const formatStepTimestamp = (timestamp?: any): string => {
    if (!timestamp) return '';
    try {
        const d = new Date(timestamp);
        if (isNaN(d.getTime())) return String(timestamp);
        return d.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return String(timestamp);
    }
};

export const buildQuoteLifecycleSteps = (quote: any, requestDetail?: any): QuoteLifecycleStep[] => {
    const rawStatus = String(quote?.status_raw || quote?.status || 'pending').toLowerCase().trim();
    const isNegotiating = quote?.revision_status === 'pending' || rawStatus.includes('negotiat');
    const isAccepted = rawStatus.includes('accept') || rawStatus.includes('won') || rawStatus.includes('completed') || rawStatus.includes('approved') || rawStatus.includes('pod');
    const isRejected = rawStatus.includes('reject') || rawStatus.includes('decline') || rawStatus.includes('cancel');
    const isExpired = rawStatus.includes('expire') || (quote?.isExpired ?? false);

    // POD & Order Completion check
    const podRaw = String(quote?.pod_status || quote?.podStatus || quote?.pod || '').toLowerCase();
    const isPodUploaded = podRaw.includes('review') || podRaw.includes('approve') || podRaw.includes('upload') || Boolean(quote?.pod_document_url || quote?.podFileUrl || quote?.pod_uploaded_at || quote?.isPodUploaded || rawStatus.includes('completed') || rawStatus.includes('pod accepted'));
    const isPodAccepted = podRaw.includes('approve') || rawStatus === 'completed' || rawStatus === 'pod accepted' || Boolean(quote?.isPodAccepted || quote?.pod_accepted_at);

    const reqCreated = quote?.quote_request?.created_at || requestDetail?.created_at || quote?.created_at;
    const quoteSubmitted = quote?.submitted_at || quote?.received_at || quote?.created_at || quote?.date;
    const negotiationTime = quote?.negotiated_at || quote?.updated_at || (isNegotiating ? quote?.updated_at : undefined);
    const acceptedTime = quote?.accepted_at || quote?.awarded_at || (isAccepted ? (quote?.updated_at || quote?.date) : undefined);
    const podUploadTime = quote?.pod_uploaded_at || quote?.order?.pod_uploaded_at || (isPodUploaded ? quote?.updated_at : undefined);
    const completedTime = quote?.completed_at || quote?.pod_accepted_at || quote?.order?.delivered_at || (isPodAccepted ? quote?.updated_at : undefined);

    const supplierName = quote?.supplier_name || quote?.supplier?.company_name || quote?.supplier?.name || quote?.carrier_name || 'Carrier';

    // Step 1: Request Posted
    const step1: QuoteLifecycleStep = {
        id: 'request_created',
        title: 'Request Created',
        subtitle: 'By Customer',
        description: 'Quote specifications posted and broadcasted to verified carriers.',
        timestamp: reqCreated,
        dateFormatted: formatStepTimestamp(reqCreated) || formatDisplayDate(reqCreated),
        status: 'completed',
        icon: FileText,
        actor: 'Customer'
    };

    // Step 2: Quote Submitted
    const step2: QuoteLifecycleStep = {
        id: 'quote_submitted',
        title: 'Quote Received',
        subtitle: `By ${supplierName}`,
        description: `Carrier submitted price offer (${quote?.amount || '—'}) and estimated transit.`,
        timestamp: quoteSubmitted,
        dateFormatted: formatStepTimestamp(quoteSubmitted) || formatDisplayDate(quoteSubmitted),
        status: 'completed',
        icon: Send,
        actor: supplierName
    };

    // Step 3: Negotiation & Review
    let step3Status: QuoteLifecycleStep['status'] = 'pending';
    if (isNegotiating) {
        step3Status = 'active';
    } else if (negotiationTime && (isAccepted || isRejected)) {
        step3Status = 'completed';
    } else if (isAccepted || isRejected || isExpired) {
        step3Status = 'completed';
    }

    const step3: QuoteLifecycleStep = {
        id: 'negotiation',
        title: isNegotiating ? 'Negotiation Active' : 'Terms & Review',
        subtitle: isNegotiating ? 'Counter Offer Sent' : 'Direct Offer Review',
        description: isNegotiating 
            ? 'Parties are currently discussing pricing, terms or cargo details.' 
            : 'Pricing, payment terms and freight specifications reviewed.',
        timestamp: negotiationTime || quoteSubmitted,
        dateFormatted: isNegotiating 
            ? formatStepTimestamp(negotiationTime || new Date()) 
            : (formatStepTimestamp(negotiationTime) || 'Completed'),
        status: step3Status,
        icon: MessageSquare,
        actor: 'Customer & Carrier'
    };

    // Step 4: Decision & Booking
    let step4Status: QuoteLifecycleStep['status'] = 'pending';
    let step4Title = 'Award & Booking';
    let step4Subtitle = 'Awaiting Decision';
    let step4Desc = 'Customer selects the winning quote and confirms booking agreement.';

    if (isAccepted) {
        step4Status = 'completed';
        step4Title = 'Accepted & Booked';
        step4Subtitle = 'Offer Approved';
        step4Desc = `Quote accepted at ${quote?.amount || 'standard rate'}. Order booking generated in Escrow.`;
    } else if (isRejected) {
        step4Status = 'rejected';
        step4Title = 'Offer Declined';
        step4Subtitle = 'Quote Rejected';
        step4Desc = 'Quote was declined by the customer or closed without booking.';
    } else if (isExpired) {
        step4Status = 'expired';
        step4Title = 'Quote Expired';
        step4Subtitle = 'Validity Passed';
        step4Desc = 'The validity window for this quotation has expired.';
    } else if (!isNegotiating) {
        step4Status = 'active';
        step4Subtitle = 'Decision Pending';
    }

    const step4: QuoteLifecycleStep = {
        id: 'decision',
        title: step4Title,
        subtitle: step4Subtitle,
        description: step4Desc,
        timestamp: acceptedTime || (isRejected ? quote?.updated_at : undefined),
        dateFormatted: isAccepted 
            ? (formatStepTimestamp(acceptedTime) || formatDisplayDate(acceptedTime)) 
            : (isRejected || isExpired ? formatStepTimestamp(quote?.updated_at) : 'In Progress'),
        status: step4Status,
        icon: isAccepted ? Check : isRejected ? XCircle : isExpired ? AlertCircle : Check,
        actor: 'Customer'
    };

    // Step 5: Supplier / Driver POD Upload
    let step5Status: QuoteLifecycleStep['status'] = 'pending';
    let step5Subtitle = 'Pending Delivery';
    let step5Desc = 'Carrier fleet / driver offloads shipment and uploads signed Proof of Delivery (POD Challan).';

    if (isAccepted) {
        if (isPodUploaded || isPodAccepted) {
            step5Status = 'completed';
            step5Subtitle = 'POD Uploaded';
            step5Desc = 'Carrier employee / driver submitted signed delivery receipt & challan.';
        } else {
            step5Status = 'active';
            step5Subtitle = 'In Transit / Awaiting POD';
            step5Desc = 'Shipment is in transit. Carrier will upload POD upon arrival at destination.';
        }
    }

    const step5: QuoteLifecycleStep = {
        id: 'pod_upload',
        title: 'POD Uploaded',
        subtitle: step5Subtitle,
        description: step5Desc,
        timestamp: podUploadTime,
        dateFormatted: isPodUploaded || isPodAccepted
            ? (formatStepTimestamp(podUploadTime) || 'Uploaded')
            : step5Status === 'active'
                ? 'In Transit'
                : 'Pending Booking',
        status: step5Status,
        icon: UploadCloud,
        actor: 'Supplier / Driver'
    };

    // Step 6: Customer POD Acceptance & Order Completion
    let step6Status: QuoteLifecycleStep['status'] = 'pending';
    let step6Subtitle = 'Pending POD Review';
    let step6Desc = 'Customer inspects delivery receipt, confirms POD acceptance, and Escrow funds are released.';

    if (isPodAccepted) {
        step6Status = 'completed';
        step6Subtitle = 'Completed & Paid';
        step6Desc = 'Customer confirmed POD acceptance. Order completed and payout released to carrier.';
    } else if (isPodUploaded) {
        step6Status = 'active';
        step6Subtitle = 'Action Required';
        step6Desc = 'POD receipt uploaded by carrier. Customer must review and accept POD to complete order.';
    }

    const step6: QuoteLifecycleStep = {
        id: 'pod_acceptance',
        title: 'POD Accepted & Complete',
        subtitle: step6Subtitle,
        description: step6Desc,
        timestamp: completedTime,
        dateFormatted: step6Status === 'completed'
            ? (formatStepTimestamp(completedTime) || 'Order Finished')
            : step6Status === 'active'
                ? 'Review & Accept POD'
                : 'Pending POD Upload',
        status: step6Status,
        icon: CheckCheck,
        actor: 'Customer'
    };

    return [step1, step2, step3, step4, step5, step6];
};

export const QuoteLifecycleTracker: React.FC<QuoteLifecycleTrackerProps> = ({
    quote,
    requestDetail,
    className = '',
    compact = false,
    allBids = []
}) => {
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const steps = buildQuoteLifecycleSteps(quote, requestDetail);

    // Identify active step index
    const activeIndex = steps.findIndex(s => s.status === 'active');
    const currentStepText = activeIndex !== -1 
        ? `Stage ${activeIndex + 1} of ${steps.length}: ${steps[activeIndex].title}` 
        : steps.some(s => s.status === 'rejected') 
            ? 'Quote Rejected' 
            : steps.some(s => s.status === 'expired')
                ? 'Quote Expired'
                : 'All Stages Completed';

    return (
        <>
            <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[5px] shadow-2xs overflow-hidden transition-all ${className}`}>
                {/* Header with Title, Active Stage Badge, and View Full History Button */}
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <History size={12} />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Quote Lifecycle & Milestone Progression
                        </h3>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-bold border bg-orange-50 text-[#ff4a1f] border-orange-200 dark:bg-[#ff4a1f]/10 dark:border-[#ff4a1f]/30">
                            {currentStepText}
                        </Badge>
                        <button
                            type="button"
                            onClick={() => setIsHistoryDrawerOpen(true)}
                            className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] flex items-center gap-1.5 cursor-pointer transition-colors px-2 py-0.5 rounded-[4px] border border-slate-300/80 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs"
                        >
                            <History size={11} className="text-[#ff4a1f]" />
                            <span>View Full History</span>
                        </button>
                    </div>
                </div>

                {/* Horizontal Step Progression Bar */}
                <div className="p-3.5 md:p-4 overflow-x-auto">
                    <div className="min-w-[700px] flex items-start justify-between relative">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isLast = idx === steps.length - 1;
                            const isCompleted = step.status === 'completed';
                            const isActive = step.status === 'active';
                            const isRejected = step.status === 'rejected';
                            const isExpired = step.status === 'expired';

                            let circleColor = 'border-[1.5px] border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300';

                            if (isCompleted) {
                                circleColor = 'bg-[#10b981] border-[#10b981] text-white shadow-2xs';
                            } else if (isActive) {
                                circleColor = 'bg-[#ff5722] border-[#ff5722] text-white ring-4 ring-[#ff5722]/20 shadow-sm';
                            } else if (isRejected) {
                                circleColor = 'bg-rose-500 border-rose-500 text-white shadow-2xs';
                            } else if (isExpired) {
                                circleColor = 'bg-amber-500 border-amber-500 text-white shadow-2xs';
                            }

                            return (
                                <div key={step.id} className="flex-1 flex flex-col items-center relative text-center group">
                                    {/* Connecting line to next step */}
                                    {!isLast && (
                                        <div 
                                            className={`absolute top-3.5 left-1/2 right-[-50%] h-[2px] z-0 transition-colors ${
                                                isCompleted && (steps[idx + 1].status === 'completed' || steps[idx + 1].status === 'active')
                                                    ? 'bg-[#10b981]'
                                                    : 'bg-slate-200 dark:bg-slate-800'
                                            }`} 
                                        />
                                    )}

                                    {/* Step Circle Icon matching reference design */}
                                    <div className={`w-7 h-7 min-w-[28px] min-h-[28px] aspect-square rounded-full flex items-center justify-center z-10 font-bold transition-all ${circleColor}`}>
                                        {isCompleted ? (
                                            <Check size={14} strokeWidth={3} className="text-white" />
                                        ) : (
                                            <span className="text-xs font-bold">{idx + 1}</span>
                                        )}
                                    </div>

                                    {/* Step Title & Subtitle */}
                                    <div className="mt-2 space-y-0.5 max-w-[115px]">
                                        <h4 className={`text-[11px] font-bold tracking-tight ${
                                            isActive 
                                                ? 'text-[#ff4a1f]' 
                                                : isCompleted 
                                                    ? 'text-slate-900 dark:text-slate-100' 
                                                    : isRejected 
                                                        ? 'text-rose-600'
                                                        : isExpired
                                                            ? 'text-amber-600'
                                                            : 'text-slate-400 dark:text-slate-500'
                                        }`}>
                                            {step.title}
                                        </h4>

                                        {step.subtitle && (
                                            <span className="text-[9.5px] text-slate-500 dark:text-slate-400 block font-medium">
                                                {step.subtitle}
                                            </span>
                                        )}

                                        {/* Date & Time Timestamp */}
                                        {step.dateFormatted && (
                                            <div className={`mt-0.5 inline-flex items-center gap-1 text-[9.5px] font-semibold px-1 py-0.2 rounded-[3px] ${
                                                isCompleted 
                                                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' 
                                                : isActive 
                                                    ? 'bg-orange-50 text-[#ff4a1f] dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40' 
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }`}>
                                                <Clock size={9} className="shrink-0 text-slate-400" />
                                                <span className="whitespace-nowrap">{step.dateFormatted}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Slide-over Full Activity History Drawer */}
            <QuoteHistoryDrawer
                isOpen={isHistoryDrawerOpen}
                onClose={() => setIsHistoryDrawerOpen(false)}
                quote={quote}
                requestDetail={requestDetail}
                allBids={allBids}
            />
        </>
    );
};

export default QuoteLifecycleTracker;
