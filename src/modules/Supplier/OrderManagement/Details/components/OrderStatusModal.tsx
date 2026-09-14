import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import { X, RefreshCw, Loader2 } from 'lucide-react';

interface OrderStatusModalProps {
    isOpen: boolean;
    orderId: string;
    newStatus: string;
    onStatusChange: (status: any) => Promise<void> | void;
    onSave?: () => void;
    onClose: () => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
    isOpen,
    orderId,
    newStatus,
    onStatusChange,
    onClose,
}) => {
    const [selectedStatus, setSelectedStatus] = useState(newStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await onStatusChange(selectedStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                            <RefreshCw size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Update Shipment Progress</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Order Ref: <strong className="font-mono text-slate-700 dark:text-slate-200">{orderId}</strong></p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 cursor-pointer disabled:opacity-50"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                <div className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Current Lifecycle Step</FormLabel>
                    <Select 
                        value={selectedStatus} 
                        onChange={(val) => setSelectedStatus(typeof val === 'object' && val?.target ? val.target.value : val)} 
                        showSearch={false} 
                        disabled={isSubmitting}
                        className="text-xs"
                        options={[
                            { id: 'confirmed', name: 'Step 1: Order Confirmed' },
                            { id: 'driver_assigned', name: 'Step 2: Driver & Vehicle Assigned' },
                            { id: 'picked_up', name: 'Step 3: Goods Picked Up' },
                            { id: 'in_transit', name: 'Step 4: In Transit (On Highway)' },
                            { id: 'arrived', name: 'Step 5: Arrived at Destination' },
                            { id: 'delivered', name: 'Step 6: Delivered (Ready for POD)' },
                            { id: 'completed', name: 'Step 7: Order Completed' },
                        ]}
                    />
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="rounded-[4px] text-xs cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        disabled={isSubmitting}
                        className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer rounded-[4px] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                        onClick={handleSave}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Updating Status...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw size={13} />
                                <span>Update Status</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default OrderStatusModal;
