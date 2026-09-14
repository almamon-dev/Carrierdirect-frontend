import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { ChevronLeft, RotateCcw, Printer, FileText, Loader2 } from 'lucide-react';

export default function CustomerOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            const cleanId = id.replace(/^ORD-0*/i, '');
            apiClient
                .get(`/customer/orders/${cleanId || id}`)
                .then((res) => {
                    const data = res.data?.data || res.data;
                    setOrderData(data);
                })
                .catch((err) => {
                    console.error('Failed to fetch order details:', err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="p-12 flex items-center justify-center text-slate-500 gap-2 min-h-screen">
                <Loader2 size={24} className="animate-spin text-[#ff4a1f]" />
                <span>Loading order details...</span>
            </div>
        );
    }

    const order = orderData || {};
    const paymentStatus = order.payment_status || 'Unpaid';
    const isPaid = String(paymentStatus).toLowerCase() === 'paid';
    const isEscrow = String(paymentStatus).toLowerCase().includes('escrow');

    return (
        <div
    className="p-4 md:p-6 bg-slate-50 dark:bg-[#12161c] min-h-screen">
            <div className="mx-auto">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="h-9 px-3">
                        <ChevronLeft size={16} /> Back
                    </Button>
                    <div className="flex-grow">
                        <div>
                            <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-0.5">Order Details</h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">View and manage the details of your specific order.</p>
                        </div>
                    </div>
                    
                    <Button 
                        variant="primary" 
                        className="h-9 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs font-semibold flex items-center gap-1.5"
                        onClick={() => navigate('/customer/quotes/create/new', { state: { repeatData: order } })}
                    >
                        <RotateCcw size={16} /> Repeat Order
                    </Button>
                    <Button variant="outline" className="h-9 px-4 bg-white dark:bg-[#1e2329] text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 shadow-xs hover:bg-slate-50 font-medium">
                        <Printer size={16} className="mr-1.5" /> Print
                    </Button>
                    <Button variant="outline" className="h-9 px-4 bg-white dark:bg-[#1e2329] text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 shadow-xs hover:bg-slate-50 font-medium">
                        <FileText size={16} className="mr-1.5" /> Download Invoice
                    </Button>
                </div>

                <div
    className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs rounded-lg">
                    {/* Header */}
                    <div
    className="flex flex-col md:flex-row justify-between items-center p-5 bg-slate-50/80 dark:bg-slate-800/40 gap-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-base tracking-tight">Order Details : <span className="text-slate-600 dark:text-slate-400 font-bold">{order.order_id || order.order_number || `ORD-${order.id}`}</span></div>
                        <div className="flex items-center gap-2">
                            <Badge variant="info" className="font-semibold px-2.5 py-1">{order.status || 'Confirmed'}</Badge>
                            <Badge 
                                variant={isPaid ? 'success' : isEscrow ? 'secondary' : 'warning'} 
                                className="font-semibold px-2.5 py-1 flex items-center gap-1.5"
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : isEscrow ? 'bg-slate-400' : 'bg-amber-500'}`}></div> 
                                {paymentStatus}
                            </Badge>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="flex flex-col xl:flex-row">
                        <div className="flex-1 p-4 md:p-5">
                            {/* TOP ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {/* Supplier Information */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">Supplier Info</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Supplier name</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{order.supplier_name || order.supplier?.company_name || order.supplier?.name || 'N/A'}</span>

                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Supplier ID</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{order.supplier?.id ? `SUP-${str_pad(order.supplier.id, 4)}` : 'N/A'}</span>

                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Email</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{order.supplier?.email || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Pickup & Delivery Info */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">Shipment Info</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Origin</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{order.pickup_address || 'N/A'}</span>

                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Destination</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{order.delivery_address || 'N/A'}</span>

                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Vehicle</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{order.vehicle || order.vehicle_type || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Payment Breakdown */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">Payment Breakdown</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Total Amount</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-bold text-emerald-600 dark:text-emerald-400 text-right">{order.amount || order.total_amount_formatted || `€ ${order.total_amount || 0}`}</span>

                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Payment Status</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-semibold text-right">{paymentStatus}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function str_pad(n: any, width: number) {
    return String(n).padStart(width, '0');
}
