import React from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, Sparkles, Clock, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    bolData?: any;
}

export const DigitalBOLModal: React.FC<Props> = ({ isOpen, onClose, bolData }) => {
    if (!isOpen) return null;

    const orderNumber = bolData?.orderNumber || bolData?.order_number || '#ORD-AENG-10001';

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" 
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-[#181d24] rounded-lg border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with close button */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <FileText size={14} className="text-[#FF4A1F]" />
                        <span>Shipment {orderNumber}</span>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 font-sans">
                    {/* Icon with animated glow */}
                    <div className="relative w-14 h-14 mx-auto">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center border border-orange-200/80 dark:border-orange-900/50 shadow-sm">
                            <FileText size={26} />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF4A1F] text-white flex items-center justify-center shadow-sm">
                            <Sparkles size={11} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF4A1F] dark:bg-orange-950/50 dark:text-orange-400 border border-orange-200/80 dark:border-orange-900/60">
                            <Clock size={12} />
                            <span>Coming Soon</span>
                        </span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                            Digital Bill of Lading (eBOL)
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Paperless electronic BOL, digital chain of custody signatures, and dock QR gate check-in are under development.
                        </p>
                    </div>

                    {/* Feature Roadmap Teasers */}
                    <div className="bg-slate-50 dark:bg-[#13171d] rounded-lg border border-slate-200/80 dark:border-slate-800 p-3.5 text-left space-y-2 text-xs">
                        <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                            Upcoming eBOL Capabilities
                        </div>

                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11.5px]">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span>3-Way Digital Signatures (Shipper, Driver, Receiver)</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11.5px]">
                            <QrCode size={14} className="text-blue-500 shrink-0" />
                            <span>Fast-Pass QR Code for warehouse gate check-in</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11.5px]">
                            <ShieldCheck size={14} className="text-purple-500 shrink-0" />
                            <span>Tamper-proof certified PDF export & audit trail</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 bg-slate-50/50 dark:bg-[#14181f] border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button 
                        onClick={onClose} 
                        className="w-full bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold py-2 rounded-md shadow-sm transition-all cursor-pointer"
                    >
                        Got It
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DigitalBOLModal;
