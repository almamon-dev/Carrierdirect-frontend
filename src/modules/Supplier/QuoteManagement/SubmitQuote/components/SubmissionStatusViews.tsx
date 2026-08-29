/**
 * Submission Status Views & Drawer Component
 * Renders the slide-in Success Drawer Modal and fallback view for submitted and declined quote requests.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    XCircle, 
    ArrowLeft, 
    ChevronRight, 
    MapPin, 
    Clock, 
    ShieldCheck, 
    DollarSign, 
    Truck, 
    FileText, 
    BellRing 
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Drawer from '@/components/modals/drawer';
import { QuoteRequest } from '../../data/quoteRequestsData';

interface SubmittedSuccessDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    requestDetails: QuoteRequest;
    totalOffer: string;
}

export const QuoteSubmittedSuccessDrawer: React.FC<SubmittedSuccessDrawerProps> = ({
    isOpen,
    onClose,
    requestDetails,
    totalOffer,
}) => {
    const navigate = useNavigate();
    const totalNum = parseFloat(totalOffer) || 0;
    const feeNum = totalNum * 0.05;
    const netPayout = (totalNum * 0.95).toFixed(2);

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            position="right"
            size="lg"
            title={
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            Quotation Submitted
                        </h3>
                        <p className="text-[11px] text-slate-500 font-normal">
                            RFQ Reference: {requestDetails.id}
                        </p>
                    </div>
                </div>
            }
            footer={
                <div className="flex items-center gap-2.5 w-full">
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 text-xs h-9 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer" 
                        onClick={() => navigate('/supplier/quotes/requests')}
                    >
                        <ArrowLeft size={13} className="mr-1.5" /> All Requests
                    </Button>
                    <Button 
                        variant="primary" 
                        size="sm"
                        className="flex-1 text-xs h-9 font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs cursor-pointer" 
                        onClick={() => navigate('/supplier/quotes/negotiation')}
                    >
                        Open Negotiation <ChevronRight size={13} className="ml-1" />
                    </Button>
                </div>
            }
        >
            <div className="space-y-4 py-1 text-slate-700 dark:text-slate-300">
                {/* Hero Confirmation Banner */}
                <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-md p-4 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <CheckCircle2 size={22} />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Offer Delivered to Shipper</span>
                            <Badge variant="success" className="text-[10px] py-0 px-1.5">Live</Badge>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Your formal commercial proposal of <strong className="text-slate-900 dark:text-white">€ {totalOffer}</strong> was registered and transmitted to <span className="font-semibold text-slate-800 dark:text-slate-200">{requestDetails.customer}</span>.
                        </p>
                    </div>
                </div>

                {/* Commercial Settlement Receipt */}
                <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-md p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                            <FileText size={13} className="text-[#ff4a1f]" /> Settlement Breakdown
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">EUR (EUR)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Quoted Gross Freight:</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">€ {totalOffer}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>Platform Escrow & Admin Fee (5%):</span>
                            <span className="text-slate-600 dark:text-slate-300">-€ {feeNum.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-baseline">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Guaranteed Carrier Payout:</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">€ {netPayout}</span>
                        </div>
                    </div>
                </div>

                {/* Freight Route & Cargo Specs Summary */}
                <div className="bg-slate-50 dark:bg-[#14181f] border border-slate-200 dark:border-slate-800 rounded-md p-3.5 space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                        <MapPin size={14} className="text-[#ff4a1f] shrink-0 mt-0.5" />
                        <span>{requestDetails.pickup} → {requestDetails.delivery}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                        <span>Distance: {requestDetails.distance || '—'}</span>
                        <span>•</span>
                        <span>Vehicle: {requestDetails.vehicleType || 'Covered Van'}</span>
                        <span>•</span>
                        <span>Shipper: {requestDetails.customer}</span>
                    </div>
                </div>

                {/* Notification Transmission Notice */}
                <div className="flex items-center gap-2.5 p-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-md text-xs text-sky-800 dark:text-sky-300">
                    <BellRing size={15} className="shrink-0 text-sky-600 dark:text-sky-400" />
                    <span>Real-time notifications dispatched to both your dashboard and the customer's portal.</span>
                </div>
            </div>
        </Drawer>
    );
};

interface SubmittedSuccessViewProps {
    requestDetails: QuoteRequest;
    totalOffer: string;
}

export const SubmittedSuccessView: React.FC<SubmittedSuccessViewProps> = ({
    requestDetails,
    totalOffer,
}) => {
    const navigate = useNavigate();
    const netPayout = (parseFloat(totalOffer) * 0.95).toFixed(2);

    return (
        <div className="p-4 md:p-6 w-full min-h-[80vh] flex items-center justify-center font-sans">
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 shadow-2xs rounded-lg p-8 max-w-md w-full text-center">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={28} />
                </div>
                <Badge variant="success" className="mb-2">Proposal Submitted</Badge>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Quote Submitted Successfully</h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    Your offer of <span className="font-bold text-slate-800 dark:text-slate-200">€ {totalOffer}</span> for request <span className="font-semibold text-slate-700 dark:text-slate-300">{requestDetails.id}</span> has been sent to <strong className="text-slate-800 dark:text-slate-200">{requestDetails.customer}</strong>.
                </p>
                
                <div className="bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-md p-3.5 mb-5 text-left space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                        <span>Route:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{requestDetails.pickup} → {requestDetails.delivery}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Est. Net Payout:</span>
                        <span className="font-bold text-emerald-600">€ {netPayout}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        className="flex-1 text-xs h-9 cursor-pointer" 
                        onClick={() => navigate('/supplier/quotes/requests')}
                    >
                        <ArrowLeft size={13} className="mr-1" /> Back to Requests
                    </Button>
                    <Button 
                        variant="primary" 
                        className="flex-1 text-xs h-9 bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer" 
                        onClick={() => navigate('/supplier/quotes/negotiation')}
                    >
                        View Negotiation <ChevronRight size={13} className="ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface DeclinedViewProps {
    requestDetails: QuoteRequest;
}

export const DeclinedView: React.FC<DeclinedViewProps> = ({ requestDetails }) => {
    const navigate = useNavigate();

    return (
        <div className="p-4 md:p-6 w-full min-h-[80vh] flex items-center justify-center font-sans">
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 shadow-2xs rounded-lg p-8 max-w-md w-full text-center">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200 dark:border-slate-700">
                    <XCircle size={28} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Request Declined</h2>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    You have declined request <span className="font-semibold text-slate-700 dark:text-slate-300">{requestDetails.id}</span>.
                </p>
                <Button 
                    variant="primary" 
                    className="w-full text-xs h-9 bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer" 
                    onClick={() => navigate('/supplier/quotes/requests')}
                >
                    Back to Quote Requests
                </Button>
            </div>
        </div>
    );
};
