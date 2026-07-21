import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Printer, Download, User, Building2, FileText, ChevronLeft, Edit, X, Copy, Package, Truck, CreditCard, Banknote, ShieldAlert, Phone, Mail, CheckCircle2, Navigation } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

export default function OrderDetails() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const orderData = state?.orderData || {};

    return (
        <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
            <div className="mx-auto">
                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                    
                    {/* header title with back button and search */}
                    <div className="flex-grow">
                        <div className="mb-2">
                            <h1 className="text-[18px] font-bold text-slate-900 mb-1">Order Details</h1>
                            <p className="text-sm text-slate-500">View and manage the details of your specific order.</p>
                        </div>
                    </div>
                    
                    <Button variant="outline" className="h-9 px-4 bg-white text-slate-600 border-slate-300 shadow-sm hover:bg-slate-50 font-medium">
                        <Printer size={16} className="mr-1.5" /> Print
                    </Button>
                    <Button variant="outline" className="h-9 px-4 bg-white text-slate-600 border-slate-300 shadow-sm hover:bg-slate-50 font-medium">
                        <FileText size={16} className="mr-1.5" /> Download Invoice
                    </Button>
                </div>

                <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center p-5 bg-slate-50/80 gap-4 border-b border-slate-200">
                        <div className="font-black text-slate-800 text-base tracking-tight">Order Details : <span className="text-slate-600 font-bold">{orderData.id || 'ORD-2026-000124'}</span></div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-brand-light text-brand border-blue-200 hover:bg-brand-light font-medium px-2.5 py-1">Processing</Badge>
                            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-medium px-2.5 py-1 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Paid</Badge>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="flex flex-col xl:flex-row">
                        
                        {/* Left Content Area (Columns 1, 2, 3) */}
                        <div className="flex-1 p-4 md:p-5">
                            
                            {/* TOP ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {/* Supplier Information */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">Supplier Info</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 font-medium">Supplier name</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">{orderData.supplier || 'ABC Logistics'}</span>

                                        <span className="text-slate-500 font-medium">Supplier ID</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">SUP-000021</span>

                                        <span className="text-slate-500 font-medium">Contact</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">Michael Brown</span>

                                        <span className="text-slate-500 font-medium">Supplier phone number</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">+88018xxxxxxx</span>

                                        <span className="text-slate-500 font-medium">Email</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">info@abc.com</span>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">Customer Info</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 font-medium">Customer name</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">John Smith</span>

                                        <span className="text-slate-500 font-medium">Customer ID</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">CUS-000125</span>

                                        <span className="text-slate-500 font-medium">Email</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">john@email.com</span>

                                        <span className="text-slate-500 font-medium">Customer phone number</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">+88017xxxxxxx</span>

                                        <span className="text-slate-500 font-medium">Company</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">ABC Corporation</span>
                                    </div>
                                </div>

                                {/* Payment Breakdown */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">Payment Breakdown</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 font-medium">Base Freight</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">€ 45,000</span>

                                        <span className="text-slate-500 font-medium">Loading</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">€ 0</span>

                                        <span className="text-slate-500 font-medium">Insurance</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">€ 0</span>

                                        <span className="text-slate-500 font-medium">Other Charge</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">€ 0</span>

                                        <div className="col-span-3 border-t border-slate-100 mt-1 pt-2 grid grid-cols-[150px_10px_1fr] items-center">
                                            <span className="text-slate-800 font-bold">Total Amount</span>
                                            <span className="text-slate-400 font-bold">:</span>
                                            <span className="text-indigo-700 font-black text-right text-sm">{orderData.amount || '€ 45,000'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Removed dashed divider per request */}

                            {/* BOTTOM ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
                                {/* Shipment Information */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">Shipment Info</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 font-medium">Pickup</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">Dhaka Warehouse</span>

                                        <span className="text-slate-500 font-medium">Delivery</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">Chittagong Port</span>

                                        <span className="text-slate-500 font-medium">Vehicle</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">{orderData.vehicle || 'Covered Van'}</span>

                                        <span className="text-slate-500 font-medium">Driver</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">MD. Rashid</span>

                                        <span className="text-slate-500 font-medium">ETA</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">2 Days</span>

                                        <span className="text-slate-500 font-medium">Shipment</span>
                                        <span className="text-slate-400">:</span>
                                        <span className={`font-semibold text-right ${orderData.status === 'Completed' ? 'text-emerald-600' : 'text-brand'}`}>{orderData.status || 'In Transit'}</span>
                                    </div>
                                </div>

                                {/* Order Information */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">Order Info</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 font-medium">Order Date</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">{orderData.date || '20 Jul 2026'}</span>

                                        <span className="text-slate-500 font-medium">Delivery Date</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">{orderData.deliveryDate || '24 Jul 2026'}</span>

                                        <span className="text-slate-500 font-medium">Tracking No</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-brand font-bold text-right">TRK-20260720</span>

                                        <span className="text-slate-500 font-medium">Invoice No</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">INV-100245</span>

                                        <span className="text-slate-500 font-medium">Order Type</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">Standard</span>
                                    </div>
                                </div>

                                {/* Payment Status */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200">Payment Status</h3>
                                    <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-[13px] items-center">
                                        <span className="text-slate-500 font-medium">Status</span>
                                        <span className="text-slate-400">:</span>
                                        <div className="flex justify-end"><span className={`font-bold flex items-center gap-1.5 ${orderData.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}><div className={`w-1.5 h-1.5 rounded-full ${orderData.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div> {orderData.paymentStatus || 'Paid'}</span></div>

                                        <span className="text-slate-500 font-medium">Method</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">Credit Card</span>

                                        <span className="text-slate-500 font-medium">Paid Amount</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">{orderData.paymentStatus === 'Paid' ? (orderData.amount || '€ 45,000') : '€ 0'}</span>

                                        <span className="text-slate-500 font-medium">Payment Date</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">21 Jul 2026</span>

                                        <span className="text-slate-500 font-medium">Transaction</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">TXN-8574829</span>

                                        <span className="text-slate-500 font-medium">Invoice</span>
                                        <span className="text-slate-400">:</span>
                                        <span className="text-slate-800 font-semibold text-right">Generated</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content Area: Live Tracking (Column 4) */}
                        <div className="w-full xl:w-[280px] p-4 md:p-5 border-t xl:border-t-0 xl:border-l border-slate-200">
                            <h3 className="text-[13px] font-bold text-slate-800 mb-5 uppercase flex items-center gap-2 tracking-wider">Live Tracking <span className="relative flex h-2 w-2 ml-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span></span></h3>
                            
                            <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 flex-1 mt-2">
                                <div className="relative pl-5">
                                    <div className="absolute -left-[9px] top-0.5 bg-white py-1">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                            <CheckCircle2 size={12} className="text-white"/>
                                        </div>
                                    </div>
                                    <p className="font-bold text-slate-800 text-xs">Order Confirmed</p>
                                    <p className="text-[10px] text-slate-500 mt-1">20 Jul, 10:30 AM</p>
                                </div>

                                <div className="relative pl-6">
                                    <div className="absolute -left-[9px] top-0.5 bg-white py-1">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                            <CheckCircle2 size={12} className="text-white"/>
                                        </div>
                                    </div>
                                    <p className="font-bold text-slate-800 text-xs">Payment Received</p>
                                    <p className="text-[10px] text-slate-500 mt-1">20 Jul, 11:20 AM</p>
                                </div>

                                <div className="relative pl-5">
                                    <div className="absolute -left-[9px] top-0.5 bg-white py-1">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                                            <CheckCircle2 size={12} className="text-white"/>
                                        </div>
                                    </div>
                                    <p className="font-bold text-slate-800 text-xs">Driver Assigned</p>
                                    <p className="text-[10px] text-slate-500 mt-1">21 Jul, 09:15 AM</p>
                                </div>

                                <div className="relative pl-5">
                                    <div className="absolute -left-[11px] top-0 bg-white py-1">
                                        <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center ring-4 ring-blue-50 shadow-sm">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <p className="font-bold text-slate-900 text-xs text-brand">In Transit</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Currently near Dhaka Highway</p>
                                    <p className="text-[10px] text-slate-400">Updated 10 mins ago</p>
                                </div>

                                <div className="relative pl-6">
                                    <div className="absolute -left-[9px] top-0.5 bg-white py-1">
                                        <div className="w-4 h-4 border-2 border-slate-200 rounded-full bg-white"></div>
                                    </div>
                                    <p className="font-medium text-slate-400 text-xs">Delivery</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Expected: 24 Jul</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
