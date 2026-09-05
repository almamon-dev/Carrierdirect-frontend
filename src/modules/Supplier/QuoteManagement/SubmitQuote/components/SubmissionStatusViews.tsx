import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { QuoteRequest } from '../../data/quoteRequestsData';

export { QuoteSubmittedSuccessDrawer } from './QuoteSubmittedSuccessDrawer';

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
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 shadow-2xs rounded-[3px] p-6 max-w-md w-full text-center">
                <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-[3px] flex items-center justify-center mx-auto mb-3 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 size={24} />
                </div>
                <Badge variant="success" className="mb-2 rounded-[3px] text-xs">Proposal Submitted</Badge>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Quote Submitted Successfully</h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Your offer of <span className="font-bold text-slate-800 dark:text-slate-200">€ {totalOffer}</span> for request <span className="font-semibold text-slate-700 dark:text-slate-300">{requestDetails.id}</span> has been sent to <strong className="text-slate-800 dark:text-slate-200">{requestDetails.customer}</strong>.
                </p>
                
                <div className="bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-[3px] p-3 mb-4 text-left space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                        <span>Route:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{requestDetails.pickup} → {requestDetails.delivery}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Est. Net Payout:</span>
                        <span className="font-bold text-emerald-600">€ {netPayout}</span>
                    </div>
                </div>

                <div className="flex gap-2.5">
                    <Button 
                        variant="outline" 
                        className="flex-1 text-xs h-8.5 rounded-[3px] cursor-pointer" 
                        onClick={() => navigate('/supplier/quotes/requests')}
                    >
                        <ArrowLeft size={13} className="mr-1" /> Back to Requests
                    </Button>
                    <Button 
                        variant="primary" 
                        className="flex-1 text-xs h-8.5 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer" 
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
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 shadow-2xs rounded-[3px] p-6 max-w-md w-full text-center">
                <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-[3px] flex items-center justify-center mx-auto mb-3 border border-slate-200 dark:border-slate-700">
                    <XCircle size={24} />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Request Declined</h2>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    You have declined request <span className="font-semibold text-slate-700 dark:text-slate-300">{requestDetails.id}</span>.
                </p>
                <Button 
                    variant="primary" 
                    className="w-full text-xs h-8.5 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer" 
                    onClick={() => navigate('/supplier/quotes/requests')}
                >
                    Back to Quote Requests
                </Button>
            </div>
        </div>
    );
};
