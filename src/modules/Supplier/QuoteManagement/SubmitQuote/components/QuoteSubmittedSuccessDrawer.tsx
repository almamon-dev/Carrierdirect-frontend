import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    ArrowLeft, 
    ChevronRight, 
    MapPin, 
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

                <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-[3px] p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <FileText size={13} className="text-[#ff4a1f]" /> Settlement Breakdown
                        </span>
                        <span className="text-[11px] text-slate-400">EUR</span>
                    </div>

                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-400 font-normal">
                            <span>Quoted Gross Freight:</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">€ {totalOffer}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 dark:text-slate-400 font-normal">
                            <span>Platform Escrow & Admin Fee (5%):</span>
                            <span className="text-slate-600 dark:text-slate-300">-€ {feeNum.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-baseline">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Guaranteed Carrier Payout:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">€ {netPayout}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#14181f] border border-slate-200 dark:border-slate-800 rounded-[3px] p-3.5 space-y-2 text-xs">
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

                <div className="flex items-center gap-2.5 p-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-[3px] text-xs text-sky-800 dark:text-sky-300">
                    <BellRing size={15} className="shrink-0 text-sky-600 dark:text-sky-400" />
                    <span>Real-time notifications dispatched to both your dashboard and the customer's portal.</span>
                </div>
            </div>
        </Drawer>
    );
};
