import React from 'react';
import { ArrowLeft, Download, Upload, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { SupplierOrder, OrderStatus } from '../../types/order.types';

interface OrderHeaderProps {
    order: SupplierOrder;
    currentStatus: OrderStatus;
    onOpenStatusModal: () => void;
    onOpenUploadModal: () => void;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
    order,
    currentStatus,
    onOpenStatusModal,
    onOpenUploadModal,
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
                <button 
                    onClick={() => navigate('/supplier/orders/active-jobs')} 
                    className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 flex items-center transition-colors font-medium mb-1 cursor-pointer"
                >
                    <ArrowLeft size={13} className="mr-1" /> Back to Active Jobs
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Order Details: {order.id}
                    </h1>
                    <Badge 
                        variant="secondary" 
                        className={
                            currentStatus === 'In Transit' ? 'bg-blue-50 text-blue-700 font-semibold' :
                            currentStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                            currentStatus === 'Scheduled' ? 'bg-amber-50 text-amber-700 font-semibold' :
                            'bg-slate-100 text-slate-700 font-semibold'
                        }
                    >
                        {currentStatus}
                    </Badge>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 text-xs font-semibold cursor-pointer"
                    onClick={() => alert(`Downloading Invoice & Specs for ${order.id}...`)}
                >
                    <Download size={13} className="mr-1.5" /> PDF Invoice
                </Button>

                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 text-xs font-semibold cursor-pointer"
                    onClick={onOpenUploadModal}
                >
                    <Upload size={13} className="mr-1.5" /> Upload POD
                </Button>

                <Button 
                    variant="primary" 
                    size="sm" 
                    className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer"
                    onClick={onOpenStatusModal}
                >
                    <RefreshCw size={13} className="mr-1.5" /> Update Status
                </Button>
            </div>
        </div>
    );
};
