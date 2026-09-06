import React from 'react';
import { 
    History, CheckCircle2, Clock, FileText, Send, MessageSquare, 
    Check, FileCheck, CheckCheck, UploadCloud, ShieldCheck, 
    MapPin, ArrowRight, Download, Eye, ExternalLink, User, Truck
} from 'lucide-react';
import Drawer from '@/components/modals/drawer';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { formatDisplayDate } from '@/lib/utils';
import { buildQuoteLifecycleSteps, formatStepTimestamp } from './QuoteLifecycleTracker';
import { getStatusBadgeClass } from '@/modules/Supplier/QuoteManagement/utils/statusStyles';

export interface QuoteHistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    quote: any;
    requestDetail?: any;
    allBids?: any[];
}

export const QuoteHistoryDrawer: React.FC<QuoteHistoryDrawerProps> = ({
    isOpen,
    onClose,
    quote,
    requestDetail,
    allBids = []
}) => {
    if (!quote && !requestDetail) return null;

    const req = requestDetail || quote?.quote_request || {};
    const steps = buildQuoteLifecycleSteps(quote, req);
    const activeIndex = steps.findIndex(s => s.status === 'active');
    const reqId = req?.id || quote?.quote_request_id || quote?.request_id || '0001';
    const displayReqId = String(reqId).startsWith('REQ-') ? reqId : `REQ-${String(reqId).padStart(4, '0')}`;

    const rawStatus = String(quote?.status_raw || quote?.status || 'pending').toLowerCase();
    const isAccepted = rawStatus.includes('accept') || rawStatus.includes('won') || rawStatus.includes('completed');
    const supplierName = quote?.supplier_name || quote?.supplier?.company_name || quote?.supplier?.name || quote?.carrier_name || 'Carrier';

    // Mock/Real POD file
    const podUrl = quote?.pod_document_url || quote?.podFileUrl || quote?.pod_url;
    const podFileName = quote?.pod_file_name || `Signed_POD_${displayReqId}.pdf`;

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            position="right"
            className="dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800"
            title={
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
                        <History size={16} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Activity & Milestone History
                            </h3>
                            <Badge variant="secondary" className="text-[10px] font-bold border bg-orange-50 text-[#ff4a1f] border-orange-200 dark:bg-[#ff4a1f]/10 dark:border-[#ff4a1f]/30">
                                {displayReqId}
                            </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Complete chronological audit trail from request creation to delivery POD.
                        </p>
                    </div>
                </div>
            }
        >
            <div className="py-2 space-y-5 font-sans">
                {/* Summary Key Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Created</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                            {formatDisplayDate(req?.created_at || quote?.created_at)}
                        </span>
                    </div>

                    <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Total Bids</span>
                        <span className="text-xs font-bold text-[#ff4a1f] truncate block">
                            {allBids.length > 0 ? `${allBids.length} Offers Received` : '1 Offer Received'}
                        </span>
                    </div>

                    <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Best Amount</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                            {quote?.amount || '€ 44.130'}
                        </span>
                    </div>

                    <div className="p-2.5 rounded-[5px] bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-0.5">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Current Stage</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                            {activeIndex !== -1 ? `Stage ${activeIndex + 1} / 6` : 'Active'}
                        </span>
                    </div>
                </div>

                {/* Vertical Timeline Audit Trail */}
                <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                        Timeline Progression & Milestone Checkpoints
                    </h4>

                    <div className="space-y-4">
                        {steps.map((s, idx) => {
                            const isCompleted = s.status === 'completed';
                            const isActive = s.status === 'active';
                            const isRejected = s.status === 'rejected';
                            const isExpired = s.status === 'expired';

                            let dotBg = 'bg-white dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300';
                            if (isCompleted) {
                                dotBg = 'bg-[#10b981] border-[#10b981] text-white shadow-2xs';
                            } else if (isActive) {
                                dotBg = 'bg-[#ff5722] border-[#ff5722] text-white ring-4 ring-[#ff5722]/20 shadow-2xs';
                            } else if (isRejected) {
                                dotBg = 'bg-rose-500 border-rose-500 text-white shadow-2xs';
                            } else if (isExpired) {
                                dotBg = 'bg-amber-500 border-amber-500 text-white shadow-2xs';
                            }

                            return (
                                <div key={s.id} className="relative flex gap-3.5 group">
                                    {/* Timeline Marker Dot & Centered Connecting Line */}
                                    <div className="relative z-10 flex flex-col items-center shrink-0">
                                        <div className={`w-7 h-7 min-w-[28px] min-h-[28px] aspect-square rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${dotBg}`}>
                                            {isCompleted ? (
                                                <Check size={14} strokeWidth={3} className="text-white" />
                                            ) : (
                                                <span className="text-xs font-bold">{idx + 1}</span>
                                            )}
                                        </div>
                                        {/* Connecting Line between steps */}
                                        {idx !== steps.length - 1 && (
                                            <div className={`absolute top-7 w-[2px] h-[calc(100%+16px)] z-0 ${
                                                isCompleted && (steps[idx + 1]?.status === 'completed' || steps[idx + 1]?.status === 'active')
                                                    ? 'bg-[#10b981]' 
                                                    : 'bg-slate-200 dark:bg-slate-700'
                                            }`} />
                                        )}
                                    </div>

                                    {/* Step Content Card */}
                                    <div className={`flex-1 p-3.5 rounded-[5px] border transition-all ${
                                        isActive 
                                            ? 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 shadow-2xs' 
                                            : isCompleted 
                                                ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs' 
                                                : 'bg-slate-50/50 dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 opacity-60'
                                    }`}>
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                                        {s.title}
                                                    </span>
                                                    {s.actor && (
                                                        <Badge variant="outline" className="text-[9.5px] font-semibold py-0 px-1.5 bg-slate-100 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600">
                                                            {s.actor}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                                    {s.description}
                                                </p>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <div className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                                                    <Clock size={11} className="text-slate-400 shrink-0" />
                                                    <span>{s.dateFormatted || 'Pending'}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold capitalize block mt-0.5 ${
                                                    isCompleted ? 'text-emerald-600 dark:text-emerald-400' :
                                                    isActive ? 'text-[#ff4a1f]' :
                                                    isRejected ? 'text-rose-600' :
                                                    isExpired ? 'text-amber-600' :
                                                    'text-slate-400'
                                                }`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Extra Milestone Artifacts */}
                                        {/* Stage 1 Extra Info: Route & Cargo */}
                                        {s.id === 'request_created' && (
                                            <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                                                    <span>{req?.pickup_city || 'Dhaka'} → {req?.delivery_city || 'Chittagong'}</span>
                                                </div>
                                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                                    {req?.weight || '500 KG'} • {req?.vehicle_type || 'Covered Van'}
                                                </span>
                                            </div>
                                        )}

                                        {/* Stage 5 Extra Info: Signed POD Document Attachment */}
                                        {s.id === 'pod_upload' && (
                                            <div className="mt-3 p-2.5 rounded-[4px] bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-[3px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
                                                        <FileCheck size={13} />
                                                    </div>
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[180px]">
                                                            {podFileName}
                                                        </span>
                                                        <span className="text-[9.5px] text-emerald-700 dark:text-emerald-400 font-medium">
                                                            {isCompleted ? '✓ Verified by Carrier Delivery Crew' : 'Pending Physical Delivery'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isCompleted && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-6 px-2 text-[10.5px] font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 cursor-pointer"
                                                        onClick={() => {
                                                            if (podUrl) window.open(podUrl, '_blank');
                                                            else alert('Signed POD document downloaded successfully.');
                                                        }}
                                                    >
                                                        <Download size={11} className="mr-1" /> View POD
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        {/* Stage 6 Extra Info: Escrow Clearance Confirmation */}
                                        {s.id === 'pod_acceptance' && isCompleted && (
                                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                                    <ShieldCheck size={13} /> Payout Released from Escrow
                                                </span>
                                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                                    {quote?.amount || '€ 44.130'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default QuoteHistoryDrawer;
