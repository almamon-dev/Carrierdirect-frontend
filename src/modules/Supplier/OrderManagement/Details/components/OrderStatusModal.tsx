import React from 'react';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import { OrderStatus } from '../../types/order.types';

interface OrderStatusModalProps {
    isOpen: boolean;
    orderId: string;
    newStatus: OrderStatus;
    onStatusChange: (status: OrderStatus) => void;
    onSave: () => void;
    onClose: () => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
    isOpen,
    orderId,
    newStatus,
    onStatusChange,
    onSave,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#1e2329] rounded-lg max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Update Order Status ({orderId})</h3>
                <div>
                    <FormLabel className="text-xs">Select New Status</FormLabel>
                    <Select 
                        value={newStatus} 
                        onChange={(val) => onStatusChange(val as OrderStatus)} 
                        showSearch={false} 
                        className="text-xs"
                        options={[
                            { id: 'Scheduled', name: 'Scheduled' },
                            { id: 'Dispatched', name: 'Dispatched' },
                            { id: 'In Transit', name: 'In Transit' },
                            { id: 'Arrived', name: 'Arrived at Destination' },
                            { id: 'Delivered', name: 'Delivered' },
                            { id: 'Delayed', name: 'Delayed' },
                        ]}
                    />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer" onClick={onSave}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};
