import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';

interface AcceptCheckoutSuccessModalProps {
    isOpen: boolean;
    quote: {
        id: string;
        supplier: string;
        totalAmount: number;
    };
}

export const AcceptCheckoutSuccessModal: React.FC<AcceptCheckoutSuccessModalProps> = ({ isOpen, quote }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1e2329] rounded-[5px] p-6 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-[5px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Carrier Booking Confirmed!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Quote <span className="font-bold text-slate-800 dark:text-slate-200">{quote.id}</span> with <span className="font-bold text-slate-800 dark:text-slate-200">{quote.supplier}</span> has been locked and dispatch tracking has started.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-[5px] border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Amount: €{quote.totalAmount.toLocaleString()}
                </div>
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="w-1/2 text-xs rounded-[5px]" onClick={() => navigate('/customer/quotes/received')}>
                        Back to Quotes
                    </Button>
                    <Button className="w-1/2 text-xs bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[5px]" onClick={() => navigate('/customer/orders')}>
                        <span>Go to Orders</span>
                        <ArrowRight size={14} className="ml-1" />
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
