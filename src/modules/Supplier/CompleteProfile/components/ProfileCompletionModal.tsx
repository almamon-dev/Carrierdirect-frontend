import React from 'react';
import { 
    CheckCircle2, 
    Truck, 
    MessageSquare, 
    DollarSign, 
    ArrowRight, 
    ShieldCheck, 
    Bell
} from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import LogoBlack from '../../../../assets/Images/LogoBlack.png';
import LogoWhite from '../../../../assets/Images/Logo.png';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToDashboard: () => void;
    onGoToQuotes?: () => void;
    companyName?: string;
}

export default function ProfileCompletionModal({
    isOpen,
    onClose,
    onGoToDashboard,
    onGoToQuotes,
    companyName,
}: ProfileCompletionModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            showCloseButton={false}
            closeOnOutsideClick={false}
            className="max-w-4xl p-0 overflow-hidden border-2 border-gray-200 dark:border-[#384150] bg-white dark:bg-[#181a20] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
        >
            <div className="flex flex-col md:flex-row w-full font-sans antialiased min-h-[460px]">
                
                {/* ── Left Side: Brand & Visual (Matching web/register) ── */}
                <div className="md:w-5/12 bg-[#f8fafc] dark:bg-[#12161c] flex flex-col items-center justify-center p-8 sm:p-10 relative border-b md:border-b-0 md:border-r border-gray-100 dark:border-[#384150]">
                    {/* Subtle dot pattern background */}
                    <div 
                        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" 
                        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                    />

                    <div className="relative z-10 flex flex-col items-center text-center w-full">
                        <img 
                            src={LogoBlack} 
                            alt="CarrierDirect" 
                            className="w-full max-w-[220px] object-contain dark:hidden mb-6" 
                        />
                        <img 
                            src={LogoWhite} 
                            alt="CarrierDirect" 
                            className="w-full max-w-[220px] object-contain hidden dark:block mb-6" 
                        />

                        {/* Success Badge */}
                        <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mb-3">
                            <ShieldCheck className="w-7 h-7" />
                        </div>

                        <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight">
                            Verified Supplier Account
                        </h3>
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-[220px]">
                            Your business credentials have been approved & registered.
                        </p>
                    </div>
                </div>

                {/* ── Right Side: Compact & Minimal Content ── */}
                <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#181a20]">
                    <div>
                        {/* Header */}
                        <div className="mb-5">
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FF4A1F] bg-orange-50 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-md mb-2">
                                <CheckCircle2 size={13} /> Setup Completed
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Congratulations{companyName ? `, ${companyName}` : ''}! 🎉
                            </h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                                Your profile is active. You can now access live customer requests and start placing bids.
                            </p>
                        </div>

                        {/* Minimal Feature List */}
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-[#1e2329] rounded-lg border border-gray-200/80 dark:border-[#2f3642]">
                                <div className="p-1.5 bg-orange-100/70 dark:bg-orange-950/50 text-[#FF4A1F] rounded-md shrink-0">
                                    <Truck size={15} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Live Quote Requests
                                    </h4>
                                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                        Access customer moving and freight orders in real time.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-[#1e2329] rounded-lg border border-gray-200/80 dark:border-[#2f3642]">
                                <div className="p-1.5 bg-blue-100/70 dark:bg-blue-950/50 text-blue-600 rounded-md shrink-0">
                                    <MessageSquare size={15} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Direct Bidding & Negotiation
                                    </h4>
                                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                        Chat directly with verified customers and submit your rates.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-[#1e2329] rounded-lg border border-gray-200/80 dark:border-[#2f3642]">
                                <div className="p-1.5 bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-600 rounded-md shrink-0">
                                    <DollarSign size={15} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Automated Invoicing & Payouts
                                    </h4>
                                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                        Generate invoices and receive direct secure bank payouts.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-[#1e2329] rounded-lg border border-gray-200/80 dark:border-[#2f3642]">
                                <div className="p-1.5 bg-purple-100/70 dark:bg-purple-950/50 text-purple-600 rounded-md shrink-0">
                                    <Bell size={15} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Database Notification Active
                                    </h4>
                                    <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                        In-app alerts are enabled for matching customer loads.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                        {onGoToQuotes && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onGoToQuotes}
                                className="w-full sm:w-1/2 h-10 text-xs font-semibold border-gray-200 dark:border-[#384150] hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                Browse Live Requests
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="primary"
                            onClick={onGoToDashboard}
                            className={`w-full ${onGoToQuotes ? 'sm:w-1/2' : ''} h-10 text-xs sm:text-sm font-semibold bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-md shadow-2xs flex items-center justify-center gap-2 cursor-pointer`}
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight size={15} />
                        </Button>
                    </div>
                </div>

            </div>
        </Modal>
    );
}
