import React from 'react';
import { History } from 'lucide-react';
import Drawer from '@/components/modals/drawer';
import Badge from '@/components/ui/badge';
import { buildQuoteLifecycleSteps } from './QuoteLifecycleTracker';
import { QuoteHistoryDrawerSummaryCards } from './QuoteHistoryDrawerSummaryCards';
import { QuoteHistoryDrawerStepItem } from './QuoteHistoryDrawerStepItem';

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
    const steps = buildQuoteLifecycleSteps(quote, req, allBids);
    const activeIndex = steps.findIndex(s => s.status === 'active');
    const reqId = req?.id || quote?.quote_request_id || quote?.request_id || '0001';
    const displayReqId = String(reqId).startsWith('REQ-') ? reqId : `REQ-${String(reqId).padStart(4, '0')}`;

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
                <QuoteHistoryDrawerSummaryCards
                    createdAt={req?.created_at || quote?.created_at}
                    allBidsCount={allBids.length}
                    quoteAmount={quote?.amount}
                    activeIndex={activeIndex}
                />

                {/* Vertical Timeline Audit Trail */}
                <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                        Timeline Progression & Milestone Checkpoints
                    </h4>

                    <div className="space-y-4">
                        {steps.map((s, idx) => {
                            const isLast = idx === steps.length - 1;
                            const isCompletedNext = steps[idx + 1]?.status === 'completed' || steps[idx + 1]?.status === 'active';

                            return (
                                <QuoteHistoryDrawerStepItem
                                    key={s.id}
                                    s={s}
                                    idx={idx}
                                    isLast={isLast}
                                    isCompletedNext={isCompletedNext}
                                    req={req}
                                    quote={quote}
                                    podUrl={podUrl}
                                    podFileName={podFileName}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </Drawer>
    );
};

export default QuoteHistoryDrawer;
