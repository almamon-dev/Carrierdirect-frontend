import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import { X, RefreshCw, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OrderStatusModalProps {
    isOpen: boolean;
    orderId: string;
    newStatus: string;
    onStatusChange: (status: any) => Promise<void> | void;
    onSave?: () => void;
    onClose: () => void;
}

const STEPS = [
    { id: 'confirmed',       label: 'Order Confirmed',            icon: '✅' },
    { id: 'driver_assigned', label: 'Driver & Vehicle Assigned',  icon: '🚗' },
    { id: 'picked_up',       label: 'Goods Picked Up',            icon: '📦' },
    { id: 'in_transit',      label: 'In Transit (On Highway)',    icon: '🛣️' },
    { id: 'arrived',         label: 'Arrived at Destination',     icon: '📍' },
    { id: 'delivered',       label: 'Delivered (Ready for POD)',  icon: '🏁' },
    { id: 'completed',       label: 'Order Completed',            icon: '🎉' },
];

const normalizeStatusToStepId = (raw: string): string => {
    const s = String(raw || '').toLowerCase().trim().replace(/_/g, ' ');
    if (s === 'pending' || s === 'confirmed' || s === 'scheduled' || s === 'new' || s === 'order confirmed') {
        return 'confirmed';
    }
    if (s === 'driver assigned' || s === 'assigned' || s === 'dispatched') {
        return 'driver_assigned';
    }
    if (s === 'picked up' || s === 'cargo loaded' || s === 'goods picked up') {
        return 'picked_up';
    }
    if (s === 'in transit' || s === 'on the way' || s === 'in progress') {
        return 'in_transit';
    }
    if (s === 'arrived' || s === 'destination reached' || s === 'out for delivery') {
        return 'arrived';
    }
    if (s === 'delivered' || s === 'pod uploaded' || s === 'pod review' || s === 'pod pending') {
        return 'delivered';
    }
    if (s === 'completed' || s === 'pod accepted') {
        return 'completed';
    }
    return 'confirmed';
};

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
    isOpen,
    orderId,
    newStatus,
    onStatusChange,
    onClose,
}) => {
    const normalizedCurrent = normalizeStatusToStepId(newStatus);
    const [selectedStatus, setSelectedStatus] = useState<string>(normalizedCurrent);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setSelectedStatus(normalizeStatusToStepId(newStatus));
    }, [newStatus, isOpen]);

    if (!isOpen) return null;

    const currentIdx = STEPS.findIndex((s) => s.id === normalizedCurrent);

    const handleSave = async () => {
        if (!selectedStatus || selectedStatus === normalizedCurrent) return;
        setIsSubmitting(true);
        try {
            await onStatusChange(selectedStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 font-sans">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                            <RefreshCw size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Update Shipment Status</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Order: <strong className="font-mono text-slate-700 dark:text-slate-200">{orderId}</strong></p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 cursor-pointer disabled:opacity-50">
                        <X size={16} />
                    </button>
                </div>

                {/* Step Buttons */}
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-0.5">
                    {STEPS.map((step, idx) => {
                        const isCurrent = step.id === normalizedCurrent;
                        const isPastCompleted = currentIdx > -1 && idx < currentIdx;
                        const isSelectedNew = selectedStatus === step.id && !isCurrent;

                        return (
                            <button
                                key={step.id}
                                type="button"
                                disabled={isSubmitting}
                                onClick={() => setSelectedStatus(step.id)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[5px] border text-left transition-all cursor-pointer disabled:opacity-50 ${
                                    isSelectedNew
                                        ? 'bg-[#ff4a1f]/10 border-[#ff4a1f] shadow-xs dark:bg-[#ff4a1f]/15 dark:border-[#ff4a1f]'
                                        : isCurrent
                                        ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800'
                                        : isPastCompleted
                                        ? 'bg-slate-50/70 border-slate-200/80 dark:bg-slate-800/30 dark:border-slate-700/50'
                                        : 'bg-white border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                            >
                                <span className="text-sm w-5 text-center shrink-0">
                                    {isPastCompleted ? '✅' : step.icon}
                                </span>
                                
                                <span className={`flex-1 text-[11.5px] font-semibold ${
                                    isSelectedNew
                                        ? 'text-[#ff4a1f] font-bold'
                                        : isCurrent
                                        ? 'text-emerald-700 dark:text-emerald-300 font-bold'
                                        : isPastCompleted
                                        ? 'text-slate-600 dark:text-slate-400 font-medium'
                                        : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                    {idx + 1}. {step.label}
                                </span>

                                {/* Badges */}
                                {isCurrent && (
                                    <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded shrink-0">
                                        Current
                                    </span>
                                )}

                                {isPastCompleted && !isCurrent && (
                                    <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1">
                                        <CheckCircle2 size={10} className="text-slate-400" /> Completed
                                    </span>
                                )}

                                {isSelectedNew && (
                                    <span className="text-[9px] font-bold text-[#ff4a1f] bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1">
                                        Selected <ArrowRight size={10} />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="outline" size="sm" disabled={isSubmitting} onClick={onClose}
                        className="rounded-[4px] text-xs cursor-pointer">
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" disabled={isSubmitting || selectedStatus === normalizedCurrent}
                        className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer rounded-[4px] text-xs font-semibold flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                        onClick={handleSave}>
                        {isSubmitting ? (
                            <><Loader2 size={13} className="animate-spin" /><span>Updating...</span></>
                        ) : (
                            <><RefreshCw size={13} /><span>Confirm Update</span></>
                        )}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OrderStatusModal;
